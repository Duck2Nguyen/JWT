import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import "./navbar.css";
import { logOutSuccess } from "../../redux/authSlice";
import { createAxios } from "../../createInstance";
import { logOut } from "../../redux/apiRequest";
import FaceRegistration from "./FaceRegistration";

const NavBar = () => {
  const user = useSelector((state) => state.auth.login.currentUser)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const id = user?._id;
  const accessToken = user?.accessToken
  const axiosJWT = createAxios(user, dispatch, logOutSuccess)

  const handleLogout = () => {
    logOut(dispatch, id, navigate, accessToken, axiosJWT)
  }
  return (
    <nav className="navbar-container">
      <Link to="/" className="navbar-home"> Home </Link>
      {user ? (
        <>
          <p className="navbar-user">Hi, <span> {user.username}  </span> </p>
          {!user?.faceRegistration && <FaceRegistration />}
          <Link to="/logout" className="navbar-logout"
            onClick={() => handleLogout()}
          > Log out</Link>
        </>
      ) : (
        <>
          <Link to="/login" className="navbar-login"> Login </Link>
          <Link to="/register" className="navbar-register"> Register</Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
