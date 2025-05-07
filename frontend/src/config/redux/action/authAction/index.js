import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try{
      const response = await clientServer.post("/user/login", {
        username: user.username,
        password: user.password,
      });

      if(response.data.token){
        localStorage.setItem("token", response.data.token);
        return response.data;
      }else{
        return thunkAPI.rejectWithValue({
          message: "token not provided!",
        });
      }

    }catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try{
      const response = await clientServer.post("/user/register", {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
      });

      return thunkAPI.fulfillWithValue(response.data.token);
    }catch (error) {
      console.log(error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try{
      const response = await clientServer.get("/user/get_user_and_profile",{
        params: {
          token: user.token,
        }
      });

      return thunkAPI.fulfillWithValue(response.data);
    }catch (error) {
      console.log(error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try{
      const response = await clientServer.get("/user/get_all_users");
      return thunkAPI.fulfillWithValue(response.data);
    }catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

