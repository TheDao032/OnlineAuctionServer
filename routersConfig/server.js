const express = require('express')
const fileUpload = require('express-fileupload')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
require('express-async-errors')

const server = express()

server.use(morgan('dev'))
server.use(bodyParser.json({limit: '200mb'}));
server.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
server.use(cors())
server.use(fileUpload())

module.exports = server
