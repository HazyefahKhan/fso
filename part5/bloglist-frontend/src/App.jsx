import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    console.log(loggedUserJSON)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log(user)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, isError = false) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification({ message: null })
    }, 5000)
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      notifyWith('wrong username or password', true)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      notifyWith(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    })
  }

  const addLike = async id => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }
    const returnedBlog = await blogService.update(id, changedBlog)
    setBlogs(blogs.map(blog => (blog.id !== id ? blog : returnedBlog)))
  }

  const onDelete = async (blog) => {
    const ok = window.confirm(`Remove ${blog.title} by ${blog.author}`)
    if (ok) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      notifyWith(`Deleted ${blog.title} by ${blog.author}`, true)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const userBlogs = () => (
    [...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
      <Blog key={blog.id} blog={blog} addLike={() => addLike(blog.id)} onDelete={() => onDelete(blog)} user={user} />
    )
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in<button onClick={handleLogout}>logout</button></p>
          <BlogForm createBlog={addBlog}/>
          {userBlogs()}
        </div>
      )}
    </div>
  )
}

export default App