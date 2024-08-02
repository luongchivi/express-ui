import React, {memo, useState} from 'react';
import {formatMoney, renderStar} from 'utils/helpers';
import labelNew from 'assets/label_new.png';
import labelBest from 'assets/label_best.png';
import {SelectOption} from 'components';
import icons from "utils/icons";
import {Link} from 'react-router-dom';
import defaultImageProduct from 'assets/default_image_product.png';

const {IoEyeSharp, IoMenu, FaHeart} = icons;

const Product = ({productData, isNew, normal}) => {
    const [isShowOption, setShowOption] = useState(false);

    return (
        <div className="w-full text-base px-[10px]">
            <Link
                to={`/products/${productData?.category?.name?.toLowerCase() || 'product'}/${productData?.id}/${productData?.name}`}
                className="w-full border p-[15px] flex flex-col items-center"
                onMouseEnter={e => {
                    e.stopPropagation();
                    setShowOption(true);
                }}
                onMouseLeave={e => {
                    e.stopPropagation();
                    setShowOption(false);
                }}
            >
                <div className="w-full relative">
                    {
                        isShowOption &&
                        <div
                            className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-4 animate-slide-top">
                            <SelectOption icon={<IoEyeSharp/>}/>
                            <SelectOption icon={<IoMenu/>}/>
                            <SelectOption icon={<FaHeart/>}/>
                        </div>
                    }
                    <img
                        src={productData?.thumbImageUrl || defaultImageProduct}
                        alt=""
                        className="w-full h-[360px]  object-contain"
                    />
                    {
                        !normal &&
                        <img
                            className="absolute top-[-10px] right-[-10px] h-[30px] object-cover"
                            src={isNew ? labelNew : labelBest}
                            alt=""
                        />
                    }
                </div>
                <div className="flex flex-col gap-2 mt-[15px] items-start w-full gap-1">
                    <span className="line-clamp-1">{productData?.name}</span>
                    <span className="flex">{renderStar(productData?.averageRating)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span>{formatMoney(productData?.unitPrice)} VND</span>
                </div>
            </Link>
        </div>
    )
}

export default memo(Product)
