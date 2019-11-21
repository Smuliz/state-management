"use strict";
const express = require("express");
const session = require("express-session");
const passport = require("./utils/pass");
const app = express();
const port = 3000;

const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/form");
  }
};

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const username = "foo";
const password = "bar";

app.use(
  session({
    secret: "salainen kissa",
    resave: false,
    saveUnitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/setCookie/:clr", (req, res) => {
  res.cookie("color", req.params.clr).send("cookie set");
});

app.get("deleteCookie", (req, res) => {
  res.clearCookie("color");
  res.send("Cookie deleted");
});

app.get("/form", (req, res) => {
  res.render("form");
});

app.get("/secret", loggedIn, (req, res) => {
  res.render("secret");
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/form" }),
  (req, res) => {
    console.log("success");
    res.redirect("/secret");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
