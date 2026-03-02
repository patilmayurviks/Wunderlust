const express=require("express");
const router=express.Router({mergeParams:true});
const Listning = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync=require("../util/wrapAsync.js");
const ExpressError=require("../util/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const {isLoggedIn, isReviewAuthor}=require("../middleware.js");
const {validateReview}=require("../middleware.js");
const ReviewController=require("../controllers/review.js");




router.post("/",isLoggedIn, validateReview,wrapAsync(ReviewController.createreview ));

//delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
    wrapAsync(ReviewController.destroyReview)

);

module.exports=router;


