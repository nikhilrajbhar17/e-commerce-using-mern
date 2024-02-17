const app = require("./app");
const dotenv = require("dotenv");
const db = require("./config/database");

process.on("uncaughtException", (err) => {
  console.log(`Error ${err.message}`);
  console.log("shutting down the server due to uncaught exception ");
  process.exit(1);
});

// setting up config file
dotenv.config({ path: "backend/config/config.env" });
// connectinh to database

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

process.on("unhandledRejection", (err) => {
  console.log(`error ${err.message}`);
  console.log("shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
