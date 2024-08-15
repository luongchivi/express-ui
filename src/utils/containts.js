import path from 'utils/path';
import icons from "utils/icons";


export const navigation = [
    {
        id: 1,
        value: 'HOME',
        path: `/${path.HOME}`,
    },
    {
        id: 2,
        value: 'PRODUCTS',
        path: `/${path.PRODUCTS}`,
    },
    {
        id: 3,
        value: 'CATEGORIES',
        path: `/${path.CATEGORIES}`,
    },
    {
        id: 4,
        value: 'BLOGS',
        path: `/${path.BLOGS}`,
    },
    {
        id: 5,
        value: 'OUR SERVICES',
        path: `/${path.OUR_SERVICES}`,
    },
    {
        id: 6,
        value: 'FAQS',
        path: `/${path.FAQS}`,
    }
];

const {
    FaShieldAlt,
    FaTruck,
    FaGift,
    FaReply,
    FaTty,
} = icons;

export const productExtraInfo = [
    {
        id: 1,
        title: 'guarantee',
        sub: 'Quality checked',
        icon: <FaShieldAlt/>
    }, ,
    {
        id: 2,
        title: 'Free Shipping',
        sub: 'Free on all products',
        icon: <FaTruck/>
    },
    {
        id: 3,
        title: 'Special gift cards',
        sub: 'Special gift cards',
        icon: <FaGift/>
    },
    {
        id: 4,
        title: 'Free return',
        sub: 'Within 7 days',
        icon: <FaReply/>
    }
    ,
    {
        id: 5,
        title: 'Consultancy',
        sub: 'Lifetime 24/7/356',
        icon: <FaTty/>
    }
];

export const productDescriptionTabs = [
    {
        id: 1,
        title: 'DESCRIPTION',
        content: `
        It's been a while since we met the last of the Mi kind. Even though the Xiaomi Mi 4 went on sale back in the summer of 2014, it succeeded in staying relevant for over 20 months and surpassed the lifespan of many competitors. Xiaomi surely took the time to make the Mi 5 worthy of the flagship series name.
The Mi 5 was the first Xiaomi phone to be unveiled under the massive spotlight of the world's biggest mobile expo - the MWC in Barcelona. And with its stunning looks and capable performance, the Mi 5 deserved nothing less.
The Xiaomi Mi 5 is instantly likeable - the new flagship comes with unbelievably thin bezels, a sharp profile, a curved back and a lightweight body - all adding to one of the most impressive exteriors a modern smartphones can hope for.
Then you learn that inside there is the latest Snapdragon 820 chipset, a new 16MP camera with 4-axis optical stabilization and yet no camera hump, generous storage options, rich connectivity options, and a beefy battery. How about that?`,
    },
    {
        id: 2,
        title: 'WARRANTY',
        content: `
        LIMITED WARRANTIES
Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:
Frames Used In Upholstered and Leather Products
Limited Lifetime Warranty
A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers. Ashley Furniture Industries,Inc. warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.`,
    },
    {
        id: 3,
        title: 'DELIVERY',
        content: `
        Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
Picking up at the store
Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
Delivery
Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`,
    },
    {
        id: 4,
        title: 'PAYMENT',
        content: `
        We offer a variety of payment methods to make your shopping experience as convenient as possible. You can choose from the following payment options:
1. **Credit/Debit Card:** We accept Visa, MasterCard, American Express, and Discover cards. Your card will be charged when your order is placed.
2. **PayPal:** You can use your PayPal account to complete your purchase quickly and securely.
3. **Bank Transfer:** For large orders, you may opt to pay via bank transfer. Please contact our customer service for bank details and instructions.
4. **Cash on Delivery (COD):** Available for select locations. Pay with cash when your order is delivered.
5. **Gift Cards:** Redeem your gift card by entering the gift card code at checkout. If the gift card balance is less than the order total, you can pay the remaining amount using another payment method.
6. **Installment Plans:** We offer flexible installment plans for eligible purchases. Choose the installment option at checkout and select the duration that suits you best.
For any questions or assistance with payment, please contact our customer service team.`,
    },
];

export const ratings = [1, 2, 3, 4, 5];

