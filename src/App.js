import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {
    Login,
    Home,
    Public,
    Blog,
    ProductDetails,
    Products,
    VerifyEmail,
    ForgotPassword,
    ResetPassword,
    SignUp,
    Categories,
    BlogDetails,
    ContactUs,
} from './pages/public';
import path from './utils/path';
import { Modal } from './components';
import { useSelector } from 'react-redux';
import {
    Admin,
    Dashboard,
    ManageUsers,
    ManageOrders,
    CreateProduct,
    ManageProducts,
    CreateBlog,
    UpdateBlog,
    ManageBlog,
    UpdateProduct,
    CreateSupplier,
    UpdateSupplier,
    ManageSuppliers,
} from './pages/admin';
import {Cart, CheckOut, Member, Personal, Purchase, Success, HistoryOrder} from './pages/member';

function App() {
    const { isShowModal, modalChildren } = useSelector(state => state.app);
    return (
        <div className="font-main relative">
            {isShowModal && <Modal>{modalChildren}</Modal>}
            <Routes>
                <Route path={path.PUBLIC} element={<Public />}>
                    <Route path={path.HOME} element={<Home />} />
                    <Route path={path.PRODUCTS} element={<Products />} />
                    <Route path={path.CATEGORIES} element={<Categories />} />
                    <Route path={path.PRODUCT_DETAILS__CATEGORY__PID__NAME} element={<ProductDetails />} />
                    <Route path={path.BLOGS} element={<Blog />} />
                    <Route path={path.BLOGS__BID__TITLE} element={<BlogDetails />} />
                    <Route path={path.CONTACT_US} element={<ContactUs />} />
                    <Route path={path.VERIFY_EMAIL} element={<VerifyEmail />} />
                    <Route path={path.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={path.RESET_PASSWORD__RESET_TOKEN} element={<ResetPassword />} />
                    <Route path={path.LOGIN} element={<Login />} />
                    <Route path={path.SIGN_UP} element={<SignUp />} />
                    <Route path={path.ALL} element={<Home />} />
                    <Route path={path.MEMBER} element={<Member />}>
                        <Route path={path.PERSONAL} element={<Personal />} />
                        <Route path={path.CART} element={<Cart />} />
                        <Route path={path.CHECK_OUT} element={<CheckOut />} />
                        <Route path={path.PURCHASE} element={<Purchase />} />
                        <Route path={path.SUCCESS__OID} element={<Success />} />
                        <Route path={path.HISTORY_ORDER} element={<HistoryOrder />} />
                    </Route>
                </Route>
                <Route path={path.ADMIN} element={<Admin />}>
                    <Route path={path.DASHBOARD} element={<Dashboard />} />

                    // Manage Users
                    <Route path={path.MANAGE_USERS} element={<ManageUsers />} />

                    <Route path={path.MANAGE_ORDERS} element={<ManageOrders />} />

                    // Manage Products
                    <Route path={path.MANAGE_PRODUCTS} element={<ManageProducts />} />
                    <Route path={path.CREATE_PRODUCT} element={<CreateProduct />} />
                    <Route path={path.UPDATE_PRODUCT__PID} element={<UpdateProduct />} />

                    // Manage Blogs
                    <Route path={path.MANAGE_BLOGS} element={<ManageBlog />} />
                    <Route path={path.CREATE_BLOG} element={<CreateBlog />} />
                    <Route path={path.UPDATE_BLOG__BID} element={<UpdateBlog />} />

                    // Manage Suppliers
                    <Route path={path.MANAGE_SUPPLIERS} element={<ManageSuppliers />} />
                    <Route path={path.CREATE_SUPPLIER} element={<CreateSupplier />} />
                    <Route path={path.UPDATE_SUPPLIER__SID} element={<UpdateSupplier />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
