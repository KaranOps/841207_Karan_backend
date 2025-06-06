const mongoose = require('mongoose');

exports.dbconnect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
    } catch (err) {
        console.log("Error occured while connecting db: ", err);
        process.exit(1);
    }
}