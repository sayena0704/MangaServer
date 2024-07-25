import { catchAsyncError } from "../Middlewares/catchAsyncError.js";
import ErrorHandler from "../Utils/errorHandler.js";
import {User} from "../Models/User.js"
import { sendToken } from "../Utils/sendToken.js";
import { sendEmail } from "../Utils/sendEmail.js";
import { Manga } from "../Models/Manga.js";
import crypto from "crypto";
import cloudinary from "cloudinary";
import getDataUri from "../Utils/dataUri.js";
import { Stats } from "../Models/Stats.js";
import { UserActivity } from "../Models/UserActivity.js";

export const register = catchAsyncError(async (req, res, next) => {
   
    const { name, email, password} = req.body;
    const file = req.file;

    if(!name || !email || !password || !file) 
        return next(new ErrorHandler("Please eneter all fields", 400));

try {
    let user = await User.findOne({ email });

    if (user) {
        return next(new ErrorHandler("User already exists", 409));
    }

    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: mycloud.public_id,
            url: mycloud.secure_url,
        },
    });

    sendToken(res, user, "Registered Successfully", 201);
} catch (error) {
    return next(new ErrorHandler(error.message, 400));
}
});


export const login = catchAsyncError(async (req, res, next) => {
   
    const { email, password} = req.body;

    // const file = req.file;

    if( !email || !password) 
        return next(new ErrorHandler("Please eneter all fields", 400));

try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Incorrect Email or Password", 401));
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return next(new ErrorHandler("Incorrect Email or Password", 401));
    }
// Log user activity
    await logUserActivity(user._id);

    sendToken(res, user, `Welcome Back!,  ${user.name}`, 200);
} catch (error) {
    return next(new ErrorHandler(error.message, 400));
}
});

export const logout = catchAsyncError(async(req, res, next) =>{
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }).json({
        success:true,
        message: "Logged Out Successfully",
    })
});

export const getMyProfile = catchAsyncError(async(req, res, next) =>{
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user,
    });
}); 

export const changePassword = catchAsyncError(async(req, res, next) =>{
    const {oldPassword, newPassword} = req.body;
    if( !oldPassword || !newPassword) 
        return next(new ErrorHandler("Please eneter all fields", 400));

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(oldPassword);

    if( !isMatch) 
        return next(new ErrorHandler("Incorrect Old Password", 400));

    user.password = newPassword;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password changed successfully!",
    });
});

export const updateProfile = catchAsyncError(async(req, res, next) =>{
    const {name, email} = req.body;
   
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;

    
    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
    });
});

export const updateprofilepicture = catchAsyncError(async(req, res, next) =>{
    
    const file = req.file;
 
    const user = await User.findById(req.user._id);


    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

await cloudinary.v2.uploader.destroy(user.avatar.public_id);
user.avatar={
    public_id: mycloud.public_id,
    url: mycloud.secure_url,
};

await user.save();

   res.status(200).json({
     success:true,
     message: "Profile Picture Updated Successfully",
   });
});

export const forgetPassword = catchAsyncError(async(req, res, next) =>{
   const { email } = req.body;
   const user = await User.findOne({ email});

   if(!user) return next(new ErrorHandler("User not Found", 400));

   const resetToken = await user.getResetToken();

   await user.save();

   const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

   const message = `Click on the link to reset your password. ${url}. If you have not requested then please ignore.`
//    send token via email
await sendEmail(user.email, "MangaVerse Reset Password", message)

   res.status(200).json({
     success:true,
     message: `Reset Token has been sent to ${user.email}`,
   });
});


export const resetPassword = catchAsyncError(async(req, res, next) =>{
   const {token} = req.params;

   const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

   const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
        $gt: Date.now(),
    },
   });

   if(!user) return next(new ErrorHandler("Token is Invalid or has been expired."));

   user.password = req.body.password;
   user.resetPasswordExpire=undefined;
   user.resetPasswordToken=undefined; 

   await user.save();

   res.status(200).json({
     success:true,
     message: "Password Changed Successfully",
   });
});


export const addToLibrary = catchAsyncError(async (req, res, next) => {
   
  
    const manga = await Manga.findById(req.body._id);
    const user = await User.findById(req.user._id);
  
    if (!manga) {
      return next(new ErrorHandler("Manga not found", 404)) ;
    }
    const itemExist = user.library.find((item)=>{
       if (item.manga.toString()===manga._id.toString()) return true;
    });

    if(itemExist) return next(new ErrorHandler("Manga already in library", 409));
  
  
    user.library.push({
      manga: manga._id,
      poster: manga.coverImage.url,
    });
  
    await user.save();
  
    res.status(200).json({
      success: true,
      message: "Manga added to library",
    });
  });

// Remove from library
export const removeFromLibrary = catchAsyncError(async (req, res, next) => {
    const manga = await Manga.findById(req.query.id);
    const user = await User.findById(req.user._id);
  
    if (!manga) {
      return next(new ErrorHandler("Manga not found", 404)) ;
    }
    const newLibrary = user.library.filter((item)=>{
       if (item.manga.toString()!==manga._id.toString()) return item;
    });

   user.library = newLibrary;  
    await user.save();
  
    res.status(200).json({
      success: true,
      message: "Manga removed from library",
    });
  });


//Admin Controllers
  export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find({});
  
    res.status(200).json({
      success: true,
      users
    });
  });


  export const updateUserRole = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) return next(new ErrorHandler("User not found", 404));

    if(user.role === "user") user.role="admin";
    else user.role = "user";

    await user.save();
  
    res.status(200).json({
      success: true,
      message: "Role Updated",
    });
  });

  export const deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) return next(new ErrorHandler("User not found", 404));

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    // Cancel Subscription

    await user.deleteOne();
  
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  });

  export const deleteMyProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    await user.deleteOne();
  
    res.status(200).cookie("token",null, {
        expires: new Date(Date.now()),
    }).json({
      success: true,
      message: "User Deleted Successfully",
    });
  });

  // Log user activity (increment login count)
export const logUserActivity = catchAsyncError(async (userId) => {
  const today = new Date().toISOString().split('T')[0];
  
  let activity = await UserActivity.findOne({ user: userId, date: today });

  if (activity) {
    activity.count += 1;
    await activity.save();
  } else {
    await UserActivity.create({ user: userId, date: today, count: 1 });
  }
});

// Get user activity for the graph
export const getUserActivity = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  const activities = await UserActivity.find({ user: userId })
    .sort({ date: 1 })
    .select('date count');

  res.status(200).json({
    success: true,
    activities
  });
});


  User.watch().on("change", async () => {
    const stats = await Stats.find({}).sort({createdAt: "desc"}).limit(1);

    const subscription = await User.find({"subscription.status": "active"});

    stats[0].users = await User.countDocuments();
    stats[0].subscription = subscription.length;
    stats[0].createdAt = new Date(Date.now());

    await stats[0].save();
});