const express = require('express')
const router = express.Router()
const Post = require('../models/post')

const jwt = require('jsonwebtoken')


// GET ALL POSTS
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET SINGLE POST
router.get('/:id', getPost, (req, res) => {
  res.json(res.post)
})

// CREATE POST
router.post('/', verifyToken, async (req, res) => {
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    createdBy: req.user.id
  })
  try {
    const newPost = await post.save()
    res.status(201).json(newPost)
  } catch (err) {
    res.status(400).json({ message: err.message  })
  }
})

// UPDATE POST
router.patch('/:id', getPost, async (req, res) => {
  if (req.body.title != null) {
    res.post.title = req.body.title
  }
  if (req.body.description != null) {
    res.post.description = req.body.description
  }
  try {
    const updatedPost = await res.post.save()
    res.json(updatedPost)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE POST
router.delete('/:id', getPost, async (req, res) => {
  try {
    await res.post.remove()
    res.json({ message: `Post with the ID of ${req.params.id} has been deleted successfully` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Middlewares
async function getPost(req, res, next) {
  let post
  try {
    post = await Post.findById(req.params.id)
    if (post == null) {
      return res.status(404).json({ message: 'No post has been found' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.post = post
  next()
}

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) {
   return res.status(401).json({ message: 'Token invalid / Unauthorized' })
  } 
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    req.user = decoded
    next()
  })
}

module.exports = router