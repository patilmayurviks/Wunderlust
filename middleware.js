const Listning = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingschema,reviewSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
     if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You Must Be Logged in to Wounderlust!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();

};
/* module.exports.isowner= async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listning.findById(id);
    if(!listing.owner._id.equals(res.locals.curruser._id)){
        req.flash("error","You are not the Owner of this listing")
        return res.redirect(`/listings/${id}`);
    }
    next();
}; */

module.exports.isowner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listning.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (!req.user || !listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the Owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.validatelist=(req,res,next)=>{
    let {error}=listingschema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
};

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
};

/* module.exports.isReviewAuthor= async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.curruser._id)){
        req.flash("error","You are not the Owner of this listing")
        return res.redirect(`/listings/${id}`);
    }
    next();
}; */

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    if (!req.user || !review.author.equals(req.user._id)) {
        req.flash("error", "You are not the Owner of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};