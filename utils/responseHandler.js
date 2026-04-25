const successResponse = (res, data, message = "Success") => {
  res.json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, message = "Error", status = 500) => {
  res.status(status).json({
    success: false,
    message,
  });
};

module.exports = { successResponse, errorResponse };