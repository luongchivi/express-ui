import React, { memo } from 'react';
import { HashLoader } from "react-spinners";

const Loading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <HashLoader className="z-index-50" color="#ee3131"/>
        </div>
    );
};

export default memo(Loading);
