const express = require('express')
const { sendOtp, verifyOtp } = require('./../controllers/auth')

const router = express.Router()

router.route('/send').post(sendOtp)
router.route('/verify').post(verifyOtp)

module.exports = router