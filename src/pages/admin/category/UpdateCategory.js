import React, { useCallback, useEffect, useState } from 'react';
import Joi from 'joi';
import { Button, InputFieldAdmin, Loading, MarkdownEditor } from 'components';
import {
    apiAddSupplierToCategory,
    apiGetCategoryDetails,
    apiRemoveSupplierFromCategory,
    apiUpdateCategory,
    apiGetAllSuppliers,
} from 'apis';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import path from 'utils/path';
import { getBase64, validateData } from 'utils/helpers';
import { useForm } from 'react-hook-form';
import { useDispatch } from "react-redux";
import { showModal } from "store/app/appSlice";
import defaultProductImage from "assets/default_image_product.png";
import icons from "utils/icons";

const { MdIndeterminateCheckBox } = icons;

const schemas = {
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().allow('').optional(),
};

const UpdateCategory = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
        defaultValues: {
            name: '',
            description: '',
            thumbImage: null,
            iconImage: null,
        }
    });
    const [preview, setPreview] = useState({
        thumbImage: null,
        iconImage: null,
    });
    const dispatch = useDispatch();
    const [initialCategory, setInitialCategory] = useState({});
    const [oldThumbImage, setOldThumbImage] = useState(null);
    const [oldIconImage, setOldIconImage] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
    const [availableSuppliers, setAvailableSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');

    const onSubmitUpdateCategory = (data) => {
        const allErrors = validateData(data, schemas);

        if (data.thumbImage && data.thumbImage.length > 1) {
            allErrors.thumbImage = 'Only one thumbnail image is allowed.';
        }

        if (data.iconImage && data.iconImage.length > 1) {
            allErrors.iconImage = 'Only one icon image is allowed.';
        }

        if (Object.keys(allErrors).length > 0) {
            console.log(allErrors);
        } else {
            const formPayload = new FormData();
            for (const key in data) {
                if (key === 'iconImage' && data[key]?.length > 0) {
                    formPayload.append(key, data[key][0]);
                } else if (key === 'thumbImage' && data[key]?.length > 0) {
                    formPayload.append(key, data[key][0]);
                } else if (key !== 'thumbImage' && key !== 'iconImage') {
                    formPayload.append(key, data[key] || null);
                } else if (key !== 'thumbImage' && key !== 'iconImage' && data[key] !== initialCategory[key]) {
                    formPayload.append(key, data[key] || null);
                }
            }
            updateCategory(formPayload);
        }
    };

    const fetchCategory = async () => {
        const response = await apiGetCategoryDetails(categoryId);
        if (response?.results?.statusCode === 200) {
            const { category } = response.results;
            setInitialCategory(category);
            setOldThumbImage(category.thumbImageUrl);
            setOldIconImage(category.iconImageUrl);
            setSuppliers(category.suppliers || []);
            const {
                name,
                description,
                thumbImage,
                iconImage,
            } = category;
            reset({
                name,
                description,
                thumbImage: null,
                iconImage: null,
            });
            if (iconImage) {
                setPreview(prev => ({ ...prev, iconImage }));
            }
            if (thumbImage) {
                setPreview(prev => ({ ...prev, thumbImage }));
            }
        }
    };

    const fetchAllSuppliers = async () => {
        const response = await apiGetAllSuppliers();
        if (response?.results?.statusCode === 200) {
            setAvailableSuppliers(response.results.suppliers);
        }
    };

    const updateCategory = async (data) => {
        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
        const response = await apiUpdateCategory(categoryId, data);
        dispatch(showModal({ isShowModal: false, modalChildren: null }))
        if (response?.results?.statusCode === 200) {
            await Swal.fire('Update category successfully.', response?.results?.message, 'success');
            navigate(`${path.ADMIN}/${path.MANAGE_CATEGORIES}`);
        } else {
            await Swal.fire('Oops! something wrong', response?.results?.message, 'error');
        }
    };

    const handleEditorChange = useCallback((content) => {
        setValue('description', content || null);
    }, [setValue]);

    const handlePreviewThumbImage = async (file) => {
        if (file) {
            const base64Thumb = await getBase64(file);
            setPreview(prev => ({ ...prev, thumbImage: base64Thumb }));
        } else {
            setPreview(prev => ({ ...prev, thumbImage: null }));
        }
    }

    const handlePreviewIconImage = async (file) => {
        if (file) {
            const base64Thumb = await getBase64(file);
            setPreview(prev => ({ ...prev, iconImage: base64Thumb }));
        } else {
            setPreview(prev => ({ ...prev, iconImage: null }));
        }
    }

    const handleAddSupplier = async () => {
        const response = await apiAddSupplierToCategory(categoryId, { companyName: selectedSupplier || undefined });
        if (response?.results?.statusCode === 200) {
            setSuppliers(prev => [...prev, { companyName: selectedSupplier }]);
            setSelectedSupplier('');
        } else {
            await Swal.fire('Oops! something wrong', response?.results?.message, 'error');
        }
    };

    const handleRemoveSupplier = async (companyName) => {
        const response = await apiRemoveSupplierFromCategory(categoryId, { companyName });
        if (response?.results?.statusCode === 200) {
            setSuppliers(prev => prev.filter(supplier => supplier.companyName !== companyName));
        } else {
            await Swal.fire('Oops! something wrong', response?.results?.message, 'error');
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
        if (watch('iconImage') && watch('iconImage').length > 0) {
            handlePreviewIconImage(watch('iconImage')[0]);
        } else {
            handlePreviewIconImage(null);
        }
    }, [watch('iconImage')]);

    useEffect(() => {
        fetchCategory();
        fetchAllSuppliers();
    }, [categoryId]);

    return (
        <div className="p-4 w-3/5 flex flex-col">
            <h1 className="text-3xl font-bold py-4">Update Category</h1>
            <form onSubmit={handleSubmit(onSubmitUpdateCategory)}>
                <InputFieldAdmin
                    label="Category Name:"
                    name="name"
                    register={register}
                    schema={schemas.name}
                    error={errors.name}
                />
                <MarkdownEditor
                    label="Description:"
                    name="description"
                    value={watch('description')}
                    onChange={handleEditorChange}
                    error={errors.description}
                />
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Old icon image:</label>
                    <img
                        className="w-[200px] min-h-[298px] object-contain border border-gray-200"
                        src={oldThumbImage || defaultProductImage}
                        alt="Old thumb image"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Old thumb image:</label>
                    <img
                        className="w-[200px] min-h-[298px] object-contain border border-gray-200"
                        src={oldIconImage || defaultProductImage}
                        alt="Old thumb image"
                    />
                </div>
                {
                    preview.iconImage &&
                    <div className="my-4">
                        <img
                            className="w-[200px] object-contain"
                            src={preview.iconImage}
                            alt="Preview Thumbnail Image"
                        />
                    </div>
                }
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Icon Image:</label>
                    <input
                        type="file"
                        {...register('iconImage')}
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
                <div className="my-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Thumb Image:</label>
                    <input
                        type="file"
                        {...register('thumbImage')}
                    />
                </div>
                <div className="my-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">List Suppliers:</label>
                    {suppliers && suppliers?.length > 0 ? (
                        <div className="w-[180px]">
                            {
                                suppliers?.map(supplier => (
                                    <div className="flex gap-4 justify-between items-center my-2 text-sm">
                                        <span>{supplier.companyName}</span>
                                        <MdIndeterminateCheckBox
                                            onClick={() => handleRemoveSupplier(supplier.companyName)}
                                            color={'red'}
                                            size={25}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <p>No suppliers available</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Add Supplier:</label>
                    <div className="flex gap-4">
                        <select
                            value={selectedSupplier}
                            onChange={(e) => setSelectedSupplier(e.target.value)}
                            className="border rounded p-2"
                        >
                            <option value="">Select a supplier</option>
                            {availableSuppliers.map((supplier, index) => (
                                <option key={index} value={supplier.companyName}>
                                    {supplier.companyName}
                                </option>
                            ))}
                        </select>
                        <Button
                            type="button"
                            handleOnClick={handleAddSupplier}
                        >Add Supplier</Button>
                    </div>
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default UpdateCategory;
