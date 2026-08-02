const mongoose = require("mongoose");
const Listing = require("./models/listing");

async function updateCategories() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

    const categories = [
        "Nature",
        "Mountains",
        "Beach",
        "City",
        "Rooms",
        "Camping",
        "Trending",
        "Popular"
    ];

    const listings = await Listing.find({}).select("_id");

    const operations = listings.map((listing, index) => ({
        updateOne: {
            filter: { _id: listing._id },
            update: {
                $set: {
                    category: categories[index % categories.length]
                }
            }
        }
    }));

    if (operations.length > 0) {
        await Listing.bulkWrite(operations);
    }

    console.log(`${listings.length} listings updated!`);

    await mongoose.connection.close();
}

updateCategories();