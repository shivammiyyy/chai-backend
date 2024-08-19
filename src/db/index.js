import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`mongodb+srv://Sumitgaud:Sumitgaud25@5umitra.5hbq8rl.mongodb.net`)
        console.log(`\n MONGODB connect !!! DB HOST : ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MONGODB CONNETING ERROR", error);
        process.exit(1)
    }
}

export default connectDB