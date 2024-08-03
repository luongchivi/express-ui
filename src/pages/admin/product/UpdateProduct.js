import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InputField, Button } from 'components';
import { apiGetProductDetails, apiUpdateProduct } from 'apis'; // Assuming you have these API functions
import Swal from 'sweetalert2';

const UpdateProduct = () => {
    const { pid } = useParams();
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        unitPrice: '',
        unitsInStock: '',
        supplierId: '',
        categoryId: '',
        weight: '',
        length: '',
        width: '',
        height: '',
        thumbImage: null,
        images: null
    });
    const [invalidFields, setInvalidFields] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await apiGetProductDetails(pid);
                if (response?.results?.statusCode === 200) {
                    setProductData(response.results.product);
                } else {
                    await Swal.fire('Error', 'Failed to fetch product details', 'error');
                }
            } catch (error) {
                await Swal.fire('Error', 'Failed to fetch product details', 'error');
            }
        };
        fetchProduct();
    }, [pid]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setProductData({ ...productData, [name]: files[0] });
    };

    const handleUpdateProduct = async () => {
        try {
            const formData = new FormData();
            for (const key in productData) {
                formData.append(key, productData[key]);
            }
            const response = await apiUpdateProduct(pid, formData);
            if (response?.results?.statusCode === 200) {
                await Swal.fire('Success', 'Product updated successfully', 'success');
                navigate('/admin/manage-products');
            } else {
                await Swal.fire('Error', 'Failed to update product', 'error');
            }
        } catch (error) {
            await Swal.fire('Error', 'Failed to update product', 'error');
        }
    };

    return (
        <div className="p-4 m-auto flex flex-col">
            <h1 className="text-3xl font-bold py-4">Update Product</h1>
            <div className="overflow-x-auto">
                <InputField
                    value={productData.name}
                    setValue={setProductData}
                    name="name"
                    invalidFields={invalidFields}
                />
                <InputField
                    value={productData.description}
                    setValue={setProductData}
                    name="description"
                    invalidFields={invalidFields}
                />
                <InputField
                    value={productData.unitPrice}
                    setValue={setProductData}
                    name="unitPrice"
                    type="number"
                    invalidFields={invalidFields}
                />
                <InputField
                    value={productData.unitsInStock}
                    setValue={setProductData}
                    name="unitsInStock"
                    type="number"
                    invalidFields={invalidFields}
                />
                <InputField
                    value={productData.supplierId}
                    setValue={setProductData}
                    name="supplierId"
                    type="number"
                    invalidFields={invalidFields}
                />
                <InputField
                    value={productData.categoryId}
                    setValue={setProductData}
                    name="categoryId"
                    type="number"
                    invalidFields={invalidFields}
                />
                <InputField
                    value={productData.weight}
                    setValue={setProductData}
                    name="weight"
                    type="number"
                    invalidFields={invalidFields}
                />
                <InputField
                    value={productData.length}
                    setValue={setProductData}
                    name="length"
                    type="number"
                    invalidFields={invalidFields}
                />
                <InputField
                    value={productData.width}
                    setValue={setProductData}
                    name="width"
                    type="number"
                    invalidFields={invalidFields}
                />
                <InputField
                    value={productData.height}
                    setValue={setProductData}
                    name="height"
                    type="number"
                    invalidFields={invalidFields}
                />
                <input
                    type="file"
                    name="thumbImage"
                    onChange={handleFileChange}
                    className="mb-4"
                />
                <input
                    type="file"
                    name="images"
                    multiple
                    onChange={handleFileChange}
                    className="mb-4"
                />
                <Button fw handleOnClick={handleUpdateProduct}>
                    Update Product
                </Button>
            </div>
        </div>
    );
};

export default UpdateProduct;
