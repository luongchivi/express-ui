import React, { memo } from 'react';
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { Link, useLocation } from "react-router-dom";
import icons from "utils/icons";

const { IoIosArrowForward } = icons;

const CustomCategoryBreadcrumb = ({ match }) => {
    const categoryName = match.params.category;
    return (
        <Link className="flex gap-1 items-center hover:text-main" to={`/products?categoryName=${categoryName}`}>
            <span className="capitalize">{categoryName}</span>
        </Link>
    );
};

const Breadcrumb = ({ name, title }) => {

    // Define breadcrumb routes
    const routes = [
        { path: "/", breadcrumb: "Home" },
        { path: "/products", breadcrumb: "Products" },
        { path: "/products/:category", breadcrumb: CustomCategoryBreadcrumb },
        { path: "/products/:category/:pid/:name", breadcrumb: name || "" },
        { path: "/blogs/:bid/:title", breadcrumb: title || "" },
    ];

    const breadcrumbs = useBreadcrumbs(routes);

    return (
        <div className='text-sm flex items-center gap-1'>
            {breadcrumbs.map(({ match, breadcrumb }, index, self) => (
                <React.Fragment key={match.pathname}>
                    {typeof breadcrumb === 'function' ? (
                        React.cloneElement(breadcrumb({ match }), {
                            key: match.pathname,
                        })
                    ) : (
                        <Link
                            className="flex gap-1 items-center hover:text-main"
                            to={match.pathname}
                        >
                            <span className="capitalize">{breadcrumb}</span>
                            {index !== self.length - 1 && <IoIosArrowForward />}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default memo(Breadcrumb);
