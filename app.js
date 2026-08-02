require("dotenv").config();

// Imports
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listings");
const reviewsRouter = require("./routes/reviews.js");
const User = require("./models/user");
const userRouter = require("./routes/users");
const dbUrl = process.env.ATLASDB_URL;

async function main() {
    console.log("ATLAS URL EXISTS:", !!process.env.ATLASDB_URL);
    await mongoose.connect(dbUrl);
}
main()
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));

// App Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// MongoDB Session Store

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET ,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});
// Session Configuration
const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {

        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly : true

    }
};
app.use(session(sessionOptions));

// Demo User Route
app.get("/demo-user", async (req, res) => {
    let user = new User({
        email: "ashwini@gmail.com",
        username: "ganeshpawar"
    });

    let registeredUser = await User.register(user, "myfirstlove");

    res.send(registeredUser);
});

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Flash Messages
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.search = req.query.search || "";
    next();
});


// Test Session Route
app.get("/test-session", (req, res) => {
    req.session.username = "Ashwini";
    res.send("Session created!");
});


// // Home Route
// app.get("/", (req, res) => {
//     res.send("Hi I am Root");
// });


// Routers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


// 404 Route
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


app.use((err, req, res, next) => {
    console.log("ERROR:", err);
    console.log("MESSAGE:", err.message);
    console.log("STACK:", err.stack);

    const {
        statusCode = 500,
        message = "Something Went Wrong!"
    } = err;

    res.status(statusCode).render("error.ejs", { message });
});

// Server
const port = 8080;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
