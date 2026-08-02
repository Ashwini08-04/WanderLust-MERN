const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema,reviewSchema} = require("./schema");
const Review = require("./models/review");


// Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }

    next();
};


// Save redirect URL
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};


// Check if current user is listing owner
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    if (
        !listing.owner ||
        !listing.owner.equals(res.locals.currUser._id)
    ) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};


// Joi Validation Middleware
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details
            .map((el) => el.message)
            .join(", ");

        throw new ExpressError(400, errMsg);
    }

    next();
};

// Review Validation
module.exports.validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
};

//review middleware
module.exports.isReviewAuthor = async (req, res, next) => {
    let { reviewId } = req.params;

    let review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review does not exist!");
        return res.redirect(`/listings/${req.params.id}`);
    }

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to delete this review!");
        return res.redirect(`/listings/${req.params.id}`);
    }

    next();
};