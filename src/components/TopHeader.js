import React, {memo, useEffect} from 'react';
import {Link} from 'react-router-dom';
import path from '../utils/path';
import {useDispatch, useSelector} from "react-redux";
import {getCurrentUser} from "../store/user/asyncAction";
import icons from "../utils/icons";
import {logout} from "../store/user/userSlice";

const {MdLogout} = icons;

const TopHeader = () => {
    const dispatch = useDispatch();
    const {isLogin, currentUser} = useSelector((state) => state.user);

    useEffect(() => {
        if (isLogin) {
            dispatch(getCurrentUser())
        }
    }, [dispatch, isLogin])

    return (
        <div className="h-[38px] w-full bg-main flex items-center justify-center">
            <div
                className="w-main flex items-center justify-between text-xs text-white"
            >
                <span>
                    ORDER ONLINE OR CALL US (+1800) 000 8808
                </span>
                {
                    isLogin ?
                        <small className="flex items-center justify-center text-xs gap-2">
                            <span>{`Welcome, ${currentUser?.lastName} ${currentUser?.firstName}`}</span>
                            <span
                                onClick={() => {
                                    dispatch(logout())
                                }}
                                className="hover:rounded-full hover:bg-gray-200 p-2 hover:text-main cursor-pointer"
                            >
                                <MdLogout size={17}/>
                            </span>
                        </small>
                        :
                        <Link
                            className="hover:text-gray-800"
                            to={`/${path.LOGIN}`}
                        >
                            Sign In or Create Account
                        </Link>
                }
            </div>
        </div>
    )
}

export default memo(TopHeader)
