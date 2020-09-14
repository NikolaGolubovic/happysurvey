const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../models/db");

router.get("/", (req, res) => {
  res.send("hello world");
});

router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const foundUser = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (foundUser.rows.length === 0) {
      throw new Error(
        "There is no such user, do you want to register account?"
      );
    }
    const checkPass = await bcrypt.compare(
      password,
      foundUser.rows[0].password
    );
    if (!checkPass) {
      throw new Error("Username or password does not match");
    }
    const userForToken = {
      username: foundUser.rows[0].username,
      id: foundUser.rows[0].id,
    };
    const token = jwt.sign(userForToken, process.env.SECRET);
    res.status(200).send({ username: foundUser.rows[0].username, token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
