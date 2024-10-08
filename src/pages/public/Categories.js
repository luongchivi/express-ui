import React, {memo, useEffect} from 'react';
import defaultImageProduct from '../../assets/default_image_product.png';
import {useDispatch, useSelector} from "react-redux";
import icons from "../../utils/icons";
import {Link} from "react-router-dom";
import {Breadcrumb} from "../../components";
import {getCategories} from "../../store/app/asyncAction";

const { IoIosArrowForward } = icons;

const Categories = () => {
    const dispatch = useDispatch();
    const {categories} = useSelector(state => state.app);

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    return (
        <div className="w-full">
            <div className="h-[81px] flex flex-col justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold uppercase">Categories</h3>
                    <Breadcrumb/>
                </div>
            </div>
            <div className='w-main m-auto flex'>
                <div className=" w-main">
                    <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">ALL CATEGORIES LIST</h3>
                    <div className="flex flex-wrap gap-4 mb-4">
                        {categories?.map(el => (
                            <Link
                                to={`/products?categoryName=${el.name}`}
                                key={el.id}
                                className="w-[396px]"
                            >
                                <div className="border flex p-4 gap-4 min-h-[190px]">
                                    <img
                                        src={el?.thumbImageUrl || defaultImageProduct}
                                        alt=""
                                        className="flex-1 w-[144px] h-[129px] object-contain"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-semibold uppercase">{el.name}</h4>
                                        <ul className="text-sm">
                                            {el.suppliers.map(item => (
                                                <span
                                                    key={item.id}
                                                    className="flex gap-2 items-center text-gray-400"
                                                >
                                                <IoIosArrowForward size={14}/>
                                                <li>{item.companyName}</li>
                                            </span>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Categories)
