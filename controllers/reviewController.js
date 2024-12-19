const Review = require("../models/reviewModel");
const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.reviewRestrictToBookings = catchAsync(async (req, res, next) => {
  try {
    // Query using `findOne` for both user and tour
    const booking = await Booking.findOne({
      user: req.body.user,
      tour: req.body.tour,
    });

    if (!booking) {
      return next(
        new AppError("Tour Booking associated with user does not exist.", 404)
      );
    }

    next();
  } catch (err) {
    next(err); // Handle errors gracefully
  }
});

exports.getAllReviews = factory.getAllOne(Review);

exports.addReviews = factory.createOne(Review);

exports.deleteReviews = factory.deleteOne(Review);

exports.updateReviews = factory.updateOne(Review);

exports.getReviews = factory.getOne(Review);
