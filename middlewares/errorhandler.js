const { errorResponse } = require("../helpers/response");

exports.errorHandler = (error, req, res, next) => {
    console.error(error);

    // ==========================
    // Yup Validation
    // ==========================
    if (error.name === "ValidationError" && Array.isArray(error.inner)) {

        const errors = error.inner.map(err => ({
            field: err.path,
            message: err.message
        }));

        return errorResponse(
            res,
            400,
            "Validation Error",
            errors
        );
    }

    // ==========================
    // Mongoose Validation
    // ==========================
    if (error.name === "ValidationError" && error.errors) {

        const errors = Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
        }));

        return errorResponse(
            res,
            400,
            "Validation Error",
            errors
        );
    }

    // ==========================
    // Invalid ObjectId
    // ==========================
    if (error.name === "CastError") {
        return errorResponse(
            res,
            400,
            `${error.path} is not valid`
        );
    }

    // ==========================
    // Duplicate Key
    // ==========================
    if (error.code === 11000) {

        const field = Object.keys(error.keyValue)[0];

        return errorResponse(
            res,
            409,
            `${field} already exists`
        );
    }

    // ==========================
    // Multer
    // ==========================
    if (error.name === "MulterError") {

        return errorResponse(
            res,
            400,
            error.message
        );
    }

    // ==========================
    // Default
    // ==========================

    return errorResponse(
        res,
        error.status || 500,
        error.message || "Internal Server Error"
    );
};