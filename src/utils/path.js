const path = {
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    SIGN_UP: 'signup',
    PRODUCTS: 'products',
    CATEGORIES: 'categories',
    BLOGS: 'blogs',
    BLOGS__BID__TITLE: 'blogs/:bid/:title',
    OUR_SERVICES: 'services',
    FAQS: 'faqs',
    PRODUCT_DETAILS__CATEGORY__PID__NAME: 'products/:category/:pid/:name',
    VERIFY_EMAIL: 'verify-email',
    FORGOT_PASSWORD: 'forgot-password',
    RESET_PASSWORD__RESET_TOKEN: 'reset-password/:resetToken',

    // Admin
    ADMIN: '/admin',
    DASHBOARD: 'dashboard',
    MANAGE_ORDERS: 'manage-orders',

    MANAGE_USERS: 'manage-users',
    UPDATE_USER: 'update-user',
    CREATE_USER: 'create-user',

    MANAGE_PRODUCTS: 'manage-products',
    CREATE_PRODUCT: 'create-product',
    UPDATE_PRODUCT__PID: 'update-product/:pid',

    MANAGE_SUPPLIERS: 'manage-suppliers',
    CREATE_SUPPLIER: 'create-supplier',
    UPDATE_SUPPLIER__SID: 'update-supplier/:supplierId',

    MANAGE_BLOGS: 'manage-blogs',
    CREATE_BLOG: 'create-blog',
    UPDATE_BLOG__BID: 'update-blog/:blogId',

    // Member
    MEMBER: 'member',
    PERSONAL: 'personal',
    CART: 'cart',
};

export default path;
