import React, {useCallback, useEffect, useState} from 'react';
import Joi from 'joi';
import {Button, InputFieldAdmin, Loading, MarkdownEditor} from 'components';
import {apiCreateCategory} from 'apis';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import path from 'utils/path';
import {getBase64, validateData} from 'utils/helpers';
import {useForm} from 'react-hook-form';
import {useDispatch} from "react-redux";
import {showModal} from "../../../store/app/appSlice";


const schemas = {
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().allow('').optional(),
};

const CreateCategory = () => {
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}, reset, setValue, watch} = useForm({
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

    const createCategory = async (data) => {
        dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
        const response = await apiCreateCategory(data);
        dispatch(showModal({isShowModal: false, modalChildren: null}))
        if (response?.results?.statusCode === 201) {
            await Swal.fire('Create category successfully', response?.results?.message, 'success');
            navigate(`${path.ADMIN}/${path.MANAGE_CATEGORIES}`);
            reset();
        } else {
            await Swal.fire('Oops! something wrong', response?.results?.message, 'error');
        }
    };

    const onSubmitCreateCategory = (data) => {
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
                }
            }
            createCategory(formPayload);
        }
    };

    const handleEditorChange = useCallback((content) => {
        setValue('description', content || null);
    }, [setValue]);

    const handlePreviewThumbImage = async (file) => {
        if (file) {
            const base64Thumb = await getBase64(file);
            setPreview(prev => ({...prev, thumbImage: base64Thumb}));
        } else {
            setPreview(prev => ({...prev, thumbImage: null}));
        }
    }

    const handlePreviewIconImage = async (file) => {
        if (file) {
            const base64Thumb = await getBase64(file);
            setPreview(prev => ({...prev, iconImage: base64Thumb}));
        } else {
            setPreview(prev => ({...prev, iconImage: null}));
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
        if (watch('iconImage') && watch('iconImage').length > 0) {
            handlePreviewIconImage(watch('iconImage')[0]);
        } else {
            handlePreviewIconImage(null);
        }
    }, [watch('iconImage')]);


    return (
        <div className="p-4 w-3/5 flex flex-col">
            <h1 className="text-3xl font-bold py-4">Create Category</h1>
            <form onSubmit={handleSubmit(onSubmitCreateCategory)}>
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
                        className={`shadow appearance-none border ${errors.iconImage ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    />
                    {errors.iconImage &&
                        <span className="text-red-500 text-xs italic">{errors.iconImage.message}</span>}
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
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default CreateCategory;

