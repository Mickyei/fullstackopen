const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json());
app.use(morgan(':method :url :status :post'))

morgan.token('post', function(req, res) {
    if(req.method === 'POST') {
        return JSON.stringify(req.body);
    }
    
});


let persons = [

    {
        "name": "Paska",
        "number": "21431321",
        "id": 8
    },
    {
        "name": "pasntsasdsa",
        "number": "1231321",
        "id": 10
    },
    {
        "name": "bibels",
        "number": "31231312",
        "id": 11
    },
    {
        "name": "piis",
        "number": "12312",
        "id": 12
    },
    {
        "name": "piis213",
        "number": "12312",
        "id": 13
    }

]


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    console.log("HAloo")
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.json(`ID ${id} deleted`)
    response.status(204).end()
    
})

app.post('/api/persons', (request, response) => {
    
    const body = request.body

    if (!body) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
    
    } else if(!body.name) {
        return response.status(400).json({ 
            error: 'name missing' 
          })

    } else if(!body.number) {
        return response.status(400).json({ 
            error: 'number missing' 
          })
    } else if(persons.find(person => person.name === body.name)) {
        return response.status(400).json({ 
            error: 'name already exists' 
          })
    }
   
    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000)

    }
    persons = persons.concat(person)
    response.json(person)
  })


app.get('/api/info', (req, res) => {
    const date = new Date();
    const response = {
        people: `Phonebook has ${persons.length} people`,
        time: date
    }
    res.json(response)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})