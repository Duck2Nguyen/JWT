import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: {
            allUsers: null,
            isFetching: false,
            error: false
        },
        msg: ""
    },
    reducers: {
        getUsersStart: (state) => {
            state.users.isFetching = true
        },
        getUsersSuccess: (state, action) => {
            state.users.isFetching = false
            state.users.allUsers = action.payload
            state.users.error = false
        },
        getUsersFailed: (state, action) => {
            state.users.isFetching = false
            state.users.error = true
        },
        deleteUsersStart: (state) => {
            state.users.isFetching = true
        },
        deleteUsersSuccess: (state, action) => {
            state.users.isFetching = false
            state.msg = action.payload
        },
        deleteUsersFailed: (state, action) => {
            state.users.isFetching = false
            state.users.error = true
            state.msg = action.payload
        },
        updateUsersStart: (state) => {
            state.users.isFetching = true
        },
        updateUsersSuccess: (state, action) => {
            state.users.isFetching = false
            state.msg = action.payload
        },
        updateUsersFailed: (state, action) => {
            state.users.isFetching = false
            state.users.error = true
            state.msg = action.payload
        },
    }
});

export const {
    getUsersStart,
    getUsersSuccess,
    getUsersFailed,
    deleteUsersStart,
    deleteUsersSuccess,
    deleteUsersFailed,
    updateUsersStart,
    updateUsersSuccess,
    updateUsersFailed
} = userSlice.actions;

export default userSlice.reducer