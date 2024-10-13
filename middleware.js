const listing=require("./models/listing.js")
const ExpressError=require("./utils/ExpressError.js")
const { listingSchema,reviewSchema }=require("./schema.js")
const review=require("./models/review.js");

module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create a listing!");
        return res.redirect("/login")
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;  // Use `res.locals`
        delete req.session.redirectUrl;  // Clean up session after storing it in res.locals
    } else {
        res.locals.redirectUrl = '/listings';  // Fallback to home page
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let Listing = await listing.findById(id);

    if (!Listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    if (!Listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not authorized to perform this action!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(',');
        throw new ExpressError(404,errMsg);
    }
    else
        next();
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(',');
        throw new ExpressError(404,errMsg);
    }
    else
        next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;

    console.log(req.user._id);
    console.log(reviewId);

    const Review = await review.findById(reviewId);

    if (!Review) {  // Check if the review exists
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);  // Redirect if review doesn't exist
    }

    if (!Review.author.equals(req.user._id)) {  // Check if the current user is the author
        req.flash("error", "You are not authorized to perform this action!");
        return res.redirect(`/listings/${id}`);
    }

    next();  // Proceed if the user is the author
};