import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AlumniLogin from "./components/Alumni/AlumniLogin";
import AdminLogin from "./components/Admin/AdminLogin";
import UserLogin from "./components/UserLogin";
import Signup from "./components/signup/Signup";
import ForgotPassword from "./components/ForgotPassword";
import UserHome from "./components/UserHome";
import Navbar from "./components/Navbar";
import PendingApproval from "./components/pendingApproval";
import ProtectedRoute from './utils/protectedRoutes';
import checkRequestStatus from "./utils/checkRequestStatus";
import AdminAlumniRequests from "./components/Admin/AdminAlumniRequests";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AlumniDashboard from "./components/Alumni/AlumniDashboard"
import Loader from "./components/Loader"
// import jwtDecode from "jwt-decode";
 
import  useAuth  from './redux/hooks/useAuth'

const App = () => {
    const { user, UpdateUserLogin} = useAuth()
    const navigate = useNavigate();
    const [isLoading, setisLoading] = useState(true)
    const getUser = async () => {
        
        try {
          const response = await fetch("http://localhost:3000/api/me", {
            method: "GET",
            credentials: "include", // Equivalent to `withCredentials: true` in axios
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const userData = await response.json();
          console.log(userData)
          return userData;
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          throw error; // Re-throw the error for further handling
        }finally {
            setisLoading(false); // Loading is complete
        }
      };      
       
    useEffect(() => {
        // const tkn = JSON.parse(localStorage.getItem('token'));
        const fetchUser = async () => {
            try {
              const tkn = await getUser(); // Await the resolved value of the promise
              console.log(tkn);
              
              if (tkn) {
                // if(tkn.role == "pending"){
                //   // await checkRequestStatus()
                //   navigate("/pending-approval")
                // }
                
                  UpdateUserLogin(tkn.username, tkn.role, tkn.token);
                
              }
            } catch (error) {
              console.error("Error in fetching user data:", error);
            }
          };
      
          fetchUser();
          setisLoading(false)
      }, [])

    //   if (isLoading) {
    //     return <Loader />; // Show loader while checking auth state
    // }

    return (
        <>
            <Navbar />
            <Routes>
                <Route
                    path="/"
                    element={user ? <UserHome /> : <Navigate to="/login/user" />}
                />
                <Route path="/pending-approval" element={<PendingApproval />} />

                <Route
                    path="/login/user"
                    element={!user ? <UserLogin /> : <Navigate to="/" />}
                />
                <Route
                    path="/signup"
                    element={!user ? <Signup /> : <Navigate to="/" />}
                />
                <Route path="/login/alumni" element={user? <Navigate to="/alumniDashboard" />: <AlumniLogin />} />
                <Route path="/login/admin" element={user ? <Navigate to="/adminDashboard" />: <AdminLogin />} />
                <Route
                    path="/adminDashboard"
                    element={user ? <AdminDashboard /> : <Navigate to="/login/admin" />}
                />
                <Route
                    path="/alumniDashboard"
                    element={user ? <AlumniDashboard /> : <Navigate to="/login/alumni" />}
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
        </>
    );
};

export default App;
