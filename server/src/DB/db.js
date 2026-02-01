const mongoose = require("mongoose")

const connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error(err,"Error ho gaya");
        console.log(process.env.MONGO_URI);
        console.log(process.env.JWT_SECRET)
        process.exit(1);
    }
};

module.exports = connectDB;
