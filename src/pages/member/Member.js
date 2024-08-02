import React from 'react';
import {Outlet, Navigate} from 'react-router-dom';
import path from '../../utils/path';
import {useSelector} from "react-redux";

const Member = () => {
    const {isLogin, currentUser} = useSelector(state => state.user);
    console.log(isLogin);
    console.log(currentUser);
    if (!isLogin || !currentUser) {
        return <Navigate to={`/${path.LOGIN}`} replace={true}/>
    }
    return (
        <div>
            Member
            <Outlet/>
        </div>
    )
}

export default Member
