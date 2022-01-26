const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

const PORT = 3001
const DB_URL = 'mongodb://localhost:27017/api'

const app = express()
app.use(express.json())
app.use(express.static(path.resolve(__dirname, '../client/build')));


mongoose.connect(DB_URL, { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', (e) => console.log(e))
db.on('open', () => console.log('Connected to database server'))

const api_routes = require('./api/routes')
app.use('/api', api_routes)


app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`))