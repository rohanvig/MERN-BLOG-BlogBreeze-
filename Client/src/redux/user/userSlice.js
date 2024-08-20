import { createSlice } from "@reduxjs/toolkit";

// Initial state for user management
const initialState = {
  currentUser: null, // Stores the current user's information
  error: null, // Stores any error messages
  loading: false, // Indicates if a request is currently being processed
};

// User reducer slice
const userSlice = createSlice({
  name: "user", // Name of the slice
  initialState, // Initial state passed to the slice
  reducers: {
    // Reducers to handle state changes

    // Called when sign-in starts; sets loading to true
    signInStart: (state) => {
      state.loading = true;
    },

    // Called on successful sign-in; stores the user data and resets error/loading
    signInSuccess: (state, action) => {
      state.currentUser = action.payload; // Update with signed-in user's data
      state.loading = false; // Set loading to false
      state.error = null; // Clear any previous error
    },

    // Called when sign-in fails; stores the error message
    signInFailure: (state, action) => {
      state.loading = false; // Stop the loading state
      state.error = action.payload; // Set the error message
    },

    // Called when user update starts; sets loading to true
    updateStart: (state) => {
      state.loading = true;
      state.error = null; // Clear any previous error
    },

    // Called on successful user update; stores the updated user data
    updateSuccess: (state, action) => {
      state.currentUser = action.payload; // Update with new user data
      state.loading = false; // Stop the loading state
      state.error = null; // Clear any error
    },

    // Called when user update fails; stores the error message
    updateFailure: (state, action) => {
      state.loading = false; // Stop the loading state
      state.error = action.payload; // Set the error message
    },

    // Called when delete user process starts; sets loading to true
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null; // Clear any previous error
    },

    // Called on successful user deletion; clears user data
    deleteUserSuccess: (state) => {
      state.currentUser = null; // Clear the user data
      state.loading = false; // Stop the loading state
      state.error = null; // Clear any error
    },

    // Called when delete user fails; stores the error message
    deleteUserFailure: (state, action) => {
      state.loading = false; // Stop the loading state
      state.error = action.payload; // Set the error message
    },

    // Called when the user successfully signs out
    signoutSuccess: (state) => {
      state.currentUser = null; // Clear the user data
      state.loading = false; // Stop the loading state
      state.error = null; // Clear any error
    },
  },
});

// Export actions to be used in components or thunks
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} = userSlice.actions;

// Export the reducer to be added to the Redux store
export default userSlice.reducer;
