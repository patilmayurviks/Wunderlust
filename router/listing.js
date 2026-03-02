const express=require("express");
const router=express.Router();
const Listning = require("../models/listing.js");
const wrapAsync=require("../util/wrapAsync.js");
const ExpressError=require("../util/ExpressError.js");
const {listingschema}=require("../schema.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const {isLoggedIn,isowner,validatelist}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}= require("../cloudConfig.js");
const upload = multer({storage});

/* router.set("view engine","ejs");
router.set("views",path.join(__dirname,"../views"));
router.use(express.static(path.join(__dirname,"../public")));
router.use(express.urlencoded({extended:true}));
router.use(methodOverride("_method"));
router.engine("ejs",ejsMate); */







router.route("/")
.get(wrapAsync(listingController.index))
.post( isLoggedIn,validatelist,upload.single('listing[image]'), wrapAsync(listingController.createListings));




//new route
router.get("/new", isLoggedIn,listingController.renderNewFOrm)
//show raoute
router.route("/:id")
.get( wrapAsync(listingController.showListing) )
.put(isLoggedIn, isowner,upload.single('listing[image]'),validatelist,wrapAsync( listingController.updateListing))
.delete(isLoggedIn,isowner,wrapAsync( listingController.destroylisting));


router.get("/:id/edit",isLoggedIn,isowner, wrapAsync( listingController.renderEditform));

module.exports=router;