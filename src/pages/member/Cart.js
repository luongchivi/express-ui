import React, {memo, useEffect, useState} from 'react';
import {apiDeleteItem, apiGetCartMe, apiUpdateQuantityItem} from 'apis';
import {Button, SelectQuantity} from 'components';
import {Link} from 'react-router-dom';
import defaultImageProduct from 'assets/default_image_product.png'
import {formatMoney} from "utils/helpers";
import {useDispatch, useSelector} from "react-redux";
import {getCartMe} from "../../store/cart/asyncAction";

const Cart = () => {
    const [cart, setCart] = useState(null);
    const {items} = useSelector(state => state.cart);
    const dispatch = useDispatch();

    const fetchCart = async () => {
        try {
            const response = await apiGetCartMe();
            if (response?.results?.statusCode === 200) {
                setCart(response?.results?.cart);
            } else if (response?.results?.message === 'Cart is empty.') {
                setCart([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const callApiQuantityChange = async (id, newQuantity) => {
        try {
            console.log(id)
            const response = await apiUpdateQuantityItem(id, {quantity: newQuantity});
            if (response?.results?.statusCode === 200) {
                fetchCart();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeQuantity = (type, id) => {
        console.log(id);
        setCart(prevCart => ({
            ...prevCart,
            items: prevCart.items.map(item => {
                if (item.productId === id) {
                    const newQuantity = type === 'plus' ? item.quantity + 1 : item.quantity - 1;
                    callApiQuantityChange(id, newQuantity > 0 ? newQuantity : 1);
                    return {...item, quantity: newQuantity > 0 ? newQuantity : 1};
                }
                return item;
            })
        }));
    };

    const handleRemoveItem = async (id) => {
        try {
            const response = await apiDeleteItem(id);
            if (response?.results?.statusCode === 200) {
                fetchCart();
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCart();
        dispatch(getCartMe());
    }, [items]);

    return (
        <div className="container mx-auto px-[80px] py-4">
            {cart && cart.length === 0 ? (
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
                    <ul>
                        {cart && cart.items.map(item => (
                            <li
                                key={item.productId}
                                className="flex justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-100">
                                <div className="flex items-center">
                                    <Link
                                        className="flex items-center"
                                        to={`/products/${item?.product?.category?.name?.toLowerCase() || 'product'}/${item?.product?.id}/${item?.product?.name}`}
                                    >
                                        <img src={item?.product?.thumbImageUrl || defaultImageProduct}
                                             alt={item?.product?.name}
                                             className="w-20 h-20 object-cover rounded"/>
                                        <div className="ml-4 max-w-[390px]">
                                            <div className="text-lg font-semibold truncate">{item?.product?.name}</div>
                                            <div className="text-gray-500">{formatMoney(item?.product?.unitPrice)} VND
                                            </div>
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
                        <small className="text-[15px] text-gray-600 font-medium">Shipping, taxes, and discounts
                            calculated at checkout.</small>
                    </div>
                    <div className="flex justify-end gap-4 items-center align-middle">
                        <div className="text-lg font-bold">Total: {cart ? formatMoney(cart.totalPrice) : '0.00'} VND
                        </div>
                        <Button
                            className="ml-4 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-all duration-200 ease-in-out">
                            Check Out
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(Cart);
