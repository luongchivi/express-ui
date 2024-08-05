import React, { useEffect, useState, useCallback } from 'react';
import Joi from 'joi';
import { Button, InputFieldAdmin } from 'components';
import { apiUpdateProduct, apiGetProductDetails, apiGetCategories } from 'apis';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import path from 'utils/path';
import Slider from "react-slick";
import defaultImageProduct from "assets/default_image_product.png";

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};

const schemas = {
    name: Joi.string().min(3).max(30).required(),
    unitPrice: Joi.number().greater(0).required(),
    description: Joi.string().optional(),
    weight: Joi.number().greater(0).required(),
    length: Joi.number().greater(0).required(),
    width: Joi.number().greater(0).required(),
    height: Joi.number().greater(0).required(),
};

const UpdateProduct = () => {
    const { pid } = useParams();
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
        thumbImage: null,
        images: [],
    });
    const [oldImages, setOldImages] = useState([]);
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
            thumbImage: null,
            images: [],
        });
    };

    const handleChange = useCallback((name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const handleFileChange = useCallback((name, files) => {
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'images' ? [...files] : files[0],
        }));
    }, []);

    const fetchCategories = async () => {
        const response = await apiGetCategories();
        if (response?.results?.statusCode === 200) {
            const { categories } = response.results;
            setCategories(categories);
        }
    };

    const fetchProduct = async () => {
        const response = await apiGetProductDetails(pid);
        if (response?.results?.statusCode === 200) {
            const product = response.results.product;
            setFormData({
                name: product.name,
                unitPrice: product.unitPrice,
                categoryId: product.categoryId,
                description: product.description,
                weight: product.weight,
                length: product.length,
                width: product.width,
                height: product.height,
                thumbImage: null,
                images: [],
            });
            setOldImages(product.imagesUrl || []);
        }
    };

    const updateProduct = async (data) => {
        const response = await apiUpdateProduct(pid, data);
        if (response?.results?.statusCode === 200) {
            await Swal.fire('Update product successfully', response?.results?.message, 'success');
            navigate(`${path.ADMIN}/${path.MANAGE_PRODUCTS}`);
        } else {
            await Swal.fire('Oops! something wrong', response?.results?.message, 'error');
        }
    };

    const validateFormData = (data) => {
        const allErrors = {};
        for (const key in data) {
            if (schemas[key]) {
                const result = schemas[key].validate(data[key], { abortEarly: false });
                if (result.error) {
                    const fieldErrors = result.error.details.reduce((acc, item) => {
                        acc[item.path[0]] = item.message;
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
            updateProduct(formPayload).then();
        }
    };

    useEffect(() => {
        fetchCategories().then();
        fetchProduct().then();
    }, [pid]);

    return (
        <div className="p-4 w-3/5 flex flex-col">
            <h1 className="text-3xl font-bold py-4">Update Product</h1>
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
                    <label className="block text-gray-700 text-sm font-bold mb-2">Old Thumbnail Image:</label>
                    {formData.thumbImage ? (
                        <img
                            className="h-32 w-32 object-cover border border-gray-200"
                            src={URL.createObjectURL(formData.thumbImage)}
                            alt="New Thumbnail"
                        />
                    ) : (
                        <img
                            className="h-32 w-32 object-cover border border-gray-200"
                            src={oldImages[0] || defaultImageProduct}
                            alt="Old Thumbnail"
                        />
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Old Images:</label>
                    <Slider className="images-slider" {...settings}>
                        {oldImages.map((el, index) => (
                            <div className="flex w-full gap-1" key={index}>
                                <img
                                    className="h-[150px] w-[150px] object-cover border border-gray-200"
                                    src={el}
                                    alt={`sub-product image ${index}`}
                                />
                            </div>
                        ))}
                        {formData.images.map((file, index) => (
                            <div className="flex w-full gap-1" key={index}>
                                <img
                                    className="h-[150px] w-[150px] object-cover border border-gray-200"
                                    src={URL.createObjectURL(file)}
                                    alt={`New image ${index}`}
                                />
                            </div>
                        ))}
                    </Slider>
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
};

export default UpdateProduct;
