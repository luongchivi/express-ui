import React, { memo, useEffect, useState } from 'react';
import { apiGetCartMe } from 'apis';
import { SelectQuantity } from 'components';
import {Link} from "react-router-dom";

const Cart = () => {
    const [cart, setCart] = useState(null);

    const fetchCart = async () => {
        const response = await apiGetCartMe();
        if (response?.results?.statusCode === 200) {
            setCart(response?.results?.cart);
        }
    };

    const handleQuantity = (id, newQuantity) => {
        setCart(prevCart => ({
            ...prevCart,
            items: prevCart.items.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        }));
    };

    const handleChangeQuantity = (type, id) => {
        setCart(prevCart => ({
            ...prevCart,
            items: prevCart.items.map(item => {
                if (item.id === id) {
                    const newQuantity = type === 'plus' ? item.quantity + 1 : item.quantity - 1;
                    return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
                }
                return item;
            })
        }));
    };

    const handleRemoveItem = (id) => {
        setCart(prevCart => ({
            ...prevCart,
            items: prevCart.items.filter(item => item.id !== id)
        }));
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <div className="container mx-auto px-[80px] py-4">
            {cart && cart.items.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div className="bg-white rounded-md border border-gray-200 p-6">
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold mb-2">Cart Items</h1>
                    </div>
                    <ul>
                        {cart && cart.items.map(item => (
                            <li
                                key={item.id}
                                className="flex justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-100">
                                <div>
                                    <Link
                                        className="flex items-center"
                                        to={`/products/${item?.product?.category?.name?.toLowerCase() || 'product'}/${item?.product?.id}/${item?.product?.name}`}
                                    >
                                        <img src={item?.product?.thumbImageUrl} alt={item?.product?.name}
                                             className="w-20 h-20 object-cover rounded"/>
                                        <div className="ml-4">
                                            <div className="text-lg font-semibold">{item?.product?.name}</div>
                                            <div className="text-gray-500">${item?.product?.unitPrice.toFixed(2)}</div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="flex items-center gap-4">
                                    <SelectQuantity
                                        quantity={item?.quantity}
                                        handleQuantity={(newQuantity) => handleQuantity(item.id, newQuantity)}
                                        handleChangeQuantity={(type) => handleChangeQuantity(type, item.id)}
                                    />
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="ml-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-end mt-4">
                        <div className="text-lg font-bold">Total: ${cart ? cart.totalPrice.toFixed(2) : '0.00'}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(Cart);
