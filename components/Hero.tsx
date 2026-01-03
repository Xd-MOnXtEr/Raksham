
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';

const Hero: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      try {
        window.history.pushState(null, '', `#${targetId}`);
      } catch (err) {}
    }
  };

  return (
    <section className="relative w-full h-[95vh] min-h-[700px] overflow-hidden bg-[#2C2A26]">
      <div className="absolute inset-0 w-full h-full">
        <img 
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=2000" 
            alt="Majestic Himalayas" 
            className="w-full h-full object-cover grayscale contrast-[0.8] brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-amber-900/30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F5F2EB]/40"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
        <div className="animate-fade-in-up">
          <span className="block text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-white/90 mb-8 border border-white/20 px-8 py-3 rounded-none bg-black/10 backdrop-blur-sm">
            Himalayan Heritage Sourcing
          </span>
          <h1 className="text-7xl md:text-9xl font-serif font-bold text-white tracking-tight mb-8">
            Raksham<span className="italic font-light text-amber-100">.</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg md:text-xl text-white/90 font-body leading-relaxed mb-12 italic">
            Authentic Rudraksha beads for modern equilibrium, hand-picked for their spiritual resonance and biological purity.
          </p>
          
          <div className="flex justify-center">
            <a 
                href="#products" 
                onClick={(e) => handleNavClick(e, 'products')}
                className="px-16 py-5 bg-white text-[#2C2A26] text-xs font-bold uppercase tracking-[0.4em] hover:bg-amber-50 transition-all duration-500 shadow-2xl border border-white"
            >
                View Collection
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/40">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-white/40"></div>
        <span className="text-[9px] uppercase tracking-[0.4em]">Descend</span>
      </div>
    </section>
  );
};

export default Hero;
