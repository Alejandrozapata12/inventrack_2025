// backend/utils/responseUtils.js
function sendSuccess(res, data, message = 'Operación exitosa', statusCode = 200) {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function sendError(res, message, statusCode = 500, details = null) {
  const response = {
    success: false,
    message
  };
  if (details) {
    response.details = details;
  }
  res.status(statusCode).json(response);
}

module.exports = {
  sendSuccess,
  sendError
};