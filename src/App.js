import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {
    Login,
    Home,
    Public,
    Blog,
    ProductDetails,
    FAQ,
    Service,
    Products,
    VerifyEmail,
    ForgotPassword,
    ResetPassword,
    SignUp,
} from './pages/public';
import path from './utils/path';
import {Modal} from './components';
import {useSelector} from "react-redux";

function App() {
    const {isShowModal, modalChildren} = useSelector(state => state.app);
    return (
        <div className="font-main relative">
            { isShowModal &&
                <Modal>
                    {modalChildren}
                </Modal>
            }
            <Routes>
                <Route path={path.PUBLIC} element={<Public/>}>
                    <Route path={path.HOME} element={<Home/>}/>
                    <Route path={path.PRODUCTS} element={<Products/>}/>
                    <Route path={path.PRODUCT_DETAILS__CATEGORY__PID__NAME} element={<ProductDetails/>}/>
                    <Route path={path.BLOGS} element={<Blog/>}/>
                    <Route path={path.FAQS} element={<FAQ/>}/>
                    <Route path={path.OUR_SERVICES} element={<Service/>}/>
                    <Route path={path.VERIFY_EMAIL} element={<VerifyEmail/>}/>
                    <Route path={path.FORGOT_PASSWORD} element={<ForgotPassword/>}/>
                    <Route path={path.RESET_PASSWORD__RESET_TOKEN} element={<ResetPassword/>}/>
                    <Route path={path.LOGIN} element={<Login/>}/>
                    <Route path={path.SIGN_UP} element={<SignUp/>}/>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
