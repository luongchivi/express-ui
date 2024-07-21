import React, {useEffect, useState} from 'react';
import {apiGetProducts} from "../apis/product";
import {Product} from "../../src/components";
import Slider from "react-slick";

const tabs = [
    {
        id: 1,
        name: "Best Sellers",
    },
    {
        id: 2,
        name: "News Arrivals",
    },
    {
        id: 3,
        name: "Tablets",
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
    const [activedTab, setActivedTab] = useState(1);

    const fetchProducts = async () => {
        const [bestSellerData, newProductData] = await Promise.all([
            apiGetProducts({sortBy: 'unitsSold', sortOrder: 'desc'}),
            apiGetProducts({sortBy: 'id', sortOrder: 'desc'}),
        ]);

        if (bestSellerData?.results?.statusCode === 200) {
            const {products} = bestSellerData.results;
            setBetterSeller(products);
        }
        if (newProductData?.results?.statusCode === 200) {
            const {products} = newProductData.results;
            setNewProduct(products);
        }
    }

    console.log(betterSellers);
    console.log(newProducts);

    useEffect(() => {
        fetchProducts();
    }, []);


    return (
        <div>
            <div className="flex text-[20px] gap-8 pb-4 border-b-2 border-main">
                {tabs.map(el => (
                    <span
                        key={el.id}
                        className={`font-semibold capitalize border-r cursor-pointer ${activedTab === el.id ? 'text-black' : 'text-gray-400'}`}
                        onClick={() => setActivedTab(el.id)}
                    >{el.name}</span>
                ))}
            </div>
            <div className="mt-4 mx-[-10px]">
                <Slider {...settings}>
                    {betterSellers.map(el => (
                        <Product
                            key={el.id}
                            productData={el}
                        />
                    ))}
                </Slider>
            </div>
        </div>
    )
}

export default BestSeller
