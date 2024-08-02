import React, {memo} from 'react';
import avatar from '../assets/default_avatar.png';
import moment from 'moment';
import {renderStar} from "../utils/helpers";

const Comment = ({comment}) => {
    return (
        <div className='flex p-4 border border-gray-200 mb-4'>
            <div className="flex-none p-4">
                <img
                    src={avatar}
                    alt="avatar"
                    className="w-16 h-16 object-cover rounded-full"
                />
            </div>
            <div className="flex flex-col flex-auto">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">{`${comment?.user?.lastName} ${comment?.user?.firstName}`}</h3>
                    <span className="text-sm text-gray-500">{moment(comment?.createdAt).fromNow()}</span>
                </div>
                <div className="flex flex-col gap-2 pl-4 text-sm mt-4 border py-2 bg-gray-100 border-gray-300">
                    <span className="flex items-center gap-1">
                        <span className="font-semibold">Rating: </span>
                        <span className="flex text-yellow-500">{renderStar(comment?.rating, 14)}</span>
                    </span>
                    <span className="flex gap-1">
                        <span className="font-semibold">Comment: </span>
                        <span className="flex items-center text-gray-700">{comment?.comment}</span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default memo(Comment);
