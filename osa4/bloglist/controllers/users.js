const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  if (body.password.length < 3) {
    return response.status(401).json({
      error: 'password is too short'
    })
  }

  if (body.username.length < 3) {
    return response.status(400).json({error: 'username is too short'})
  }
  const passwordHash = await bcrypt.hash(body.password, saltRounds)


  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })


  const savedUser = await user.save()
    .catch(error => response.status(400).send({ error: error.message }))

  response.status(200).json()
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, likes: 1 })

  response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter