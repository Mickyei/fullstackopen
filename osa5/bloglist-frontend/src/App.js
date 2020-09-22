import React, { useState, useEffect, useRef  } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const Notification = (props) => {
  if (props.message === null) {
    return null
  }

  return (
    <div style={props.style} >
      {props.message}
    </div>
  )
}


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [msgClr, setMsgClr] = useState('green')

  const blogFormRef = useRef()


  const notiStyle = {
    color: msgClr,
    background: 'lightgreen',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };


  //Get all blogs
  useEffect(() => {
    if(user) {
      getBlogs()
    }
  }, [user, blogs])

  const getBlogs = () => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }

  //Check if user found in local storage
  useEffect(() => {
    
    
    const loggedUserJSON = window.localStorage.getItem('user')
    console.log(loggedUserJSON + ' found')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('user')
    setUser(null)
  }

  //Log user in
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })

     
      window.localStorage.setItem('user', JSON.stringify(user)) 
    
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
      
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setMsgClr('red')
      setTimeout(() => {
        setErrorMessage(null)
        setMsgClr('green')
      }, 5000)
    }
  }
  
  const handleNewBlog = async (blog) => {
    blogFormRef.current.toggleVisibility()
    try {
      
      blogService.create(blog)
      getBlogs()
      setErrorMessage(`${blog.title} added to blog collection`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

    } catch {
      setErrorMessage('Error adding blog')
      setMsgClr('red')
      setTimeout(() => {
        setErrorMessage(null)
        setMsgClr('green')
      }, 5000)
    }
  }

  
  //Component for login form
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in</h2>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const blogList = () => (
    <div>
      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>

      <Notification message={errorMessage} style={notiStyle} />

      {user === null ?
      loginForm() :
      <div>
        <p>{user.username} logged in</p> <button onClick={handleLogout}>Log out</button>

        <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createNote={handleNewBlog}/>
        </Togglable>
        
        { blogList()}
      </div>

     
    }
     
    </div>
  )
}


export default App