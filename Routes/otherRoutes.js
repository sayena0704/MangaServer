import express from "express";
import { contact, getDashboardStats, mangaRequest } from "../Controllers/otherController.js";
import { authorizedAdmin, isAuthenticated } from "../Middlewares/auth.js";

const router = express.Router();

// contact form
router.route("/contact").post(contact);

// Request form
router.route("/mangarequest").post(mangaRequest);

// Get Admin Dashboard Stats

router.route("/admin/stats").get(isAuthenticated, authorizedAdmin, getDashboardStats);

export default router;