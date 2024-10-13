const express = require('express');
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const {isLoggedin, isOwner,validateListing}=require("../middleware.js");
const { populate } = require('../models/review.js');
const listingcontroller = require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js")
const upload=multer({storage})


router
    .route("/")
    .get(wrapAsync(listingcontroller.index))
    .post(isLoggedin,upload.single("listing[image]"),validateListing, wrapAsync(listingcontroller.post));

router.get("/new",isLoggedin,listingcontroller.newroute);

router
    .route("/:id")
    .get(wrapAsync(listingcontroller.show))
    .delete(isLoggedin,isOwner,wrapAsync(listingcontroller.delete))
    .put(isLoggedin, isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingcontroller.update));

router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingcontroller.edit));

module.exports = router;