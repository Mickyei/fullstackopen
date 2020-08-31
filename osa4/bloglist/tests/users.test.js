const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const app = require('../app')

const supertest = require('supertest')
const User = require('../models/user')
const helper = require('../utils/list_helper')
const api = supertest(app);

//...

describe('user tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1pY2t5ZWkiLCJpZCI6IjVmNDRmNjc2NGU2ZDY4NjQyMGEwZTkxMiIsImlhdCI6MTU5ODM1NTA3Mn0.o8PSRTiAzjDVzF81qkDjgMtcAP8rzAr7WHU4pPlwk4A')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1pY2t5ZWkiLCJpZCI6IjVmNDRmNjc2NGU2ZDY4NjQyMGEwZTkxMiIsImlhdCI6MTU5ODM1NTA3Mn0.o8PSRTiAzjDVzF81qkDjgMtcAP8rzAr7WHU4pPlwk4A')
      .expect(400)
      .expect('Content-Type', /application\/json/)

      console.log(result.body.error)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()
  

    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1pY2t5ZWkiLCJpZCI6IjVmNDRmNjc2NGU2ZDY4NjQyMGEwZTkxMiIsImlhdCI6MTU5ODM1NTA3Mn0.o8PSRTiAzjDVzF81qkDjgMtcAP8rzAr7WHU4pPlwk4A')
      .expect(400)
      .expect('Content-Type', /application\/json/)

    

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

})

afterAll(() => {
  mongoose.connection.close()
})