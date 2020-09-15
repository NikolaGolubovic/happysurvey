const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const surveyController = require("./controllers/surveyController");
const usersController = require("./controllers/usersController");
const loginController = require("./controllers/loginController");

const middleware = require("./utils/middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));

app.use(morgan("dev"));

//app.use(express.static(path.join(__dirname, "build")));

app.use("/api/survey", surveyController);
app.use("/api/users", usersController);
app.use("/api/login", loginController);

app.get("/", function (req, res) {
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
});
// let protected = ["transformed.js", "main.css", "favicon.ico"];

// app.get("/*", (req, res) => {
//   let path = req.params["0"].substring(1);

//   if (protected.includes(path)) {
//     // Return the actual file(s)
//     res.sendFile(`${__dirname}/build/${path}`);
//   } else {
//     // Otherwise, redirect to /build/index.html
//     res.sendFile(`${__dirname}/build/index.html`);
//   }
// });

// app.get("/*", function (req, res) {
//   console.log("id");
//   res.sendFile("index.html", {
//     root: path.join(__dirname, "./build/index.html"),
//   });
// });

// app.get("/*/:id", function (req, res) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

app.use(middleware.errorHandler);

module.exports = app;
