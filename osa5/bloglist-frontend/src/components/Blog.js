import React, { useState } from 'react'

const Blog = ({ blog }) => {

  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  return (
    <div>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>View</button>
      </div>
      <div style={showWhenVisible}>
        <h2>{blog.title} by {blog.author}</h2>
        <h3>{blog.url}</h3>
        <h3>likes {blog.likes}</h3>
        <button onClick={toggleVisibility}>Hide</button>
      </div>
      </div>

  )

}

export default Blog
