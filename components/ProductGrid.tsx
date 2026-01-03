
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

const categories = ['All', 'Audio', 'Wearable', 'Mobile', 'Home'];
const INITIAL_BATCH_SIZE = 6;
const BATCH_LOAD_SIZE = 3;

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products,
  onProductClick, 
  onAddToCart,
  wishlistIds = [], 
  onToggleWishlist 
}) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const loaderRef = useRef<HTMLDivElement>(null);

  const processedProducts = useMemo(() => {
    let result = [...products];
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.tagline.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }
    return result;
  }, [products, activeCategory, searchTerm]);

  // Reset scroll when filters change
  useEffect(() => {
    setVisibleCount(INITIAL_BATCH_SIZE);
  }, [activeCategory, searchTerm]);

  const visibleProducts = useMemo(() => {
    return processedProducts.slice(0, visibleCount);
  }, [processedProducts, visibleCount]);

  const hasMore = visibleCount < processedProducts.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore]);

  const loadMore = () => {
    setIsLoadingMore(true);
    // Simulate spiritual manifestation time
    setTimeout(() => {
      setVisibleCount(prev => prev + BATCH_LOAD_SIZE);
      setIsLoadingMore(false);
    }, 800);
  };

  return (
    <section id="products" className="py-40 px-6 md:px-12 bg-[#F5F2EB]">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Collection Header */}
        <div className="flex flex-col items-center text-center mb-32 space-y-12">
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.5em] text-amber-900 font-bold opacity-80 animate-pulse">Sacred Artifacts</span>
            <h2 className="text-5xl md:text-8xl font-serif text-[#2C2A26] tracking-tight">The Collection</h2>
            <div className="w-32 h-[1px] bg-amber-900/30 mx-auto"></div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-32 border-b border-[#D6D1C7]/30 pb-16">
           <div className="flex flex-wrap justify-center gap-10">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[10px] uppercase tracking-[0.4em] font-bold transition-all border-b-2 pb-2 ${
                    activeCategory === cat ? 'text-[#2C2A26] border-amber-900' : 'text-[#A8A29E] border-transparent hover:text-[#2C2A26]'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
           
           <div className="relative w-full max-w-sm">
              <input 
                type="text" 
                placeholder="Search Archive..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-b border-[#D6D1C7] py-3 text-[10px] uppercase tracking-widest font-bold placeholder-[#A8A29E] outline-none focus:border-[#2C2A26] transition-all"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute right-0 top-3 text-[#A8A29E]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
           </div>
        </div>

        {/* Product Card Grid */}
        {visibleProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
              {visibleProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onQuickAdd={onAddToCart}
                  onClick={onProductClick} 
                />
              ))}
            </div>
            
            {/* Infinite Scroll Sentinel */}
            <div ref={loaderRef} className="w-full py-40 flex flex-col items-center justify-center">
              {isLoadingMore && (
                <div className="flex flex-col items-center gap-6 animate-fade-in-up">
                  <div className="w-12 h-12 border-2 border-amber-900/20 border-t-amber-900 rounded-full animate-spin"></div>
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-amber-900">Manifesting Artifacts...</span>
                </div>
              )}
              {!hasMore && processedProducts.length > INITIAL_BATCH_SIZE && (
                <div className="text-center opacity-40">
                  <div className="w-12 h-[1px] bg-amber-900/30 mx-auto mb-6"></div>
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#2C2A26]">The descent is complete.</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-60 text-center animate-fade-in-up">
            <h3 className="text-3xl font-serif text-[#A8A29E] italic mb-8">"Silence remains where paths are obscured."</h3>
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#5D5A53]">No beads matching your resonance were found.</p>
            <button 
              onClick={() => {setSearchTerm(''); setActiveCategory('All');}}
              className="mt-16 text-[10px] uppercase tracking-[0.5em] font-bold border border-[#2C2A26] px-16 py-5 hover:bg-[#2C2A26] hover:text-[#F5F2EB] transition-all shadow-xl"
            >
              Reset Archive
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
