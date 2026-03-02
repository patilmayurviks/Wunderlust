
const User=require("../models/user.js");
module.exports.renderSignup= (req,res)=>{
    res.render("./user/sinup.ejs")
};
module.exports.signup= async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newuser=new User({email,username});
    const register=await User.register(newuser,password);
    //console.log(register);
    req.login(register,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome Back to Wandurlust!");
        res.redirect("/listings");
    });
    
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
    

};
module.exports.renderlogin = (req,res)=>{
    res.render("./user/login.ejs")
};
module.exports.login= async(req,res)=>{
    req.flash("success","Welcome Back to Wandurlust!");
    let redirectUrl =res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};
module.exports.logout= (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You Logged Out !");
        res.redirect("/listings");
    })
};