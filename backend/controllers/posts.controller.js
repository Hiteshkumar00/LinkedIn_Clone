import Post from '../models/posts.model.js';
import User from '../models/user.model.js';
import Comment from '../models/comments.model.js';

import fs from 'fs';

const createPost = async (req, res, next) => {
  const {token} = req.body;
  if(!token) {
    return res.status(400).json({ message: "Invalid request." });
  }

  const user = await User.findOne({ token });
  if(!user) {
    return res.status(400).json({ message: "Invalid request." });
  }

  const post = new Post({
    userId: user._id,
    body: req.body.body,
    media: req.file != undefined ? req.file.filename : "",
    fileType: req.file != undefined ? req.file.mimetype.split("/").pop() : "",
  });

  await post.save();

  return res.status(201).json({ message: "Post created!" });
};


const getAllPosts = async (req, res, next) => {
  const posts = await Post.find().populate('userId', 'name email profilePicture username');
  return res.status(200).json(posts);
};

const deletePost = async (req, res, next) => {
  const {token, post_id} = req.body;
  if(!token || !post_id) {
    console.log(req.body);
    return res.status(400).json({ message: "Invalid request." });
  };

  const user = await User.findOne({ token }).select('_id');
  if(!user) {
    return res.status(400).json({ message: "Invalid request." });
  };

  const post = await Post.findOne({ _id: post_id, userId: user._id });
  if(!post) {
    return res.status(400).json({ message: "Invalid request." });
  };

  if(post.media){
    fs.unlink("uploads/" + post.media, (err) => {
      if(err) {
        console.error(err);
      }
    });
  }
  
  await Post.findByIdAndDelete(post._id);

  return res.status(200).json({ message: "Post deleted!" });
};

const commentPost = async (req, res, next) => {
  const {token, post_id, body} = req.body;
  if(!token || !post_id || !body) {
    return res.status(400).json({ message: "Invalid request." });
  };

  const user = await User.findOne({ token }).select('_id');
  const post = await Post.findById(post_id).select('_id');
  if(!user || !post) {
    return res.status(400).json({ message: "Invalid request." });
  };

  const comment = new Comment({
    userId: user._id,
    postId: post._id,
    body
  });

  await comment.save();

  return res.status(201).json({ message: "Comment created!" });
};


const getPostCommentsByPost = async (req, res, next) => {
  const {post_id} = req.query;
  if(!post_id) {
    return res.status(400).json({ message: "Invalid request." });
  };

  const comments = await Comment.find({ postId: post_id }).populate('userId', 'username name profilePicture');
  
  return res.status(200).json(comments);
};


const deleteComment = async (req, res, next) => {
  const {token, comment_id} = req.body;
  if(!token || !comment_id) {
    return res.status(400).json({ message: "Invalid request." });
  };

  const user = await User.findOne({ token }).select('_id');

  if(!user) {
    return res.status(400).json({ message: "Invalid request." });
  };

  await Comment.findOneAndDelete({ _id: comment_id, userId: user._id });

  return res.status(200).json({ message: "Comment deleted!" });
};


const incrementLikes = async (req, res, next) => {
  const {post_id} = req.body;
  
  const post = await Post.findById(post_id).select('_id likes');
  if(!post) {
    return res.status(400).json({ message: "Invalid request." });
  };
  post.likes += 1;
  await post.save();

  return res.status(200).json({ message: "Post liked!" });
};

export {
  createPost,
  getAllPosts,
  deletePost,
  commentPost,
  getPostCommentsByPost,
  deleteComment,
  incrementLikes
};