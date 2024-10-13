const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {reviewSchema}=require("../schema.js")
const review=require("../models/review.js");
const listing=require("../models/listing.js");
const { isLoggedin, isReviewAuthor,validateReview } = require('../middleware.js');


const reviewcontroller=require("../controllers/review.js")

router.post("/",validateReview,isLoggedin,wrapAsync(reviewcontroller.createReview));

router.delete("/:reviewId", isLoggedin, isReviewAuthor, wrapAsync(reviewcontroller.deleteReview));

module.exports=router;