const portfolioModel = require('./../models/portfolio')
const commentModel = require('./../models/comment')
const { isValidObjectId } = require("mongoose")
const { errorResponse, successResponse } = require('./../helpers/response')
const { createPaginationData } = require('./../utils/pagination')
const { populate } = require('../models/barber')

exports.getComments = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const { portfolioID } = req.params;
        
        if (!isValidObjectId(portfolioID)) {
            return errorResponse(res, 400, "portfolio not valid !!");
        }

        const portfolio = await portfolioModel.findById(portfolioID);

        if (!portfolio) {
            return errorResponse(res, 404, "portfolio not found !!");
        }

        const [comments, totalComments] = await Promise.all([
            commentModel.find({ portfolio: portfolioID })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("user", "username")
                .populate({
                    path: "portfolio",
                    populate: {
                        path: "barber",
                        select: "user",
                        populate: {
                            path: "user",
                            select: "username"
                        }
                    }
                }),

            commentModel.countDocuments({ portfolio: portfolioID })
        ]);

        return successResponse(res, 200, {
            comments,
            pagination: createPaginationData(page, limit, totalComments, "Comments")
        });

    } catch (error) {
        next(error);
    }
};

exports.createComment = async (req, res, next) => {
    try {
        const user = req.user
        const { portfolioID } = req.params
        const { text } = req.body
        if (!isValidObjectId(portfolioID)) {
            return errorResponse(res, 400, "portfolioID not valid !!")
        }

        const portfolio = await portfolioModel.findById(portfolioID)
        if (!portfolio) {
            return errorResponse(res, 404, "portfolio not found !!")
        }

        const comment = await commentModel.create({
            user,
            portfolio: portfolioID,
            text
        })

        return successResponse(res, 201, {
            message: "comment create successfully :))",
            comment
        })
    } catch (error) {
        next(error)
    }
}

exports.removeComment = async (req, res, next) => {
    try {
        const { commentID } = req.params
        if (!isValidObjectId(commentID)) {
            return errorResponse(res, 400, "commentID not valid !!")
        }

        const comment = await commentModel.findByIdAndDelete(commentID)
        if (!comment) {
            return errorResponse(res, 404, "comment not found !!")
        }

        return successResponse(res, 201, "comment removed successfully :))")
    } catch (error) {
        next(error)
    }
}