
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { db } from '../services/db';
import { User } from '../types';

interface EmailVerificationProps {
  email: string;
  purpose: 'signup' | 'change_email';
  onVerified: (user: User) => void;
  onBack: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ email, purpose, onVerified, onBack }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulated verification logic
    setTimeout(() => {
      if (code === '123456') { 
        if (purpose === 'signup') {
          const user = db.verifyUser(email);
          if (user) {
            db.setCurrentUser(user);
            onVerified(user);
          }
        } else {
          // Change email purpose
          const currentUser = db.getCurrentUser();
          if (currentUser) {
            const users = db.getUsers();
            const idx = users.findIndex(u => u.email === currentUser.email);
            if (idx >= 0) {
              users[idx].email = email;
              localStorage.setItem('raksham_users_v1', JSON.stringify(users));
              currentUser.email = email;
              db.setCurrentUser(currentUser);
              onVerified(currentUser);
            }
          }
        }
      } else {
        setError('The verification code does not match our records.');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#F5F2EB] flex items-center justify-center font-sans">
      <div className="max-w-md w-full animate-fade-in-up text-center">
        <div className="w-16 h-16 bg-[#2C2A26] text-[#F5F2EB] rounded-full flex items-center justify-center mx-auto mb-12 shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-serif text-[#2C2A26] mb-4">
          {purpose === 'signup' ? 'Initiation Verification' : 'Essence Migration'}
        </h1>
        <p className="text-[#5D5A53] italic font-body text-lg mb-8 leading-relaxed">
          The code has been dispatched to <span className="font-bold text-[#2C2A26]">{email}</span>. <br/>
          Provide the 6-digit key to continue.
        </p>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-xs uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-8">
          <input 
            type="text" 
            maxLength={6}
            autoFocus
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            className="w-full bg-white border border-[#D6D1C7] p-6 text-center text-4xl font-serif tracking-[0.5em] outline-none focus:border-[#2C2A26] transition-colors shadow-inner" 
            placeholder="000000"
            required
          />
          
          <button 
            type="submit" 
            disabled={loading || code.length < 6}
            className="w-full py-6 bg-[#2C2A26] text-[#F5F2EB] uppercase tracking-[0.4em] text-[10px] font-bold hover:bg-amber-950 transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? 'Validating...' : 'Authorize Transaction'}
          </button>
        </form>

        <div className="mt-12 flex flex-col gap-4">
          <p className="text-[10px] uppercase tracking-widest text-[#A8A29E]">Standard Security Hint: 123456</p>
          <button 
            onClick={onBack}
            className="text-[10px] uppercase tracking-widest font-bold text-[#A8A29E] hover:text-[#2C2A26] transition-colors border-b border-[#D6D1C7] pb-1 w-fit mx-auto"
          >
            Abort and Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
