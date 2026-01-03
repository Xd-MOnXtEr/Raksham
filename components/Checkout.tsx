
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo } from 'react';
import { Product, Order } from '../types';
import { db } from '../services/db';

interface CheckoutProps {
  items: Product[];
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'PayPal'>('Razorpay');
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  });
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // Value in $
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<Order | null>(null);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items]);
  
  // Dynamic shipping cost based on country (Mock logic)
  const shippingCost = useMemo(() => {
    return formData.country.toLowerCase() === 'india' ? 0 : 45;
  }, [formData.country]);

  const total = subtotal + shippingCost - appliedDiscount;

  // Mock delivery estimation
  const deliveryEstimate = useMemo(() => {
    const today = new Date();
    const minDays = formData.country.toLowerCase() === 'india' ? 3 : 7;
    const maxDays = formData.country.toLowerCase() === 'india' ? 5 : 12;
    
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);

    return `${minDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${maxDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }, [formData.country]);

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'OM10') {
      setAppliedDiscount(Math.floor(subtotal * 0.1));
      alert("Divine blessing applied: 10% discount enabled.");
    } else if (promoCode.toUpperCase() === 'FIRST') {
      setAppliedDiscount(25);
      alert("Seeker's welcome applied: $25 discount enabled.");
    } else {
      alert("This mantra (code) does not resonate with our records.");
      setAppliedDiscount(0);
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address || !formData.city) {
      alert("Please complete the destination details.");
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      const newOrder: Order = {
        id: `RAK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        customerName: formData.name,
        customerEmail: formData.email,
        shippingAddress: {
          line1: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country
        },
        items: [...items],
        subtotal: subtotal,
        discount: appliedDiscount,
        shippingCost: shippingCost,
        total: total,
        status: 'pending',
        paymentMethod: paymentMethod,
        date: new Date().toISOString(),
        estimatedDelivery: deliveryEstimate
      };

      db.createOrder(newOrder);
      setOrderComplete(newOrder);
      setIsProcessing(false);
    }, 2500);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F2EB] px-6 text-center py-20">
        <div className="max-w-xl animate-fade-in-up">
          <div className="w-20 h-20 bg-[#2C2A26] text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-4xl font-serif text-[#2C2A26] mb-4">Sacred Order Received</h1>
          <p className="text-[#5D5A53] mb-8 font-body text-lg">
            An order confirmation has been sent to <span className="font-bold">{orderComplete.customerEmail}</span>. 
            The seeds are being prepared at high altitudes for their journey to <span className="italic">{orderComplete.shippingAddress.city}</span>.
          </p>
          <div className="bg-white border border-[#D6D1C7] p-8 text-left mb-8 shadow-lg">
             <div className="flex justify-between mb-4 border-b border-[#F5F2EB] pb-2">
                <span className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-bold">Order ID</span>
                <span className="font-mono text-sm">{orderComplete.id}</span>
             </div>
             <div className="flex justify-between mb-4 border-b border-[#F5F2EB] pb-2">
                <span className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-bold">Estimated Arrival</span>
                <span className="font-serif text-sm font-bold text-amber-900">{orderComplete.estimatedDelivery}</span>
             </div>
             <div className="flex justify-between font-serif text-xl pt-2 border-t border-[#F5F2EB]">
                <span>Total Circulation</span>
                <span>${orderComplete.total}</span>
             </div>
          </div>
          <button 
            onClick={onBack}
            className="px-16 py-5 bg-[#2C2A26] text-white text-[10px] uppercase tracking-[0.4em] font-bold shadow-xl hover:bg-amber-950 transition-all"
          >
            Return to Sanctuary
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 bg-[#F5F2EB] animate-fade-in-up font-sans">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#A8A29E] hover:text-[#2C2A26] transition-colors mb-12"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Archive
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <h1 className="text-5xl font-serif text-[#2C2A26] mb-12">Checkout Initiation</h1>
            
            <form onSubmit={handlePayment} className="space-y-16">
              {/* Contact Information */}
              <div>
                <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-[#2C2A26] mb-8 border-b border-[#D6D1C7] pb-2">Primary Identity</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="relative group">
                     <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-transparent border-b border-[#D6D1C7] py-4 text-[#2C2A26] placeholder-transparent outline-none focus:border-[#2C2A26] transition-colors peer" 
                      id="name" placeholder="Name"
                     />
                     <label htmlFor="name" className="absolute left-0 top-4 text-[#A8A29E] text-[10px] uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-[#2C2A26] peer-[:not(:placeholder-shown)]:-top-2">Full Name</label>
                   </div>
                   <div className="relative group">
                     <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-transparent border-b border-[#D6D1C7] py-4 text-[#2C2A26] placeholder-transparent outline-none focus:border-[#2C2A26] transition-colors peer" 
                      id="email" placeholder="Email"
                     />
                     <label htmlFor="email" className="absolute left-0 top-4 text-[#A8A29E] text-[10px] uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-[#2C2A26] peer-[:not(:placeholder-shown)]:-top-2">Sacred Email</label>
                   </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-[#2C2A26] mb-8 border-b border-[#D6D1C7] pb-2">Destination Anchor</h2>
                <div className="space-y-8">
                  <div className="relative group">
                    <input 
                      type="text" 
                      required
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="w-full bg-transparent border-b border-[#D6D1C7] py-4 text-[#2C2A26] placeholder-transparent outline-none focus:border-[#2C2A26] transition-colors peer" 
                      id="address" placeholder="Address"
                    />
                    <label htmlFor="address" className="absolute left-0 top-4 text-[#A8A29E] text-[10px] uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-[#2C2A26] peer-[:not(:placeholder-shown)]:-top-2">Street Address</label>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="relative group">
                      <input 
                        type="text" 
                        required
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                        className="w-full bg-transparent border-b border-[#D6D1C7] py-4 text-[#2C2A26] placeholder-transparent outline-none focus:border-[#2C2A26] transition-colors peer" 
                        id="city" placeholder="City"
                      />
                      <label htmlFor="city" className="absolute left-0 top-4 text-[#A8A29E] text-[10px] uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-[#2C2A26] peer-[:not(:placeholder-shown)]:-top-2">City</label>
                    </div>
                    <div className="relative group">
                      <input 
                        type="text" 
                        required
                        value={formData.state}
                        onChange={e => setFormData({...formData, state: e.target.value})}
                        className="w-full bg-transparent border-b border-[#D6D1C7] py-4 text-[#2C2A26] placeholder-transparent outline-none focus:border-[#2C2A26] transition-colors peer" 
                        id="state" placeholder="State"
                      />
                      <label htmlFor="state" className="absolute left-0 top-4 text-[#A8A29E] text-[10px] uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-[#2C2A26] peer-[:not(:placeholder-shown)]:-top-2">State / Province</label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="relative group">
                      <input 
                        type="text" 
                        required
                        value={formData.zip}
                        onChange={e => setFormData({...formData, zip: e.target.value})}
                        className="w-full bg-transparent border-b border-[#D6D1C7] py-4 text-[#2C2A26] placeholder-transparent outline-none focus:border-[#2C2A26] transition-colors peer" 
                        id="zip" placeholder="Zip"
                      />
                      <label htmlFor="zip" className="absolute left-0 top-4 text-[#A8A29E] text-[10px] uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-[#2C2A26] peer-[:not(:placeholder-shown)]:-top-2">Postal Code</label>
                    </div>
                    <div className="relative group">
                      <select 
                        value={formData.country}
                        onChange={e => setFormData({...formData, country: e.target.value})}
                        className="w-full bg-transparent border-b border-[#D6D1C7] py-4 text-[#2C2A26] outline-none focus:border-[#2C2A26] transition-colors text-[10px] font-bold uppercase tracking-widest cursor-pointer"
                      >
                        <option value="India">India</option>
                        <option value="Nepal">Nepal</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                      </select>
                      <label className="absolute left-0 -top-2 text-[#A8A29E] text-[10px] uppercase tracking-widest">Region</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-[#2C2A26] mb-8 border-b border-[#D6D1C7] pb-2">Sacred Transaction Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('Razorpay')}
                    className={`p-8 border flex flex-col items-center gap-4 transition-all duration-500 shadow-sm ${paymentMethod === 'Razorpay' ? 'border-[#2C2A26] bg-white ring-1 ring-[#2C2A26] scale-[1.02] shadow-xl' : 'border-[#D6D1C7] opacity-40 hover:opacity-100'}`}
                  >
                    <div className="text-blue-600 font-bold text-2xl tracking-tighter italic">Razorpay</div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">UPI • Cards • NetBanking</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('PayPal')}
                    className={`p-8 border flex flex-col items-center gap-4 transition-all duration-500 shadow-sm ${paymentMethod === 'PayPal' ? 'border-[#2C2A26] bg-white ring-1 ring-[#2C2A26] scale-[1.02] shadow-xl' : 'border-[#D6D1C7] opacity-40 hover:opacity-100'}`}
                  >
                    <div className="text-blue-900 font-bold text-2xl tracking-tighter italic">PayPal</div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">International Seeker</span>
                  </button>
                </div>
              </div>

              <div className="pt-12">
                <button 
                  type="submit"
                  disabled={isProcessing || items.length === 0}
                  className="w-full py-8 bg-[#2C2A26] text-[#F5F2EB] uppercase tracking-[0.5em] text-xs font-bold shadow-2xl hover:bg-amber-950 transition-all disabled:opacity-50 relative overflow-hidden group"
                >
                  <span className={isProcessing ? 'opacity-0' : 'opacity-100'}>Initiate Sacred Exchange — ${total}</span>
                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-5 lg:pl-16 lg:border-l border-[#D6D1C7]">
            <div className="sticky top-32">
              <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-[#2C2A26] mb-12 border-b border-[#D6D1C7] pb-2">Archive Summary</h2>
              
              <div className="space-y-8 mb-12 max-h-[40vh] overflow-y-auto no-scrollbar pr-2">
                 {items.map((item, idx) => (
                   <div key={`${item.id}-${idx}`} className="flex gap-6 group animate-fade-in-up">
                      <div className="w-16 h-20 bg-[#EBE7DE] flex-shrink-0 overflow-hidden border border-[#D6D1C7]/30 shadow-sm">
                         <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                         <h3 className="font-serif text-[#2C2A26] text-lg leading-tight">{item.name}</h3>
                         <p className="text-[9px] text-[#A8A29E] tracking-[0.2em] uppercase font-bold mt-1">{item.category}</p>
                      </div>
                      <span className="text-sm text-[#2C2A26] font-medium self-center">${item.price}</span>
                   </div>
                 ))}
              </div>

              {/* Promo Code Section */}
              <div className="mb-12 pt-8 border-t border-[#D6D1C7]/30">
                <label className="block text-[10px] uppercase tracking-widest text-[#A8A29E] font-bold mb-4">Celestial Blessing (Promo Code)</label>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="ENTER CODE" 
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    className="flex-1 bg-white border border-[#D6D1C7] px-4 py-3 text-xs tracking-widest font-bold outline-none focus:border-[#2C2A26] transition-colors uppercase"
                  />
                  <button 
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-6 py-3 border border-[#2C2A26] text-[10px] uppercase tracking-widest font-bold hover:bg-[#2C2A26] hover:text-white transition-all"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Cost Summary */}
              <div className="space-y-4 pt-8 border-t border-[#D6D1C7]">
                 <div className="flex justify-between items-center text-[#5D5A53]">
                   <span className="text-[10px] uppercase tracking-widest font-bold">Base Frequency (Subtotal)</span>
                   <span className="font-serif text-lg">${subtotal}</span>
                 </div>
                 <div className="flex justify-between items-center text-[#5D5A53]">
                   <span className="text-[10px] uppercase tracking-widest font-bold">Transit (Shipping)</span>
                   <span className="font-serif text-lg">{shippingCost === 0 ? 'Divine Gift' : `$${shippingCost}`}</span>
                 </div>
                 {appliedDiscount > 0 && (
                   <div className="flex justify-between items-center text-amber-900 font-bold">
                     <span className="text-[10px] uppercase tracking-widest">Blessing Applied (Discount)</span>
                     <span className="font-serif text-lg">-${appliedDiscount}</span>
                   </div>
                 )}
                 <div className="pt-4 mt-4 border-t border-[#2C2A26]/10">
                   <div className="flex justify-between items-center">
                     <span className="text-[11px] uppercase tracking-[0.2em] font-black text-[#2C2A26]">Total Resonant Value</span>
                     <span className="font-serif text-3xl text-[#2C2A26]">${total}</span>
                   </div>
                 </div>
                 
                 {/* Delivery Estimate */}
                 <div className="mt-8 p-4 bg-white/60 border border-dashed border-[#D6D1C7] text-center">
                    <span className="block text-[9px] uppercase tracking-widest text-[#A8A29E] font-bold mb-1">Expected Manifestation</span>
                    <p className="font-serif text-[#2C2A26] font-bold">{deliveryEstimate}</p>
                 </div>

                 <p className="text-[9px] text-[#A8A29E] uppercase tracking-widest leading-relaxed text-center mt-8 italic">
                   "Authentic Himalayan seeds undergo purification before dispatch. Their vibration remains sealed until arrival."
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
