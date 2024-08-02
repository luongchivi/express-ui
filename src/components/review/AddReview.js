import React, {memo, useEffect, useRef, useState} from 'react';
import logo from 'assets/logo_digital_new_250x.png';
import {feedbackScore} from "utils/containts";
import icons from "utils/icons";
import {Button} from "components";

const {FaStar} = icons;


const AddReview = ({ productName, handleSubmitAddReview }) => {
    const modalRef = useRef();
    const [chosenStar, setChosenStar] = useState(null);
    const [comment, setComment] = useState('');

    useEffect(() => {
        modalRef.current.scrollIntoView({
            block: "center",
            behavior: 'smooth',
        });
    }, []);

    return (
        <div
            onClick={e => e.stopPropagation()}
            ref={modalRef}
            className="bg-white p-8 rounded-lg shadow-lg gap-4 flex flex-col items-center justify-center"
        >
            <div className="w-[700px] flex flex-col items-center justify-center gap-4">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-[300px] object-contain"
                />
                <h2 className="text-center text-2xl">
                    {`Review product `}
                    <strong>{productName}</strong>
                </h2>
                <textarea
                    className="form-textarea w-full border border-gray-300 rounded-md placeholder:italic placeholder:text-xs placeholder:text-gray-500"
                    placeholder="Write your review here..."
                    aria-label="Review Textarea"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
                <div className="w-full text-center">
                    <p className="mb-4 text-lg">How do you like this product?</p>
                    <div className="flex items-center justify-center gap-4">
                        {feedbackScore.map(score => (
                            <div
                                className="w-[90px] hover:bg-gray-300 cursor-pointer bg-gray-100 rounded-md p-4 flex items-center justify-center flex-col gap-4"
                                key={score.id}
                                onClick={() => setChosenStar(score.id)}
                            >
                                {
                                    (Number(chosenStar) && chosenStar >= score.id)
                                        ? <FaStar className="mt-2" color="orange"/>
                                        :  <FaStar className="mt-2" color="gray"/>
                                }

                                <span>{score.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Button
                fw
                handleOnClick={() => handleSubmitAddReview({
                    comment,
                    rating: chosenStar,
                })}
            >Submit</Button>
        </div>
    );
}

export default memo(AddReview);
