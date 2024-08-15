import React, {useEffect} from 'react';
import {Link, useParams} from "react-router-dom";
import {apiCancelOrder, apiGetOrderDetailsUser} from "../../apis";
import moment from "moment";
import {formatMoney} from "../../utils/helpers";
import defaultImageProduct from "../../assets/default_image_product.png";
import {getCartMe} from "../../store/cart/asyncAction";
import {useDispatch} from "react-redux";
import {Button} from "../../components";
import Swal from "sweetalert2";

const Success = () => {
    const {orderId} = useParams();
    const [order, setOrder] = React.useState(null);
    const dispatch = useDispatch();
    const isCancellable = moment().diff(moment(order?.createdAt), 'hours') <= 12;
    const [isCancel, setIsCancel] = React.useState(null);

    const fetchOrderDetails = async () => {
        try {
            const response = await apiGetOrderDetailsUser(orderId);
            if (response?.results?.statusCode === 200) {
                dispatch(getCartMe());
                setOrder(response?.results?.order);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleCancelOrder = async (orderId) => {
        try {
            const response = await apiCancelOrder(orderId);
            if (response?.results?.statusCode === 200) {
                setIsCancel(true);
                await Swal.fire('Successfully', 'Cancel order successfully.', 'success');
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId, isCancel])

    return (
        <div className="w-[800px] flex flex-col border border-gray-200 p-6 rounded-md">
            <div className="mb-4 border-b border-main gap-4">
                <h1 className="text-3xl font-bold mb-2">Order Review</h1>
            </div>
            <div>
                <span className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <label className="font-bold">Full name:</label>
                        <span>{order?.user?.lastName} {order?.user?.firstName}</span>
                    </div>
                    <div className="flex gap-4">
                        <label className="font-bold">Phone:</label>
                        <span>{order?.user?.address?.phone}</span>
                    </div>
                    <div className="flex gap-4">
                        <label className="font-bold">Address:</label>
                        <span>{order?.user?.address?.address}</span>
                    </div>
                    <div className="flex gap-4">
                        <label className="font-bold">Payment Type:</label>
                        <span>{order?.paymentType}</span>
                    </div>
                    <div className="flex gap-4">
                        <label className="font-bold">Order Status:</label>
                        <span>{order?.orderStatus}</span>
                    </div>
                    <div className="flex gap-4">
                        <label className="font-bold">Total items:</label>
                        <span>{order?.orderItems?.length}</span>
                    </div>
                    <div className="flex gap-4">
                        <label className="font-bold">Expected Delivery Time:</label>
                        <span>{moment(order?.expectedDeliveryTime).format('DD/MM/YYYY HH:mm')}</span>
                    </div>
                    <div className="flex gap-4">
                        <label className="font-bold">Created At:</label>
                        <span>{moment(order?.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                    </div>
                    <div className="flex gap-4">
                        <label className="font-bold">Shipping Fee:</label>
                        <span>{formatMoney(order?.shippingFee)} VND</span>
                    </div>
                    <div className="flex gap-4 mb-4">
                        <label className="font-bold">Total Amount:</label>
                        <span>{formatMoney(order?.totalAmount)} VND</span>
                    </div>
                </span>
            </div>
            <div className="py-4 border-main border-t">
                <small className="text-[15px] text-gray-600 font-medium">
                    <strong>Note:</strong> Orders can only be canceled within the last 12 hours.
                </small>
            </div>
            {isCancellable && order?.orderStatus !== 'Cancelled' && (
                <div className="mb-2">
                    <Button
                        handleOnClick={() => handleCancelOrder(orderId)}
                    >Cancel order</Button>
                </div>
            )}
            <div className="mb-4 border-b border-main">
                <h3 className="text-3xl font-bold mb-2">Order Items</h3>
            </div>
            <ul className="min-h-[113px] max-h-[600px] overflow-y-auto border-t border-gray-200">
                {order?.orderItems?.map((item) => (
                    <li
                        key={item.id}
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
                                    <div className="text-gray-500 flex gap-1 text-[14px]">
                                        <span className="font-medium">Price:</span>
                                        <span>{formatMoney(item?.unitPrice)} VND</span>
                                    </div>
                                    <div className="text-gray-500 flex gap-1 text-[14px]">
                                        <span className="font-medium">Quantity:</span>
                                        <span>{item?.quantity}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Success
