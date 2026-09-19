const express = require('express')
const { auth } = require('./../middlewares/auth')
const { myProfile, updateProfile } = require('../controllers/profile.js')

const router = express.Router()

router.route('/')
    .get(auth, myProfile)
    .patch(auth, updateProfile)


module.exports = router