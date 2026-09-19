const express = require('express')
const { auth } = require('../middlewares/auth')
const roleGuard = require('../middlewares/roleGuard')
const { 
    showAllBarbers, 
    createBarberProfile,
    getAllBarbersForAdmin,
    getMyProfile,
    editProfile, 
    getBarberForAdmin, 
    getBarber, 
    toggleStatus, 
    editBarber,
    makeBarber,
    removeBarber
} = require('../controllers/barber')
const { multerStorage } = require('./../utils/multer')

const upload = multerStorage("public/images/barber")


const router = express.Router()

router.route('/')
    .get(showAllBarbers)
    .post(auth, roleGuard("ADMIN"), createBarberProfile)

router.route('/me')
    .get(auth, roleGuard("BARBER"), getMyProfile)
    .patch(auth, roleGuard("BARBER"), upload.single("avatar"), editProfile)

router.route('/admin').get(auth, roleGuard("ADMIN"), getAllBarbersForAdmin)

router.route('/:id/admin').get(auth, roleGuard("ADMIN"), getBarberForAdmin)

router.route('/:id').get(getBarber)

router.route('/:id/toggle-status').patch(auth, roleGuard("ADMIN"), toggleStatus)

router.route('/:id')
    .patch(auth, roleGuard("ADMIN"), editBarber)

router.route('/:id/make-barber')
    .patch(auth, roleGuard("ADMIN"), makeBarber)
    
router.route('/:id/remove-barber')
    .patch(auth, roleGuard("ADMIN"), removeBarber)


module.exports = router