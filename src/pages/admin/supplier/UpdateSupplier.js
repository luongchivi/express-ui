import React, {useEffect, useState, useCallback} from 'react';
import Joi from 'joi';
import {Button, InputFieldAdmin} from 'components';
import {useNavigate, useParams} from 'react-router-dom';
import Swal from 'sweetalert2';
import path from 'utils/path';
import {apiGetSupplierDetails, apiUpdateSupplier} from "apis/supplier";


const schemas = {
    companyName: Joi.string().min(3).max(100).required(),
    contactName: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    region: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
    phone: Joi.string().required(),
    fax: Joi.string().required(),
    homePage: Joi.string().required(),
};

const UpdateSupplier = () => {
    const {supplierId} = useParams();
    const [payload, setPayload] = useState({
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
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleChange = useCallback((name, value) => {
        setPayload((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, [payload]);

    const fetchSupplier = async () => {
        try {
            const response = await apiGetSupplierDetails(supplierId);
            if (response?.results?.statusCode === 200) {
                const {supplier} = response.results;
                const { id, createdAt, updatedAt, products, ...rest } = supplier;
                setPayload(rest);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateSupplier = async (data) => {
        try {
            const response = await apiUpdateSupplier(supplierId, data);
            if (response?.results?.statusCode === 200) {
                await Swal.fire('Update supplier successfully', response?.results?.message, 'success');
                navigate(`${path.ADMIN}/${path.MANAGE_SUPPLIERS}`);
            } else {
                await Swal.fire('Oops! something wrong', response?.results?.message, 'error');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const validateFormData = (data) => {
        const allErrors = {};
        for (const key in data) {
            if (schemas[key]) {
                const result = schemas[key].validate(data[key], {abortEarly: false});
                if (result.error) {
                    const fieldErrors = result.error.details.reduce((acc, item) => {
                        acc[key] = item.message.replace("value", `${key}`);
                        return acc;
                    }, {});
                    Object.assign(allErrors, fieldErrors);
                }
            }
        }
        return allErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const allErrors = validateFormData(payload);

        if (Object.keys(allErrors).length > 0) {
            setErrors(allErrors);
        } else {
            setErrors({});
            updateSupplier(payload).then();
        }
    };

    useEffect(() => {
        fetchSupplier().then();
    }, [supplierId]);

    return (
        <div className="p-4 w-3/5 flex flex-col">
            <h1 className="text-3xl font-bold py-4">Update Supplier</h1>
            <form onSubmit={handleSubmit}>
                <InputFieldAdmin
                    label="Company Name:"
                    name="companyName"
                    value={payload.companyName}
                    onChange={handleChange}
                    schema={schemas.companyName}
                    error={errors.companyName}
                />
                <InputFieldAdmin
                    label="Contact Name:"
                    name="contactName"
                    value={payload.contactName}
                    onChange={handleChange}
                    schema={schemas.contactName}
                    error={errors.contactName}
                />
                <InputFieldAdmin
                    label="Address:"
                    name="address"
                    value={payload.address}
                    onChange={handleChange}
                    schema={schemas.address}
                    error={errors.address}
                />
                <InputFieldAdmin
                    label="City:"
                    name="city"
                    value={payload.city}
                    onChange={handleChange}
                    schema={schemas.city}
                    error={errors.city}
                />
                <InputFieldAdmin
                    label="Region:"
                    name="region"
                    value={payload.region}
                    onChange={handleChange}
                    schema={schemas.region}
                    error={errors.region}
                />
                <InputFieldAdmin
                    label="Country:"
                    name="country"
                    value={payload.country}
                    onChange={handleChange}
                    schema={schemas.country}
                    error={errors.country}
                />
                <InputFieldAdmin
                    label="Postal Code:"
                    name="postalCode"
                    value={payload.postalCode}
                    onChange={handleChange}
                    schema={schemas.postalCode}
                    error={errors.postalCode}
                />
                <InputFieldAdmin
                    label="Fax:"
                    name="fax"
                    value={payload.fax}
                    onChange={handleChange}
                    schema={schemas.fax}
                    error={errors.fax}
                />
                <InputFieldAdmin
                    label="Phone:"
                    name="phone"
                    value={payload.phone}
                    onChange={handleChange}
                    schema={schemas.phone}
                    error={errors.phone}
                />
                <InputFieldAdmin
                    label="Home Page:"
                    name="homePage"
                    value={payload.homePage}
                    onChange={handleChange}
                    schema={schemas.homePage}
                    error={errors.homePage}
                />
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default UpdateSupplier;

