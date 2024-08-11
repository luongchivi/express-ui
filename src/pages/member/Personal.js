import React, {useEffect, useState} from 'react';
import {Button, InputFieldAdmin, Loading} from "../../components";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {showModal} from "../../store/app/appSlice";
import Swal from "sweetalert2";
import path from "../../utils/path";
import {validateData} from "../../utils/helpers";
import Joi from "joi";
import {apiGetDistrict, apiGetProvinces, apiGetWard, apiUpdateUser} from "../../apis";
import {getCurrentUser} from "../../store/user/asyncAction";

const schemas = {
    firstName: Joi.string().max(30).required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    isActive: Joi.boolean().required(),
    address: Joi.string().required(),
    districtId: Joi.number().required(),
    wardId: Joi.number().required(),
    provinceId: Joi.number().required(),
    phone: Joi.string().required(),
};

const Personal = () => {
    const {currentUser} = useSelector(state => state.user);
    const {address} = currentUser;

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [provinceIdQuery, setProvinceIdQuery] = useState(address?.provinceId || null);
    const [districtIdQuery, setDistrictIdQuery] = useState(address?.districtId || null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {register, handleSubmit, formState: {errors}, reset, setValue} = useForm({
        defaultValues: {
            firstName: currentUser.firstName || '',
            lastName: currentUser.lastName || '',
            email: currentUser.email || '',
            isActive: currentUser.isActive.toString() || '',
            address: address?.address || '',
            phone: address?.phone || '',
            districtId: address?.districtId || '',
            wardId: address?.wardId || '',
            provinceId: address?.provinceId || ''
        }
    });

    useEffect(() => {
        const initializeForm = () => {
            setValue("firstName", currentUser.firstName);
            setValue("lastName", currentUser.lastName);
            setValue("email", currentUser.email);
            setValue("isActive", currentUser.isActive.toString());
            setValue("address", address.address);
            setValue("phone", address.phone);
            setValue("provinceId", address.provinceId);
            setProvinceIdQuery(address.provinceId);
        };

        const fetchProvinces = async () => {
            try {
                const response = await apiGetProvinces({pageSize: 63});
                if (response?.results?.statusCode === 200) {
                    setProvinces(response?.results?.provinces);
                }
            } catch (error) {
                console.log(error);
            }
        };

        initializeForm();
        fetchProvinces();
    }, [currentUser, address, setValue]);

    useEffect(() => {
        const fetchDistricts = async () => {
            if (provinceIdQuery) {
                try {
                    const response = await apiGetDistrict({provinceId: provinceIdQuery, pageSize: 2000});
                    if (response?.results?.statusCode === 200) {
                        setDistricts(response?.results?.districts);
                        if (address) {
                            setValue("districtId", address.districtId);
                            setDistrictIdQuery(address.districtId); // Trigger fetching wards
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };

        fetchDistricts();
    }, [provinceIdQuery, address, setValue]);

    useEffect(() => {
        const fetchWards = async () => {
            if (districtIdQuery) {
                try {
                    const response = await apiGetWard({districtId: districtIdQuery, pageSize: 2000});
                    if (response?.results?.statusCode === 200) {
                        setWards(response?.results?.wards);
                        if (address) {
                            setValue("wardId", address.wardId);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };

        fetchWards();
    }, [districtIdQuery, address, setValue]);

    const saveUserInfo = async (data) => {
        dispatch(showModal({isShowModal: true, modalChildren: <Loading/>}));
        const {isActive, ...payload} = data;
        const response = await apiUpdateUser(currentUser.id, payload);
        dispatch(showModal({isShowModal: false, modalChildren: null}));

        if (response?.results?.statusCode === 201) {
            await Swal.fire('Save user info successfully', response?.results?.message, 'success');
            navigate(`/${path.MEMBER}/${path.PERSONAL}`);
            reset();
        } else {
            await Swal.fire('Oops! something wrong', response?.results?.message, 'error');
        }
    };

    const onSubmitSaveUserInfo = (data) => {
        const allErrors = validateData(data, schemas);
        if (Object.keys(allErrors).length > 0) {
            console.log(allErrors);
        } else {
            saveUserInfo(data);
        }
    };

    return (
        <div className="mx-[100px] flex flex-col border border-gray-200 p-6 rounded-md">
            <h1 className="text-3xl font-bold mb-2">User Info</h1>
            <form onSubmit={handleSubmit(onSubmitSaveUserInfo)}>
                <InputFieldAdmin
                    label="First Name:"
                    name="firstName"
                    register={register}
                    schema={schemas.firstName}
                    error={errors.firstName}
                />
                <InputFieldAdmin
                    label="Last Name:"
                    name="lastName"
                    register={register}
                    schema={schemas.lastName}
                    error={errors.lastName}
                />
                <InputFieldAdmin
                    label="Email:"
                    name="email"
                    register={register}
                    schema={schemas.email}
                    error={errors.email}
                />
                <InputFieldAdmin
                    label="Is Active:"
                    name="isActive"
                    register={register}
                    schema={schemas.isActive}
                    error={errors.isActive}
                    disabled={true}
                />
                <InputFieldAdmin
                    label="Address:"
                    name="address"
                    register={register}
                    schema={schemas.address}
                    error={errors.address}
                />
                <InputFieldAdmin
                    label="Phone:"
                    name="phone"
                    register={register}
                    schema={schemas.phone}
                    error={errors.phone}
                />
                <InputFieldAdmin
                    label="Province:"
                    name="provinceId"
                    register={register}
                    schema={schemas.provinceId}
                    error={errors.provinceId}
                    type={'select'}
                    selectors={provinces}
                    selectorName={'province'}
                    onChange={(e) => setProvinceIdQuery(e.target.value)}
                />
                <InputFieldAdmin
                    label="District:"
                    name="districtId"
                    register={register}
                    schema={schemas.districtId}
                    error={errors.districtId}
                    type={'select'}
                    selectors={districts}
                    selectorName={'district'}
                    onChange={(e) => setDistrictIdQuery(e.target.value)}
                />
                <InputFieldAdmin
                    label="Ward:"
                    name="wardId"
                    register={register}
                    schema={schemas.wardId}
                    error={errors.wardId}
                    type={'select'}
                    selectors={wards}
                    selectorName={'ward'}
                />
                <Button type="submit">Save</Button>
            </form>
        </div>
    );
};

export default Personal;
