const express = require("express");
const bookingController = require("./../controllers/bookingController");
const router = express.Router({ mergeParams: true });
const authController = require("./../controllers/authController");

router.use(authController.protect);

router.get("/checkout-session/:tourID", bookingController.getCheckoutSession);

router
  .route("/")
  .get(bookingController.getAllBookings)
  .post(
    authController.restrictTo("admin", "lead-guide"),
    bookingController.createBookings
  );

router
  .route("/:id")
  .delete(
    authController.restrictTo("admin", "lead-guide"),
    bookingController.deleteBookings
  )
  .get(bookingController.getBookings)
  .patch(bookingController.updateBookings);

module.exports = router;
