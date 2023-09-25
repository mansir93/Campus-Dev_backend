const httpStatusCodes = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
};

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const statusName = httpStatusCodes[status] || "Unknown Error";
  const title = err.title || statusName;

  console.log(err)
  res.status(status).json({
      status: status,
      title: title,
      message: err.message || statusName,
      StackTrace: err.stack,
  });
};

module.exports = errorHandler;
