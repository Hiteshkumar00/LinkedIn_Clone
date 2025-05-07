// instand of react redux we can use Zustand in react roject

import { configureStore } from '@reduxjs/toolkit';

import authReducer from './reducer/authReducer';
import postReducer from './reducer/postReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
  }
});

export default store;