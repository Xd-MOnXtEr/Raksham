
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState } from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, isWishlisted, onToggleWishlist, onBack, onAddToCart }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const allImages = [product.imageUrl, ...(product.gallery || [])].filter(Boolean);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="pt-40 min-h-screen bg-[#F5F2EB] animate-fade-in-up">
      <div className="max-w-[1700px] mx-auto px-6 md:px-16 pb-48">
        
        {/* Back Navigation */}
        <button 
          onClick={onBack}
          className="group flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-[#A8A29E] hover:text-[#2C2A26] transition-all mb-24 border-b border-transparent hover:border-[#2C2A26] pb-2 w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 group-hover:-translate-x-2 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Return to Archive
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32">
          
          {/* Visual Side (Left) */}
          <div className="lg:col-span-7 flex flex-col gap-16">
            <div className="w-full aspect-[3/4] md:aspect-[4/5] bg-[#EBE7DE] overflow-hidden shadow-[0_60px_100px_-20px_rgba(44,42,38,0.25)] relative group/slider border border-white/30 rounded-2xl">
              <div className="w-full h-full relative">
                {allImages.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${idx === activeImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} perspective ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {allImages.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-10 pointer-events-none">
                  <button onClick={handlePrevImage} className="pointer-events-auto w-16 h-16 bg-white/95 backdrop-blur-2xl flex items-center justify-center border border-[#D6D1C7]/30 hover:bg-[#2C2A26] hover:text-white transition-all transform hover:scale-110 shadow-2xl rounded-full">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
                  </button>
                  <button onClick={handleNextImage} className="pointer-events-auto w-16 h-16 bg-white/95 backdrop-blur-2xl flex items-center justify-center border border-[#D6D1C7]/30 hover:bg-[#2C2A26] hover:text-white transition-all transform hover:scale-110 shadow-2xl rounded-full">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
                  </button>
                </div>
              )}
              
              {/* Pagination Indicators */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
                {allImages.map((_, idx) => (
                  <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`w-2 h-2 rounded-full transition-all duration-700 ${idx === activeImageIndex ? 'bg-[#2C2A26] w-12' : 'bg-[#2C2A26]/20 hover:bg-[#2C2A26]/40'}`}></button>
                ))}
              </div>
            </div>

            {/* Supplementary Metadata Blocks */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Sanctuary', value: product.origin || 'Highlands' },
                { label: 'Facets', value: `${product.mukhi || 'Sacred'} Mukhi` },
                { label: 'Celestial', value: product.planetaryRuler || 'Shiva' },
                { label: 'Resonance', value: product.vibration || 'High' }
              ].map((item, idx) => (
                <div key={idx} className="p-8 border border-[#D6D1C7]/40 bg-white/50 backdrop-blur-sm shadow-sm flex flex-col justify-center rounded-2xl hover:bg-white transition-colors duration-500 group">
                   <span className="block text-[9px] uppercase tracking-[0.4em] text-[#A8A29E] mb-3 font-black group-hover:text-amber-900 transition-colors">{item.label}</span>
                   <span className="font-serif text-lg text-[#2C2A26] tracking-tight">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Narrative Side (Right) */}
          <div className="lg:col-span-5 flex flex-col pt-8 lg:sticky lg:top-40 h-fit">
             <div className="flex justify-between items-start mb-12">
               <span className="text-[11px] font-black text-amber-950 uppercase tracking-[0.6em] border-b-4 border-amber-900 pb-4">{product.category}</span>
               <button onClick={onToggleWishlist} className="p-5 bg-white border border-[#D6D1C7]/40 rounded-full hover:bg-[#2C2A26] hover:text-white transition-all transform hover:rotate-[15deg] shadow-xl group">
                 <svg fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" className={`w-7 h-7 transition-colors ${isWishlisted ? 'text-amber-100' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
               </button>
             </div>
             
             <h1 className="text-7xl xl:text-9xl font-serif text-[#2C2A26] mb-10 leading-[0.85] tracking-tighter">{product.name}</h1>
             <p className="text-3xl font-serif italic text-amber-950/70 mb-16 tracking-tight leading-relaxed max-w-lg">"{product.tagline.replace(/[.]$/, '')}"</p>
             
             <div className="flex items-baseline gap-6 mb-24">
               <span className="text-7xl font-serif text-[#2C2A26] tracking-tight">${product.price}</span>
               <span className="text-[10px] uppercase tracking-[0.5em] text-[#A8A29E] font-black italic">Resonant Value</span>
             </div>
             
             <div className="space-y-16 mb-24 border-t border-[#D6D1C7]/60 pt-20">
               <div className="space-y-8">
                  <h3 className="text-[11px] uppercase tracking-[0.6em] font-black text-[#2C2A26]">Sacred Archive Narrative</h3>
                  <p className="text-[#5D5A53] leading-loose font-body text-2xl italic opacity-95 first-letter:text-6xl first-letter:font-serif first-letter:mr-4 first-letter:float-left">{product.description}</p>
               </div>

               {product.specificMantra && (
                 <div className="p-12 bg-[#2C2A26] text-[#F5F2EB] shadow-[0_40px_80px_-15px_rgba(44,42,38,0.4)] relative overflow-hidden group rounded-3xl">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-[2.5] transition-transform duration-[5s] text-9xl">ॐ</div>
                    <span className="block text-[10px] uppercase tracking-[0.5em] text-white/40 mb-6 font-black">Spiritual Alignment Mantra</span>
                    <p className="text-3xl font-serif tracking-widest leading-relaxed text-amber-100">"{product.specificMantra}"</p>
                 </div>
               )}

               <div className="space-y-8">
                  <h3 className="text-[11px] uppercase tracking-[0.6em] font-black text-[#2C2A26]">Divine Projections</h3>
                  <div className="flex flex-wrap gap-5">
                    {product.features.map((feature, idx) => (
                      <span key={idx} className="px-8 py-4 border border-[#D6D1C7]/50 text-[10px] uppercase tracking-[0.4em] font-black text-[#5D5A53] bg-white rounded-full hover:border-[#2C2A26] transition-all shadow-sm hover:shadow-md cursor-default">{feature}</span>
                    ))}
                  </div>
               </div>
             </div>

             <button 
               onClick={() => onAddToCart(product)}
               className="w-full py-12 bg-[#2C2A26] text-[#F5F2EB] uppercase tracking-[0.8em] text-xs font-black hover:bg-amber-950 transition-all shadow-[0_30px_60px_-12px_rgba(44,42,38,0.5)] relative overflow-hidden group rounded-2xl"
             >
               <span className="relative z-10">Initiate Connection</span>
               <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"></div>
             </button>
             
             <p className="mt-12 text-[10px] uppercase tracking-[0.4em] text-[#A8A29E] text-center font-bold">Lab Certified • Authentic Himalayan Harvest • Spiritual Integrity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
