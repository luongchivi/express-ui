import React from 'react';
import Slider from "react-slick";
import {Link} from "react-router-dom";
import {BrandItem} from "components";

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1
};


const BrandSlider = ({brands}) => {
    return (
        <div className="my-4 mx-[-10px]">
            {brands && <Slider className="custom-slider-brand" {...settings}>
                {brands.map(blog => (
                    <div
                        key={blog.id}
                    >
                        <BrandItem
                            brandData={blog}
                        />
                    </div>
                ))}
            </Slider>}
        </div>
    )
}

export default BrandSlider
