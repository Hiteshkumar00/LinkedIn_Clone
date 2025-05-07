import { createSlice } from "@reduxjs/toolkit";

import { getAllPosts, createPost, getAllComments } from "@/config/redux/action/postAction/index.js";


const initialState = {
  posts: [],
  postFetched: false,
  isLoading: false,
  isLoggedIn: false,
  isError: false,
  message: "",
  comments: [],
  postId: null,
};


const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: (state) => state = initialState,
    resetPostId: (state) => {
      state.postId = null;
      state.comments = []
    }
  },
  extraReducers: (builder) =>{
    builder
    .addCase(getAllPosts.pending, (state) => {
      state.isLoading = true;
      state.message = "Fetching all the posts...";
    })
    .addCase(getAllPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.postFetched = true;
      state.isError = false;
      state.posts = action.payload.reverse();
    })
    .addCase(createPost.pending, (state) => {
      state.isLoading = true;
      state.message = "Creating post...";
    })
    .addCase(createPost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
    })
    .addCase(createPost.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
      state.message = action.payload.message;
    })
    .addCase(getAllComments.fulfilled, (state, action) => {
      state.postId = action.payload.post_id;
      state.comments = action.payload.comments.reverse();
    })
  }
});


export const { reset, resetPostId } = postSlice.actions;

export default postSlice.reducer;
