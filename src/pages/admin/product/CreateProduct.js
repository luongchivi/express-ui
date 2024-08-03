import React, {useEffect, useState} from 'react';
import Joi from 'joi';
import { Button, InputFieldAdmin } from 'components';
import {apiCreateProduct, apiGetCategories} from "apis";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import path from "utils/path";

const nameSchema = Joi.string().min(3).max(30).required();
const priceSchema = Joi.number().greater(0).required();
const descriptionSchema = Joi.string().optional();
const weightSchema = Joi.number().greater(0).required();
const lengthSchema = Joi.number().greater(0).required();
const widthSchema = Joi.number().greater(0).required();
const heightSchema = Joi.number().greater(0).required();

const CreateProduct = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        unitPrice: '',
        categoryId: '',
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
            description: '',
            weight: '',
            length: '',
            width: '',
            height: '',
        })
    };

    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchCategories = async () => {
        const response = await apiGetCategories();
        if (response?.results?.statusCode === 200) {
            const {
                categories,
            } = response?.results;
            setCategories(categories);
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const nameResult = nameSchema.validate(formData.name, { abortEarly: false });
        const priceResult = priceSchema.validate(formData.unitPrice, { abortEarly: false });
        const weightResult = weightSchema.validate(formData.weight, { abortEarly: false });
        const lengthResult = weightSchema.validate(formData.length, { abortEarly: false });
        const widthResult = weightSchema.validate(formData.width, { abortEarly: false });
        const heightResult = weightSchema.validate(formData.height, { abortEarly: false });

        const allErrors = {};
        if (nameResult.error) {
            const nameErrors = nameResult.error.details.reduce((acc, item) => {
                acc[item.path[0]] = item.message;
                return acc;
            }, {});
            Object.assign(allErrors, nameErrors);
        }
        if (priceResult.error) {
            const priceErrors = priceResult.error.details.reduce((acc, item) => {
                acc[item.path[0]] = item.message;
                return acc;
            }, {});
            Object.assign(allErrors, priceErrors);
        }
        if (weightResult.error) {
            const weightErrors = weightResult.error.details.reduce((acc, item) => {
                acc[item.path[0]] = item.message;
                return acc;
            }, {});
            Object.assign(allErrors, weightErrors);
        }
        if (lengthResult.error) {
            const weightErrors = weightResult.error.details.reduce((acc, item) => {
                acc[item.path[0]] = item.message;
                return acc;
            }, {});
            Object.assign(allErrors, weightErrors);
        }
        if (heightResult.error) {
            const weightErrors = weightResult.error.details.reduce((acc, item) => {
                acc[item.path[0]] = item.message;
                return acc;
            }, {});
            Object.assign(allErrors, weightErrors);
        }
        if (widthResult.error) {
            const weightErrors = weightResult.error.details.reduce((acc, item) => {
                acc[item.path[0]] = item.message;
                return acc;
            }, {});
            Object.assign(allErrors, weightErrors);
        }

        if (Object.keys(allErrors).length > 0) {
            setErrors(allErrors);
        } else {
            setErrors({});
            console.log('Form data:', formData);
            createProduct(formData).then();
        }
    };

    useEffect(() => {
        fetchCategories().then();
    }, []);

    return (
        <div className="p-4 m-auto flex flex-col">
            <h1 className="text-3xl font-bold py-4">Create Product</h1>
            <form onSubmit={handleSubmit} className="">
                <InputFieldAdmin
                    label="Product Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    schema={nameSchema}
                    error={errors.name}
                />
                <InputFieldAdmin
                    label="Unit Price"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    schema={priceSchema}
                    error={errors.unitPrice}
                />
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
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
                <InputFieldAdmin
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    schema={descriptionSchema}
                    error={errors.description}
                />
                <InputFieldAdmin
                    label="Weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    schema={weightSchema}
                    error={errors.weight}
                />
                <div className="grid grid-cols-3 gap-4">
                    <InputFieldAdmin
                        label="Length"
                        name="length"
                        value={formData.length}
                        onChange={handleChange}
                        schema={lengthSchema}
                        error={errors.length}
                    />
                    <InputFieldAdmin
                        label="Width"
                        name="width"
                        value={formData.width}
                        onChange={handleChange}
                        schema={widthSchema}
                        error={errors.width}
                    />
                    <InputFieldAdmin
                        label="Height"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        schema={heightSchema}
                        error={errors.height}
                    />
                </div>
                <Button type={"submit"}>Submit</Button>
            </form>
        </div>
    );
}

export default CreateProduct;
