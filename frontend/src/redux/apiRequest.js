import axios from "axios";
import { logOutFailed, logOutStart, logOutSuccess, loginFailed, loginStart, loginSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";
import { deleteUsersFailed, deleteUsersStart, deleteUsersSuccess, getUsersFailed, getUsersStart, getUsersSuccess, updateUsersFailed, updateUsersStart, updateUsersSuccess } from "./userSlice";

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart())
    try {
        const res = await axios.post("/v1/auth/login", user);
        dispatch(loginSuccess(res.data))
        navigate("/")
        window.location.reload(true)
    } catch (err) {
        console.log(err)
        dispatch(loginFailed())
    }
}

export const loginByFace = async (user, dispatch, navigate) => {
    dispatch(loginStart())
    try {
        const res = await axios.post("/v1/auth/loginByFace", user);
        dispatch(loginSuccess(res.data))
        navigate("/")
        window.location.reload(true)
    } catch (err) {
        console.log(err)
        dispatch(loginFailed())
    }
}

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart())
    try {
        const res = await axios.post("/v1/auth/register", user);
        dispatch(registerSuccess(res.data))
        navigate("/login")
    } catch (err) {
        console.log(err)
        dispatch(registerFailed())
    }
}


export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
    dispatch(getUsersStart())
    try {
        const res = await axiosJWT.get("/v1/user", {
            headers: { token: `Bearer ${accessToken}` }
        });
        dispatch(getUsersSuccess(res.data))
    } catch (err) {
        console.log(err)
        dispatch(getUsersFailed())
    }
}

export const deleteUser = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(deleteUsersStart())
    try {
        const res = await axiosJWT.delete("/v1/user/" + id, {
            headers: { token: `Bearer ${accessToken}` }
        });
        dispatch(deleteUsersSuccess(res.data))
    } catch (err) {
        console.log(err)
        dispatch(deleteUsersFailed(err.response.data))
    }
}


export const logOut = async (dispatch, id, navigate, accessToken, axiosJWT) => {
    dispatch(logOutStart())
    try {
        const res = await axiosJWT.post("/v1/auth/logout", id, {
            headers: { token: `Bearer ${accessToken}` }
        });
        dispatch(logOutSuccess())
        navigate("/login")
    } catch (err) {
        console.log(err)
        dispatch(logOutFailed())
    }
}


export const updateFaceRegistration = async (dispatch, data, accessToken, axiosJWT) => {
    dispatch(updateUsersStart())
    try {
        const res = await axiosJWT.put("/v1/user/update", data, {
            headers: { token: `Bearer ${accessToken}` }
        });
        console.log(res)
        dispatch(updateUsersSuccess(res.data))
    } catch (err) {
        console.log(err)
        dispatch(updateUsersFailed(err.response.data))
    }
}