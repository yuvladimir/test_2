const express = require("express");
const httpStatus = require("http-status");
const { errorConverter, errorHandler } = require("./middlewares/error");
const AppError = require("./utils/applicationError");
const HistoryController = require("./history/history.controller");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
HistoryController.boot(app);
app.use((req, res, next) => {
  next(new AppError(httpStatus.NOT_FOUND, "Not found"));
});
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
