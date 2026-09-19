const fs = require('fs')
const path = require('path')
const barberModel = require('./../models/barber')
const serviceModel = require('./../models/service')
const portfolioModel = require('./../models/portfolio')
const { errorResponse, successResponse } = require('../helpers/response')
const { isValidObjectId } = require('mongoose')
const { createPaginationData } = require('../utils/pagination')

const supportedFormat = [
    "image/jpeg",
    "image/png",
    "image/svg",
    "image/webp",
    "image/gif",
    "image/svg+xml",
]

exports.createPortfolio = async (req, res, next) => {
    try {
        const user = req.user
        const { caption } = req.body

        const barber = await barberModel.findOne({ user: user._id })

        if (!barber) {
            return errorResponse(res, 404, "barber not found!!")
        } 

        let images = [];
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            if (!supportedFormat.includes(file.mimetype)) {
                return errorResponse(res, 400, "UnSupported image format !!");
            }

            images.push(file.filename);
        }

        const portfolio = await portfolioModel.create({
            barber,
            images,
            caption
        })

        return successResponse(res, 201, {
            message: "portfolio create successfully :))",
            portfolio
        })

    } catch (error) {
        if (req.files) {
            Object.values(req.files).flat().forEach(file => {
                fs.unlink(file.path, err => {
                    if (err) console.error('Error deleting file:', err);
                });
            });
        }
        next(error)
    }
}

exports.getPortfolioByBarber = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const { barberID } = req.params
        if (!isValidObjectId(barberID)) {
            return errorResponse(res, 400, "barberID not valid !!")
        }  

        const barber = await barberModel.findById( barberID )
        if (!barber) {
            return errorResponse(res, 404, "barber not found !!")
        }

        const [Portfolio, totalPortfolios] = await Promise.all([        
            portfolioModel.find({barber: barberID})
                .sort({ createdAt: "desc" })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate({
                    path: "barber",
                    select: "user",
                    populate: {
                        path: "user",
                        select: "username"
                    }
                }),



            portfolioModel.countDocuments({ barber: barberID })
        ])


        return successResponse(res, 200, {
            portfolio,
            pagination: createPaginationData(page, limit, totalPortfolios, "Portfolio")
        })
    } catch (error) {
        next(error)
    }
}

exports.getPortfolio = async (req, res, next) => {
    try {
        const { portfolioID } = req.params
        if (!isValidObjectId(portfolioID)) {
            return errorResponse(res, 400, "portfolioID not valid !!")
        }

        const portfolio = await portfolioModel.findById(portfolioID)
            .populate({
                path: "barber",
                select: "user",
                populate: {
                    path: "user",
                    select: "username"
                }
            })
        if (!portfolio) {
            return errorResponse(res, 404, "portfolio not found !!")
        }

        return successResponse(res, 200, portfolio)
    } catch (error) {
        next(error)
    }
}

exports.updatePortfolio = async (req, res, next) => {
    try {
        const user = req.user
        const { portfolioID } = req.params
        const { caption } = req.body
        if (!isValidObjectId(portfolioID)) {
            return errorResponse(res, 400, "portfolioID not valid !!")
        }

        const barber = await barberModel.findOne({ user: user._id })
        if (!barber) {
            return errorResponse(res, 404, "barber not found !!")
        }

        const portfolio = await portfolioModel.findById(portfolioID)
        if (!portfolio) {
            return errorResponse(res, 404, "portfolio not found !!")
        }

        if (portfolio.barber.toString() !== barber._id.toString()) {
            return errorResponse(res, 403, "this portfolio not for you !!")
        }

        portfolio.caption = caption
        await portfolio.save()

        return successResponse(res, 200, {
            message: "portfolio updated successfully :))",
            portfolio
        })
    } catch (error) {
        next(error)
    }
}

