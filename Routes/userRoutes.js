import express from "express";
import { addToLibrary, changePassword, deleteMyProfile, deleteUser, forgetPassword, getAllUsers, getMyProfile, getUserActivity, login, logout, register, removeFromLibrary, resetPassword, updateProfile, updateprofilepicture, updateUserRole } from "../Controllers/userController.js";
import { authorizedAdmin, isAuthenticated } from "../Middlewares/auth.js";
import singleUpload from "../Middlewares/multer.js";

const router = express.Router();

// To register a new user
router.route("/register").post(singleUpload , register);

// Login
router.route("/login").post(login);

// LOgout
router.route("/logout").get(logout);

// Get my profile
router.route("/me").get(isAuthenticated , getMyProfile);

// Delete my profile
router.route("/me").delete(isAuthenticated , deleteMyProfile);

// ChangePassword
router.route("/changepassword").put(isAuthenticated , changePassword);

//  UpdateProfile
router.route("/updateprofile").put(isAuthenticated , updateProfile);

//  UpdateProfilePicture
router.route("/updateprofilepicture").put(isAuthenticated , singleUpload, updateprofilepicture);

// ForgetPassword
router.route("/forgetpassword").post(forgetPassword);

// ResetPassword
router.route("/resetpassword/:token").put(resetPassword);
// Add to library
router.route("/addtomylibrary").post(isAuthenticated, addToLibrary);
// remove from library
router.route("/removefromlibrary").delete(isAuthenticated, removeFromLibrary);
// Get user activity (for graph)
router.route("/activity").get(isAuthenticated, getUserActivity);

// Admin Routes
router.route("/admin/users").get(isAuthenticated, authorizedAdmin,getAllUsers);

router.route("/admin/user/:id")
.put(isAuthenticated, authorizedAdmin,updateUserRole)
.delete(isAuthenticated, authorizedAdmin, deleteUser);

export default router;