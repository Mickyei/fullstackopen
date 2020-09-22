const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const usersRouter = require('./controllers/users')
const User = require('./models/user')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  console.log(authorization + 'haloo')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
  }

  return null
}

const tokenExtractor = (request, response, next) => {
  // tokenin ekstraktoiva koodi

     if(request.url === '/api/users') {
      const token = getTokenFrom(request)
      const decodedToken = jwt.verify(token, process.env.SECRET)
      if (!token || !decodedToken.id) {
          response.status(401).json({ error: 'token missing or invalid' })
      } else {
          request.token = token
      }
    } 
    

  next()
}

app.use(tokenExtractor)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

app.use(cors({credentials: true, origin: true}))
app.use(express.static('build'))
app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)

module.exports = app