const fs = require('fs')
const path = require('path')
const userModel = require('./../models/user')
const serviceModel = require('./../models/service')
const barberModel = require('./../models/barber')
const { isValidObjectId } = require('mongoose')
const { errorResponse, successResponse } = require('../helpers/response')
const { createBarberValidator, editBarberProfileValidator, editBarberProfileValidatorForAdmin } = require('../validations/barber')

const supportedFormat = [
    "image/jpeg",
    "image/png",
    "image/svg",
    "image/webp",
    "image/gif",
    "image/svg+xml",
]

// for user
exports.showAllBarbers = async (req, res, next) => {
    try {
        const barbers = await barberModel.find({ isActive: true })
            .populate("services")
            .populate("user", "username")

        if (barbers.length === 0) {
            return errorResponse(res, 404, "barber not found !!")
        }

        return successResponse(res, 200, barbers)
    } catch (error) {
        next(error)
    }
}

// for admin
exports.createBarberProfile = async (req, res, next) => {
    try {
        const { user, services, workDays, startTime, endTime } = req.body

        await createBarberValidator.validate(req.body, {  abortEarly: false })

        const userExists = await userModel.findById(user)
        if (!userExists) {
            return errorResponse(res, 404, "user not found !!")
        }

        if (!userExists.roles.includes("BARBER")) {
            return errorResponse( res, 400, "user is not barber")
        }

        const barberExists = await barberModel.findOne({ user })
        if (barberExists) {
            return errorResponse(res, 409, "this user already has a barber profile !!")
        }

        const barber = await barberModel.create({
            user, services, workDays, startTime, endTime
        })

        return successResponse(res, 201, {
            message: "barberProfile set successfully :))",
            barber
        })
    } catch (error) {
        next(error)
    }
}

exports.getAllBarbersForAdmin = async (req, res, next) => {
    try {
        const barbers = await barberModel.find()
            .populate("user")
            .populate("services")

        if (barbers.length === 0) {
            return errorResponse(res, 404, "barber not found !!")
        }

        return successResponse(res, 200, barbers)
    } catch (error) {
        next(error)
    }
}

// for barber
exports.getMyProfile = async (req, res, next) => {
    const user = req.user

    const barber = await barberModel.findOne({ user: user._id }).populate('services')

    return successResponse(res, 200, barber)
}

exports.editProfile = async (req, res, next) => {
    try {
        const user = req.user;
        const { bio, workDays, startTime, endTime } = req.body;

        await editBarberProfileValidator.validate(req.body, {
            abortEarly: false,
        });

        const barber = await barberModel.findOne({ user: user._id });

        if (!barber) {
            if (req.file) {
                fs.unlink(req.file.path, () => {});
            }

            return errorResponse(res, 404, "barber not found !!");
        }

        const oldAvatar = barber.avatar;

        const updateData = {};

        if (bio !== undefined) updateData.bio = bio;
        if (workDays !== undefined) updateData.workDays = workDays;
        if (startTime !== undefined) updateData.startTime = startTime;
        if (endTime !== undefined) updateData.endTime = endTime;

        if (req.file) {

            if (!supportedFormat.includes(req.file.mimetype)) {

                fs.unlink(req.file.path, () => {});

                return errorResponse(
                    res,
                    400,
                    "Unsupported image format !!"
                );
            }

            updateData.avatar = req.file.filename;
        }

        const updatedBarber = await barberModel.findOneAndUpdate(
            { user: user._id },
            updateData,
            { new: true }
        );

        // حذف عکس قبلی بعد از موفق بودن آپدیت
        if (req.file && oldAvatar) {

            const oldImagePath = path.join(
                "public/images/barber",
                oldAvatar
            );

            fs.unlink(oldImagePath, err => {
                if (err) {
                    console.error("Error deleting old image:", err);
                }
            });
        }

        return successResponse(res, 200, {
            message: "barber updated successfully :))",
            barber: updatedBarber,
        });

    } catch (error) {

        // اگر عکس جدید آپلود شده ولی عملیات شکست خورد
        if (req.file) {
            fs.unlink(req.file.path, err => {
                if (err) {
                    console.error("Error deleting uploaded image:", err);
                }
            });
        }

        next(error);
    }
};

// for amdin
exports.getBarberForAdmin = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!isValidObjectId(id)) {
            return errorResponse(res, 400, "barberID not valid !!")
        }

        const barber = await barberModel.findById(id)
            .populate("user")
            .populate("services")

        if (!barber) {
            return errorResponse(res, 404, "barber not found !!")
        }

        return successResponse(res, 200, barber)
    } catch (error) {
        next(error)
    }
}

// for user
exports.getBarber = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!isValidObjectId(id)) {
            return errorResponse(res, 400, "barberID not valid !!")
        }

        const barber = await barberModel.findOne({
            _id: id,
            isActive: true
        })
        .populate("user", "username")
        .populate("services")
            
        if (!barber) {
            return errorResponse(res, 404, "barber not found !!")
        }

        return successResponse(res, 200, barber)
    } catch (error) {
        next(error)
    }
}

// for admin
exports.toggleStatus = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!isValidObjectId(id)) {
            return errorResponse(res, 400, 'barberID not valid !!')
        }

        const barber = await barberModel.findById(id)
        if (!barber) {
            return errorResponse(res, 404, "barber not found !!")
        }

        barber.isActive = !barber.isActive

        await barber.save()

        return successResponse(res, 200, {
            message: "status updated successfully :))",
            barber
        })
    } catch (error) {
        next(error)
    }
}

exports.editBarber = async (req, res, next) => {
    try {
        const { id } = req.params
        const { services, bio, avatar, workDays, startTime, endTime } = req.body;

        if (!isValidObjectId(id)) {
            return errorResponse(res, 400, "barberID not valid !!")
        }

        await editBarberProfileValidatorForAdmin.validate(req.body, {abortEarly: false})

        const updateData = {};

        if (services !== undefined) updateData.services = services;
        if (bio !== undefined) updateData.bio = bio;
        if (avatar !== undefined) updateData.avatar = avatar;
        if (workDays !== undefined) updateData.workDays = workDays;
        if (startTime !== undefined) updateData.startTime = startTime;
        if (endTime !== undefined) updateData.endTime = endTime;

        const barber = await barberModel.findByIdAndUpdate(id, updateData, { new: true })
        if (!barber) {
            return errorResponse(res, 404, "barber not found !!")
        }

        return successResponse(res, 200, {
            message: "barber updated successfully :))",
            barber
        })
    } catch (error) {
        next(error)
    }
}

exports.makeBarber = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!isValidObjectId(id)) {
            return errorResponse(res, 400, "id not valid !!")
        }

        const user = await userModel.findById(id);

        if (!user) {
            return errorResponse(res, 404, "user not found !!" );
        }
        
        if (user.roles.includes('BARBER')) {
            return errorResponse(res, 409, "user is already barber");   
        }

        user.roles = ["BARBER"];

        await user.save();

        return successResponse(res, 200, {
            message: "barber meked successfully :))",
            user
        })

    } catch (error) {
        next(error)
    }
}

exports.removeBarber = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!isValidObjectId(id)) {
            return errorResponse(res, 400, "id not valid !!")
        }

        const user = await userModel.findById(id);

        if (!user) {
            return errorResponse(res, 404, "user not found !!" );
        }
        
        if (user.roles.includes('USER')) {
            return errorResponse(res, 409, "user not barber !!");   
        }

        user.roles = ["USER"];

        await user.save();

        return successResponse(res, 200, {
            message: "barber remove successfully :))",
            user
        })

    } catch (error) {
        next(error)
    }
}