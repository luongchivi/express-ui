import React, {memo, useEffect, useState} from 'react';
import {apiGetProducts} from "apis/product";
import {ProductCard} from "components";


const FeatureProduct = () => {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        const response = await apiGetProducts({pageSize: 9, page: Math.round(Math.random() * 5) + 1});
        if (response?.results?.statusCode === 200) {
            setProducts(response?.results?.products);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [])

    return (
        <div className="w-main">
            <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">FEATURE PRODUCTS</h3>
            <div className="flex flex-wrap mt-[15px] mx-[-10px]">
                {products.map((el, index) => (
                    <ProductCard
                        key={index}
                        thumbImageUrl={el.thumbImageUrl}
                        name={el.name}
                        averageRating={el.averageRating}
                        unitPrice={el.unitPrice}
                        product={el}
                    />
                ))}
            </div>
            <div className="grid grid-cols-4 grid-rows-2 gap-4">
                <img
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661"
                    alt=""
                    className="w-full h-full object-cover col-span-2 row-span-2"
                />
                <img
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-bottom-home2_400x.jpg?v=1613166661"
                    alt=""
                    className="w-full h-full object-cover col-span-1 row-span-1"
                />
                <img
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661"
                    alt=""
                    className="w-full h-full object-cover col-span-1 row-span-2"
                />
                <img
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner3-bottom-home2_400x.jpg?v=1613166661"
                    alt=""
                    className="w-full h-full object-cover col-span-1 row-span-1"
                />
            </div>
        </div>
    );
}

export default memo(FeatureProduct);
