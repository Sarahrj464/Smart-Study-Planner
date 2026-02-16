const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message;

    // Log to console for dev
    console.error('🔥 ERROR caught by middleware:', err);
    if (err.stack) console.error(err.stack);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        // const message = 'Duplicate field value entered';
        const message = 'Email is already registered. Please login.';
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    // Multer error
    if (err.name === 'MulterError') {
        let message = err.message;
        if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'File size too large. Max limit is 5MB.';
        }
        error = new ErrorResponse(message, 400);
    }

    // Extract message from original error if not already set or if it's a generic one
    const finalMessage = error.message || err.message || 'Server Error';
    const finalStatusCode = error.statusCode || err.statusCode || 500;

    res.status(finalStatusCode).json({
        success: false,
        error: finalMessage
    });
};

module.exports = errorHandler;
