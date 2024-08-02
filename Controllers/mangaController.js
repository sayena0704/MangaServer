// import {Manga} from "../Models/Manga.js"

import { raw } from "express";
import { catchAsyncError } from "../Middlewares/catchAsyncError.js";
import { Manga } from "../Models/Manga.js";
import getDataUri from "../Utils/dataUri.js";
import ErrorHandler from "../Utils/errorHandler.js";
import cloudinary from "cloudinary"
import { Stats } from "../Models/Stats.js";


export const getAllMangas = catchAsyncError(async (req, res, next) => {
  const keyword = req.query.keyword || "";
  const genre = req.query.genre || "";

  const query = {
    title: { $regex: keyword, $options: "i" }
  };

  // if (genre) {
  //   query.genres = { $elemMatch: { $regex: genre, $options: "i" } };
  // }
  
  if (genre) {
    query.genres = genre; // Match exact genre or handle array
}
 
  const mangas = await Manga.find(query).select("-chapters");
  
  res.status(200).json({
    success: true,
    mangas,
  });
});




export const addManga = catchAsyncError( async (req, res, next) => {

  const {
   
    title,
    description,
    author,
    artist,
    genres,
    status,
    rating,
    bookmarks,
    comments,
    coverImage,
    // chapters,
  } = req.body;

  if ( !title || !description || !author || !artist || !genres || !status || !rating || !coverImage ) {
    return next(new ErrorHandler("Please add all fields", 400));
  }

  const file = req.file;
  const fileUri = getDataUri(file);

  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);


  const existingManga = await Manga.findOne({ title, author });
  if (existingManga) {
    return next(new ErrorHandler("Manga already exists", 400));
  }
  
  await Manga.create({
    
    title,
    description,
    author,
    artist,
    // genres,
    genres: Array.isArray(genres) ? genres : [genres],
    status,
    rating,
    bookmarks,
    comments,
    coverImage: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
    // chapters,
    // chapters: JSON.parse(chapters),
  });


     res.status(201).json({
        success: true,
        message: "Manga added Successfully!"
     });

});


export const getMangaChapters = catchAsyncError( async (req, res, next) => {

  const manga = await Manga.findById(req.params.id);
  if(!manga) return next(new ErrorHandler("Manga not found",404));

  manga.views += 1;
  await manga.save();

  res.status(200).json({
     success: true,
    //  chapters: manga.chapters,
    manga: {
      id: manga._id,
      title: manga.title,
      description: manga.description,
      author: manga.author,
      artist: manga.artist,
      genres: manga.genres,
      status: manga.status,
      rating: manga.rating,
      bookmarks: manga.bookmarks,
      comments: manga.comments,
      coverImage: manga.coverImage,
      chapters: manga.chapters,
    },
     views: manga.views,
  });

});

export const addChapters = catchAsyncError( async (req, res, next) => {
  const { id } = req.params;
  const { title, date, translator, } = req.body;

  // Find the manga by ID
  const manga = await Manga.findById(id);
  if (!manga) return next(new ErrorHandler("Manga not found", 404));


  const file = req.file;
  const fileUri = getDataUri(file);

  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content,{
    resource_type: "raw",
 });

  // Add the new chapter
  manga.chapters.push({
    number: manga.chapters.length + 1, // Increment the chapter number
    title,
    date,
    translator,
    pdfUrl: mycloud.secure_url, // URL to the uploaded PDF
    pdfPublicId: mycloud.public_id, // Cloudinary public ID for the PDF
  });

  // manga.numOfChapters = manga.chapters.length;

  await manga.save();

  res.status(200).json({
     success: true,
     message: "Chapter added successfully in Manga",
  });

});

export const deleteManga = catchAsyncError( async (req, res, next) => {

  const { id } = req.params;

  const manga = await Manga.findById(id);
  if (!manga) return next(new ErrorHandler("Manga not found", 404));

  if (manga.coverImage && manga.coverImage.public_id) {
    await cloudinary.v2.uploader.destroy(manga.coverImage.public_id, {
      resource_type: "image", // Use 'image' if it's an image file, adjust as needed
    });
  }
 
for (let i=0;i<manga.chapters.length;i++){
   const singleChapter = manga.chapters[i];
   if (singleChapter.pdfPublicId) {
    await cloudinary.v2.uploader.destroy(singleChapter.pdfPublicId, {
      resource_type: "raw", // For non-image files like PDFs
    });
  }
}

await Manga.findByIdAndDelete(id);

     res.status(200).json({
        success: true,
        message: "Manga deleted Successfully!"
     });

});


export const deleteChapter = catchAsyncError( async (req, res, next) => {

  const { mangaId, chapterId } = req.query;

  const manga = await Manga.findById(mangaId);
  if (!manga) return next(new ErrorHandler("Manga not found", 404));

  // Find the chapter by ID
  const chapter = manga.chapters.find(item => item._id.toString() === chapterId.toString());
  if (!chapter) return next(new ErrorHandler("Chapter not found", 404));

  // Delete the chapter's PDF from Cloudinary
  await cloudinary.v2.uploader.destroy(chapter.pdfPublicId, {
    resource_type: "raw", // For non-image files like PDFs
  });

  // Remove the chapter from the manga's chapters array
  manga.chapters = manga.chapters.filter(item => item._id.toString() !== chapterId.toString());

  manga.chapters.forEach((chapter, index) => {
    chapter.number = index + 1;
  });

await manga.save();

     res.status(200).json({
        success: true,
        message: "Chapter deleted Successfully!"
     });

});


// Manga.watch().on("change", async()=>{
//   const stats = await Stats.find({}).sort({ createdAt: "desc"}).limit(1);

//   const mangas = await Manga.find({});
  
//   totalViews = 0;
//   for (let i = 0; i < mangas.length; i++) {
//     totalViews += mangas[i].views;
//   }
//   stats[0].views = totalViews;
//   stats[0].createdAt = new date(Date.now());

//   await stats[0].save();
// });

Manga.watch().on("change", async () => {
  const stats = await Stats.find({}).sort({createdAt: "desc"}).limit(1);

  const mangas = await Manga.find({});

  let totalViews=0;

  for (let i = 0; i < mangas.length; i++) {
      totalViews += mangas[i].views;
  }
  stats[0].views = totalViews;
  stats[0].createdAt = new Date(Date.now());

  await stats[0].save();
});