export const sortBy = [
    {
        id: 1,
        title: 'Featured',
        value: {
            sortBy: 'id',
            sortOrder: 'desc',
        }
    },
    {
        id: 2,
        title: 'Best Selling',
        value: {
            sortBy: 'unitsSold',
            sortOrder: 'desc',
        }
    },
    {
        id: 3,
        title: 'Alphabetically, A-Z',
        value: {
            sortBy: 'name',
            sortOrder: 'asc',
        }
    },
    {
        id: 4,
        title: 'Alphabetically, Z-A',
        value: {
            sortBy: 'name',
            sortOrder: 'desc',
        }
    },
    {
        id: 5,
        title: 'Price, low to high',
        value: {
            sortBy: 'unitPrice',
            sortOrder: 'asc',
        }
    },
    {
        id: 6,
        title: 'Price, high to low',
        value: {
            sortBy: 'unitPrice',
            sortOrder: 'desc',
        }
    },
    {
        id: 7,
        title: 'Date, old to new',
        value: {
            sortBy: 'createdAt',
            sortOrder: 'asc',
        }
    },
    {
        id: 8,
        title: 'Date, new to old',
        value: {
            sortBy: 'createdAt',
            sortOrder: 'desc',
        }
    },
];

export const feedbackScore = [
    {
        id: 1,
        text: 'Bad'
    },
    {
        id: 2,
        text: 'Poor'
    },
    {
        id: 3,
        text: 'Normal'
    },
    {
        id: 4,
        text: 'Good'
    },
    {
        id: 5,
        text: 'Perfect'
    }
];

const {
    AiOutlineDashboard,
    MdGroups,
    AiFillProduct,
    TiShoppingCart,
    FaBloggerB,
    TbBuildingWarehouse,
    IoMdSettings,
    FaHeart,
    MdHistory,
} = icons;

export const adminSidebar = [
    {
        id: 1,
        type: 'SINGLE',
        text: 'Dashboard',
        path: `${path.ADMIN}/${path.DASHBOARD}`,
        icon: <AiOutlineDashboard/>
    },
    {
        id: 2,
        type: 'PARENT',
        text: 'Manage Users',
        submenu: [
            {
                text: 'Manage Users',
                path: `${path.ADMIN}/${path.MANAGE_USERS}`,
            },
            {
                text: 'Create Users',
                path: `${path.ADMIN}/${path.CREATE_USER}`,
            },
        ],
        icon: <MdGroups/>
    },
    {
        id: 3,
        type: 'PARENT',
        text: 'Manage Products',
        submenu: [
            {
                text: 'Manage Products',
                path: `${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
            },
            {
                text: 'Create Product',
                path: `${path.ADMIN}/${path.CREATE_PRODUCT}`,
            },
        ],
        icon: <AiFillProduct/>
    },
    {
        id: 4,
        type: 'SINGLE',
        text: 'Manage Orders',
        path: `${path.ADMIN}/${path.MANAGE_ORDERS}`,
        icon: <TiShoppingCart/>
    },
    {
        id: 5,
        type: 'PARENT',
        text: 'Manage Blogs',
        submenu: [
            {
                text: 'Manage Blogs',
                path: `${path.ADMIN}/${path.MANAGE_BLOGS}`,
            },
            {
                text: 'Create Blog',
                path: `${path.ADMIN}/${path.CREATE_BLOG}`,
            },
        ],
        icon: <FaBloggerB/>
    },
    {
        id: 6,
        type: 'PARENT',
        text: 'Manage Supplier',
        submenu: [
            {
                text: 'Manage Supplier',
                path: `${path.ADMIN}/${path.MANAGE_SUPPLIERS}`,
            },
            {
                text: 'Create Supplier',
                path: `${path.ADMIN}/${path.CREATE_SUPPLIER}`,
            },
        ],
        icon: <TbBuildingWarehouse/>
    },
];

export const personalSidebar = [
    {
        id: 1,
        type: 'SINGLE',
        text: 'User info',
        path: `/${path.MEMBER}/${path.PERSONAL}`,
        icon: <IoMdSettings/>
    },
    {
        id: 2,
        type: 'SINGLE',
        text: 'Cart',
        path: `/${path.MEMBER}/${path.CART}`,
        icon: <TiShoppingCart/>
    },
    {
        id: 3,
        type: 'SINGLE',
        text: 'Wishlist',
        path: `${path.ADMIN}/${path.DASHBOARD}`,
        icon: <FaHeart/>
    },
    {
        id: 4,
        type: 'SINGLE',
        text: 'History buy',
        path: `/${path.MEMBER}/${path.HISTORY_ORDER}`,
        icon: <MdHistory/>
    },
];