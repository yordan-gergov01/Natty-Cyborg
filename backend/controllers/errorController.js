import AppError from "../utils/AppError.js";

const handleInvalidDataType = function (err) {
  const valueMatch = err.message.match(
    /invalid input syntax for type integer: "(.*)"/
  );
  const invalidValue = valueMatch ? valueMatch[1] : "unknown";

  const message = `Invalid value for field: ${invalidValue}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = function (err) {
  const detail = err.detail || "";
  const valueMatch = detail.match(/\(([^)]+)\)/);
  const message = `Duplicate field value: '${valueMatch}'. Please use another value!`;

  return new AppError(message, 400);
};

const handleConstraintViolation = function (err) {
  const message =
    err.detail || "Invalid input data. Check constraints violated.";

  return new AppError(message, 400);
};

const handleJWT = function (err) {
  return new AppError("Invalid token. Please log in again!", 401);
};

const handleJWTExpired = function (err) {
  return new AppError("Your token has expired! Please log in again.", 401);
};

const sendErrorDevelopment = function (req, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProduction = function (req, res) {
  // operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // programming or other unknown error: don't leak error details
  } else {
    console.error("ERROR:", err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const globalErrorHandler = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDevelopment(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    // PostgreSQL error handling (validation)
    if (error.code === "22P02") error = handleInvalidDataType(error);
    if (error.code === "23505") error = handleDuplicateFieldsDB(error);
    if (error.code === "23514") error = handleConstraintViolation(error);
    if (error.name === "JsonWebTokenError") error = handleJWT();
    if (error.name === "TokenExpiredError") error = handleJWTExpired();

    sendErrorProduction(error, res);
  }
};

export { globalErrorHandler };
