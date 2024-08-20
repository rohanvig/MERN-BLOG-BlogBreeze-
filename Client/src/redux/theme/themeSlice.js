import { createSlice } from '@reduxjs/toolkit';

// Define the initial state for the theme, starting with 'light'
const initialState = {
    theme: 'light'  // Initial theme set to 'light'
};

// Create a Redux slice for theme management
const themeSlice = createSlice({
    name: 'theme',  // Name of the slice
    initialState,   // Initial state passed to the slice
    reducers: {     // Define reducers (functions to change the state)
        toggleTheme: (state) => {
            // Toggle between 'light' and 'dark' theme
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
    }
});

// Export the toggleTheme action so it can be used in components
export const { toggleTheme } = themeSlice.actions;

// Export the reducer to be added to the Redux store
export default themeSlice.reducer;
