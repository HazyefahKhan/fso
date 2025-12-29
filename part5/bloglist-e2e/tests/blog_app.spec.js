const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'testpassword'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'testpassword')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'wrongpassword')
      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'testpassword')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test Blog Title', 'Test Author', 'http://testurl.com')
      
      await expect(page.locator('.blog-default').getByText('Test Blog Title Test Author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Blog to Like', 'Like Author', 'http://likeurl.com')
      
      await page.getByRole('button', { name: 'view' }).click()
      
      await expect(page.locator('.blog-likes')).toContainText('likes 0')
      
      await page.getByRole('button', { name: 'like' }).click()
      
      await expect(page.locator('.blog-likes')).toContainText('likes 1')
    })

    test('the user who added the blog can delete it', async ({ page }) => {
      await createBlog(page, 'Blog to Delete', 'Delete Author', 'http://deleteurl.com')
      
      await page.reload()
      
      await page.getByRole('button', { name: 'view' }).click()
      
      page.on('dialog', dialog => dialog.accept())
      
      await page.getByRole('button', { name: 'delete' }).click()
      
      await expect(page.locator('.blog')).not.toBeVisible()
    })

    test('only the user who added the blog sees the delete button', async ({ page, request }) => {
      await createBlog(page, 'Test Blog', 'Test Author', 'http://testurl.com')
      
      await page.getByRole('button', { name: 'logout' }).click()
      
      await request.post('/api/users', {
        data: {
          name: 'Another User',
          username: 'anotheruser',
          password: 'anotherpassword'
        }
      })
      
      await loginWith(page, 'anotheruser', 'anotherpassword')
      
      await page.getByRole('button', { name: 'view' }).click()
      
      await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
    })

    test('blogs are ordered by likes with most likes first', async ({ page }) => {
      test.setTimeout(15000)
      
      await createBlog(page, 'First Blog', 'Author A', 'http://first.com')
      await createBlog(page, 'Second Blog', 'Author B', 'http://second.com')
      await createBlog(page, 'Third Blog', 'Author C', 'http://third.com')

      const secondBlog = page.locator('.blog').filter({ hasText: 'Second Blog' })
      await secondBlog.getByRole('button', { name: 'view' }).click()
      await secondBlog.getByRole('button', { name: 'like' }).click()
      await expect(secondBlog.locator('.blog-likes')).toContainText('likes 1')
      await secondBlog.getByRole('button', { name: 'like' }).click()
      await expect(secondBlog.locator('.blog-likes')).toContainText('likes 2')

      const thirdBlog = page.locator('.blog').filter({ hasText: 'Third Blog' })
      await thirdBlog.getByRole('button', { name: 'view' }).click()
      await thirdBlog.getByRole('button', { name: 'like' }).click()
      await expect(thirdBlog.locator('.blog-likes')).toContainText('likes 1')
      await thirdBlog.getByRole('button', { name: 'like' }).click()
      await expect(thirdBlog.locator('.blog-likes')).toContainText('likes 2')
      await thirdBlog.getByRole('button', { name: 'like' }).click()
      await expect(thirdBlog.locator('.blog-likes')).toContainText('likes 3')

      const blogs = page.locator('.blog')
      await expect(blogs.nth(0)).toContainText('Third Blog')
      await expect(blogs.nth(1)).toContainText('Second Blog')
      await expect(blogs.nth(2)).toContainText('First Blog')
    })
  })
})
