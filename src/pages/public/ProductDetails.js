import React, {useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom'
import {apiGetProductDetails, apiGetProducts} from '../../apis';
import {Breadcrumb, Button, ProductDescription, ProductExtraInfo, SelectQuantity} from '../../components';
import Slider from "react-slick";
import ReactImageMagnify from 'react-image-magnify';
import {formatMoney, renderStar} from "../../utils/helpers";
import {productExtraInfo} from "../../utils/containts"

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};


const ProductDetails = () => {
    const {pid, name, category} = useParams();
    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);

    const fetchProductByCategory = async () => {
        const response = await apiGetProducts({ categoryName: category});
        if (response?.results?.statusCode === 200) {
            const {products} = response?.results;
            setProducts(products);
        }
    }

    const fetchProductDetails = async () => {
        const response = await apiGetProductDetails(pid);
        if (response?.results?.statusCode === 200) {
            const {product} = response?.results;
            setProduct(product);
        }
    }

    useEffect(() => {
        if (pid) {
            fetchProductDetails().then();
            fetchProductByCategory().then();
        }
    }, [pid])

    const handleQuantity = useCallback((number) => {
        if (Number(number) && Number(number) > 1) {
            setQuantity(number)
        }
    }, [quantity]);
    const handleChangeQuantity = useCallback((flag, quantity) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setQuantity(prev => +prev - 1)
        if (flag === 'plus') setQuantity(prev => +prev + 1)
    }, [])

    return (
        <div className="w-full">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold">{name}</h3>
                    <Breadcrumb name={name} category={category || 'product'}/>
                </div>
            </div>
            <div className="w-main m-auto mt-4 flex">
                <div className="flex flex-col gap-4 w-2/5">
                    <div className="h-[470px] w-[469px] border border-gray-200">
                        <ReactImageMagnify {...{
                            smallImage: {
                                alt: 'Wristwatch by Ted Baker London',
                                isFluidWidth: true,
                                src: product?.thumbImageUrl
                            },
                            largeImage: {
                                src: product?.thumbImageUrl,
                                width: 1800,
                                height: 1800
                            }
                        }} />
                    </div>
                    <div className="w-full">
                        <Slider className="images-slider" {...settings}>
                            {
                                product?.imagesUrl?.map((el, index) => (
                                    <div className="flex w-full gap-1" key={index}>
                                        <img
                                            className="h-[143px] w-[143px] object-cover border border-gray-200"
                                            src={el} alt={`sub-product image ${index}`}
                                        />
                                    </div>
                                ))
                            }
                        </Slider>
                    </div>
                </div>
                <div className="w-2/5 flex flex-col gap-4">
                    <h2 className="text-[30px] font-semibold">{formatMoney(product?.unitPrice)} VND</h2>
                    <div className="flex items-center justify-start gap-1">
                        <div className="flex items-center">
                            {renderStar(product?.averageRating, 25)?.map((el, index) => (
                                <span key={index}>{el}</span>
                            ))}
                        </div>
                        <span className="text-sm text-main italic">({product?.unitsSold} Sold)</span>
                    </div>
                    <ul className='list-square text-sx text-gray-500 pl-6'>
                        {product?.description.split('\n').map((el, index) => (
                            <li
                                className="leading-8"
                                key={index}
                            >{el}</li>
                        ))}
                    </ul>
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center justify-start gap-2">
                            <span className="font-semibold text-[20px]">Quantity:</span>
                            <SelectQuantity
                                quantity={quantity}
                                handleQuantity={handleQuantity}
                                handleChangeQuantity={handleChangeQuantity}
                            />
                        </div>
                        <Button
                            fw
                        >
                            Add to Cart
                        </Button>
                    </div>
                </div>
                <div className="w-1/5 ml-[20px]">
                    {productExtraInfo.map(el => (
                        <ProductExtraInfo
                            key={el.id}
                            title={el.title}
                            icon={el.icon}
                            sub={el.sub}
                        />
                    ))}
                </div>
            </div>
            <div className=" w-main m-auto mt-[8px]">
                <ProductDescription products={products}/>
            </div>
        </div>
    )
}

export default ProductDetails
