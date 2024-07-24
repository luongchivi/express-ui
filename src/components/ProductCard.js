import React from 'react';
import {formatMoney, renderStar} from "../utils/helpers";


const ProductCard = ({thumbImageUrl, name, unitPrice, averageRating}) => {
    return (
        <div className="w-1/3 flex-auto  px-[10px] mb-[20px]">
            <div className="border flex w-full">
                <img
                    src={thumbImageUrl}
                    alt="product image"
                    className="w-[120px] object-contain p-4"
                />
                <div className="flex flex-col gap-1 mt-[15px] items-start w-full text-xs">
                    <span className="line-clamp-1 capitalize text-sm">{name?.toLowerCase()}</span>
                    <span className="flex h-4">{renderStar(averageRating, 14)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span>{formatMoney(unitPrice)} VND</span>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
