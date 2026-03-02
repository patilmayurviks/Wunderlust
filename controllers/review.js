const Review = require("../models/review.js");
const Listning = require("../models/listing.js");

module.exports.createreview = async (req,res)=>{
    let listing=await Listning.findById(req.params.id);
    let newReview =new Review (req.body.review)
    listing.review.push(newReview);
    newReview.author=req.user._id;
    //console.log(newReview);
    await newReview.save();
    await listing.save();
     req.flash("success","Revivw is Created ! ");
    
    res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyReview= async(req,res)=>{
        let {id,reviewId}=req.params;
        await Listning.findByIdAndUpdate(id,{$pull: { review:reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted ! ");
    

        res.redirect(`/listings/${id}`);


    };