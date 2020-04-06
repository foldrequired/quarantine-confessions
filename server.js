// Imports
require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path'); 

// Routes Imports
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const postsRouter = require('./routes/posts')

// Production - Heroku
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('Connected Successfully to the Database'))

// Let our server to accept json as a body inside API requests
app.use(express.json()) 

// Router
const API_ROOT = '/api'
const API_VERSION = 'v1'
const API_BASE = API_ROOT + '/' + API_VERSION

app.use(API_BASE + '/auth', authRouter) // example: localhost:3000/api/v1/auth/..
app.use(API_BASE + '/users', usersRouter) // example: localhost:3000/api/v1/users/..
app.use(API_BASE + '/posts', postsRouter) // example: localhost:3000/api/v1/posts/..

// Server
app.listen(3000, () => console.log("Work"))
