const app = require("./app");
const dotenv = require("dotenv");
const db = require("./config/database");
// setting up config file
dotenv.config({ path: "backend/config/config.env" });
// connectinh to database

app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
