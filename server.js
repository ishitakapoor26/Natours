const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  // console.log("Shutting down....");
  // console.log(err);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handle central promise rejection--> database connectivity failure
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Shutting down....");
  server.close(() => {
    process.exit(1);
  });
});

// console.log(x);
