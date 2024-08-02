import React, {memo} from 'react';
import useBreadcrumbs from "use-react-router-breadcrumbs";
import {Link, useLocation} from "react-router-dom";
import icons from "utils/icons";

const {IoIosArrowForward} = icons;

const Breadcrumb = ({name}) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryName = queryParams.get('categoryName');
    // Define breadcrumb routes
    const routes = [
        {path: "/", breadcrumb: "Home"},
        {path: "/products", breadcrumb: "Products"},
        {path: categoryName ? `/products?categoryName=${categoryName}` : "/products", breadcrumb: categoryName || "Category"},
        {path: name ? `/products/:category/:pid/:name` : "", breadcrumb: name || ""}
    ];

    const breadcrumbs = useBreadcrumbs(routes);

    return (
        <div className='text-sm flex items-center gap-1'>
            {breadcrumbs.map(({match, breadcrumb}, index, self) => (
                <React.Fragment key={match.pathname}>
                    <Link
                        className="flex gap-1 items-center hover:text-main"
                        to={match.pathname}
                    >
                        <span className="capitalize">{breadcrumb}</span>
                        {index !== self.length - 1 && <IoIosArrowForward />}
                    </Link>
                </React.Fragment>
            ))}
        </div>
    );
};

export default memo(Breadcrumb);
