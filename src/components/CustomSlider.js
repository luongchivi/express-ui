import React, {memo} from 'react';
import Slider from "react-slick";
import {Product} from "./index";

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};


const CustomSlider = ({products, activeTab}) => {
    return (
        <>
            {products && <Slider {...settings}>
                {products.map((el, index) => (
                    <Product
                        key={index}
                        productData={el}
                        isNew={activeTab === 1}
                    />
                ))}
            </Slider>}
        </>
    )
}

export default memo(CustomSlider)
