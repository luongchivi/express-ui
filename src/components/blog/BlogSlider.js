import React from 'react';
import Slider from "react-slick";
import {BlogItem} from "components";
import {Link} from "react-router-dom";

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};


const BlogSlider = ({blogs}) => {
    return (
        <div className="my-4">
            {blogs && <Slider className="custom-slider" {...settings}>
                {blogs.map(blog => (
                    <Link
                        key={blog.id}
                        to={`/blogs/${blog.id}/${blog.title}`}
                    >
                        <BlogItem
                            blogData={blog}
                        />
                    </Link>
                ))}
            </Slider>}
        </div>
    )
}

export default BlogSlider
