const express = require("express");
const reviewController = require("./../controllers/reviewController");
const router = express.Router({ mergeParams: true });
const authController = require("./../controllers/authController");

router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.reviewRestrictToBookings,
    reviewController.addReviews
  );

router
  .route("/:id")
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.deleteReviews
  )
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.updateReviews
  )
  .get(reviewController.getReviews);

module.exports = router;
