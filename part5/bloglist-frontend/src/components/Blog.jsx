import { useState } from 'react'

const Blog = ({ blog, addLike, onDelete, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [showDetails, setShowDetails] = useState(false)
  const hideWhenVisible = { display: showDetails ? 'none' : '' }
  const showWhenVisible = { display: showDetails ? '' : 'none' }

  return (

    <div style={blogStyle} className="blog">
      <div style={hideWhenVisible} className="blog-default">
        {blog.title} {blog.author}
        <button onClick={() => setShowDetails(true)}>view</button>
      </div>
      <div style={showWhenVisible} className="blog-details">
        {blog.title} {blog.author}
        <button onClick={() => setShowDetails(false)}>hide</button>
        <div className="blog-url">{blog.url}</div>
        <div className="blog-likes">likes {blog.likes} <button onClick={addLike}>like</button></div>
        <div>{blog.user.name}</div>
        {user && blog.user.username === user.username && (
          <button onClick={onDelete}>delete</button>
        )}
      </div>

    </div>
  )
}

export default Blog