const express = require("express");
const routes = require("./routes");
const error404 = require("./middlewares/404");

const app = express();

app.use(express.static(__dirname + "/public"));

app.use("/", routes);

app.use("/", error404);

app.listen(3000);

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Caught exception: ", err, err.message);
});
