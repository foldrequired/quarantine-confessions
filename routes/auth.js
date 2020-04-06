const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt') // Password Hasher
const jwt = require('jsonwebtoken')
const Joi = require('@hapi/joi')

const User = require('../models/user')

// Validation
const validationSchema = {
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  nickName: Joi.string().min(6).required()
}

// CREATE USER (REGISTER)
router.post('/register', async (req, res) => {

  // Validate Request
  const validation = Joi.validate(req.body, validationSchema)

  // Set data into new User
  const user = new User({
    email: req.body.email
  })
  try {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.passwordHash, salt)
    console.log(salt);
    console.log(hashedPassword); 
    user.passwordHash = hashedPassword
    user.firstName = req.body.firstName
    user.lastName = req.body.lastName
    user.nickName = req.body.nickName
  } catch (err) {
    res.status(500).json({ messsage: err.message })
  }
  try {
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// LOGIN USER
router.post('/login', async (req, res) => {
  // Authentication
  const user = await User.findOne({email: req.body.email}, function(err,obj) {console.log("\nuser details:\n" + obj)})
  if (user == null) {
      return res.status(400).json({ message: 'Please use a valid email'})
  }
  try {
    if (await bcrypt.compare(req.body.password, user.passwordHash)) {
        //res.status(200).json({ message: 'Login successfully '})
        console.log("Logged in successfully");
        
    } else {
        res.status(401).json({ message: 'Login failed, check Email and Password again'})
        console.log("Login failed, password is not matched");
        
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }

  // JWT
  console.log("JWT")
  const userEmail = req.body.email
  const userId = user.id
  const serializeUser = { id: userId, email: userEmail }
  console.log(serializeUser)

  const accessToken = generateAccessToken(serializeUser)
  const refreshToken = generateRefreshAccessToken(serializeUser)
  res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken })
})

// REFRESH TOKEN
router.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken
})

// LOGOUT USER
router.delete('/logout', (req, res) => {

})

// GET ALL USERS
router.get('/users', async (req, res) => {
   try {
    const users = await Auth.find()
    res.json(users)
   } catch (err) {
   res.status(500).json({ message: err.message })
  }
})

// FUNCTIONS / MIDDLEWARES
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

function generateRefreshAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_REFRESH_TOKEN_SECRET)
}

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) {
   return res.status(401)
  } 
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403)
    }
    req.user = decoded
    next()
  })
}

module.exports = router