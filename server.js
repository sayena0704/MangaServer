import app from "./app.js";
import {connectDB} from "./Config/database.js"
import cloudinary from "cloudinary"
import Razorpay from "razorpay"
import nodeCron from "node-cron";
import { Stats } from "./Models/Stats.js";

connectDB();

cloudinary.v2.config({
   cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
   api_key: process.env.CLOUDINARY_CLIENT_API,
   api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

export const instance = new Razorpay({
   key_id: process.env.RAZORPAY_API_KEY,
   key_secret: process.env.RAZORPAY_API_SECRET,
 });

 nodeCron.schedule("0 0 0 1 * *", async ()=>{
   try{
      await Stats.create();
   } catch(error){
      console.log(error);
   }
 });

 const temp = async() =>{
   await Stats.create({});
 }
temp();
app.listen(process.env.PORT,()=>{
   console.log(`Server is working on port: ${process.env.PORT}`);
});

// import express from "express";
// import { connectDB } from "./db.js";
// import mangaRoutes from "./Routes/mangaRoutes.js"; // Adjust the path if necessary

// const app = express();

// // Connect to the database
// connectDB();

// app.use(express.json());

// // Use routes
// app.use('/api', mangaRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
