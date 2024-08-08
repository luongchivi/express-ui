import React, {memo, useCallback, useEffect, useState} from 'react';
import Joi from 'joi';
import { Button, InputFieldAdmin } from 'components';
import { apiCreateBlog } from 'apis';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import path from 'utils/path';
import MarkdownEditor from 'components/input/MarkdownEditor';
import { getBase64, validateData } from 'utils/helpers';
import { useForm, useWatch } from 'react-hook-form';

const schemas = {
    title: Joi.string().max(250).required(),
    content: Joi.string().required(),
};

const CreateBlog = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, setValue, control, watch } = useForm({
        defaultValues: {
            title: '',
            content: '',
            thumbImage: null,
        }
    });
    const [preview, setPreview] = useState(null);

    const thumbImage = useWatch({ control, name: 'thumbImage' });

    const createBlog = async (data) => {
        const response = await apiCreateBlog(data);
        if (response?.results?.statusCode === 201) {
            await Swal.fire('Create blog successfully', response?.results?.message, 'success');
            navigate(`${path.ADMIN}/${path.MANAGE_BLOGS}`);
            reset();
        } else {
            await Swal.fire('Oops! something wrong', response?.results?.message, 'error');
        }
    };

    const onSubmitCreateBlog = (data) => {
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
            createBlog(formPayload);
        }
    };

    const handleEditorChange = useCallback((content) => {
        setValue('content', content);
    }, [setValue]);

    const handlePreviewThumbImage = async (file) => {
        const base64Thumb = await getBase64(file);
        setPreview(base64Thumb);
    }

    useEffect(() => {
        if (thumbImage && thumbImage.length > 0) {
            handlePreviewThumbImage(thumbImage[0]);
        }
    }, [thumbImage]);

    return (
        <div className="p-4 w-3/5 flex flex-col">
            <h1 className="text-3xl font-bold py-4">Create Blog</h1>
            <form onSubmit={handleSubmit(onSubmitCreateBlog)}>
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

export default memo(CreateBlog);
