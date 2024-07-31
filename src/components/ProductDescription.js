import React, {memo, useEffect} from 'react';
import {productDescriptionTabs} from "../utils/containts";
import {Button, RatingBar, AddReview} from "../components";
import {renderStar} from "../utils/helpers";
import {apiAddReviewProduct, apiGetReviewsProduct} from "../apis";
import {useDispatch, useSelector} from "react-redux";
import {showModal} from "../store/app/appSlice";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import path from '../utils/path';


const ProductDescription = ({pid, productName}) => {
    const [activeTab, setActiveTab] = React.useState(1);
    const [ratingCount, setRatingCount] = React.useState(0);
    const [averageRating, setAverageRating] = React.useState(0);
    const [detailsEachStarVote, setDetailsEachStarVote] = React.useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isLogin} = useSelector(state => state.user);
    const [shouldFetchReviews, setShouldFetchReviews] = React.useState(false);

    const handleSubmitAddReview = async (data) => {
        if (isLogin) {
            const response = await apiAddReviewProduct(pid, data);
            if (response?.results?.statusCode === 201) {
                await Swal.fire('Submit review successfully.', response?.results?.message, 'success');
                setShouldFetchReviews(true);
            } else {
                await Swal.fire('Oops! something wrong.', response?.results?.message, 'error');
            }
        } else {
            await Swal.fire({
                text: 'You need to login for add review.',
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Login',
                title: 'Oops! something wrong.',
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    dispatch(showModal({
                        isShowModal: false,
                        modalChildren: null,
                    }))
                    navigate(`/${path.LOGIN}`);
                }
            });
        }
    };

    const fetchGetAllReviewsProduct = async () => {
        const response = await apiGetReviewsProduct(pid);
        if (response?.results?.statusCode === 200) {
            const {
                totalReviews,
                totalZeroStar,
                totalOneStar,
                totalTwoStar,
                totalThreeStar,
                totalFourStar,
                totalFiveStar
            } = response?.results;
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
        setShouldFetchReviews(false);  // Reset state
    }, [pid, shouldFetchReviews]);

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
                    activeTab === 5 && <div className="flex flex-col p-4">
                        <div className="flex">
                            <div
                                className="flex-3 flex flex-col items-center justify-center border-l border-t border-b border-gray-200">
                                <span>{`${Math.round(averageRating) || 0}/5`}</span>
                                <span className="flex">{renderStar(averageRating || 0, 20)}</span>
                                <span className="flex">{ratingCount || 0} reviewers</span>
                            </div>
                            <div className="gap-3 flex-6 flex flex-col p-4 border border-gray-200">
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
                        <div className="flex flex-col items-center justify-center mt-5">
                            <span>Review this production</span>
                            <Button
                                handleOnClick={() =>
                                    dispatch(showModal({
                                        isShowModal: true,
                                        modalChildren: <AddReview productName={productName} handleSubmitAddReview={handleSubmitAddReview}/>
                                    }))
                                }
                            >
                                Add Review
                            </Button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default memo(ProductDescription);

