const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)

let token = null
let userId = null

beforeEach(async () => {
    // Clear users and blogs
    await User.deleteMany({})
    await Blog.deleteMany({})
    
    const passwordHash = await bcrypt.hash('testpassword', 10)
    const user = new User({
      username: 'testuser',
      name: 'Test User',
      passwordHash
    })
    const savedUser = await user.save()
    userId = savedUser._id.toString()
    
    // Login to get token
    const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'testpassword'
      })
    
    token = loginResponse.body.token
    
    // Insert blogs associated with the test user
    const blogsWithUser = helper.blogs.map(blog => ({
      ...blog,
      user: userId
    }))
    await Blog.insertMany(blogsWithUser)
    
    // Update user's blogs array
    const blogs = await Blog.find({})
    savedUser.blogs = blogs.map(blog => blog._id)
    await savedUser.save()
  })

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.blogs.length)
  })

test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    
    const blog = response.body[0]
    assert.ok(blog.id, 'id property should exist')
    assert.strictEqual(blog._id, undefined, '_id property should not exist')
  })

test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Test-Driven Development with React',
      author: 'Kent C. Dodds',
      url: 'https://kentcdodds.com/blog/test-driven-development',
      likes: 15
    }
  
    const initialBlogs = await helper.blogsInDb()
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAfterPost = await helper.blogsInDb()
    assert.strictEqual(blogsAfterPost.length, initialBlogs.length + 1)
  
    const titles = blogsAfterPost.map(blog => blog.title)
    assert.ok(titles.includes(newBlog.title), 'The new blog title should be in the database')
  })

test('likes property defaults to 0 if missing', async () => {
    const newBlog = {
      title: 'Blog Without Likes Property',
      author: 'Test Author',
      url: 'https://example.com/blog-without-likes'
    }
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    assert.strictEqual(response.body.likes, 0, 'likes should default to 0')
  })

test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Test Author',
      url: 'https://example.com/blog-without-title',
      likes: 5
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })

test('blog without url is not added', async () => {
    const newBlog = {
      title: 'Blog Without URL',
      author: 'Test Author',
      likes: 5
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })

test('a blog can be deleted by its creator', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  
    const ids = blogsAtEnd.map(blog => blog.id)
    assert.ok(!ids.includes(blogToDelete.id), 'deleted blog should not be in the database')
  })

test('adding a blog fails with 401 if token is not provided', async () => {
    const newBlog = {
      title: 'Blog Without Token',
      author: 'Unauthorized Author',
      url: 'https://example.com/unauthorized',
      likes: 5
    }
  
    const initialBlogs = await helper.blogsInDb()
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  
    const blogsAfterPost = await helper.blogsInDb()
    assert.strictEqual(blogsAfterPost.length, initialBlogs.length)
  })

test('deleting a non-existent blog returns 404', async () => {
    const nonExistentId = await helper.nonExistingId()
  
    await api
      .delete(`/api/blogs/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })

test('deleting a blog fails with 401 if token is not provided', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)
  
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

test('deleting a blog with invalid id returns 400', async () => {
    const invalidId = '123invalid'
  
    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })

test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
  
    const updatedBlogData = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 10
    }
  
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)
    assert.strictEqual(response.body.title, blogToUpdate.title)
  })

test('updating likes of a blog works', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
  
    const updatedBlogData = {
      likes: 100
    }
  
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    assert.strictEqual(response.body.likes, 100)
  
    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, 100)
  })

test('updating a non-existent blog returns 404', async () => {
    const nonExistentId = await helper.nonExistingId()
  
    const updatedBlogData = {
      likes: 50
    }
  
    await api
      .put(`/api/blogs/${nonExistentId}`)
      .send(updatedBlogData)
      .expect(404)
  })

test('updating a blog with invalid id returns 400', async () => {
    const invalidId = '123invalid'
  
    const updatedBlogData = {
      likes: 50
    }
  
    await api
      .put(`/api/blogs/${invalidId}`)
      .send(updatedBlogData)
      .expect(400)
  })

after(async () => {
    await mongoose.connection.close()
  })