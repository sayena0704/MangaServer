// import mongoose from "mongoose";

// const mangaSchema = new mongoose.Schema({
//   // id: {
//   //   type: String,
//   //   required: true,
//   //   unique: true,
//   // },
//   title: {
//     type: String,
//     required: [true, "Please enter manga title"],
//     minLength:  [4, "Title must be at least 4 characters"],
//     maxLength:  [80, "Title can't exceed 80 characters"],
//   },
//   description: {
//     type: String,
//     required: [true, "Please enter the description"],
//     minLength:  [20, "Description must be at least of 20 characters"],
//   },
//   author: {
//     type: String,
//     required: true,
//     minLength:  [4, "Title must be at least 4 characters"],
//     maxLength:  [80, "Title can't exceed 80 characters"],
//   },
//   artist: {
//     type: String,
//     required: true,
//     minLength:  [4, "Title must be at least 4 characters"],
//     maxLength:  [80, "Title can't exceed 80 characters"],
//   },
//   genres: [
//     {
//       type: String,
//       required: true,
//     },
//   ],
//   status: {
//     type: String,
//     required: true,
//   },
//   rating: {
//     type: Number,
//     required: true,
//     min: 0,
//     max: 10,
//   },
//   bookmarks: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
//   comments: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
//   views: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
//   coverImage: {
//     public_id: {
//     type: String,
//     required: true,
//     },
//     url:{
//         type: String,
//         required: true,
//     },
//   },
//   chapters: [
//     {
//       number: {
//         type: Number,
//         required: true,
//       },
//       title: {
//         type: String,
//         required: true,
//       },
//       date: {
//         type: String,
//         required: true,
//       },
//       translator: {
//         type: String,
//         required: true,
//       },
//     },
//   ],

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export const Manga = mongoose.model("Manga", mangaSchema);


import mongoose from "mongoose";

const mangaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter manga title"],
    minLength: [4, "Title must be at least 4 characters"],
    maxLength: [80, "Title can't exceed 80 characters"],
  },
  description: {
    type: String,
    required: [true, "Please enter the description"],
    minLength: [20, "Description must be at least of 20 characters"],
  },
  author: {
    type: String,
    required: true,
    minLength: [4, "Title must be at least 4 characters"],
    maxLength: [80, "Title can't exceed 80 characters"],
  },
  artist: {
    type: String,
    required: true,
    minLength: [4, "Title must be at least 4 characters"],
    maxLength: [80, "Title can't exceed 80 characters"],
  },
  genres: [
    {
      type: String,
      required: true,
    },
  ],
  status: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  bookmarks: {
    type: Number,
    required: true,
    default: 0,
  },
  comments: {
    type: Number,
    required: true,
    default: 0,
  },
  views: {
    type: Number,
    required: true,
    default: 0,
  },
  coverImage: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  chapters: [
    {
      number: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
      translator: {
        type: String,
        required: true,
      },
      pdfUrl: {
        type: String,
      },
      pdfPublicId: {
        type: String,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Manga = mongoose.model("Manga", mangaSchema);
