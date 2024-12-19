const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const Booking = require("../models/bookingModel");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  // 1. Get currently booked tour
  const tour = await Tour.findById(req.params.tourID);
  // 2. Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/?tour=${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
          },
          unit_amount: tour.price * 100, // Stripe accepts amounts in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
  });
  // 3. Create session as a response
  res.status(200).json({
    status: "success",
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is temporary, because it's unsecure; can book without paying
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split("?")[0]);
});

exports.getAllBookings = factory.getAllOne(Booking);
exports.createBookings = factory.createOne(Booking);
exports.deleteBookings = factory.deleteOne(Booking);
exports.getBookings = factory.getOne(Booking);
exports.updateBookings = factory.updateOne(Booking);
