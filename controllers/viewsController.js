const Booking = require("../models/bookingModel");
const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Review = require("../models/reviewModel");

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get Tour data from collection
  const tours = await Tour.find();
  // 2) Build template
  // 3) Render the template using tour data from 1)
  res.status(200).render("overview", {
    title: "Exciting tours for adventurous people",
    tours,
    manageTour: "false",
  });
});

exports.getTours = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate({
      path: "reviews",
      fields: "review rating user",
    })
    .populate({
      path: "bookings",
      fields: "user tour",
    });

  // console.log(tour);

  if (!tour) {
    return next(new AppError("There is no tour with that name", 404));
  }

  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  });
});

// .set(
//   "Content-Security-Policy",
//   "default-src 'self' https://*.mapbox.com ; base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
// )

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
});

// .set(
//   "Content-Security-Policy",
//   "default-src *; connect-src *; font-src 'self' https://fonts.gstatic.com data:; base-uri 'self'; block-all-mixed-content; form-action 'self'; frame-ancestors 'self'; object-src 'none'; script-src 'self' https://cdnjs.cloudflare.com https://api.mapbox.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; upgrade-insecure-requests;"
// )

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account",
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render("account", {
    title: "Your account",
    user: updatedUser,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1. Find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  // 2. Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render("overview", {
    title: "My Tours",
    tours,
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id });
  // console.log(reviews);
  res.status(200).render("reviews", {
    title: "My Tour Reviews",
    reviews,
  });
});

exports.getSignupForm = catchAsync(async (req, res, next) => {
  res.status(200).render("signup", {
    title: "Signup into your account",
  });
});

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === "booking")
    res.locals.alert =
      "Your booking was successful! Please check your email for confirmation.";
  next();
};

exports.manageTours = async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render("overview", {
    title: "Manage Tours | Admin Portal",
    tours,
    manageTour: "true",
  });
};

exports.addTours = async (req, res, next) => {
  res.status(200).render("createTour", {
    title: "Manage Tours | Add Tour",
  });
};
