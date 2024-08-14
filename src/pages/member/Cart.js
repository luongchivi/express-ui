import React, { memo, useEffect, useState } from 'react';
import { apiDeleteItem, apiUpdateQuantityItem } from 'apis';
import {Button, SelectQuantity} from 'components';
import {Link, useNavigate} from 'react-router-dom';
import defaultImageProduct from 'assets/default_image_product.png';
import { formatMoney } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getCartMe } from 'store/cart/asyncAction';
import path from 'utils/path'
import Swal from "sweetalert2";

const Cart = () => {
    const { currentUser } = useSelector(state => state.user);
    const { address } = currentUser;
    const [cart, setCart] = useState({ items: [] });
    const { items, totalPrice } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [isRemove, setIsRemove] = useState(false);
    const navigate = useNavigate();

    const callApiQuantityChange = async (id, newQuantity) => {
        try {
            const response = await apiUpdateQuantityItem(id, { quantity: newQuantity });
            if (response?.results?.statusCode === 200) {
                dispatch(getCartMe());
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeQuantity = (type, id) => {
        setCart((prevCart) => ({
            ...prevCart,
            items: prevCart.items.map((item) => {
                if (item.productId === id) {
                    const newQuantity = type === 'plus' ? item.quantity + 1 : item.quantity - 1;
                    callApiQuantityChange(id, newQuantity > 0 ? newQuantity : 1);
                    return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
                }
                return item;
            }),
        }));
    };

    const handleRemoveItem = async (id) => {
        try {
            const response = await apiDeleteItem(id);
            if (response?.results?.statusCode === 200) {
                setIsRemove(true);
                dispatch(getCartMe());
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        dispatch(getCartMe());
    }, [dispatch, isRemove]);

    useEffect(() => {
        setCart({ items });
    }, [items]);

    const handleCreateOrder = async () => {
        if (address) {
            navigate(`/${path.MEMBER}/${path.CHECK_OUT}`);
        } else {
            await Swal.fire('Oops! something wrong.', 'Please update your address before check out order.', 'info');
            navigate(`/${path.MEMBER}/${path.PERSONAL}`);
        }
    }

    return (
        <div className="container mx-auto px-[80px] py-4">
            {cart.items.length === 0 ? (
                <div className="bg-white rounded-md border border-gray-200 p-6">
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold mb-2">Cart Items</h1>
                    </div>
                    <div className="mb-4">
                        <p>Your cart is empty</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-md border border-gray-200 p-6">
                    <div className="mb-4 border-b border-main">
                        <h1 className="text-3xl font-bold mb-2">Cart Items</h1>
                    </div>
                    <ul className="min-h-[113px] max-h-[600px] overflow-y-auto border-t border-gray-200">
                        {cart.items.map((item) => (
                            <li
                                key={item.productId}
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
                                            <div className="text-gray-500">{formatMoney(item?.product?.unitPrice)} VND</div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="flex items-center gap-4">
                                    <SelectQuantity
                                        quantity={item?.quantity}
                                        handleQuantity={(newQuantity) => callApiQuantityChange(item.productId, newQuantity)}
                                        handleChangeQuantity={(type) => handleChangeQuantity(type, item.productId)}
                                    />
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
                    <div className="flex justify-end mt-4 items-center italic">
                        <small className="text-[15px] text-gray-600 font-medium">
                            Shipping, taxes, and discounts calculated at checkout.
                        </small>
                    </div>
                    <div className="flex justify-end gap-4 items-center align-middle">
                        <div className="text-lg font-bold">Total: {totalPrice ? formatMoney(totalPrice) : '0.00'} VND</div>
                        <Button
                            className="ml-4 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-all duration-200 ease-in-out"
                            handleOnClick={handleCreateOrder}
                        >
                            Create Order
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(Cart);
