const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  // Default error response
  let error = {
    success: false,
    message: 'Internal server error',
    error_code: 'INTERNAL_ERROR'
  };
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.message = 'Validation failed';
    error.error_code = 'VALIDATION_ERROR';
    error.errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json(error);
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    error.error_code = 'DUPLICATE_ERROR';
    error.field = Object.keys(err.keyValue)[0];
    return res.status(400).json(error);
  }
  
  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    error.message = 'Invalid ID format';
    error.error_code = 'INVALID_ID';
    return res.status(400).json(error);
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.error_code = 'INVALID_TOKEN';
    return res.status(401).json(error);
  }
  
  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.error_code = 'TOKEN_EXPIRED';
    return res.status(401).json(error);
  }
  
  // Custom application errors
  if (err.statusCode) {
    error.message = err.message;
    error.error_code = err.code || 'CUSTOM_ERROR';
    return res.status(err.statusCode).json(error);
  }
  
  // MongoDB connection errors
  if (err.name === 'MongooseServerSelectionError') {
    error.message = 'Database connection failed';
    error.error_code = 'DB_CONNECTION_ERROR';
    return res.status(503).json(error);
  }
  
  // Rate limiting error
  if (err.status === 429) {
    error.message = 'Too many requests, please try again later';
    error.error_code = 'RATE_LIMIT_EXCEEDED';
    return res.status(429).json(error);
  }
  
  // Request entity too large
  if (err.type === 'entity.too.large') {
    error.message = 'Request payload too large';
    error.error_code = 'PAYLOAD_TOO_LARGE';
    return res.status(413).json(error);
  }
  
  // Invalid JSON
  if (err.type === 'entity.parse.failed') {
    error.message = 'Invalid JSON format';
    error.error_code = 'INVALID_JSON';
    return res.status(400).json(error);
  }
  
  // Development vs Production error details
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
    error.details = err;
  }
  
  // Default 500 server error
  res.status(500).json(error);
};

// Custom error class for application-specific errors
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 Not Found handler
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND');
  next(error);
};

module.exports = {
  errorHandler,
  AppError,
  asyncHandler,
  notFoundHandler
};