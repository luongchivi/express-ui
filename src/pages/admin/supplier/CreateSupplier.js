import React, { useEffect, useState } from 'react';
import Joi from 'joi';
import { Button, InputFieldAdmin } from 'components';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import path from 'utils/path';
import {apiAddSupplier} from "apis/supplier";

const schemas = {
    companyName: Joi.string().min(3).max(30).required(),
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

const CreateSupplier = () => {
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

    const resetPayload = () => {
        setPayload({
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
    };

    const handleChange = (name, value) => {
        setPayload((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const createSupplier = async (data) => {
        const response = await apiAddSupplier(data);
        if (response?.results?.statusCode === 201) {
            console.log(response);
            await Swal.fire('Add new supplier successfully', response?.results?.message, 'success');
            navigate(`${path.ADMIN}/${path.MANAGE_SUPPLIERS}`);
        } else {
            await Swal.fire('Oops! something wrong', response?.results?.message, 'error');
            resetPayload();
        }
    };

    const validateApplicationJsonData = (data) => {
        const allErrors = {};
        for (const key in data) {
            if (schemas[key]) {
                const result = schemas[key].validate(data[key], { abortEarly: false });
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
        console.log("Submit")
        e.preventDefault();
        const allErrors = validateApplicationJsonData(payload);
        console.log(allErrors)
        if (Object.keys(allErrors).length > 0) {
            setErrors(allErrors);
        } else {
            setErrors({});
            console.log(payload)
            createSupplier(payload).then();
        }
    };

    return (
        <div className="p-4 w-3/5 flex flex-col">
            <h1 className="text-3xl font-bold py-4">Create Supplier</h1>
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
}

export default CreateSupplier;

