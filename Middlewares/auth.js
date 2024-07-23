import jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "../Utils/errorHandler.js";
import { User } from "../Models/User.js";


export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    // Check if token is present
    if (!token) return next(new ErrorHandler("Not Logged In", 401));

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user based on the decoded token
        req.user = await User.findById(decoded._id);

        // Check if user exists
        if (!req.user) return next(new ErrorHandler("User not found", 404));

        next();
    } catch (error) {
        // Handle any errors from token verification
        return next(new ErrorHandler("Invalid token", 401));
    }
});

// Middleware to check if the user is an admin
export const authorizedAdmin = (req, res, next) => {
    // Check if the user role is 'admin'
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return next(new ErrorHandler(
            `${req.user ? req.user.role : "User"} is not allowed to access this resource`,
            403
        ));
    }
};

export const authorizeSubscribers = (req, res, next) => {

    if (req.user.subscription.status !== "active" && req.user.role !== "admin")
        return next(new ErrorHandler(
            `Only Subscribers can acess this resource`, 403)
        );

    next();

};