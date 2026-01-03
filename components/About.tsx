
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="bg-[#EBE7DE]">
      
      {/* Introduction / Story */}
      <div className="py-32 px-6 md:px-12 max-w-[1800px] mx-auto flex flex-col md:flex-row items-start gap-16 md:gap-32">
        <div className="md:w-1/3">
          <h2 className="text-4xl md:text-7xl font-serif text-[#2C2A26] leading-tight">
            Ancient Wisdom, <br/> Earthly Form.
          </h2>
        </div>
        <div className="md:w-2/3 max-w-2xl">
          <p className="text-xl md:text-2xl text-[#5D5A53] font-body leading-relaxed mb-8 italic">
            "Rudraksha is not just a bead; it is a spiritual anchor in an increasingly disconnected world."
          </p>
          <p className="text-lg md:text-xl text-[#5D5A53] font-body leading-relaxed mb-8">
            Raksham was founded with a deep respect for the Vedic tradition and the sacred Elaeocarpus ganitrus tree. We believe that technology can be found in nature—ancient, biological, and perfectly tuned to the human spirit.
          </p>
          <p className="text-lg md:text-xl text-[#5D5A53] font-body leading-relaxed mb-8">
            Each bead we source is tested for its density, Mukhi (facets) count, and energetic integrity. We work directly with Himalayan farmers to ensure ethical harvesting and preservation of these sacred forests.
          </p>
          <img 
            src="https://tse3.mm.bing.net/th/id/OIP.zKcDLDgv5q40fHml4DDdYgHaJQ?w=1080&h=1350&rs=1&pid=ImgDetMain&o=7&rm=3" 
            alt="Sacred Rudraksha Essence" 
            className="w-full h-[500px] object-cover mt-12 shadow-2xl"
          />
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#A8A29E] mt-6">
            Authentic Naural Beads, from the laps of Himalayas
          </p>
        </div>
      </div>

      {/* Philosophy Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
        <div className="order-2 lg:order-1 relative h-[600px] lg:h-auto overflow-hidden group">
           <img 
             src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1200" 
             alt="Vedic Temple Details" 
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
           />
        </div>
        <div className="order-1 lg:order-2 flex flex-col justify-center p-12 lg:p-24 bg-[#D6D1C7]">
           <span className="text-xs font-bold uppercase tracking-[0.4em] text-[#5D5A53] mb-8">Bio-Electromagnetism</span>
           <h3 className="text-4xl md:text-6xl font-serif mb-8 text-[#2C2A26] leading-tight">
             Resonance with the soul.
           </h3>
           <p className="text-xl text-[#5D5A53] font-body leading-relaxed mb-12 max-w-md">
             Rudraksha beads possess unique inductive and capacitive properties. When worn against the skin, they interact with the body's bio-electric field, stabilizing the heart rhythm and focusing the mind.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
        <div className="flex flex-col justify-center p-12 lg:p-24 bg-[#2C2A26] text-[#F5F2EB]">
           <span className="text-xs font-bold uppercase tracking-[0.4em] text-[#A8A29E] mb-8">Authenticity First</span>
           <h3 className="text-4xl md:text-6xl font-serif mb-8 text-[#F5F2EB] leading-tight">
             Vetted by Science, <br/> Blessed by Ritual.
           </h3>
           <p className="text-xl text-[#A8A29E] font-body leading-relaxed mb-12 max-w-md">
             Every bead undergoes an X-ray test to verify the internal seeds and Mukhi structures. Before reaching you, they are purified in a traditional Abhishekam ritual with Himalayan gangajal.
           </p>
        </div>
        <div className="relative h-[600px] lg:h-auto overflow-hidden group">
           <img 
             src="https://static.toiimg.com/photo/67849874/varanasi-ghat.jpg?width=748&resize=4" 
             alt="Sacred purification ritual" 
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
           />
        </div>
      </div>
    </section>
  );
};

export default About;
