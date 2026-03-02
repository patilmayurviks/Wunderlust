const Listning = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index= async(req,res)=>{
    const allListings =await Listning.find({});
    res.render("./listings/index.ejs",{allListings});
};

module.exports.renderNewFOrm = (req,res)=>{
   
    
    res.render("./listings/new.ejs");
};
module.exports.showListing= (async(req,res)=>{
    let {id}=req.params;
   const listing=await Listning.findById(id).populate({path:"review",populate:{path:"author",}}).populate("owner");
   //console.log(listing);
   if(!listing){
    req.flash("error","Listing you requested for does not exit");
    return res.redirect("/listings");
   }
   res.render("./listings/show.ejs",{listing});

});
/* module.exports.createListings= async(req,res,next)=>{
    let response=  await geocodingClient.forwardGeocode({
         query: 'pune, India',
         limit: 1
         })
  .send();
  
  /* .then(response => {
    const match = response.body;
  }); */
        
       /* let listings=req.body.listing;
      // console.log(listings);
      let url=req.file.path;
      let filename= req.file.filename;
       
        const newlistings= new Listning(listings);
       // console.log(req.user);
        newlistings.owner=req.user._id;
        newlistings.image={url,filename};
        newlistings.geometry=response.body.features[0].geometry;
        let savelisting= await newlistings.save();
       // console.log(savelisting);
       req.flash("success","New Listing Created ! .....");
       res.redirect("/listings");
       
    
    }; */ 
    // controllers/listings.js

/*  module.exports.createListings = async (req, res, next) => {
  try {
    const listingData = req.body.listing;

    if (!listingData.location) {
      req.flash("error", "Location is required");
      return res.redirect("/listings/new");
    }

    const response = await geocodingClient
      .forwardGeocode({
        query: listingData.location, // 🔥 dynamic user location
        limit: 1,
      })
      .send();

    if (!response.body.features.length) {
      req.flash("error", "Invalid location entered");
      return res.redirect("/listings/new");
    }

    const { path: url, filename } = req.file;

    const newListing = new Listning(listingData);

    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");

  } catch (err) {
    next(err);
  }
};  */ 
module.exports.createListings = async (req, res, next) => {
  try {
    const listingData = req.body.listing;

    if (!listingData.location) {
      req.flash("error", "Location is required");
      return res.redirect("/listings/new");
    }

    const response = await geocodingClient
      .forwardGeocode({
        query: listingData.location,
        limit: 1,
      })
      .send();

    if (!response.body.features.length) {
      req.flash("error", "Invalid location entered");
      return res.redirect("/listings/new");
    }

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
    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();

    req.flash("success", "New Listing Created!");
    return res.redirect("/listings");

  } catch (err) {
    return next(err);
  }
}; 




  
module.exports.renderEditform= async(req,res)=>{
        let {id}=req.params;
        const listing= await Listning.findById(id);
        if(!listing){
    req.flash("error","Listing you requested for does not exit");
    return res.redirect("/listings");
   }
   let originalImageurl=listing.image.url;
   originalImageurl= originalImageurl.replace("/upload","/upload/w_250");


        res.render("./listings/edit.ejs",{listing,originalImageurl});

        
    };
    module.exports.updateListing = async (req,res)=>{
        let {id}=req.params;
        
      /*    let listing= await Listning.findByIdAndUpdate(id,{...req.body.listing}); */
      let listing = await Listning.findByIdAndUpdate(
  id,
  { ...req.body.listing },
  { new: true }
);
         if(typeof req.file !== "undefined"){
           let url=req.file.path;
           let filename= req.file.filename;
           listing.image={url,filename};
           await listing.save();

         }
         
          req.flash("success"," Listing Updated !");
           
         res.redirect(`/listings/${id}`); 
        };

module.exports.destroylisting= async (req,res)=>{
    let {id}=req.params;
    let deleteList= await Listning.findByIdAndDelete(id); 
    console.log(deleteList);
     req.flash("success","Listing Deleted !");
       
    res.redirect("/listings"); 


};