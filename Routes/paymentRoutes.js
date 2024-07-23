import express from "express";
import { isAuthenticated } from "../Middlewares/auth.js";
import { buySubscription, cancelSubscription, getRazorPayKey, paymentVerification } from "../Controllers/paymentController.js";

const router = express.Router();

// Buy Subscription
router.route("/subscribe").get(isAuthenticated,buySubscription);

// Verify Payment and save reference in databse
router.route("/paymentverification").post(isAuthenticated,paymentVerification);

// Get RazorPay key
router.route("/razorpaykey").get(getRazorPayKey);

// cancel subscription 
router.route("/subscribe/cancel").delete(isAuthenticated,cancelSubscription);

export default router;