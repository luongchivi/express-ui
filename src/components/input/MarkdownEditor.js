import { memo } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const MarkdownEditor = ({ label, name, value, onChange, error }) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
            <Editor
                apiKey={process.env.REACT_APP_MCETINY}
                initialValue={value}
                init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                onChange={(e) => {
                    if (typeof onChange === 'function') {
                        onChange(e.target.getContent()); // Pass content directly
                    }
                }}
            />
            {error && <span className="text-red-500 text-xs italic">{error}</span>}
        </div>
    );
};

export default memo(MarkdownEditor);
