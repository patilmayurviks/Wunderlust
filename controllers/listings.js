const Listning = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await Listning.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewFOrm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;

  const listing = await Listning.findById(id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }

  res.render("./listings/show.ejs", { listing });
};

module.exports.createListings = async (req, res, next) => {
  try {
    const listingData = req.body.listing;

    if (!req.file) {
      req.flash("error", "Image is required");
      return res.redirect("/listings/new");
    }

    const newListing = new Listning(listingData);

    newListing.owner = req.user._id;

    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };

    // Default coordinates (Pune)
    newListing.geometry = {
      type: "Point",
      coordinates: [73.8567, 18.5204],
    };

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

module.exports.renderEditform = async (req, res) => {
  let { id } = req.params;

  const listing = await Listning.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }

  let originalImageurl = listing.image.url;
  originalImageurl = originalImageurl.replace("/upload", "/upload/w_250");

  res.render("./listings/edit.ejs", {
    listing,
    originalImageurl,
  });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listning.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };

    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroylisting = async (req, res) => {
  let { id } = req.params;

  await Listning.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};