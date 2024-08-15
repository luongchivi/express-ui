import React, {useCallback, useEffect, useState} from 'react';
import {createSearchParams, Link, useNavigate, useSearchParams} from 'react-router-dom';
import {Breadcrumb, Pagination} from 'components';
import {apiGetAllBlogs} from 'apis';
import moment from "moment";
import defaultImageProduct from "assets/default_image_product.png";
import icons from "utils/icons";
import {stripHtmlTags} from "../../utils/helpers";

const {MdArrowRightAlt} = icons;

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [params] = useSearchParams();
    const [totalItemsFiltered, setTotalItemsFiltered] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const navigate = useNavigate();
    const [queriesFilter, setQueriesFilter] = useState({});

    const fetchBlogs = async (queries) => {
        const response = await apiGetAllBlogs(queries);
        if (response?.results?.statusCode === 200) {
            const {
                blogs,
                totalItemsFiltered: totalItemsFilteredData,
                currentPage: currentPageData,
                pageSize: pageSizeData,
            } = response?.results;
            setBlogs(blogs);
            setCurrentPage(currentPageData);
            setTotalItemsFiltered(totalItemsFilteredData);
            setPageSize(pageSizeData);
        }
    };

    const saveQueriesInFilter = useCallback((value, keysToRemove = []) => {
        setQueriesFilter(prev => {
            const updatedFilter = {...prev, ...value};
            keysToRemove.forEach(key => {
                delete updatedFilter[key];
            });
            return updatedFilter;
        });
    }, []);

    useEffect(() => {
        const newQueriesFilter = Object.fromEntries([...params.entries()]);
        setQueriesFilter(prev => ({...prev, ...newQueriesFilter}));
    }, [params]);

    useEffect(() => {
        fetchBlogs(queriesFilter);
    }, [queriesFilter]);

    useEffect(() => {
        window.scrollTo(0, 0);
        navigate({
            pathname: '/blogs',
            search: createSearchParams(queriesFilter).toString()
        });
    }, [queriesFilter]);

    return (
        <div className="w-full flex flex-col">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-main">
                    <Breadcrumb/>
                </div>
            </div>
            <div className="w-main m-auto flex gap-4">
                <div className="w-4/5 flex flex-col mt-4">
                    <div>
                        {blogs.length > 0 && blogs.map(blog => (
                            <div key={blog.id} className="flex bg-white mb-4">
                                <div className="w-3/5 flex">
                                    <img
                                        className="object-cover w-full h-[280px] p-1"
                                        src={blog.thumbImageUrl || defaultImageProduct}
                                        alt="Thumb Image"
                                    />
                                </div>
                                <div className="w-3/5 flex flex-col px-4 gap-2">
                                    <h3 className="text-[18px] font-semibold">{blog.title}</h3>
                                    <div className="flex gap-2">
                                        <span className="text-[13px] text-gray-500">
                                            By {`${blog.user.firstName} ${blog.user.lastName}`}
                                        </span>
                                        <span className="text-[13px] text-gray-500">.</span>
                                        <span className="text-[13px] text-gray-500">
                                            {moment(blog.createdAt).format('MMM DD, YYYY')}
                                        </span>
                                    </div>
                                    <div className="relative overflow-hidden" style={{maxHeight: '150px'}}>
                                        <div className="text-gray-600 text-[14px]">
                                            {stripHtmlTags(blog.content)}
                                        </div>
                                    </div>
                                    <Link
                                        to={`/blogs/${blog.id}/${blog.title}`}
                                        className="text-main text-[14px] flex items-center gap-1 hover:text-black cursor-pointer">
                                        <span>Read More</span>
                                        <MdArrowRightAlt size={16} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-full mb-4">
                        <Pagination
                            totalItemsFiltered={totalItemsFiltered}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            saveQueriesInFilter={saveQueriesInFilter}
                            text={"blogs"}
                        />
                    </div>
                </div>
                <div className="w-1/6 h-[250px] bg-main mt-4">
                    <div className="text-white">Other content goes here</div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
