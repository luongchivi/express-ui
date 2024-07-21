import React, {useEffect, useState} from 'react';
import {apiGetProducts} from "../apis/product";
import {Product} from "../../src/components";
import Slider from "react-slick";

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

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};

const BestSeller = () => {
    const [betterSellers, setBetterSeller] = useState([]);
    const [newProducts, setNewProduct] = useState([]);
    const [activeTab, setActiveTab] = useState(1);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const [bestSellerData, newProductData] = await Promise.all([
                apiGetProducts({sortBy: 'unitsSold', sortOrder: 'desc'}),
                apiGetProducts({sortBy: 'id', sortOrder: 'desc'}),
            ]);

            if (bestSellerData?.results?.statusCode === 200) {
                const {products} = bestSellerData.results;
                setBetterSeller(products);
                if (activeTab === 1) setProducts(products);
            }
            if (newProductData?.results?.statusCode === 200) {
                const {products} = newProductData.results;
                setNewProduct(products);
                if (activeTab === 2) setProducts(products);
            }
        };

        fetchProducts().then();
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 1) setProducts(betterSellers);
        if (activeTab === 2) setProducts(newProducts);
    }, [activeTab, betterSellers, newProducts]);

    return (
        <div>
            <div className="flex text-[20px] gap-8 pb-4 border-b-2 border-main">
                {tabs.map(el => (
                    <span
                        key={el.id}
                        className={`font-semibold capitalize border-r pr-8 cursor-pointer ${activeTab === el.id ? 'text-black' : 'text-gray-400'}`}
                        onClick={() => setActiveTab(el.id)}
                    >
                        {el.name}
                    </span>
                ))}
            </div>
            <div className="mt-4 mx-[-10px]">
                <Slider {...settings}>
                    {products.map(el => (
                        <Product
                            key={el.id}
                            productData={el}
                            isNew={activeTab === 1}
                        />
                    ))}
                </Slider>
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

export default BestSeller;