exports.removePortfolio = async (req, res, next) => {
    try {
        const user = req.user
        const { portfolioID } = req.params
        if (!isValidObjectId(portfolioID)) {
            return errorResponse(res, 400, "portfolioID not valid !!")
        }

        const barber = await barberModel.findOne({ user: user._id })
        if (!barber) {
            return errorResponse(res, 404, "barber not found !!")
        }

        const portfolio = await portfolioModel.findById(portfolioID)
        if (!portfolio) {
            return errorResponse(res, 404, "portfolio not found !!")
        }

        if (portfolio.barber.toString() !== barber._id.toString()) {
            return errorResponse(res, 403, "this portfolio not for you !!")
        }

        for (const image of portfolio.images) {
            const imagePath = path.join(__dirname, "..", "public", "images", "portfolio", image);

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }        

        await portfolio.deleteOne()

        return successResponse(res, 200, "portfolio removed successfully :))")
    } catch (error) {
        next(error)
    }
}

exports.addImages = async (req, res, next) => {
    try {
        const user = req.user
        const { id } = req.params
        if (!isValidObjectId(id)) {
            return errorResponse(res, 400, "portfolioID not valid !!")
        } 

        const barber = await barberModel.findOne({ user: user._id })
        if (!barber) {
            return errorResponse(res, 404, "barber not found !!")
        }

        const portfolio = await portfolioModel.findById(id)
        if (!portfolio) {
            return errorResponse(res, 404, "portfolio not found !!")
        }

        if (portfolio.barber.toString() !== barber._id.toString()) {
            return errorResponse(res, 403, "this portfolio not for you !!")
        }

        const images = []
        for (const file of req.files) {
            if (!supportedFormat.includes(file.mimetype)) {
                return errorResponse(res, 400, "Unsupported image format !!")
            }

            images.push(file.filename)
        }

        portfolio.images.push(...images)

        await portfolio.save()

        return successResponse(res, 200, {
            message: "image added successfully :))",
            portfolio
        })
    } catch (error) {
        if(req.file){
            fs.unlink(req.file.path,()=>{});
        }        
        next(error)
    }
}

exports.removeImage = async (req, res, next) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const { image } = req.body;

        const portfolio = await portfolioModel.findById(id);

        if (!portfolio) {
            return errorResponse(res,404,"portfolio not found !!");
        }

        const barber = await barberModel.findOne({ user:user._id });

        if (!barber || barber._id.toString() !== portfolio.barber.toString()) {
            return errorResponse(res,403,"this portfolio not for you !!");
        }

        if (!portfolio.images.includes(image)) {
            return errorResponse(res,404,"image not found !!");
        }

        portfolio.images = portfolio.images.filter(
            item => item !== image
        );

        await portfolio.save();

        fs.unlink(
            path.join("public/images/portfolio", image),
            ()=>{}
        );

        return successResponse(res,200,{
            message:"image removed successfully :))",
            portfolio
        });

    } catch (error) {
        if(req.file){
            fs.unlink(req.file.path,()=>{});
        }
        next(error);
    }
};

exports.replaceImage = async (req, res, next) => {
    try {

        const user = req.user;
        const { id } = req.params;
        const { oldImage } = req.body;

        const portfolio = await portfolioModel.findById(id);

        if (!portfolio) {
            return errorResponse(res,404,"portfolio not found !!");
        }

        const barber = await barberModel.findOne({ user:user._id });

        if (!barber || barber._id.toString() !== portfolio.barber.toString()) {
            return errorResponse(res,403,"this portfolio not for you !!");
        }

        if (!portfolio.images.includes(oldImage)) {
            return errorResponse(res,404,"old image not found !!");
        }

        if (!req.file) {
            return errorResponse(res,400,"image is required !!");
        }

        if (!supportedFormat.includes(req.file.mimetype)) {
            fs.unlink(req.file.path,()=>{});
            return errorResponse(res,400,"Unsupported image format !!");
        }

        const index = portfolio.images.indexOf(oldImage);

        portfolio.images[index] = req.file.filename;

        await portfolio.save();

        fs.unlink(
            path.join("public/images/portfolio", oldImage),
            ()=>{}
        );

        return successResponse(res,200,{
            message:"image replaced successfully :))",
            portfolio
        });

    } catch (error) {

        if(req.file){
            fs.unlink(req.file.path,()=>{});
        }

        next(error);
    }
};