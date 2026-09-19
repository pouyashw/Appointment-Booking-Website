const serviceModel = require('./../models/service')
const { successResponse, errorResponse } = require('./../helpers/response')
const formatDuration = require('./../helpers/formatDuration')
const { createServiceValidator, updateServiceValidator } = require('../validations/services')
const { isValidObjectId } = require('mongoose')

exports.getServices = async (req, res, next) => {
    try {
        const services = await serviceModel.find({
            isActive: true
        })
        if (services.length === 0) {
            return errorResponse(res, 404, "services not found !!")
        }
        // services.forEach(service => {
        //     service.formattedDuration = formatDuration(service.duration);
        // });

        return successResponse(res, 200, services)
    } catch (error) {
        next(error)
    }
}

exports.createServices = async (req, res, next) => {
    try {
        const { title, price, duration } = req.body

        await createServiceValidator.validate(req.body, { abortEarlyL: false })

        const service = await serviceModel.create({
            title,
            price,
            duration
        })
        
        return successResponse(res, 200, {
            message: "service create successfully :))",
            service
        })
    } catch (error) {
        next(error)
    }
}

exports.updateService = async (req, res, next) => {
    try {
        const { id } = req.params
        const { title, price, duration, description } = req.body

        if (!isValidObjectId(id)) {
            return errorResponse(res, 403, "serviceID not valid")
        }

        await updateServiceValidator.validate(req.body, { abortEarly: false })

        const service = await serviceModel.findByIdAndUpdate(id, req.body, { new: true })
        if (!service) {
            return errorResponse(res, 404, "service not found !!")
        }

        return successResponse(res, 200, {
            message: "service updated successfully :))",
            service
        })

    } catch (error) {
        next(error)
    }
}

exports.toggleServiceStatus = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!isValidObjectId(id)) {
            return errorResponse(res, 403, 'serviceID not valid !!')
        }

        const service = await serviceModel.findById(id)
        if (!service) {
            return errorResponse(res, 404, "service not found !!")
        }

        service.isActive = !service.isActive

        await service.save()

        return successResponse(res, 200, {
            message: "status updated successfully :))",
            service
        })
    } catch (error) {
        next(error)
    }
}

exports.removeService = async (req, res, next) => {
    try {
       const { id } = req.params
       if (!isValidObjectId(id)) {
        return errorResponse(res, 403, "serviceID not valid !!")
       }  

       const service = await serviceModel.findByIdAndDelete(id)
       if (!service) {
        return errorResponse(res, 404, "service not found !!")
       }

       return successResponse(res, 200, "service remove successfully :))")
    } catch (error) {
        next(error)
    }
}