import React, { useEffect, useState } from 'react';
import Joi from 'joi';
import { Button, InputFieldAdmin } from 'components';
import { apiCreateProduct, apiGetCategories } from 'apis';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import path from 'utils/path';
import {apiGetAllSuppliers} from "../../../apis/supplier";

const schemas = {
    name: Joi.string().min(3).max(30).required(),
    unitPrice: Joi.number().greater(0).required(),
    description: Joi.string().optional(),
    weight: Joi.number().greater(0).required(),
    length: Joi.number().greater(0).required(),
    width: Joi.number().greater(0).required(),
    height: Joi.number().greater(0).required(),
};

const CreateProduct = () => {
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        unitPrice: '',
        categoryId: '',
        supplierId: '',
        description: '',
        weight: '',
        length: '',
        width: '',
        height: '',
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const resetPayload = () => {
        setFormData({
            name: '',
            unitPrice: '',
            categoryId: '',
            supplierId: '',
            description: '',
            weight: '',
            length: '',
            width: '',
            height: '',
            thumbImage: null,
            images: [],
        });
    };

    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (name, files) => {
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'images' ? [...files] : files[0],
        }));
    };

    const fetchCategories = async () => {
        const response = await apiGetCategories();
        if (response?.results?.statusCode === 200) {
            const { categories } = response.results;
            setCategories(categories);
        }
    };

    const fetchSuppliers = async () => {
        const response = await apiGetAllSuppliers();
        if (response?.results?.statusCode === 200) {
            const { suppliers } = response.results;
            setSuppliers(suppliers);
        }
    };

    const createProduct = async (data) => {
        const response = await apiCreateProduct(data);
        if (response?.results?.statusCode === 201) {
            console.log(response);
            await Swal.fire('Create product successfully', response?.results?.message, 'success');
            navigate(`${path.ADMIN}/${path.MANAGE_PRODUCTS}`);
        } else {
            await Swal.fire('Oops! something wrong', response?.results?.message, 'error');
            resetPayload();
        }
    };

    const validateFormData = (data) => {
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
        e.preventDefault();
        const allErrors = validateFormData(formData);

        if (formData.thumbImage && formData.thumbImage.length > 1) {
            allErrors.thumbImage = 'Only one thumbnail image is allowed.';
        }

        if (formData.images && formData.images.length > 10) {
            allErrors.images = 'You can upload a maximum of 10 images.';
        }

        if (Object.keys(allErrors).length > 0) {
            setErrors(allErrors);
        } else {
            setErrors({});
            const formPayload = new FormData();
            for (const key in formData) {
                if (key === 'images') {
                    formData[key].forEach((file) => formPayload.append('images', file));
                } else {
                    formPayload.append(key, formData[key]);
                }
            }
            createProduct(formPayload).then();
        }
    };

    useEffect(() => {
        fetchCategories().then();
        fetchSuppliers().then();
    }, []);

    return (
        <div className="p-4 w-3/5 flex flex-col">
            <h1 className="text-3xl font-bold py-4">Create Product</h1>
            <form onSubmit={handleSubmit}>
                <InputFieldAdmin
                    label="Product Name:"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    schema={schemas.name}
                    error={errors.name}
                />
                <InputFieldAdmin
                    label="Unit Price:"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    schema={schemas.unitPrice}
                    error={errors.unitPrice}
                />
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={(e) => handleChange('categoryId', e.target.value)}
                        className={`shadow appearance-none border ${errors.categoryId ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId && <span className="text-red-500 text-xs italic">{errors.categoryId}</span>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Supplier:</label>
                    <select
                        name="categoryId"
                        value={formData.supplierId}
                        onChange={(e) => handleChange('supplierId', e.target.value)}
                        className={`shadow appearance-none border ${errors.supplierId ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    >
                        <option value="">Select a supplier</option>
                        {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.companyName}
                            </option>
                        ))}
                    </select>
                    {errors.supplierId && <span className="text-red-500 text-xs italic">{errors.supplierId}</span>}
                </div>
                <InputFieldAdmin
                    label="Description:"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    schema={schemas.description}
                    error={errors.description}
                    isTextarea={true}
                />
                <InputFieldAdmin
                    label="Weight:"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    schema={schemas.weight}
                    error={errors.weight}
                />
                <div className="grid grid-cols-3 gap-4">
                    <InputFieldAdmin
                        label="Length:"
                        name="length"
                        value={formData.length}
                        onChange={handleChange}
                        schema={schemas.length}
                        error={errors.length}
                    />
                    <InputFieldAdmin
                        label="Width:"
                        name="width"
                        value={formData.width}
                        onChange={handleChange}
                        schema={schemas.width}
                        error={errors.width}
                    />
                    <InputFieldAdmin
                        label="Height:"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        schema={schemas.height}
                        error={errors.height}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Thumbnail Image:</label>
                    <input
                        type="file"
                        name="thumbImage"
                        onChange={(e) => handleFileChange('thumbImage', e.target.files)}
                        className={`shadow appearance-none border ${errors.thumbImage ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    />
                    {errors.thumbImage && <span className="text-red-500 text-xs italic">{errors.thumbImage}</span>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Images:</label>
                    <input
                        type="file"
                        name="images"
                        multiple
                        onChange={(e) => handleFileChange('images', e.target.files)}
                        className={`shadow appearance-none border ${errors.images ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    />
                    {errors.images && <span className="text-red-500 text-xs italic">{errors.images}</span>}
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
}

export default CreateProduct;

