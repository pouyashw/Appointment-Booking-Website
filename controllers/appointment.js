const appointmentsModel = require('./../models/appointment')
const userModel = require('./../models/user')
const servicesModel = require('./../models/service')
const barbersModel = require('./../models/barber')
const { createAppointmentValidator } = require('./../validations/appointment')
const { errorResponse, successResponse } = require('../helpers/response')
const { isValidObjectId } = require('mongoose')

exports.createAppointment = async (req, res, next) => {
    try {
        const user = req.user
        const { barber, service, date, time } = req.body

        if (!isValidObjectId(barber) || !isValidObjectId(service)) {
            return errorResponse(res, 400, "barber or service Id not valid !!")
        }

        await createAppointmentValidator.validate(req.body, { abortEarly: false })

        const barberDoc = await barbersModel.findById(barber)
        if (!barberDoc) {
            return errorResponse(res, 404, "barber not found !!")
        }
        if (!barberDoc.isActive) {
            return errorResponse(res, 404, "barber not active !!")
        }

        const serviceDoc = await servicesModel.findById(service)
        if (!serviceDoc) {
            return errorResponse(res, 404, "service not found !!")
        }

        const alreadyBooked = await appointmentsModel.findOne({
            barber,
            date,
            time,
            status: {
                $nin: ["CANCELLED", "REJECTED"]
            }
        });
        return errorResponse(res, 409, "this time already booked");

        const appointment = await appointmentsModel.create({
            user: user._id,
            barber: barberDoc._id,
            service: serviceDoc._id,
            date,
            time,
            status: "PENDING"
        })

        return successResponse(res, 201, {
            message: 'appointment create successfully :))',
            appointment
        })
        
    } catch (error) {
        next(error)
    }
}

exports.showAppontment = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const user = req.user

        const [appointments, totalAppointments] = await Promise.all([
            appointmentsModel.find({ user: user._id })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("barber")
                .populate("service"),

            appointmentsModel.countDocuments({
                user: user._id
            })
        ]);        

        return successResponse(res, 200, {
            appointments,
            pagination: createPaginationData(page, limit, totalAppointments, "Appointment")
        })
    } catch (error) { 
        next(error)
    }
}

exports.showAppontmentForBarber = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const user = req.user

        const barberDoc = await barbersModel.findOne({ user: user._id })
        if (!barberDoc) {
            return errorResponse(res,404,"barber not found !!");
        }
        
        const [appointments, totalAppointments] = await Promise.all([
            appointmentsModel.find({
                barber: barberDoc._id
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("user", "username")
            .populate("service"),

            appointmentsModel.countDocuments({
                barber: barberDoc._id
            })
        ]);

        return successResponse(res, 200, {
            appointments,
            pagination: createPaginationData(page, limit, totalAppointments, "Appointment")
        })
    } catch (error) {
        next(error)
    }
}

exports.canselAppointment = async (req, res, next) => {
    try {
        const user = req.user 
        const { id } = req.params
        if (!isValidObjectId(id)) {
            return errorResponse(res, 400, "appointmentID not valid !!3")
        }

        const appointment = await appointmentsModel.findById(id)
        if (!appointment) {
            return errorResponse(res, 404, "appointment not found !!")
        }

        const isOwner = user._id.toString() === appointment.user.toString()
        if (!isOwner) {
            return errorResponse(res, 403, "this appointment not for you !!")
        }

        if (appointment.status === "CANCELLED") {
            return errorResponse(res, 409, "appointment already cancelled !!")
        }

        appointment.status = "CANCELLED"

        await appointment.save()

        return successResponse(res, 200, {
            message: "appointment canselled successfully :))",
            appointment
        })
    } catch (error) { 
        next(error)
    }
}

exports.confirmAppointment = async (req, res, next) => {
    try {
        const user = req.user
        const { id } = req.params
        if (!isValidObjectId(id)) {
            return errorResponse(res, 400, "appointment Id not valid !!")
        }

        const appointment = await appointmentsModel.findById(id)
        if (!appointment) {
            return errorResponse(res, 404, "appointment not found !!")
        }

        const isOwner = appointment.barber.toString() === user._id.toString()
        if (!isOwner) {
            return errorResponse(res, 403, "this appointment not for you !!")
        }

        if (appointment.status !== "PENDING") {
            return errorResponse(res, 409, "appointment already processed");
        }

        appointment.status = "CONFIRMED"

        await appointment.save()

        return successResponse(res, 200, {
            message: "appointment confirm successfully :))",
            appointment
        })

    } catch (error) {
        next(error)
    }
}

exports.rejectAppointment = async (req, res, next) => {
    try {
       const user = req.user
       const { id } = req.params
       if (!isValidObjectId(id)) {
        return errorResponse(res, 400, "appointment Id not valid !!")
       }

       const appointment = await appointmentsModel.findById(id)
       if (!appointment) {
        return errorResponse(res, 404, "appointment not found !!")
       }

       const isOwner = appointment.barber.toString() === user._id.toString()
       if (!isOwner) {
        return errorResponse(res, 403, "this appointment not for you !!")
       }

       if (appointment.status !== "PENDING") {
        return errorResponse(res, 409, "appointment already processed");
        }       

       appointment.status = "REJECTED"

       await appointment.save()

       return successResponse(res, 200, {
        message: "appointment rejected successfully :))",
        appointment
       })   
    } catch (error) {
        next(error)
    }
}

exports.doneAppointment = async (req, res, next) => {
    try {
               const user = req.user
       const { id } = req.params
       if (!isValidObjectId(id)) {
        return errorResponse(res, 400, "appointment Id not valid !!")
       }

       const appointment = await appointmentsModel.findById(id)
       if (!appointment) {
        return errorResponse(res, 404, "appointment not found !!")
       }

       const isOwner = appointment.barber.toString() === user._id.toString()
       if (!isOwner) {
        return errorResponse(res, 403, "this appointment not for you !!")
       }

       if (appointment.status !== "CONFIRMED") {
        return errorResponse( res, 409, "appointment must be confirmed first");
       }

       appointment.status = "DONE"

       await appointment.save()

       return successResponse(res, 200, {
        message: "appointment done successfully :))",
        appointment
       })
    } catch (error) {
        next(error)
    }
}

exports.removeAppointmentForAdmin = async (req, res, next) => {
    try {
        const user = req.user
        const { id } = req.params
        if (!isValidObjectId(id)) {
            return errorResponse(res, 400, "appointment Id not valid !!")
        }

        const appointment = await appointmentsModel.findByIdAndDelete(id)
        if (!appointment) {
            return errorResponse(res, 404, "appointment not found !!")
        }

        return successResponse(res, 200, "appointment remove successfully !!")
    } catch (error) {
        next(error)
    }
}