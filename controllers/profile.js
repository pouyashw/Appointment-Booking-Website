const { errorResponse, successResponse } = require('../helpers/response')
const { profileValidation } = require('../validations/profile')
const userModel = require('./../models/user')

exports.myProfile = async (req, res, next) => {
    try {
        const user = req.user

        const profile = await userModel.findOne({ _id: user._id })
        if (!profile) {
            return errorResponse(res, 404, "user not found !!")
        }

        return successResponse(res, 200, { profile })
    } catch (error) {
        next(error)
    }
}

exports.updateProfile = async (req, res, next) => {
    try {
        const user = req.user
        const { username } = req.body

        await profileValidation.validate({ username }, { abortEarly: false })

        const profile = await userModel.findOneAndUpdate({ _id: user._id }, {
            username
        }, { new: true })
        if (!profile) {
            return errorResponse(res, 404, "user not found !!")
        }

        return successResponse(res, 200, {
            message: "user updated successfully :))",
            user: profile
        })

        } catch (error) {
        next(error)
    }
}