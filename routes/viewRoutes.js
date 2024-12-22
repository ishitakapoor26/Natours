const express = require("express");
const router = express.Router();
const viewController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

router.use(viewController.alerts);

router.get("/", authController.isLoggedIn, viewController.getOverview);

router.get("/tour/:slug", authController.isLoggedIn, viewController.getTours);

router.get("/login", authController.isLoggedIn, viewController.getLoginForm);

router.get("/signup", viewController.getSignupForm);

router.get("/me", authController.protect, viewController.getAccount);

router.get("/my-tours", authController.protect, viewController.getMyTours);

router.get("/manage-tours", authController.protect, viewController.manageTours);

router.get("/add-tour", authController.protect, viewController.addTours);

router.get("/update-tour", authController.protect, viewController.updateTours);

router.get("/my-reviews", authController.protect, viewController.getMyReviews);

router.post(
  "/submit-user-data",
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
