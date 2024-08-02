import React, {memo, useEffect, useState} from 'react';
import {apiGetProducts} from "../apis/product";
import CustomSlider from "./CustomSlider";
import {useDispatch, useSelector} from "react-redux";
import {getNewProducts} from "../store/product/asyncAction";

const tabs = [
    {
        id: 1,
        name: "New Arrivals",
    },
    {
        id: 2,
        name: "Best Sellers",
    },
];

const BestSeller = () => {
    const [betterSellers, setBetterSeller] = useState([]);
    const [activeTab, setActiveTab] = useState(1);
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();
    const { newProducts } = useSelector(state => state.products);

    const fetchProducts = async () => {
        const response = await apiGetProducts({sortBy: 'unitsSold', sortOrder: 'desc'});
        if (response?.results?.statusCode === 200) {
            const {products} = response.results;
            setBetterSeller(products);
        }
    };

    useEffect(() => {
        fetchProducts().then();
        dispatch(getNewProducts())
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 1) setProducts(newProducts);
        if (activeTab === 2) setProducts(betterSellers);
    }, [activeTab, betterSellers, newProducts]);

    return (
        <div>
            <div className="flex text-[20px] gap-8 pb-4 border-b-2 border-main">
                {tabs.map(el => (
                    <span
                        key={el.id}
                        className={`font-semibold uppercase border-r pr-8 cursor-pointer ${activeTab === el.id ? 'text-black' : 'text-gray-400'}`}
                        onClick={() => setActiveTab(el.id)}
                    >
                        {el.name}
                    </span>
                ))}
            </div>
            <div className="mt-4 mx-[-10px]">
                <CustomSlider products={products} activeTab={activeTab} />
            </div>
            <div className="w-full flex gap-4 mt-4">
                <img
                    className="flex-1 object-contain"
                    alt=""
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657"/>
                <img
                    className="flex-1 object-contain"
                    alt=""
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657"/>
            </div>
        </div>
    );
};

export default memo(BestSeller);
