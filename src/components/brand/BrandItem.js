import React, { memo } from 'react';
import defaultImageProduct from "assets/default_image_product.png";

const BrandItem = ({ brandData }) => {
    return (
        <div>
            <div className="flex flex-col px-[10px]">
                <img
                    className="object-contain w-full h-[90px] border shadow-md"
                    src={brandData.image || defaultImageProduct}
                    alt="brand Thumbnail"
                />
            </div>
        </div>
    );
}

export default memo(BrandItem);
