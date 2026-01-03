
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
  onQuickAdd?: (product: Product) => void;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isWishlisted, onToggleWishlist, onQuickAdd, onClick }) => {
  return (
    <div className="group flex flex-col gap-10 cursor-pointer relative" onClick={() => onClick(product)}>
      {/* Premium Visual Container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#EBE7DE] shadow-xl group-hover:shadow-[0_40px_80px_-20px_rgba(44,42,38,0.2)] transition-all duration-1000 ease-out border border-white/40">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-all duration-[2.5s] ease-out group-hover:scale-110 group-hover:brightness-[0.85]"
        />
        
        {/* Wishlist Toggle Button - Floating */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist?.(product.id);
          }}
          className="absolute top-8 right-8 z-20 p-4 bg-white/95 backdrop-blur-xl text-[#2C2A26] opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-6 group-hover:translate-y-0 hover:bg-[#2C2A26] hover:text-white border border-[#D6D1C7]/30 rounded-full shadow-2xl"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className={`w-5 h-5 ${isWishlisted ? 'text-amber-800 group-hover:text-amber-400' : ''}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end p-10 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000">
            <div className="flex flex-col gap-4 w-full transform translate-y-12 group-hover:translate-y-0 transition-all duration-1000">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAdd?.(product);
                  }}
                  className="w-full bg-[#F5F2EB] text-[#2C2A26] py-5 rounded-none text-[10px] uppercase tracking-[0.6em] font-black shadow-2xl hover:bg-[#2C2A26] hover:text-white transition-all border border-[#D6D1C7]/30 backdrop-blur-md"
                >
                    Initiate Connection
                </button>
            </div>
        </div>

        {/* Floating Metadata */}
        <div className="absolute top-8 left-8 z-20 overflow-hidden">
           <span className="inline-block text-[9px] uppercase tracking-[0.4em] bg-black/70 backdrop-blur-xl px-4 py-2 text-[#F5F2EB] font-black border border-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700">
             {product.category}
           </span>
        </div>
      </div>
      
      {/* Product Detail Text */}
      <div className="text-center group-hover:-translate-y-4 transition-all duration-1000 px-6">
        <h3 className="text-2xl md:text-3xl font-serif text-[#2C2A26] mb-3 group-hover:text-amber-950 transition-colors tracking-tight leading-tight">{product.name}</h3>
        <p className="text-[10px] font-black text-[#A8A29E] mb-6 tracking-[0.4em] uppercase opacity-80 italic italic-offset-4">{product.tagline.replace(/[.]$/, '')}</p>
        <div className="inline-flex items-center gap-6">
          <div className="h-[1px] w-12 bg-amber-900/20 group-hover:w-20 transition-all duration-1000"></div>
          <span className="text-2xl font-serif text-[#2C2A26] tracking-[0.1em] font-light">${product.price}</span>
          <div className="h-[1px] w-12 bg-amber-900/20 group-hover:w-20 transition-all duration-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
