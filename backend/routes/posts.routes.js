import {
  createPost,
  getAllPosts,
  deletePost,
  commentPost,
  getPostCommentsByPost,
  deleteComment,
  incrementLikes,

} from "../controllers/posts.controller.js";

import wrapAsync from "../middleware/wrapAsync.js";


import { Router } from "express";
const router = Router();

import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// 1. Create a new post
router.post("/", upload.single('media'), wrapAsync(createPost));

// 2. get all posts
router.get("/", wrapAsync(getAllPosts));

// 3. Delete a post
router.delete("/", wrapAsync(deletePost));


// 4. Comment on a post
router.post("/comment", wrapAsync(commentPost));

// 5. get all comments on a post
router.get("/comments", wrapAsync(getPostCommentsByPost));

// 6. Delete a comment
router.delete("/comment", wrapAsync(deleteComment));

// 8. like a post
router.patch("/like", wrapAsync(incrementLikes));

export default router;