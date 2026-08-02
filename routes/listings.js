const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });


const {
    index,
    renderNewForm,
    showListing,
    createListing,
    renderEditForm,
    updateListing,
    deleteListing
} = require("../controllers/listings");

// INDEX + CREATE
router.route("/")
    .get(wrapAsync(index))
    .post(isLoggedIn,upload.single("image"),validateListing,wrapAsync(createListing));

// NEW
router.get("/new", isLoggedIn, renderNewForm);

// EDIT
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(renderEditForm));

// SHOW + UPDATE + DELETE
router.route("/:id")
    .get(wrapAsync(showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("image"),
        validateListing,
        wrapAsync(updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(deleteListing)
    );

    module.exports = router;