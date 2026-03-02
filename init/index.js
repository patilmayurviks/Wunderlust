
const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listning = require("../models/listing.js");
const Mongo_url= "mongodb://127.0.0.1:27017/Wanderlust";
main().then(()=>{console.log("conected to DB")})
.catch(err=>{console.log(err)});
async function main() {
    await mongoose.connect(Mongo_url);
}
const initDB=async()=>{
    await Listning.deleteMany({});
    initdata.data= initdata.data.map(obj=>({...obj,owner:'698b672df7c6ce83f61ed408',}));


    await Listning.insertMany(initdata.data);
    console.log("all data savde Succefully");
};
initDB();