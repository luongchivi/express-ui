import React from 'react';
import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";
import path from "utils/path";
import {AdminSidebar} from "components";


const Admin = () => {
    const {isLogin, currentUser} = useSelector(state => state.user);
    const {roles} = currentUser;
    const isAdmin = roles.some(role => role.name === 'Admin');
    if (!isLogin || !currentUser || !isAdmin) {
        return <Navigate to={`/${path.LOGIN}`} replace={true}/>
    }
    return (
        <div className="flex w-full min-h-screen relative">
            <div className="w-[327px] top-0 bottom-0 flex-none fixed">
                <AdminSidebar/>
            </div>
            <div className="w-[327px]">

            </div>
            <div className="flex-auto">
                <Outlet/>
            </div>
        </div>
    )
}

export default Admin
