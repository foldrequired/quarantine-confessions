const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    min: 6
  },
  passwordHash: {
    type: String,
    required: true,
    min: 6
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true, 
  },
  nickName: {
    type: String,
    required: true,
    min: 6
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now()
  }
})

module.exports = mongoose.model('User', userSchema)