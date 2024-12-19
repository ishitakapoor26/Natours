const express = require("express");
const fs = require("fs");
const morgan = require("morgan"); // Import morgan
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const app = express();
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");
const reviewRouter = require("./routes/reviewRouter");
const bookingRouter = require("./routes/bookingRouter");
const viewRouter = require("./routes/viewRoutes");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const { title } = require("process");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Global Middleware to log HTTP requests (dev format)

// // Set security HTTP
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         connectSrc: ["'self'", "ws://localhost:53220"],
//       },
//     },
//   })
// );

// Development logging
app.use(morgan("dev"));

// Middleware to parse JSON bodies
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against nosql query injection

app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Set request limits
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

// Prevent Parameter pollution
app.use(
  hpp({
    // allows duplicate properties
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "difficulty",
      "price",
    ],
  })
);

// Routes

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/booking", bookingRouter);

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // (err.status = "fail"), (err.statusCode = 404);
  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
