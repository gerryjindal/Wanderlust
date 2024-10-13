const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");


main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongoose");
}
const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"66fede0838e37fe90ae38a5f"}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialised");
}

initDB();
