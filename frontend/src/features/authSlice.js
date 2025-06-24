import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,  // fixed typo
};

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        userLoggedIn: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        userLoggedOut: (state) => {  // fixed naming consistency
            state.user = null;
            state.isAuthenticated = false;
        }
    }
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
