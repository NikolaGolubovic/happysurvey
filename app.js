const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const csp = require("helmet-csp");

const surveyController = require("./controllers/surveyController");
const usersController = require("./controllers/usersController");
const loginController = require("./controllers/loginController");

const middleware = require("./utils/middleware");

const app = express();

app.use(cors());

app.use(
  csp({
    directives: {
      defaultSrc: ["*"],
      fontSrc: ["https://fonts.googleapis.com/", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "http://localhost:3005"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://surveyjs.azureedge.net/1.8.0/modern.css",
        "https://fonts.googleapis.com",
        // "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",
        // "'sha256-OTeu7NEHDo6qutIWo0F2TmYrDhsKWCzrUgGoxxHGJ8o='",
      ],
      imgSrc: ["*"],
      scriptSrc: [
        "'self'",
        "unsafe-inline",
        "'sha256-eE1k/Cs1U0Li9/ihPPQ7jKIGDvR8fYw65VJw+txfifw='",
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
    reportOnly: false,
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));

app.use(morgan("dev"));

app.use("/api/survey", surveyController);
app.use("/api/users", usersController);
app.use("/api/login", loginController);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(middleware.errorHandler);

module.exports = app;
