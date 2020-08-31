const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app);

describe('blog tests', () => {

    test('a valid blog can be added ', () => {

        const newBlog = {
            title: 'async/await simplifies making async calls',
            author: "El Boss",
            url: "www.nice.fi",
            likes: 20
        }

        const blog = new Blog(newBlog);
        

        api.get('/api/blogs')
            .then((getResp) => {
                const initialBlogs = getResp.body;
                api
                    .post('/api/blogs')
                    .send(newBlog)
                    .then(result => {
                        //response.status(201).json(result)
                    })
                    .then(() => {
                        api.get('/api/blogs')
                            .then(response => {
                                const titles = response.body.map(r => r.title)
                                expect(response.body).toHaveLength(initialBlogs.length + 1)
                                expect(titles).toContain(
                                    'async/await simplifies making async calls'
                                )
                            })
                    })
            })
    })

    test('check if id is defined', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })

    /* test('amount of blogs', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(8)
    }) */

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('blogs require title and url', async () => {

        const newBlog = {

            author: "El Boss",

            likes: 20
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

    test('if likes are undefined, make them 0', async () => {

        const newBlog = {
            title: "King of Spain",
            author: "El Boss",
            url: "www.jyy.fi"

        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        const last = response.body.slice(-1)[0]
        expect(last.likes).toBe(0)

    })


})

afterAll(() => {

    mongoose.connection.close()

})