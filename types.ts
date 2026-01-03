
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  role: 'customer' | 'admin';
}

export interface Banner {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  link?: string;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  price: number;
  category: 'Audio' | 'Wearable' | 'Mobile' | 'Home';
  imageUrl: string;
  gallery?: string[];
  features: string[];
  mukhi?: number | string;
  origin?: string;
  size?: string;
  vibration?: string;
  certification?: string;
  stock?: number;
  reviews?: Review[];
  material?: string;
  weight?: string;
  planetaryRuler?: string;
  specificMantra?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: Product[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  paymentMethod: 'Razorpay' | 'PayPal';
  date: string;
  estimatedDelivery: string;
}

export interface JournalArticle {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  content: React.ReactNode;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'product', product: Product }
  | { type: 'journal', article: JournalArticle }
  | { type: 'checkout' }
  | { type: 'admin' }
  | { type: 'wishlist' }
  | { type: 'account' }
  | { type: 'auth', mode: 'login' | 'signup' }
  | { type: 'verify', email: string, purpose: 'signup' | 'change_email' };
