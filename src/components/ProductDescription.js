import React, { memo, useEffect } from 'react';
import { productDescriptionTabs } from "../utils/containts";
import { CustomSlider, RatingBar } from "../components";
import { renderStar } from "../utils/helpers";
import { apiGetReviewsProduct } from "../apis";

const ProductDescription = ({ products, pid }) => {
    const [activeTab, setActiveTab] = React.useState(1);
    const [ratingCount, setRatingCount] = React.useState(0);
    const [averageRating, setAverageRating] = React.useState(0);
    const [detailsEachStarVote, setDetailsEachStarVote] = React.useState({});

    const fetchGetAllReviewsProduct = async () => {
        const response = await apiGetReviewsProduct(pid);
        if (response?.results?.statusCode === 200) {
            const { totalReviews, totalZeroStar, totalOneStar, totalTwoStar, totalThreeStar, totalFourStar, totalFiveStar } = response?.results;
            setRatingCount(totalReviews);
            const averageRating = (
                (0 * totalZeroStar) +
                (1 * totalOneStar) +
                (2 * totalTwoStar) +
                (3 * totalThreeStar) +
                (4 * totalFourStar) +
                (5 * totalFiveStar)
            ) / totalReviews;
            setAverageRating(averageRating);
            setDetailsEachStarVote({
                totalZeroStar, totalOneStar, totalTwoStar, totalThreeStar, totalFourStar, totalFiveStar
            });
            console.log(averageRating);
        }
    }

    useEffect(() => {
        fetchGetAllReviewsProduct().then();
    }, [pid]);

    return (
        <div className='w-main flex flex-col'>
            <div className="flex items-center gap-1 relative bottom-[-1px]">
                {productDescriptionTabs.map(el => (
                    <span
                        key={el.id}
                        className={`py-2 px-4 cursor-pointer ${activeTab === el.id ? 'bg-white border border-b-0' : 'bg-gray-200'}`}
                        onClick={() => setActiveTab(el.id)}
                    >
                        {el.title}
                    </span>
                ))}
                <span
                    className={`py-2 px-4 cursor-pointer ${activeTab === 5 ? 'bg-white border border-b-0' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab(5)}
                >
                    CUSTOMER REVIEWS
                </span>
            </div>
            <div className="w-full min-h-[100px] border">
                {
                    productDescriptionTabs.some(el => el.id === activeTab) && productDescriptionTabs.find(el => el.id === activeTab)?.content
                }
                {
                    activeTab === 5 && <div className="flex p-4">
                        <div className="flex-3 flex flex-col items-center justify-center border-r border-gray-200">
                            <span>{`${Math.round(averageRating) || 0}/5`}</span>
                            <span className="flex">{renderStar(averageRating || 0, 20)}</span>
                            <span className="flex">{ratingCount || 0} reviewers</span>
                        </div>
                        <div className="gap-3 flex-6 flex flex-col p-4">
                            {Array.from(Array(5).keys()).reverse().map(el => (
                                <RatingBar
                                    key={el}
                                    number={el + 1}
                                    ratingCount={ratingCount}
                                    detailsEachStarVote={detailsEachStarVote}
                                />
                            ))}
                        </div>
                    </div>
                }
            </div>
            <div className="w-full">
                <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main uppercase">Other Customers
                    also buy:</h3>
                <div className="w-full my-8">
                    <CustomSlider products={products} normal={true} />
                </div>
            </div>
        </div>
    );
}

export default memo(ProductDescription);

