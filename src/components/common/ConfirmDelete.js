import React, { memo } from 'react';

const ConfirmDelete = ({ id, handleSubmit }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                <p className="mb-4">Do you want to delete this product?</p>
                <div className="flex justify-end">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                        onClick={() => handleSubmit(id)}
                    >
                        Delete
                    </button>
                    <button
                        className="bg-gray-300 px-4 py-2 rounded"
                        onClick={() => handleSubmit(null)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(ConfirmDelete);
