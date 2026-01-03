
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useCallback } from 'react';
import { Banner } from '../types';

interface BannerSliderProps {
  banners: Banner[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeBanners = banners.filter(b => b.active);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === activeBanners.length - 1 ? 0 : prev + 1));
  }, [activeBanners.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, activeBanners.length]);

  if (activeBanners.length === 0) return null;

  return (
    <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden bg-[#2C2A26] group">
      {activeBanners.map((banner, index) => (
        <div 
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img 
            src={banner.imageUrl} 
            alt={banner.title || 'Banner'} 
            className="w-full h-full object-cover"
          />
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
            <h2 className="text-3xl md:text-5xl font-serif text-[#F5F2EB] mb-4 transform translate-y-4 animate-fade-in-up">
              {banner.title}
            </h2>
            <p className="text-lg md:text-2xl text-[#D6D1C7] italic font-body mb-8 animate-fade-in-up delay-200">
              {banner.subtitle}
            </p>
            {banner.link && (
              <a 
                href={banner.link}
                className="px-8 py-3 bg-[#F5F2EB] text-[#2C2A26] text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-amber-100 transition-all shadow-xl animate-fade-in-up delay-400"
              >
                Explore
              </a>
            )}
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      {activeBanners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 border border-white/20 bg-black/10 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-[#2C2A26]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 border border-white/20 bg-black/10 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-[#2C2A26]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            {activeBanners.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-8' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerSlider;
