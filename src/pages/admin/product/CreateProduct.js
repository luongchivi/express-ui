import React, {useCallback, useEffect, useState} from 'react';
import Joi from 'joi';
import {Button, InputFieldAdmin} from 'components';
import {apiCreateProduct, apiGetCategories} from 'apis';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import path from 'utils/path';
import {apiGetAllSuppliers} from 'apis/supplier';
import MarkdownEditor from 'components/input/MarkdownEditor';
import {getBase64, validateData} from 'utils/helpers';
import {useForm} from 'react-hook-form';
import icons from 'utils/icons'

const {ImBin} = icons

const schemas = {
    name: Joi.string().min(3).max(100).required(),
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
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}, reset, setValue, watch} = useForm({
        defaultValues: {
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
        }
    });
    const [preview, setPreview] = useState({
        thumbImage: null,
        images: [],
    });
    const [isDelete, setIsDelete] = useState(null);

    const fetchCategories = async () => {
        const response = await apiGetCategories();
        if (response?.results?.statusCode === 200) {
            const {categories} = response.results;
            setCategories(categories);
        }
    };

    const fetchSuppliers = async () => {
        const response = await apiGetAllSuppliers();
        if (response?.results?.statusCode === 200) {
            const {suppliers} = response.results;
            setSuppliers(suppliers);
        }
    };

    const createProduct = async (data) => {
        const response = await apiCreateProduct(data);
        if (response?.results?.statusCode === 201) {
            await Swal.fire('Create product successfully', response?.results?.message, 'success');
            navigate(`${path.ADMIN}/${path.MANAGE_PRODUCTS}`);
            reset();
        } else {
            await Swal.fire('Oops! something wrong', response?.results?.message, 'error');
        }
    };

    const onSubmitCreateProduct = (data) => {
        const allErrors = validateData(data, schemas);

        if (data.thumbImage && data.thumbImage.length > 1) {
            allErrors.thumbImage = 'Only one thumbnail image is allowed.';
        }

        if (data.images && data.images.length > 10) {
            allErrors.images = 'You can upload a maximum of 10 images.';
        }

        if (Object.keys(allErrors).length > 0) {
            console.log(allErrors);
        } else {
            const formPayload = new FormData();
            for (const key in data) {
                if (key === 'images' && data[key].length > 0) {
                    Array.from(data[key]).forEach((file) => formPayload.append('images', file));
                } else if (key === 'thumbImage' && data[key]?.length > 0) {
                    formPayload.append(key, data[key][0]);
                } else if (key !== 'thumbImage' && key !== 'images') {
                    formPayload.append(key, data[key] || null);
                }
            }
            createProduct(formPayload);
        }
    };

    const handleEditorChange = useCallback((content) => {
        setValue('description', content);
    }, [setValue]);

    useEffect(() => {
        fetchCategories();
        fetchSuppliers();
    }, []);

    const handlePreviewThumbImage = async (file) => {
        if (file) {
            const base64Thumb = await getBase64(file);
            setPreview(prev => ({...prev, thumbImage: base64Thumb}));
        } else {
            setPreview(prev => ({...prev, thumbImage: null}));
        }
    }

    const handlePreviewImages = async (files) => {
        const imagesPreview = [];
        for (let file of files) {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                await Swal.fire('Oops! something wrong', 'Only accept png, jpeg', 'error');
            } else {
                const base64 = await getBase64(file);
                imagesPreview.push({
                    name: file.name,
                    path: base64
                });
            }
        }
        if (imagesPreview.length > 0) {
            setPreview(prev => ({...prev, images: imagesPreview}));
        }
    }

    const handleRemoveImage = (name) => {
        const files = [...watch('images')];
        reset({
            images: files?.filter(el => el.name !== name),
        })
        if (preview.images?.some(el => el.name === name)) {
            setPreview(prev => ({...prev, images: prev.images?.filter(el => el.name !== name)}))
        }
    }

    useEffect(() => {
        if (watch('thumbImage') && watch('thumbImage').length > 0) {
            handlePreviewThumbImage(watch('thumbImage')[0]);
        } else {
            handlePreviewThumbImage(null);
        }
    }, [watch('thumbImage')]);


    useEffect(() => {
        if (watch('images') && watch('images').length > 0) {
            handlePreviewImages(watch('images'));
        }
    }, [watch('images')]);


    return (
        <div className="p-4 w-3/5 flex flex-col">
            <h1 className="text-3xl font-bold py-4">Create Product</h1>
            <form onSubmit={handleSubmit(onSubmitCreateProduct)}>
                <InputFieldAdmin
                    label="Product Name:"
                    name="name"
                    register={register}
                    schema={schemas.name}
                    error={errors.name}
                />
                <InputFieldAdmin
                    label="Unit Price:"
                    name="unitPrice"
                    register={register}
                    schema={schemas.unitPrice}
                    error={errors.unitPrice}
                />
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
                    <select
                        {...register('categoryId')}
                        className={`shadow appearance-none border ${errors.categoryId ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId &&
                        <span className="text-red-500 text-xs italic">{errors.categoryId.message}</span>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Supplier:</label>
                    <select
                        {...register('supplierId')}
                        className={`shadow appearance-none border ${errors.supplierId ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    >
                        <option value="">Select a supplier</option>
                        {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.companyName}
                            </option>
                        ))}
                    </select>
                    {errors.supplierId &&
                        <span className="text-red-500 text-xs italic">{errors.supplierId.message}</span>}
                </div>
                <MarkdownEditor
                    label="Description:"
                    name="description"
                    value={watch('description')}
                    onChange={handleEditorChange}
                    error={errors.description}
                />
                <InputFieldAdmin
                    label="Weight:"
                    name="weight"
                    register={register}
                    schema={schemas.weight}
                    error={errors.weight}
                />
                <div className="grid grid-cols-3 gap-4">
                    <InputFieldAdmin
                        label="Length:"
                        name="length"
                        register={register}
                        schema={schemas.length}
                        error={errors.length}
                    />
                    <InputFieldAdmin
                        label="Width:"
                        name="width"
                        register={register}
                        schema={schemas.width}
                        error={errors.width}
                    />
                    <InputFieldAdmin
                        label="Height:"
                        name="height"
                        register={register}
                        schema={schemas.height}
                        error={errors.height}
                    />
                </div>
                {
                    preview.thumbImage &&
                    <div className="my-4">
                        <img
                            className="w-[200px] object-contain"
                            src={preview.thumbImage}
                            alt="Preview Thumbnail Image"
                        />
                    </div>
                }
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Thumbnail Image:</label>
                    <input
                        type="file"
                        {...register('thumbImage')}
                        className={`shadow appearance-none border ${errors.thumbImage ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    />
                    {errors.thumbImage &&
                        <span className="text-red-500 text-xs italic">{errors.thumbImage.message}</span>}
                </div>
                {
                    preview.images.length > 0 &&
                    <div className="my-4 flex w-full gap-3 flex-wrap">
                        {
                            preview.images.map((el, index) => (
                                <div
                                    key={index}
                                    className="w-fit relative"
                                    onMouseEnter={() => setIsDelete(el.name)}
                                    onMouseLeave={() => setIsDelete(null)}
                                >
                                    <img
                                        src={el.path}
                                        alt={`Preview Image ${index + 1}`}
                                    />
                                    {
                                        isDelete === el.name &&
                                        <div
                                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                                            onClick={() => handleRemoveImage(el.name)}
                                        >
                                            <ImBin size={35} color={'white'}/>
                                        </div>
                                    }
                                </div>
                            ))
                        }
                    </div>
                }
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Product Images:</label>
                    <input
                        type="file"
                        {...register('images')}
                        multiple
                        className={`shadow appearance-none border ${errors.images ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    />
                    {errors.images && <span className="text-red-500 text-xs italic">{errors.images.message}</span>}
                </div>

                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default CreateProduct;

