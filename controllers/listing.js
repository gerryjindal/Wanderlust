const listing=require("../models/listing.js")
const { populate } = require('../models/review.js');

module.exports.index = async (req, res) => {
    const alllistings = await listing.find({});  // Async database call
    res.render("listings/index.ejs", { alllistings });
}

module.exports.newroute=(req,res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
}

module.exports.show=async (req, res) => {
    const { id } = req.params;
    const Listing = await listing.findById(id)
        .populate({path:"reviews",populate:{path:"author"}})
        .populate("owner");
    if (!Listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");  // Return to prevent further execution
    }
    else
        res.render("listings/show.ejs", { Listing });
}

module.exports.delete=async (req, res) => {
    let { id } = req.params;
    let deletedListing=await listing.findByIdAndDelete(id, {id});
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect(`/listings`);
}

module.exports.edit=async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id);
    
    if (!Listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");  // Return to stop further execution
    }
    let originalImageUrl=Listing.image.url;
    originalImageUrl.replace("/update","/upload/w_250")    
    res.render("listings/edit.ejs", { Listing,originalImageUrl });
}

module.exports.update=async (req, res) => {
    let { id } = req.params;
    let Listing=await listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        Listing.image={url,filename};
        await Listing.save();  // Save the updated listing with the new image URL and filename
    }
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.post=async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"..",filename)
    const newListing = new listing(req.body.listing);
    newListing.owner=req.user._id;  // Add the owner ID to the new listing before saving it
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
}