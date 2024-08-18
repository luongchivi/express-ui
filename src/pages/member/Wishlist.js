import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getWishlists} from "store/wishlist/asyncAction";
import {Link} from "react-router-dom";
import defaultImageProduct from "assets/default_image_product.png";
import {formatMoney} from "utils/helpers";
import {apiDeleteProductFromWishlist} from "apis";

const Wishlist = () => {
    const dispatch = useDispatch();
    const {wishlists} = useSelector((state) => state.wishlist);
    const [isRemove, setIsRemove] = useState(false);

    useEffect(() => {
        dispatch(getWishlists());
    }, [dispatch, isRemove]);

    const handleRemoveItem = async (id) => {
        try {
            const response = await apiDeleteProductFromWishlist({
                productId: id,
            });
            if (response?.results?.statusCode === 200) {
                setIsRemove(true);
                dispatch(getWishlists());
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container mx-auto px-[80px] py-4">
            {wishlists.length === 0 ? (
                <div className="bg-white rounded-md border border-gray-200 p-6">
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold mb-2">Wishlist Items</h1>
                    </div>
                    <div className="mb-4">
                        <p>Your wishlist is empty</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-md border border-gray-200 p-6">
                    <div className="mb-4 border-b border-main">
                        <h1 className="text-3xl font-bold mb-2">Wishlist Items</h1>
                    </div>
                    <ul className="min-h-[113px] max-h-[600px] overflow-y-auto border-t border-gray-200">
                        {wishlists.map((item) => (
                            <li
                                key={item?.product?.id}
                                className="flex justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-100"
                            >
                                <div className="flex items-center">
                                    <Link
                                        className="flex items-center"
                                        to={`/products/${item?.product?.category?.name?.toLowerCase() || 'product'}/${item?.product?.id}/${item?.product?.name}`}
                                    >
                                        <img
                                            src={item?.product?.thumbImageUrl || defaultImageProduct}
                                            alt={item?.product?.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div className="ml-4 max-w-[390px]">
                                            <div className="text-lg font-semibold truncate">{item?.product?.name}</div>
                                            <div className="text-gray-500">{formatMoney(item?.product?.unitPrice)} VND
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handleRemoveItem(item.productId)}
                                        className="ml-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Wishlist;
