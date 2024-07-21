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
        <div className="flex flex-col border">
            {categories.map(el => (
                <NavLink
                    to={createSlug(el.name)}
                    key={el.id}
                    className={({isActive}) => isActive ? 'px-5 pt-[15px] pb-[14px] text-sm bg-main text-white hover:text-main' : 'px-5 pt-[15px] pb-[14px] text-sm hover:text-main'}
                >
                    {el.name}
                </NavLink>
            ))}
        </div>
    )
}

export default Sidebar;
