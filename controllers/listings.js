const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const { category, search } = req.query;

    let filter = {};

    if (category) {
        filter.category = category;
    }

    if (search) {
    filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
    ];
}

    const allListings = await Listing.find(filter);

    res.render("listings/index", {
        allListings,
        category,search
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
    .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
         .populate("owner");

    if (!listing) {
        req.flash("error", "The listing you requested does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
};

const listing = require("../models/listing");

module.exports.createListing = async (req, res) => {
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;

    const location = req.body.listing.location;
    const country = req.body.listing.country;
    const query = `${location}, ${country}`;

    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
        {
            headers: {
                "User-Agent": "Wanderlust-App"
            }
        }
    );

    const data = await response.json();

    if (!data.length) {
        throw new Error("Location not found");
    }

    const lat = Number(data[0].lat);
    const lon = Number(data[0].lon);

    listing.geometry = {
        type: "Point",
        coordinates: [lon, lat]
    };

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();

    req.flash("success", "New listing created!");
    res.redirect(`/listings/${listing._id}`);
};
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "The listing you requested does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");

    res.render("listings/edit", { listing,originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true, runValidators: true }
    );

     if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");

    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted successfully!");

    res.redirect("/listings");
};