import React, {memo} from 'react';
import {productDescriptionTabs} from "../utils/containts"
import {CustomSlider} from "../components";

const activeStyles = '';
const notActiveStyles = '';

const ProductDescription = ({products}) => {
    const [activeTab, setActiveTab] = React.useState(1);

    return (
        <div className='w-main flex flex-col'>
            <div className="flex items-center gap-1 relative bottom-[-1px]">
                {productDescriptionTabs.map(el => (
                    <span
                        key={el.id}
                        className={`py-2 px-4 cursor-pointer ${activeTab === el.id ? 'bg-white border border-b-0' : 'bg-gray-200'}`}
                        onClick={() => setActiveTab(el.id)}
                    >
                        {el.title}
                    </span>
                ))}
            </div>
            <div className="w-full min-h-[100px] border">
                {
                    productDescriptionTabs.some(el => el.id === activeTab) && productDescriptionTabs.find(el => el.id === activeTab)?.content
                }
            </div>
            <div className="w-full">
                <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main uppercase">Other Customers also buy:</h3>
                <div className="w-full my-8">
                    <CustomSlider products={products} normal={true} />
                </div>
            </div>
        </div>
    )
}

export default memo(ProductDescription)
