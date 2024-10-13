const User=require("../models/user.js")

module.exports.signup=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.registerNewUser=async(req,res,next)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser= await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err) 
               return next(err);
            req.flash("success","Account created successfully and logged in!");
            res.redirect("/listings");
        }
    )}
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.loginpage=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res,next)=>{
    req.flash("success","Logged in successfully!");
    res.redirect(res.locals.redirectUrl);
}

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully!");
        res.redirect("/listings");
    })
}