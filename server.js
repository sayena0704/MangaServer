import dotenv from 'dotenv';
dotenv.config({ path: './Config/config.env' });

import app from "./app.js";
import { connectDB } from "./Config/database.js";
import cloudinary from "cloudinary";
import Razorpay from "razorpay";
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

nodeCron.schedule("0 0 0 1 * *", async () => {
//   try {
//     await Stats.create({});
//   } catch (error) {
//     console.log(error);
//   }
try {
   const today = new Date();
   const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

   // Check if a document already exists for the current month
   let stats = await Stats.findOne({ createdAt: { $gte: startOfMonth } });

   if (!stats) {
     // Create new document if it doesn't exist
     await Stats.create({});
   }
 } catch (error) {
   console.log(error);
 }
});

app.listen(process.env.PORT,()=>{
  console.log(`Server is working on port: ${process.env.PORT}`)
})


