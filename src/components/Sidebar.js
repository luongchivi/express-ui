import React, {useEffect} from 'react';
import {NavLink} from 'react-router-dom';
import {createSlug} from '../utils/helpers';
import {useDispatch, useSelector} from "react-redux";
import {getCategories} from "../store/asyncAction";

const Sidebar = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector(state => state.app);

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    return (
        <div className="border">
            {categories.map(el => (
                <div
                    key={el.id}
                    className="flex items-center p-3"
                >
                    <img
                        className="w-6 h-6 mr-3"
                        src={el.imageUrl}
                        alt="ImageIcon"
                    />
                    <NavLink
                        to={createSlug(el.name)}
                        className={({ isActive }) =>
                            isActive ? 'flex-1 text-main font-semibold' : 'flex-1 text-gray-700 hover:text-main'
                        }
                    >
                        {el.name}
                    </NavLink>
                </div>
            ))}
        </div>
    )
}

export default Sidebar;
