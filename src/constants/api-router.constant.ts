export const ROUTER_CONSTANTS = {
  HOST: 'http://localhost:3001/api',
  LOGIN: 'auth/login',
  VERIFY_OTP: 'auth/verify-otp',
  HOME: '',
  PROFILE: 'customers/profile',
  DASHBOARD: {
    HOME: 'dashboard',
    ORDERS: {
      LIST: 'dashboard/orders',
      CREATE: 'dashboard/orders',
    },
    USERS: {
      LIST: 'dashboard/users',
      CREATE: 'dashboard/users',
      EDIT: 'dashboard/users/edit/:id',
    },
    PRODUCTS: {
      LIST: 'dashboard/products',
      CREATE: 'dashboard/products',
      EDIT: 'dashboard/products',
    },
    CATEGORIES: {
      LIST: 'dashboard/categories',
      CREATE: 'dashboard/categories',
      DETAIL: 'dashboard/categories',
      EDIT: 'dashboard/categories',
    },
    SHOPS: {
      LIST: 'dashboard/shops',
      CREATE: 'dashboard/shops',
      EDIT: 'dashboard/shops',
      DETAIL: 'dashboard/shops',
    },
    DELIVERY_BRANDS: {
      LIST: 'dashboard/delivery-brands',
      CREATE: 'dashboard/delivery-brands',
      EDIT: 'dashboard/delivery-brands',
    },
    SHIPPING: 'dashboard/shipping',
    SHOP: {
      LIST: 'dashboard/shops',
      CREATE: 'dashboard/shops',
      EDIT: 'dashboard/shops',
      DETAIL: 'dashboard/shops',
    },
  },
};
