import React, {useEffect} from 'react';
import Joi from 'joi';
import {Button, InputFieldAdmin, Loading} from 'components';
import {useNavigate, useParams} from 'react-router-dom';
import Swal from 'sweetalert2';
import path from 'utils/path';
import {apiGetSupplierDetails, apiUpdateSupplier} from 'apis/supplier';
import { validateData } from 'utils/helpers';
import { useForm } from 'react-hook-form';
import {apiGetProductDetails} from "apis";
import {useDispatch} from "react-redux";
import {showModal} from "../../../store/app/appSlice";

const schemas = {
    companyName: Joi.string().max(30).required(),
    contactName: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    region: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
    phone: Joi.string().required(),
    fax: Joi.string().optional(),
    homePage: Joi.string().optional(),
};

const CreateSupplier = () => {
    const {supplierId} = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
        defaultValues: {
            companyName: '',
            contactName: '',
            address: '',
            city: '',
            region: '',
            postalCode: '',
            country: '',
            phone: '',
            fax: '',
            homePage: '',
        }
    });
    const dispatch = useDispatch();

    useEffect(() => {
        if (supplierId) {
            fetchSupplier();
        }
    }, [supplierId]);

    const fetchSupplier = async () => {
        dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
        const response = await apiGetSupplierDetails(supplierId);
        dispatch(showModal({isShowModal: false, modalChildren: null}))
        if (response?.results?.statusCode === 200) {
            const {supplier} = response.results;
            const {
                companyName,
                contactName,
                address,
                city,
                region,
                postalCode,
                country,
                phone,
                fax,
                homePage,
            } = supplier;
            reset({
                companyName,
                contactName,
                address,
                city,
                region,
                postalCode,
                country,
                phone,
                fax,
                homePage,
            });
        }
    };

    const updateSupplier = async (data) => {
        const response = await apiUpdateSupplier(supplierId, data);
        if (response?.results?.statusCode === 200) {
            await Swal.fire('Create supplier successfully', response?.results?.message, 'success');
            navigate(`${path.ADMIN}/${path.MANAGE_SUPPLIERS}`);
            reset();
        } else {
            await Swal.fire('Oops! something wrong', response?.results?.message, 'error');
        }
    };

    const onSubmitCreateSupplier = (data) => {
        const allErrors = validateData(data, schemas);

        if (Object.keys(allErrors).length > 0) {
            console.log(allErrors);
        } else {
            console.log(data);
            updateSupplier(data);
        }
    };

    return (
        <div className="p-4 w-3/5 flex flex-col">
            <h1 className="text-3xl font-bold py-4">Create Supplier</h1>
            <form onSubmit={handleSubmit(onSubmitCreateSupplier)}>
                <InputFieldAdmin
                    label="Company Name:"
                    name="companyName"
                    register={register}
                    schema={schemas.companyName}
                    error={errors.companyName}
                />
                <InputFieldAdmin
                    label="Contact Name:"
                    name="contactName"
                    register={register}
                    schema={schemas.contactName}
                    error={errors.contactName}
                />
                <InputFieldAdmin
                    label="Address:"
                    name="address"
                    register={register}
                    schema={schemas.address}
                    error={errors.address}
                />
                <InputFieldAdmin
                    label="City:"
                    name="city"
                    register={register}
                    schema={schemas.city}
                    error={errors.city}
                />
                <InputFieldAdmin
                    label="Region:"
                    name="region"
                    register={register}
                    schema={schemas.region}
                    error={errors.region}
                />
                <InputFieldAdmin
                    label="Postal Code:"
                    name="postalCode"
                    register={register}
                    schema={schemas.postalCode}
                    error={errors.postalCode}
                />
                <InputFieldAdmin
                    label="Country:"
                    name="country"
                    register={register}
                    schema={schemas.country}
                    error={errors.country}
                />
                <InputFieldAdmin
                    label="Phone:"
                    name="phone"
                    register={register}
                    schema={schemas.phone}
                    error={errors.phone}
                />
                <InputFieldAdmin
                    label="Fax:"
                    name="fax"
                    register={register}
                    schema={schemas.fax}
                    error={errors.fax}
                />
                <InputFieldAdmin
                    label="Home Page:"
                    name="homePage"
                    register={register}
                    schema={schemas.homePage}
                    error={errors.homePage}
                />
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default CreateSupplier;
