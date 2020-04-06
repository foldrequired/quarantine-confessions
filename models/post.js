const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true, 
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now()
    },
    createdBy: {
      type: String,
      required: true
    }
})

module.exports = mongoose.model('Post', postSchema)