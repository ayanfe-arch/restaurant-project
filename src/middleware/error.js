module.exports = (err, req, res, next) => {

  if (res.headersSent) {
    return next(err);
  }

 let statusCode = err.statusCode || err.status || 500;
 
  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
  } else if (err.name === 'CastError') {
    statusCode = 400;
  }


  const isDev = process.env.NODE_ENV !== 'production';
  const response = {
    success: false,
    message: err.message || 'Server error',
  };

  if (isDev) {
    response.stack = err.stack;
  }

  console.error(err.stack);

  res.status(statusCode).json(response);
};