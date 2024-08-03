const path = {
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    SIGN_UP: 'signup',
    PRODUCTS: 'products',
    CATEGORIES: 'categories',
    BLOGS: 'blogs',
    OUR_SERVICES: 'services',
    FAQS: 'faqs',
    PRODUCT_DETAILS__CATEGORY__PID__NAME: 'products/:category/:pid/:name',
    VERIFY_EMAIL: 'verify-email',
    FORGOT_PASSWORD: 'forgot-password',
    RESET_PASSWORD__RESET_TOKEN: 'reset-password/:resetToken',

    // Admin
    ADMIN: '/admin',
    DASHBOARD: 'dashboard',
    MANAGE_USERS: 'manage-users',
    MANAGE_ORDERS: 'manage-orders',

    MANAGE_PRODUCTS: 'manage-products',
    CREATE_PRODUCT: 'create-product',
    UPDATE_PRODUCT__PID: 'update-product/:pid',

    MANAGE_BLOGS: 'manage-blogs',
    CREATE_BLOG: 'create-blog',
    UPDATE_BLOG: 'update-blog',

    // Member
    MEMBER: 'member',
    PERSONAL: 'personal',
};

export default path;
