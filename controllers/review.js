const review=require("../models/review.js")
const listing=require("../models/listing.js")
const {reviewSchema}=require("../schema.js")

module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params;
    // Remove the reference to the review from the listing
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // Delete the review itself
    await review.findByIdAndDelete(reviewId); // Corrected to findByIdAndDelete
    console.log("Review deleted");
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.createReview = async(req, res) => {
    let Listing=await listing.findById(req.params.id);
    let newReview=new review(req.body.review);
    newReview.author=req.user._id;
    Listing.reviews.push(newReview);
    await newReview.save();
    await Listing.save();
    console.log("new review saved");
    req.flash("success", "Review Added Successfully!");
    res.redirect(`/listings/${Listing._id}`);
}
