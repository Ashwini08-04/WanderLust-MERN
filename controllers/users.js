const User = require("../models/user");


// SIGNUP FORM
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
};


// SIGNUP
module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const user = new User({
            username,
            email
        });

        const registeredUser = await User.register(user, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


// LOGIN FORM
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};


// LOGIN SUCCESS
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");

    const redirectUrl = res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);
};


// LOGOUT
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You have been logged out!");
        res.redirect("/listings");
    });
};