import mongoose from "mongoose";

export const connectDB = async() => {
    const  {connection} = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected with ${connection.host}`);
}

// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

// export const connectDB = async () => {
//   try {
//     const { connection } = await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 30000, // Increase the timeout to 30 seconds
//     });

//     console.log(`MongoDB connected with ${connection.host}`);
//   } catch (error) {
//     console.error('MongoDB connection error:', error.message);
//     process.exit(1); // Exit process with failure
//   }
// };
