import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: rootReducer,
  },
});

export default store;