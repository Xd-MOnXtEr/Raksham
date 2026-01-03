
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { User, Order } from '../types';
import { db } from '../services/db';

interface AccountProps {
  user: User;
  onBack: () => void;
  onLogout: () => void;
  onRequestEmailChange: (newEmail: string) => void;
}

const Account: React.FC<AccountProps> = ({ user, onBack, onLogout, onRequestEmailChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const orders = db.getOrders().filter(o => o.customerEmail === user.email);

  const handleSubmitEmailChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail && newEmail !== user.email) {
      onRequestEmailChange(newEmail);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#F5F2EB]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16 border-b border-[#D6D1C7] pb-8">
          <div>
            <h1 className="text-4xl font-serif text-[#2C2A26]">The Member's Circle</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#A8A29E] mt-2">Personal Sanctuary of {user.name}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onLogout}
              className="text-[10px] uppercase tracking-widest font-bold text-amber-900 border border-amber-900 px-6 py-2 hover:bg-amber-900 hover:text-white transition-all"
            >
              Exit Circle
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Settings Column */}
          <div className="space-y-12">
            <section>
              <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-[#2C2A26] mb-8 border-b border-[#D6D1C7] pb-2">Your Essence</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#A8A29E] mb-1">Name</label>
                  <p className="text-xl font-serif text-[#2C2A26]">{user.name}</p>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#A8A29E] mb-1">Primary Email</label>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-serif text-[#2C2A26]">{user.email}</p>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-[10px] uppercase tracking-widest text-amber-900 font-bold underline underline-offset-4"
                    >
                      {isEditing ? 'Cancel' : 'Update'}
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <form onSubmit={handleSubmitEmailChange} className="mt-8 p-6 bg-white border border-[#D6D1C7] animate-fade-in-up">
                    <h3 className="text-sm font-serif mb-4">Request Email Migration</h3>
                    <input 
                      type="email"
                      required
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      placeholder="New Email Address"
                      className="w-full bg-[#F5F2EB] border-none p-4 text-sm mb-4 outline-none focus:ring-1 ring-[#2C2A26]"
                    />
                    <button 
                      type="submit"
                      className="w-full py-4 bg-[#2C2A26] text-white text-[10px] uppercase tracking-[0.3em] font-bold"
                    >
                      Begin Verification
                    </button>
                  </form>
                )}
              </div>
            </section>
          </div>

          {/* Orders Column */}
          <div className="lg:col-span-2">
             <section>
              <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-[#2C2A26] mb-8 border-b border-[#D6D1C7] pb-2">Order History</h2>
              {orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white border border-[#D6D1C7] p-8 hover:shadow-lg transition-all">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="block text-[10px] uppercase tracking-widest text-[#A8A29E]">Order ID</span>
                            <span className="font-mono text-sm">{order.id}</span>
                          </div>
                          <span className={`px-4 py-1 text-[10px] uppercase tracking-widest font-bold ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status}
                          </span>
                       </div>
                       <div className="flex justify-between items-end border-t border-[#F5F2EB] pt-4">
                          <div>
                             <span className="block text-[10px] uppercase tracking-widest text-[#A8A29E]">Destiny</span>
                             <p className="text-sm font-serif">{order.shippingAddress?.city || 'Himalayan Archive'}</p>
                             {order.estimatedDelivery && order.status === 'pending' && (
                               <p className="text-[9px] uppercase tracking-widest text-amber-700 mt-1">Arrival: {order.estimatedDelivery}</p>
                             )}
                          </div>
                          <div className="text-right">
                             <span className="block text-[10px] uppercase tracking-widest text-[#A8A29E]">Resonant Value</span>
                             <p className="text-xl font-serif">${order.total}</p>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center bg-white/50 border border-dashed border-[#D6D1C7]">
                  <p className="text-xl font-serif italic text-[#A8A29E]">"The archive of your acquisitions is currently empty."</p>
                  <button onClick={onBack} className="mt-8 text-[10px] uppercase tracking-widest font-bold border-b border-[#2C2A26] pb-1">
                    Begin Your Collection
                  </button>
                </div>
              )}
             </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
