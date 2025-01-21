const mongoose = require("mongoose")


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('DB connected');
        
    } catch (error) {
        console.log(error);
        console.log('DB failed');
    }
};

module.exports = connectDB