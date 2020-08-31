const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.delete('/:id', async (request, response) => {
    
    const blog = await Blog.findById(request.params.id)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)

    if(!request.token) {
        response.status(401).json()
    }

    if(blog.user.toString() === user._id.toString()) {
        await Blog.findByIdAndRemove(request.params.id)
        .catch(error => response.status(400).send({ error: error.message }))
    response.status(200).json()
    } else {
        console.log("Wrong user")
        response.status(401).json()
    }
  


})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const newLikes = {
        likes: body.likes,

    }

    const newBlog = await Blog.findByIdAndUpdate(request.params.id, newLikes, { new: true })
        .catch(error => response.status(400).send({ error: error.message }))
    response.status(200).json(newBlog);

})

blogsRouter.post('/', async (request, response) => {

    const body = request.body
    //const token = getTokenFrom(request)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })



    if (typeof blog.likes === 'undefined') {
        blog.likes = 0;
    }

    if (typeof blog.title === 'undefined' && typeof blog.url === 'undefined') {
        console.log("haloo")
        response.status(400).json()
    } else {


        const savedBlog = await blog.save()

        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog)

    }

})

module.exports = blogsRouter