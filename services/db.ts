
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Product, Order, Review, User, Banner } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../constants';

const PRODUCTS_KEY = 'raksham_products_v1';
const ORDERS_KEY = 'raksham_orders_v1';
const WISHLIST_KEY = 'raksham_wishlist_v1';
const USERS_KEY = 'raksham_users_v1';
const BANNERS_KEY = 'raksham_banners_v1';
const CURRENT_USER_KEY = 'raksham_current_user_v1';

const INITIAL_BANNERS: Banner[] = [
  {
    id: 'b1',
    imageUrl: 'https://images.unsplash.com/photo-1603204000325-300451a94017?q=80&w=2000&auto=format&fit=crop',
    title: 'Rudraksh Utsav',
    subtitle: 'Celebrating Divine Peace & Prosperity',
    link: '#products',
    active: true
  },
  {
    id: 'b2',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=2000',
    title: 'Himalayan Collection',
    subtitle: 'Direct from the sacred mountains',
    link: '#about',
    active: true
  }
];

export const db = {
  // User Operations
  getUsers: (): User[] => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  addUser: (email: string, name: string): User => {
    const users = db.getUsers();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      verified: false,
      role: 'customer'
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  },

  verifyUser: (email: string) => {
    const users = db.getUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      user.verified = true;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return user;
    }
    return null;
  },

  // Banner Operations
  getBanners: (): Banner[] => {
    const stored = localStorage.getItem(BANNERS_KEY);
    if (!stored) {
      localStorage.setItem(BANNERS_KEY, JSON.stringify(INITIAL_BANNERS));
      return INITIAL_BANNERS;
    }
    return JSON.parse(stored);
  },

  saveBanner: (banner: Banner) => {
    const banners = db.getBanners();
    const index = banners.findIndex(b => b.id === banner.id);
    if (index >= 0) {
      banners[index] = banner;
    } else {
      banners.push(banner);
    }
    localStorage.setItem(BANNERS_KEY, JSON.stringify(banners));
  },

  deleteBanner: (id: string) => {
    const banners = db.getBanners().filter(b => b.id !== id);
    localStorage.setItem(BANNERS_KEY, JSON.stringify(banners));
  },

  // Product Operations
  getProducts: (): Product[] => {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (!stored) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(stored);
  },

  saveProduct: (product: Product) => {
    const products = db.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  deleteProduct: (id: string) => {
    const products = db.getProducts().filter(p => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  addReview: (productId: string, review: Review) => {
    const products = db.getProducts();
    const product = products.find(p => p.id === productId);
    if (product) {
      if (!product.reviews) product.reviews = [];
      product.reviews.unshift(review);
      db.saveProduct(product);
      return product;
    }
    return null;
  },

  // Order Operations
  getOrders: (): Order[] => {
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  createOrder: (order: Order) => {
    const orders = db.getOrders();
    orders.unshift(order); 
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return order;
  },

  updateOrderStatus: (orderId: string, status: Order['status']) => {
    const orders = db.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index >= 0) {
      orders[index].status = status;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  },

  // Wishlist Operations
  getWishlist: (): string[] => {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveWishlist: (ids: string[]) => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  }
};
