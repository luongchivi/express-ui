import React from 'react';
import {useParams} from 'react-router-dom'

const ProductDetails = () => {
    const {pid, name} = useParams();
    return (
        <div>ProductDetails</div>
    )
}

export default ProductDetails
