/* if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
} */
require('dotenv').config();
if (!process.env.SECRET) {
  throw new Error("SECRET is missing in .env file");
}


//console.log(process.env.SECRET);

const express=require("express");

const app= express();
const mongoose=require("mongoose");

const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");


const ExpressError=require("./util/ExpressError.js");
const listings=require("./router/listing.js");
const reviews=require("./router/review.js");
const user=require("./router/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);



//let Mongo_url= "mongodb://127.0.0.1:27017/Wanderlust";
const dburl= process.env.ATLASDB_URL;

main().then(()=>{console.log("conected to DB")}).catch(err=>{console.log(err)});
async function main() {
    await mongoose.connect(dburl);
};

const store =  MongoStore.create({
    mongoUrl:dburl,
    
        secret:process.env.SECRET,
});
store.on("error",(err)=>{
    console.log("Error in Mongo Session",err);
});



const sessionoption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true,
    }
};



app.use(session(sessionoption));
app.use(flash());

//authantications

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
});

app.get("/demo",async(req,res)=>{
    let fakeuser=new User({
        email:"studemt@hymail.com",
        username:"delta-student",
    });
    let register= await User.register(fakeuser,"helloworls");
    res.send(register);
})


app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/listings" ,listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",user);

/* app.get("/testListing",async(req,res)=>{
    let smaplelisting=new Listning({
        title:"my new villla",
        description:"by the beach",
        price:12333,
        location:"clangita ,goa",
        contry:"india",
    })
    await smaplelisting.save();
    console.log("sample was saved");
    res.send("succesfull Testing");

}) */

//reviews
/* app.get("/",(req,res)=>{
    res.send("working dont woory!");
}); */


/* app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page Not Found!"));
}); */

app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found~~~~~~~~~~!"));
});

/* app.use((err,req,res,next)=>{
    let {statusCode=400,message="somthing wrong"}=err;
    res.status(statusCode).render("./listings/error.ejs" ,{message});
    
}); */
app.use((err,req,res,next)=>{
    if(res.headersSent){
        return next(err);
    }
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("./listings/error.ejs",{message});
});



app.listen(8080,()=>{
    console.log("app is in listning");
})