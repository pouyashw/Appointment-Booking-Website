const express = require('express')
const { auth } = require('../middlewares/auth')
const roleGuard = require('../middlewares/roleGuard')
const { 
    createAppointment, 
    showAppontment, 
    showAppontmentForBarber, 
    canselAppointment, 
    confirmAppointment, 
    rejectAppointment, 
    doneAppointment, 
    removeAppointmentForAdmin 
} = require('./../controllers/appointment')

const router = express.Router()

router.route('/')
    .post(auth, createAppointment)
    .get(auth, showAppontment)
    
router.route('/barbers')
    .get(auth, roleGuard("BARBER"), showAppontmentForBarber)

router.route('/:id')
    .delete(auth, canselAppointment)

router.route('/:id/confirm')
    .patch(auth, roleGuard("BARBER"), confirmAppointment)

router.route('/:id/reject')
    .patch(auth, roleGuard("BARBER"), rejectAppointment)

router.route('/:id/done')
    .patch(auth, roleGuard("BARBER"), doneAppointment)

router.route('/:id/admin')
    .delete(auth, roleGuard("ADMIN"), removeAppointmentForAdmin)


module.exports = router