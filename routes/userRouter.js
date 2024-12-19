const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const bookingRouter = require("./bookingRouter");
const reviewRouter = require("./reviewRouter");

const router = express.Router();

router.route("/signup").post(authController.signup);

router.route("/login").post(authController.login);

router.route("/logout").get(authController.logout);

router.route("/forgot").post(authController.forgotPassword);

router.route("/reset/:token").patch(authController.resetPassword);

router.use(authController.protect);

router.route("/account/me").get(userController.getMe, userController.getUser);

router
  .route("/updateMe")
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateUserData
  );

router.route("/deleteMe").delete(userController.deleteUser);

router.route("/updatePassword").patch(authController.updatePassword);

router.use("/:userId/bookings", bookingRouter);

router.use("/:userId/reviews", reviewRouter);

// Middleware runs in sequence: Post this user will be authenticated

router.use(authController.restrictTo("admin"));

router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .delete(userController.deleteUser)
  .patch(userController.updateUser)
  .get(userController.getUser);

module.exports = router;
