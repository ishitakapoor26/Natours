const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const Tour = require("./../../models/tourModel");
const Review = require("./../../models/reviewModel");
const User = require("./../../models/userModel");

dotenv.config({ path: `./config.env` });
const db = process.env.DATABASE.replace("<password>", process.env.PASSWORD);

mongoose
  .connect(db)
  .then((con) => {
    console.log("MongoDB connected successfully");
    // console.log(con.connections);
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Read JSON file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

// Import data into database

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Created!");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete all data from database

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Deleted");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

console.log(process.argv);

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
