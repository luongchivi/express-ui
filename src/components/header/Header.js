import React, {Fragment, memo, useState} from 'react';
import logo from 'assets/logo_digital_new_250x.png';
import icons from 'utils/icons';
import {Link} from 'react-router-dom';
import path from 'utils/path';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from "../../store/user/userSlice";

const Header = () => {
    const {currentUser, isLogin} = useSelector(state => state.user);
    const isAdmin = currentUser?.roles?.some(role => role.name === 'Admin');
    const isUser = currentUser?.roles?.some(role => role.name === 'User');
    const dispatch = useDispatch();
    const {
        MdPhone, IoMdMail, IoBagCheckSharp, FaCircleUser
    } = icons;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        setIsDropdownOpen(false);
    };

    return (
        <div className='w-main h-[110px] py-[35px] flex justify-between'>
            <Link to={path.HOME}>
                <img src={logo} alt="logo" className="w-[234px] object-contain"/>
            </Link>
            <div className='flex text-[13px]'>
                <div className='flex flex-col items-center px-6 border-r'>
                    <span className='flex gap-4 items-center'>
                        <MdPhone color='red'/>
                        <span className='font-semibold'>(+1800) 000 8808</span>
                    </span>
                    <span>Mon-Sat 9:00AM - 8:00PM</span>
                </div>
                <div className='flex flex-col items-center px-6 border-r'>
                    <span className='flex gap-4 items-center'>
                        <IoMdMail color='red'/>
                        <span className='font-semibold'>SUPPORT@TADATHEMES.COM</span>
                    </span>
                    <span>Online Support 24/7</span>
                </div>
                {isLogin && (
                    <Fragment>
                        <Link
                            to={`/${path.MEMBER}/${path.CART}`}
                            className='flex items-center justify-center gap-2 px-6 border-r cursor-pointer'>
                            <IoBagCheckSharp color='red' size={20}/>
                            <span>0 item(s)</span>
                        </Link>
                        <div className='relative flex'>
                            <div
                                onClick={toggleDropdown}
                                className='flex items-center justify-center gap-2 px-6 cursor-pointer'
                            >
                                <FaCircleUser size={20} color='red'/>
                                <span>Profile</span>
                            </div>
                            {isDropdownOpen && (
                                <div
                                    className='min-w-full m-auto absolute left-0 top-8 mt-2 bg-white border rounded-b shadow-lg'>
                                    <Link
                                        to={`/${path.MEMBER}/${path.PERSONAL}`}
                                        className='block px-4 py-2 text-gray-800 hover:bg-gray-200 hover:text-main'
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Personal
                                    </Link>
                                    {isAdmin && (
                                        <Link
                                            to={`${path.ADMIN}/${path.DASHBOARD}`}
                                            className='block px-4 py-2 text-gray-800 hover:bg-gray-200 hover:text-main'
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Admin
                                        </Link>
                                    )}
                                    <div
                                        onClick={handleLogout}
                                        className='block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer hover:text-main'
                                    >
                                        Logout
                                    </div>
                                </div>
                            )}
                        </div>
                    </Fragment>
                )}
            </div>
        </div>
    );
}

export default memo(Header);
