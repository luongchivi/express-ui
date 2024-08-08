import React, {useEffect, useState} from 'react';
import {Breadcrumb} from "../../components";
import {useParams} from "react-router-dom";
import {apiGetBlogDetails} from "../../apis";
import moment from "moment/moment";
import DOMPurify from "dompurify";

const BlogDetails = () => {
    const {bid, title} = useParams();
    const [blog, setBlog] = useState(null);

    const fetchBlogDetails = async () => {
        const response = await apiGetBlogDetails(bid);
        if (response?.results?.statusCode === 200) {
            const {blog} = response?.results;
            console.log(blog);
            setBlog(blog);
        }
    }

    useEffect(() => {
        fetchBlogDetails();
    }, [])

    return (
        <div className="w-full flex flex-col">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold uppercase">{title}</h3>
                    <Breadcrumb title={title}/>
                </div>
            </div>
            <div className="w-main m-auto flex flex-col gap-4 my-4">
                <div className="flex gap-2 text-[14px] text-gray-500 uppercase">
                    <span>
                        By {`${blog?.user?.firstName} ${blog?.user?.lastName}`}
                    </span>
                    <span>.</span>
                    <span>
                        {moment(blog?.createdAt).format('MMM DD, YYYY')}
                    </span>
                </div>
                <div
                    className="text-gray-600 text-[14px] line-clamp-6"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(blog?.content),
                    }}
                />
            </div>
        </div>
    )
}

export default BlogDetails;
