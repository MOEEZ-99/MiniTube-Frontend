import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../features/userSlice";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const url = import.meta.env.VITE_API_URL
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const sidebar = useSelector((state) => state.sidebar.show);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${url}/api/user`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          dispatch(setUser(data))
        } else {
          alert("Token expired!")
          dispatch(clearUser())
        }
      } catch (err) {
        console.error(err);
        dispatch(clearUser())
      } finally {
        setLoading(false);
      }
    };

    getUser();
  },[]);

  if (loading) return <p>Loading...</p>;

  return user ? (
    <div className={`md:grid ${sidebar ? "md:grid-cols-[180px_1fr]" : "md:grid-cols-[auto_1fr] md:gap-[68px]"}`}>
          <div className="">
            <Sidebar />
          </div>
      <div className="md:col-span-1 p-2 overflow-hidden">
        <Outlet /> 
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
