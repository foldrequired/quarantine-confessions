const express = require('express')
const router = express.Router()
const User = require('../models/user')

// GET ALL USERS
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET SINGLE USER
router.get('/:id', getUser, (req, res) => {
  res.json(res.user)
})

// UPDATE USER
router.patch('/:id', getUser, async (req, res) => {
  if (req.body.firstName != null) {
    res.user.firstName = req.body.firstName
  }
  if (req.body.lastName != null) {
    res.user.lastName = req.body.lastName
  }
  try {
    const updatedUser = await res.user.save()
    res.json(updatedUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE USER
// router.delete('/:id', getUser, async (req, res) => {
//   try {
//     await res.user.remove()
//     res.json({ message: `User with the ID of ${req.params.id} has been deleted successfully` })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// Middlewares
async function getUser(req, res, next) {
  let user
  try {
    user = await User.findById(req.params.id)
    if (user == null) {
      return res.status(404).json({ message: 'No user has been found' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.user = user
  next()
}

module.exports = router