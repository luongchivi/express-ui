import React, {memo, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import path from '../utils/path';
import {useDispatch, useSelector} from "react-redux";
import {getCurrentUser} from "../store/user/asyncAction";
import icons from "../utils/icons";
import {clearSessionExpiredMessage, logout} from "../store/user/userSlice";
import Swal from "sweetalert2";

const {MdLogout} = icons;

const TopHeader = () => {
    const dispatch = useDispatch();
    const {isLogin, currentUser, sessionExpiredMessage} = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        const setTimeoutId = setTimeout(() => {
            if (isLogin) {
                dispatch(getCurrentUser())
            }

            return () => {
                clearTimeout(setTimeoutId);
            }
        }, 300)
    }, [dispatch, isLogin])

    useEffect(() => {
        if (sessionExpiredMessage) {
            Swal.fire("Oops!", sessionExpiredMessage, 'info').then(() => {
                dispatch(clearSessionExpiredMessage());
                navigate(`/${path.LOGIN}`);
            })
        }
    }, [sessionExpiredMessage])

    return (
        <div className="h-[38px] w-full bg-main flex items-center justify-center">
            <div
                className="w-main flex items-center justify-between text-xs text-white"
            >
                <span>
                    ORDER ONLINE OR CALL US (+1800) 000 8808
                </span>
                {
                    isLogin && currentUser
                        ?
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
