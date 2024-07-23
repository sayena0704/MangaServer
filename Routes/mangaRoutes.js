import express from "express";
import { addChapters, addManga, deleteChapter, deleteManga, getAllMangas, getMangaChapters } from "../Controllers/mangaController.js";
import singleUpload from "../Middlewares/multer.js";
import { authorizedAdmin, authorizeSubscribers, isAuthenticated } from "../Middlewares/auth.js";

const router = express.Router();
//  Get all mangas without chapters
router.route("/mangas").get(getAllMangas);

//  add new Manga only admin
router.route("/addmanga").post(isAuthenticated, authorizedAdmin, singleUpload, addManga);

// Add chapter, Delete Manga, Get Manga details
router.route("/manga/:id")
.get(isAuthenticated, authorizeSubscribers ,getMangaChapters)
.post(isAuthenticated, authorizedAdmin, singleUpload,addChapters)
.delete(isAuthenticated, authorizedAdmin, deleteManga);
;

// Delete Chapters
router.route("/chapter").delete(isAuthenticated, authorizedAdmin, deleteChapter)

export default router;