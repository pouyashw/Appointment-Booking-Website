const express = require('express')
const { auth } = require('./../middlewares/auth')
const roleGuard = require('./../middlewares/roleGuard')
const { getComments, createComment, removeComment } = require('./../controllers/comment.js')

const router = express.Router()

router.route('/:portfolioID')
    .get(getComments)
    .post(auth, createComment)

router.route('/remove/:commentID')
    .delete(auth, roleGuard("ADMIN"), removeComment)

module.exports = router