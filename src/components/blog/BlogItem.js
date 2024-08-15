import React, { memo } from 'react';
import defaultImageProduct from "assets/default_image_product.png";
import moment from "moment";
import { stripHtmlTags } from "../../utils/helpers";
import icons from "../../utils/icons";

const { FaCalendarAlt } = icons;

const BlogItem = ({ blogData }) => {
    return (
        <div>
            <div className="flex flex-col min-h-[400px] gap-2">
                <img
                    className="object-contain w-[407px] h-[270px] shadow-md" // Customize border here
                    src={blogData.thumbImageUrl || defaultImageProduct}
                    alt="Blog Thumbnail"
                />
                <div className="flex items-center justify-center">
                    <span className="text-center text-[15px] font-semibold hover:text-main">{blogData.title}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                    <FaCalendarAlt color={"gray"} size={13} />
                    <span className="text-gray-500 text-[13px]">
                        {moment(blogData.createdAt).format('MMM DD, YYYY')}
                    </span>
                </div>
                <div className="flex items-center justify-center relative overflow-hidden" style={{ maxHeight: '100px' }}>
                    <div className="text-gray-600 text-[14px] text-center">
                        {stripHtmlTags(blogData.content)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(BlogItem);
