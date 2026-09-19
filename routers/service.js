const express = require('express')
const { auth } = require('../middlewares/auth')
const roleGuard = require('../middlewares/roleGuard')
const { getServices, createServices, updateService, removeService, toggleServiceStatus } = require('../controllers/services')

const router = express.Router()

router.route('/')
    .get(getServices)
    .post(auth, roleGuard("ADMIN"), createServices)

router.route('/:id')
    .patch(auth, roleGuard("ADMIN"), updateService)
    .delete(auth, roleGuard("ADMIN"), removeService)

router.route('/:id/toggle-status')
    .patch(auth, roleGuard("ADMIN"), toggleServiceStatus)

module.exports = router