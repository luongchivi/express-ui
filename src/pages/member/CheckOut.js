import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {Button, InputFieldAdmin, Loading, Paypal} from "components";
import Joi from "joi";
import {apiCalculateShippingFee, apiCheckOutOrder, apiGetDistrict, apiGetProvinces, apiGetWard} from "apis";
import {Link, useNavigate} from "react-router-dom";
import defaultImageProduct from "assets/default_image_product.png";
import {formatMoney} from "utils/helpers";
import path from "utils/path";
import Swal from "sweetalert2";
import {getCartMe} from "store/cart/asyncAction";
import {showModal} from "store/app/appSlice";

const schemas = {
    firstName: Joi.string().max(30).required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    isActive: Joi.boolean().required(),
    address: Joi.string().required(),
    district: Joi.string().required(),
    ward: Joi.string().required(),
    province: Joi.string().required(),
    phone: Joi.string().required(),
    paymentType: Joi.string().valid('COD', 'Paypal').required(),
};

const CheckOut = () => {
    const {currentUser} = useSelector(state => state.user);
    const {address} = currentUser;
    const {items, totalPrice} = useSelector((state) => state.cart);
    const {register, handleSubmit, formState: {errors, isDirty}, reset, setValue, watch} = useForm({
        defaultValues: {
            firstName: currentUser.firstName || '',
            lastName: currentUser.lastName || '',
            email: currentUser.email || '',
            isActive: currentUser.isActive.toString() || '',
            address: address?.address || '',
            phone: address?.phone || '',
            districtId: address?.districtId || '',
            wardId: address?.wardId || '',
            provinceId: address?.provinceId || '',
            paymentType: '',
        }
    });
    const [isPaypal, setIsPaypal] = useState(null);
    const [shippingFee, setShippingFee] = useState(0);
    const [selectedPaymentType, setSelectedPaymentType] = useState('');
    const [payloadCheckOut, setPayloadCheckOut] = useState({
        paymentType: '',
    });
    const [checkOutButton, setCheckOutButton] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchProvinceName = async (provinceId) => {
        try {
            const response = await apiGetProvinces({id: provinceId, pageSize: 63});
            if (response?.results?.statusCode === 200) {
                setValue("province", response?.results?.provinces[0].name);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchDistrictName = async (provinceId, districtId) => {
        try {
            const response = await apiGetDistrict({provinceId, id: districtId, pageSize: 2000});
            if (response?.results?.statusCode === 200) {
                setValue("district", response?.results?.districts[0].name);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchWardName = async (districtId, wardId) => {
        try {
            const response = await apiGetWard({districtId, id: wardId, pageSize: 2000});
            if (response?.results?.statusCode === 200) {
                setValue("ward", response?.results?.wards[0].name);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getShippingFee = async () => {
        try {
            const response = await apiCalculateShippingFee();
            if (response?.results?.statusCode === 200) {
                setShippingFee(response?.results?.shippingFee?.total);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getShippingFee();
    }, [])

    useEffect(() => {
        const initializeForm = () => {
            if (currentUser) {
                setValue("firstName", currentUser.firstName);
                setValue("lastName", currentUser.lastName);
                setValue("email", currentUser.email);
                setValue("isActive", currentUser.isActive.toString());
                if (address) {
                    setValue("address", address.address);
                    setValue("phone", address.phone);
                    const {provinceId, districtId, wardId} = address
                    fetchProvinceName(provinceId);
                    fetchDistrictName(provinceId, districtId);
                    fetchWardName(districtId, wardId);
                }
            }
        };

        initializeForm();
    }, [currentUser, address, setValue]);

    const handleCheckOut = async () => {
        if (!selectedPaymentType) {
            await Swal.fire('Oops! something wrong', 'Please choose the payment type.', 'info');
            return;
        }

        const payload = {
            ...payloadCheckOut,
            paymentType: selectedPaymentType,
        };

        setPayloadCheckOut(payload);
        dispatch(showModal({isShowModal: true, modalChildren: <Loading/>}))
        const response = await apiCheckOutOrder(payload);
        dispatch(showModal({isShowModal: false, modalChildren: null}))
        const {id: orderId} = response?.results?.order;
        if (response?.results?.statusCode === 200 && selectedPaymentType === 'PayPal') {
            dispatch(getCartMe());
            navigate(`/${path.MEMBER}/${path.PURCHASE}`);
        } else {
            dispatch(getCartMe());
            await Swal.fire('Check out successfully', 'Check out Cash on delivery successfully.', 'success');
            navigate(`/${path.MEMBER}/${path.SUCCESS}/${orderId}`);
        }
    }

    return (
        <div className="w-[800px] flex flex-col border border-gray-200 p-6 rounded-md">
            <div className="mb-4 border-b border-main">
                <h1 className="text-3xl font-bold mb-2">Check Out Information</h1>
            </div>
            <form>
                <div className="flex gap-4">
                    <InputFieldAdmin
                        label="First Name:"
                        name="firstName"
                        register={register}
                        schema={schemas.firstName}
                        error={errors.firstName}
                        disabled={true}
                    />
                    <InputFieldAdmin
                        label="Last Name:"
                        name="lastName"
                        register={register}
                        schema={schemas.lastName}
                        error={errors.lastName}
                        disabled={true}
                    />
                </div>
                <InputFieldAdmin
                    label="Email:"
                    name="email"
                    register={register}
                    schema={schemas.email}
                    error={errors.email}
                    disabled={true}
                />
                <InputFieldAdmin
                    label="Phone:"
                    name="phone"
                    register={register}
                    schema={schemas.phone}
                    error={errors.phone}
                    disabled={true}
                />
                <InputFieldAdmin
                    label="Address:"
                    name="address"
                    register={register}
                    schema={schemas.address}
                    error={errors.address}
                    disabled={true}
                />
                <div className="flex gap-4">
                    <InputFieldAdmin
                        label="Province:"
                        name="province"
                        register={register}
                        schema={schemas.province}
                        error={errors.province}
                        disabled={true}
                    />
                    <InputFieldAdmin
                        label="District:"
                        name="district"
                        register={register}
                        schema={schemas.district}
                        error={errors.district}
                        disabled={true}
                    />
                    <InputFieldAdmin
                        label="Ward:"
                        name="ward"
                        register={register}
                        schema={schemas.ward}
                        error={errors.ward}
                        disabled={true}
                    />
                </div>
                <div className="mb-4">
                    <div className="mb-4 border-b border-main">
                        <h1 className="text-3xl font-bold mb-2">Order Items</h1>
                    </div>
                    <ul className="min-h-[113px] max-h-[600px] overflow-y-auto border-t border-gray-200">
                        {items.map((item) => (
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
                                            <div className="text-gray-500 flex gap-1 text-[14px]">
                                                <span className="font-medium">Price:</span>
                                                <span>{formatMoney(item?.product?.unitPrice)} VND</span>
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
                    <div className="flex justify-end mt-4">
                        <div className="flex flex-col gap-3 items-end">
                            <span
                                className="text-[13px] text-gray-600 font-medium">Shipping Fee: {shippingFee ? formatMoney(shippingFee) : '0.00'} VND
                            </span>
                            <span
                                className="text-[14px] text-gray-600 font-medium">Total Price: {totalPrice ? formatMoney(totalPrice) : '0.00'} VND
                            </span>
                            <span
                                className="text-[20px] font-bold">Total: {totalPrice && shippingFee ? formatMoney(totalPrice + shippingFee) : '0.00'} VND
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    <div>
                        <div className="mb-4 border-b border-main">
                            <h1 className="text-3xl font-bold mb-2">Payment Type</h1>
                        </div>
                        <div className="my-4">
                            <small className="text-[15px] text-gray-600 font-medium">
                                <strong>Note:</strong> Cash on delivery is only accepted when the total price is less
                                than or equal to 1,000,000 VND.
                            </small>
                        </div>
                        <div className="flex flex-col">
                            <label
                                className={totalPrice > 1000000 ? 'mb-4 flex items-center p-4 border border-gray-200 bg-gray-200 text-gray-600' : 'flex items-center p-4 border border-gray-200 hover:bg-gray-200 mb-4'}
                            >
                                <input
                                    type="radio"
                                    value="Cash on Delivery"
                                    className="form-radio"
                                    disabled={totalPrice > 1000000}
                                    checked={selectedPaymentType === 'Cash on Delivery'}
                                    onChange={() => {
                                        setSelectedPaymentType('Cash on Delivery')
                                        setCheckOutButton(true);
                                        setIsPaypal(false);
                                    }}
                                />
                                <span className="ml-2">Cash on delivery</span>
                            </label>
                            <label
                                className="flex items-center p-4 border border-gray-200 hover:bg-gray-200">
                                <input
                                    type="radio"
                                    value="PayPal"
                                    className="form-radio"
                                    checked={selectedPaymentType === 'PayPal'}
                                    onChange={() => {
                                        setSelectedPaymentType('PayPal');
                                        setCheckOutButton(false);
                                        setIsPaypal(true);
                                    }}
                                />
                                <span className="ml-2">Paypal</span>
                            </label>
                            {
                                isPaypal &&
                                <div className="mt-4">
                                    <Paypal
                                        amount={Math.trunc((totalPrice / 23500)) + Math.trunc((shippingFee / 23500))}
                                        payload={{paymentType: 'PayPal'}}
                                        cart={{
                                            cart: items,
                                            shippingFee: Math.trunc(shippingFee / 23500),
                                        }}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {
                    checkOutButton && <div className="flex justify-end gap-3 items-center align-middle">
                        <Button
                            handleOnClick={handleCheckOut}
                        >
                            Check Out
                        </Button>
                    </div>
                }
            </form>
        </div>
    );
}

export default CheckOut
