import React, { memo, useCallback, useEffect, useState } from 'react';
import Joi from 'joi';
import {Button, InputFieldAdmin, Loading, MarkdownEditor} from 'components';
import { apiGetBlogDetails, apiUpdateBlog } from 'apis';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import path from 'utils/path';
import { getBase64, validateData } from 'utils/helpers';
import { useForm, useWatch } from 'react-hook-form';
import {showModal} from "../../../store/app/appSlice";
import {useDispatch} from "react-redux";

const schemas = {
    title: Joi.string().max(250).required(),
    content: Joi.string().required(),
};

const UpdateBlog = () => {
    const { blogId } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, setValue, control, watch } = useForm({
        defaultValues: {
            title: '',
            content: '',
            thumbImage: null,
        }
    });
    const [preview, setPreview] = useState(null);
    const dispatch = useDispatch();
    const thumbImage = useWatch({ control, name: 'thumbImage' });

    useEffect(() => {
        if (blogId) {
            fetchBlog();
        }
    }, [blogId]);

    const fetchBlog = async () => {
        const response = await apiGetBlogDetails(blogId);
        if (response?.results?.statusCode === 200) {
            const { blog } = response.results;
            const { title, content, thumbImage } = blog;
            reset({
                title,
                content,
                thumbImage: null,
            });
            if (thumbImage) {
                setPreview(thumbImage);
            }
        }
    };

    const updateBlog = async (data) => {
        dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
        const response = await apiUpdateBlog(blogId, data);
        dispatch(showModal({isShowModal: false, modalChildren: null}))
        if (response?.results?.statusCode === 200) {
            await Swal.fire('Update blog successfully', response?.results?.message, 'success');
            navigate(`${path.ADMIN}/${path.MANAGE_BLOGS}`);
        } else {
            await Swal.fire('Oops! something went wrong', response?.results?.message, 'error');
        }
    };

    const onSubmitUpdateBlog = (data) => {
        const allErrors = validateData(data, schemas);

        if (data.thumbImage && data.thumbImage.length > 1) {
            allErrors.thumbImage = 'Only one thumbnail image is allowed.';
        }

        if (Object.keys(allErrors).length > 0) {
            console.log(allErrors);
        } else {
            const formPayload = new FormData();
            for (const key in data) {
                if (key === 'thumbImage' && data[key]?.length > 0) {
                    formPayload.append(key, data[key][0]);
                } else if (key !== 'thumbImage') {
                    formPayload.append(key, data[key] || null);
                }
            }
            updateBlog(formPayload);
        }
    };

    const handleEditorChange = useCallback((content) => {
        setValue('content', content);
    }, [setValue]);

    const handlePreviewThumbImage = async (file) => {
        if (file) {
            const base64Thumb = await getBase64(file);
            setPreview(base64Thumb);
        } else {
            setPreview(null);
        }
    };

    useEffect(() => {
        if (thumbImage && thumbImage.length > 0) {
            handlePreviewThumbImage(thumbImage[0]);
        } else {
            handlePreviewThumbImage(null);
        }
    }, [thumbImage]);

    return (
        <div className="p-4 w-3/5 flex flex-col">
            <h1 className="text-3xl font-bold py-4">Update Blog</h1>
            <form onSubmit={handleSubmit(onSubmitUpdateBlog)}>
                <InputFieldAdmin
                    label="Title:"
                    name="title"
                    register={register}
                    schema={schemas.title}
                    error={errors.title}
                />
                <MarkdownEditor
                    label="Content:"
                    name="content"
                    value={watch('content')}
                    onChange={handleEditorChange}
                    error={errors.content}
                />
                {
                    preview &&
                    <div className="my-4">
                        <img
                            className="w-[200px] object-contain"
                            src={preview}
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

export default memo(UpdateBlog);
