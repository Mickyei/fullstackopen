require('dotenv').config()
const config = require('./utils/config')
const http = require('http')

const express = require('express')
const app = require('./app')
const cors = require('cors')


const server = http.createServer(app)


server.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
  })

