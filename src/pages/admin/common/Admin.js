import React from 'react';
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import path from "utils/path";
import { AdminSidebar } from "components";

const Admin = () => {
    const { isLogin, currentUser } = useSelector(state => state.user);
    const roles = currentUser ? currentUser.roles : [];
    const isAdmin = roles.some(role => role.name === 'Admin');

    if (!isLogin || !currentUser || !isAdmin) {
        return <Navigate to={`/${path.LOGIN}`} replace={true} />
    }
    return (
        <div className="flex min-h-screen">
            <div className="w-72 bg-gray-800 text-white fixed top-0 left-0 bottom-0 overflow-y-auto">
                <AdminSidebar />
            </div>
            <div className="flex-1 ml-72 p-4 overflow-x-auto">
                <Outlet />
            </div>
        </div>
    )
}

export default Admin;

