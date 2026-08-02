const express = require("express");
const router = express.Router();

const passport = require("passport");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const {saveRedirectUrl} = require("../middleware.js");

const 
{
    renderSignupForm,
    signup,
    renderLoginForm,
    login,
    logout } = require("../controllers/users");

// SIGNUP
router.route("/signup")
    .get(renderSignupForm)
    .post(wrapAsync(signup));


// LOGIN
router.route("/login")
    .get(renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        login
    );


// LOGOUT
router.get("/logout", logout);

module.exports = router;
