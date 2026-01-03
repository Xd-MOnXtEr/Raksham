
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface WishlistProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onProductClick: (product: Product) => void;
  onBack: () => void;
}

const Wishlist: React.FC<WishlistProps> = ({ products, wishlistIds, onToggleWishlist, onProductClick, onBack }) => {
  const wishlistedProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="pt-24 min-h-screen bg-[#F5F2EB] animate-fade-in-up">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 pb-24">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 pb-8 border-b border-[#D6D1C7]">
          <div>
            <button 
              onClick={onBack}
              className="group flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#A8A29E] hover:text-[#2C2A26] transition-colors mb-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Return to Store
            </button>
            <h1 className="text-4xl md:text-6xl font-serif text-[#2C2A26]">Sacred Wishlist</h1>
            <p className="text-[#A8A29E] text-sm uppercase tracking-widest mt-4">
              {wishlistedProducts.length} Beads Awaiting Your Connection
            </p>
          </div>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-20 h-20 border border-[#D6D1C7] rounded-full flex items-center justify-center mx-auto mb-8 opacity-40">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <p className="text-xl font-body italic text-[#5D5A53] mb-8">
              "Your spiritual resonance has not yet chosen its vessels."
            </p>
            <button 
              onClick={onBack}
              className="px-12 py-4 bg-[#2C2A26] text-white text-xs uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
              Explore the Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
            {wishlistedProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isWishlisted={true}
                onToggleWishlist={onToggleWishlist}
                onClick={onProductClick} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
