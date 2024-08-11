import React, {Fragment, useState} from 'react';
import {Navigate, NavLink, Outlet} from 'react-router-dom';
import {useSelector} from "react-redux";
import {personalSidebar} from "utils/containts";
import clsx from 'clsx';
import icons from 'utils/icons';
import path from "utils/path";
import defaultAvatar from "assets/default_avatar.png";

const { IoIosArrowDown, IoIosArrowForward } = icons;

const activeStyle = 'px-4 py-2 flex items-center gap-2 text-gray-200 bg-gray-500';
const notActiveStyle = 'px-4 py-2 flex items-center gap-2 text-gray-200 hover:bg-gray-400';

const Member = () => {
    const [active, setActive] = useState([]);

    const handleShowTabs = (tabId) => {
        if (active.includes(tabId)) {
            setActive(prev => prev.filter(id => id !== tabId));
        } else {
            setActive(prev => [...prev, tabId]);
        }
    };
    const {isLogin, currentUser} = useSelector(state => state.user);
    if (!isLogin || !currentUser) {
        return <Navigate to={`/${path.LOGIN}`} replace={true}/>
    }
    return (
        <div className="flex">
            <div className="w-main m-auto flex">
                <div className="w-1/5 bg-zinc-600">
                    <div className="p-4 flex flex-col justify-center items-center gap-2">
                        <img className="w-[100px] object-contain" src={defaultAvatar} alt="logo"/>
                    </div>
                    <div>
                        {personalSidebar.map((item) => (
                            <Fragment key={item.id}>
                                {item.type === 'SINGLE' && (
                                    <NavLink
                                        className={({isActive}) => clsx(isActive ? activeStyle : notActiveStyle)}
                                        to={item.path}
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.text}</span>
                                    </NavLink>
                                )}
                                {item.type === 'PARENT' && (
                                    <div className="flex flex-col text-gray-200">
                                        <div
                                            className="flex items-center justify-between px-4 py-2 cursor-pointer"
                                            onClick={() => handleShowTabs(item.id)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span>{item.icon}</span>
                                                <span>{item.text}</span>
                                            </div>
                                            {active.includes(item.id) ? <IoIosArrowDown/> : <IoIosArrowForward/>}
                                        </div>
                                        {active.includes(item.id) && (
                                            <div className="flex flex-col pl-6">
                                                {item.submenu.map((subItem, index) => (
                                                    <NavLink
                                                        key={index}
                                                        to={subItem.path}
                                                        onClick={e => e.stopPropagation()}
                                                        className={({isActive}) => clsx(isActive ? activeStyle : notActiveStyle)}
                                                    >
                                                        {subItem.text}
                                                    </NavLink>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Fragment>
                        ))}
                    </div>
                </div>
                <div className="w-4/5 py-4">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default Member
