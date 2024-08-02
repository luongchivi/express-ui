import React, {memo} from 'react';
import useBreadcrumbs from "use-react-router-breadcrumbs";
import {Link} from "react-router-dom";
import icons from "../utils/icons"

const {IoIosArrowForward} = icons;


const Breadcrumb = ({name, category}) => {
    const routes = [
        {path: "/:category", breadcrumb: category},
        {path: "/:category/:pid/:name", breadcrumb: name},
        {path: "/", breadcrumb: "Home"},
    ];

    const breadcrumbs = useBreadcrumbs(routes);

    return (
        <div className='text-sm flex items-center gap-1'>
            {breadcrumbs?.filter(el => !el.match.route === false).map(({match, breadcrumb}, index, self) => (
                <Link
                    className="flex gap-1 items-center hover:text-main"
                    key={match.pathname} to={match.pathname}>
                        <span className="capitalize">{breadcrumb} </span>
                        {
                            index !== self.length - 1 &&
                            <IoIosArrowForward/>
                        }
                </Link>
            ))}
        </div>
    )
}

export default memo(Breadcrumb)
