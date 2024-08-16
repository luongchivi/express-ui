import React from 'react';
import { Breadcrumb } from "components";
import icons from "utils/icons";

const {MdOutlineMail, FaLocationDot, MdPhone, FaCheck} = icons;

const ContactUs = () => {
    return (
        <div className="w-full flex flex-col">
            <div className="h-[81px] flex flex-col justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold uppercase">Contact Us</h3>
                    <Breadcrumb />
                </div>
            </div>
            <div className="w-main m-auto my-4">
                <div className="flex w-full">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.9983729532326!2d-79.37696228451207!3d43.66118217912019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34d69fd25d83%3A0x2b2b7e999ae0dd70!2s474%20Ontario%20St%2C%20Toronto%2C%20ON%20M4X%201M7%2C%20Canada!5e0!3m2!1sen!2s!4v1692212558744!5m2!1sen!2s"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
                <div className="flex flex-col w-full p-4 gap-2">
                    <p className="text-gray-600">Sed vestibulum faucibus felis, sit amet facilisis tellus. Aliquam erat volutpat. Sed consectetur ipsum velit, quis rhoncus libero egestas eget.</p>
                    <ul>
                        <li className="flex gap-2 items-center">
                            <FaLocationDot size={18} color='red'/>
                            <strong>Address:</strong> 474 Ontario St Toronto, ON M4X 1M7, Canada
                        </li>
                        <li className="flex gap-2 items-center">
                            <FaCheck size={18} color='red'/>
                            <strong>Opening hours:</strong> Mon-Fri: 11.00 – 20.00, Sat: 10.00 – 20.00, Sun: 19.00 – 20.00
                        </li>
                        <li className="flex gap-2 items-center">
                            <MdOutlineMail size={18} color='red'/>
                            <strong>Email:</strong> support@atodathemes.com
                        </li>
                        <li className="flex gap-2 items-center">
                            <MdPhone size={18} color='red'/>
                            <strong>Phone:</strong> (+123) 345 678 xxx
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;
