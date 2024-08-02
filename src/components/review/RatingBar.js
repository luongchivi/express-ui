import React, {memo, useEffect, useRef} from 'react';
import icons from "utils/icons";

const {FaStar} = icons;

const RatingBar = ({number, ratingCount, detailsEachStarVote}) => {
    const percentRef = useRef();

    const {totalZeroStar, totalOneStar, totalTwoStar, totalThreeStar, totalFourStar, totalFiveStar} = detailsEachStarVote;

    const starCounts = [totalZeroStar, totalOneStar, totalTwoStar, totalThreeStar, totalFourStar, totalFiveStar];
    const totalStarCount = starCounts[number];

    useEffect(() => {
        if (ratingCount > 0) {
            const percentage = Math.round((totalStarCount / ratingCount) * 100);
            percentRef.current.style.cssText = `right: ${100 - percentage}%`;
        } else {
            percentRef.current.style.cssText = `right: 100%`;
        }
    }, [ratingCount, totalStarCount]);

    return (
        <div className="flex items-center gap-2 text-gray-500">
            <div className="w-[10%] flex items-center justify-center gap-1 text-sm">
                <span>{number}</span>
                <FaStar color="orange" size={16}/>
            </div>
            <div className="w-[75%]">
                <div className="relative w-full h-[10px] bg-gray-200 rounded-l-full rounded-r-full">
                    <div
                        ref={percentRef}
                        className={`absolute inset-0 ${ratingCount > 0 ? 'bg-red-500' : 'bg-gray-200'}`}>
                    </div>
                </div>
            </div>
            <div className="w-[15%] flex justify-end text-xs text-400">
                {totalStarCount || 0} reviewers
            </div>
        </div>
    )
}

export default memo(RatingBar);

