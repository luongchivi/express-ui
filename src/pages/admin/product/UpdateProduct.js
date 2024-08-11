import React, {useCallback, useEffect, useState} from 'react';
import Joi from 'joi';
import {Button, InputFieldAdmin, Loading, MarkdownEditor} from 'components';
import {apiGetCategories, apiGetProductDetails, apiUpdateProduct} from 'apis';
import {useNavigate, useParams} from 'react-router-dom';
import Swal from 'sweetalert2';
import path from 'utils/path';
import {apiGetAllSuppliers} from 'apis/supplier';
import {getBase64, validateData} from 'utils/helpers';
import {useForm} from 'react-hook-form';
import icons from 'utils/icons';
import defaultProductImage from "assets/default_image_product.png"
import Slider from "react-slick";
import {showModal} from "../../../store/app/appSlice";
import {useDispatch} from "react-redux";

const {ImBin} = icons;

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1
};

const schemas = {
    name: Joi.string().min(3).max(100).required(),
    unitPrice: Joi.number().greater(0).required(),
    description: Joi.string().optional(),
    weight: Joi.number().greater(0).required(),
    length: Joi.number().greater(0).required(),
    width: Joi.number().greater(0).required(),
    height: Joi.number().greater(0).required(),
    unitsInStock: Joi.number().greater(0).required(),
};

const UpdateProduct = () => {
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [preview, setPreview] = useState({
        thumbImage: null,
        images: [],
    });
    const [initialProduct, setInitialProduct] = useState({});
    const [isDelete, setIsDelete] = useState(null);
    const navigate = useNavigate();
    const {pid} = useParams();
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
            unitsInStock: '',
            thumbImage: null,
            images: [],
        }
    });
    const [oldThumbImage, setOldThumbImage] = useState(null);
    const [oldImages, setOldImages] = useState([]);
    const dispatch = useDispatch();

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

    const fetchProduct = async () => {
        const response = await apiGetProductDetails(pid);
        if (response?.results?.statusCode === 200) {
            const {product} = response.results;
            setInitialProduct(product);
            setOldThumbImage(product.thumbImageUrl);
            setOldImages(product.imagesUrl);
            const {
                name,
                unitPrice,
                unitsInStock,
                weight,
                length,
                width,
                height,
                supplierId,
                categoryId,
                description,
                thumbImage,
                images
            } = product;
            reset({
                name,
                unitPrice,
                unitsInStock,
                weight,
                length,
                width,
                height,
                supplierId,
                categoryId,
                description,
                thumbImage: null,
                images: [],
            });
            if (thumbImage) {
                setPreview(prev => ({...prev, thumbImage}));
            }
            if (images) {
                setPreview(prev => ({
                    ...prev,
                    images: images.map(image => ({
                        name: image.name,
                        path: image.path
                    }))
                }));
            }
        }
    };

    const updateProduct = async (data) => {
        dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
        const response = await apiUpdateProduct(pid, data);
        dispatch(showModal({isShowModal: false, modalChildren: null}))
        if (response?.results?.statusCode === 200) {
            await Swal.fire('Update product successfully.', response?.results?.message, 'success');
            navigate(`${path.ADMIN}/${path.MANAGE_PRODUCTS}`);
        } else {
            await Swal.fire('Oops! something wrong', response?.results?.message, 'error');
        }
    };

    const onSubmitUpdateProduct = (data) => {
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
                } else if (key !== 'thumbImage' && key !== 'images' && data[key] !== initialProduct[key]) {
                    formPayload.append(key, data[key] || null);
                }
            }
            updateProduct(formPayload);
        }
    };

    const handleEditorChange = useCallback((content) => {
        setValue('description', content);
    }, [setValue]);

    useEffect(() => {
        fetchCategories();
        fetchSuppliers();
        fetchProduct();
    }, [pid]);

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
                await Swal.fire('Oops! something wrong', 'Oops! something wrong, Only accept png, jpeg', 'error');
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
    };

    const handleRemoveImage = (name) => {
        const files = [...watch('images')];
        reset({
            images: files?.filter(el => el.name !== name),
        });
        if (preview.images?.some(el => el.name === name)) {
            setPreview(prev => ({...prev, images: prev.images?.filter(el => el.name !== name)}));
        }
    };

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
            <h1 className="text-3xl font-bold py-4">Update Product</h1>
            <form onSubmit={handleSubmit(onSubmitUpdateProduct)}>
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
                    label="Units In Stock:"
                    name="unitsInStock"
                    register={register}
                    schema={schemas.unitsInStock}
                    error={errors.unitsInStock}
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
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Old thumb image:</label>
                    <img
                        className="w-[200px] min-h-[298px] object-contain border border-gray-200"
                        src={oldThumbImage || defaultProductImage}
                        alt="Old thumb image"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Old images:</label>
                    <Slider className="images-slider-admin w-[840px] flex items-center justify-center" {...settings}>
                        {
                            (() => {
                                const imagesToShow = oldImages?.images?.length > 0 ? oldImages.images : oldImages;
                                const totalImages = 6;
                                const combinedImages = [...imagesToShow];

                                while (combinedImages.length < totalImages) {
                                    combinedImages.push(defaultProductImage);
                                }

                                return combinedImages.map((el, index) => (
                                    <div className="flex gap-1" key={index}>
                                        <img
                                            className="w-[200px] min-h-[298px] object-contain border border-gray-200"
                                            src={el instanceof File ? URL.createObjectURL(el) : el}
                                            alt={`image ${index}`}
                                        />
                                    </div>
                                ));
                            })()
                        }
                    </Slider>
                </div>
                {
                    preview.thumbImage &&
                    <div className="my-4">
                        <img
                            className="w-[200px] min-h-[298px] object-contain"
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
                                        className="w-[200px] min-h-[298px] object-contain"
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

export default UpdateProduct;


