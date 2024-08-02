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
    MANAGE_PRODUCTS: 'manage-products',
    MANAGE_ORDERS: 'manage-orders',
    CREATE_PRODUCT: 'create-product',

    // Member
    MEMBER: 'member',
    PERSONAL: 'personal',
};

export default path;
