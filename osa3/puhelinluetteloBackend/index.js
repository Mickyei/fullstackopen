require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :post'))

morgan.token('post', function (req) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }

})


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result)
    })
        .catch(error => res.status(400).send({ error: error.message }))
})

app.get('/api/persons/:id', (request, response) => {


    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => response.status(400).send({ error: error.message }))

})



app.delete('/api/persons/:id', (request, response) => {

    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            console.log(result)
            response.status(204).end()
        })
        .catch(error => response.status(400).send({ error: error.message }))

})

app.post('/api/persons', (request, response) => {

    const body = request.body


    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())

    })
        .catch(error => {
            console.log(error.message)
            response.status(422).send({ error: error.message })

        })

})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const note = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => response.status(400).send({ error: error.message }))
})

app.get('/api/info', (req, res) => {
    const date = new Date()

    Person.countDocuments({}, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            const response = {
                people: `Phonebook has ${result} people`,
                time: date
            }
            res.json(response)

        }
    })

})

//Middlewaret virheidenkäsittelyyn
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})