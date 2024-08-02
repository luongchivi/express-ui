import React, { Fragment, memo, useState } from 'react';
import logo from 'assets/logo_digital_new_250x.png';
import { adminSidebar } from 'utils/containts';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import icons from 'utils/icons';

const { IoIosArrowDown, IoIosArrowForward } = icons;

const activeStyle = 'px-4 py-2 flex items-center gap-2 text-gray-200 bg-gray-500';
const notActiveStyle = 'px-4 py-2 flex items-center gap-2 text-gray-200 hover:bg-gray-400';

const AdminSidebar = () => {
    const [active, setActive] = useState([]);

    const handleShowTabs = (tabId) => {
        if (active.includes(tabId)) {
            setActive(prev => prev.filter(id => id !== tabId));
        } else {
            setActive(prev => [...prev, tabId]);
        }
    };

    return (
        <div className="py-4 bg-zinc-600 h-full">
            <div className="p-4 flex flex-col justify-center items-center gap-2">
                <img className="w-[200px] object-contain" src={logo} alt="logo" />
                <span>Admin Workspace</span>
            </div>
            <div>
                {adminSidebar.map((item) => (
                    <Fragment key={item.id}>
                        {item.type === 'SINGLE' && (
                            <NavLink
                                className={({ isActive }) => clsx(isActive ? activeStyle : notActiveStyle)}
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
                                    {active.includes(item.id) ? <IoIosArrowDown /> : <IoIosArrowForward />}
                                </div>
                                {active.includes(item.id) && (
                                    <div className="flex flex-col pl-6">
                                        {item.submenu.map((subItem, index) => (
                                            <NavLink
                                                key={index}
                                                to={subItem.path}
                                                onClick={e => e.stopPropagation()}
                                                className={({ isActive }) => clsx(isActive ? activeStyle : notActiveStyle)}
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
    );
};

export default memo(AdminSidebar);
