import { createSlice } from "@reduxjs/toolkit";

import { loginUser, registerUser, getAboutUser, getAllUsers,
  getConnectionsRequest, getMyConnectionsRequest
 } from "../../action/authAction/index.js";

const initialState = {
  user: {},
  all_users: [],
  isError: false,
  isRegistered: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  isTokenThere: false,
  message: "",
  profileFetched: false,
  allUsersFetched: false,
  connections: [],
  connectionRequests: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => state = initialState,
    handleLoginUser: (state, action) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere: (state, action) => {
      state.isTokenThere = true;
    },
    unsetTokenIsThere: (state, action) => {
      state.isTokenThere = false;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Knoking the door...";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "Login is successful!";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "registering you...";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isRegistered = true;
        state.message = "Registration is successful! please Login";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isRegistered = false;
        state.message = action.payload.message;
      })
      .addCase(getAboutUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching user profile...";
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.profileFetched = true;
        state.user = action.payload;
        state.message = "User profile fetched successfully!";
      })
      .addCase(getAboutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.profileFetched = false;
        state.message = action.payload.message;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching all users...";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.all_users = action.payload;
        state.allUsersFetched = true;
        state.message = "All users fetched successfully!";
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload.message;
      })
      .addCase(getConnectionsRequest.fulfilled, (state, action) => {
        state.connections = action.payload;
      })
      .addCase(getConnectionsRequest.rejected, (state) => {
        state.message = action.payload;
      })
      .addCase(getMyConnectionsRequest.fulfilled, (state, action) => {
        state.connectionRequests = action.payload;
      })
      .addCase(getMyConnectionsRequest.rejected, (state) => {
        state.message = action.payload;
      });
  }
});

export const { emptyMessage, setTokenIsThere, reset, unsetTokenIsThere} = authSlice.actions;

export default authSlice.reducer;