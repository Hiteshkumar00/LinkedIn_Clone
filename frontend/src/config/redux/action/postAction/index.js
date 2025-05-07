import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";


export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI)=> {
    try {
      const response = await clientServer.get("/post");
      return thunkAPI.fulfillWithValue(response.data);
    }catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const createPost = createAsyncThunk(
  "post/createPost",
  async (data, thunkAPI)=> {
    try {
      
      let formData = new FormData();
      formData.append("body", data.body);
      formData.append("media", data.media);
      formData.append("token", localStorage.getItem("token"));

      
      const response = await clientServer.post("/post", formData);

      return thunkAPI.fulfillWithValue(response.data);
    }catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post_id, thunkAPI) => {
    try {
      const response = await clientServer.delete("/post",{
        data: {
          post_id,
          token: localStorage.getItem('token')
        }
      });

      return thunkAPI.fulfillWithValue(response.data);
    }catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const incrementLikes = createAsyncThunk(
  "post/incrementLikes",
  async (post_id, thunkAPI) => {
    try {
      const response = await clientServer.patch("/post/like",{post_id});

      return thunkAPI.fulfillWithValue(response.data);
    }catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async(post_id, thunkAPI) => {
    try {
      const response = await clientServer.get("/post/comments",{
        params: {
          post_id
        }
      });


      return thunkAPI.fulfillWithValue({
        comments: response.data,
        post_id
      });
    }catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const postComment = createAsyncThunk(
  "post/postComment",
  async({post_id, body}, thunkAPI) => {
    try {
      const response = await clientServer.post("/post/comment",{
        token: localStorage.getItem("token"),
        body,
        post_id
      });


      return thunkAPI.fulfillWithValue(response.data);
    }catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const deleteComment = createAsyncThunk(
  "post/deleteComment",
  async(comment_id, thunkAPI) => {
    try {
      const response = await clientServer.delete("/post/comment",{
        data: {
          comment_id,
          token: localStorage.getItem('token')
        }
      });


      return thunkAPI.fulfillWithValue(response.data);
    }catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



