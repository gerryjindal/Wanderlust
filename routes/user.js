const express = require('express');
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const passport=require("passport");
const { saveRedirectUrl } = require('../middleware.js');
const usercontroller=require("../controllers/user.js");

router.get("/",(req,res)=>{
    res.redirect("/listings");
})

router
    .route("/signup")
    .get(usercontroller.signup)
    .post(wrapAsync(usercontroller.registerNewUser))

router
    .route("/login")
    .get(usercontroller.loginpage)
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true})
    ,wrapAsync(usercontroller.login))


router.get("/logout",usercontroller.logout)
module.exports=router;