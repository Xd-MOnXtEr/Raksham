
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { User } from '../types';

interface AuthProps {
  initialMode: 'login' | 'signup';
  onAuthSuccess: (user: User) => void;
  onVerifyNeeded: (email: string) => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ initialMode, onAuthSuccess, onVerifyNeeded, onBack }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Verification States for Signup
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Check for existing verification on mount or email change
  useEffect(() => {
    if (formData.email && mode === 'signup') {
      const verified = localStorage.getItem(`raksham_verified_${formData.email}`);
      if (verified === 'true') {
        setIsEmailVerified(true);
      } else {
        setIsEmailVerified(false);
      }
    }
  }, [formData.email, mode]);

  const handleSendOtp = () => {
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email to receive the sacred code.');
      return;
    }
    setError('');
    setLoading(true);

    // Simulate sending OTP
    setTimeout(() => {
      // Generate a truly random 6-digit OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      setOtpSent(true);
      setLoading(false);
      
      // Celestial Dispatch (Mock Service)
      console.log(`%c [Celestial Dispatch] Code for ${formData.email}: ${newOtp} `, 'background: #2C2A26; color: #F5F2EB; font-weight: bold; padding: 4px;');
    }, 1200);
  };

  const handleConfirmOtp = () => {
    if (otpInput === generatedOtp && generatedOtp !== '') {
      setIsVerifyingOtp(true);
      setTimeout(() => {
        setIsEmailVerified(true);
        setIsVerifyingOtp(false);
        setOtpSent(false);
        setError('');
        // Persist verification status
        localStorage.setItem(`raksham_verified_${formData.email}`, 'true');
      }, 1000);
    } else {
      setError('The code does not resonate with our records.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (mode === 'signup') {
      // Double check persistence to prevent state injection
      const persistedVerification = localStorage.getItem(`raksham_verified_${formData.email}`);
      if (!isEmailVerified && persistedVerification !== 'true') {
        setError('Email verification is required to anchor your presence.');
        return;
      }
    }

    setLoading(true);

    setTimeout(() => {
      if (mode === 'signup') {
        const users = db.getUsers();
        if (users.find(u => u.email === formData.email)) {
          setError('This essence is already registered in our circle.');
          setLoading(false);
          return;
        }
        // Direct creation since we verified inline
        const newUser = db.addUser(formData.email, formData.name);
        db.verifyUser(newUser.email); // Auto-verify in DB because UI handled it
        db.setCurrentUser({ ...newUser, verified: true });
        
        // Clean up verification tokens
        localStorage.removeItem(`raksham_verified_${formData.email}`);
        onAuthSuccess({ ...newUser, verified: true });
      } else {
        // Mock Login
        const users = db.getUsers();
        const user = users.find(u => u.email === formData.email);
        if (user) {
          // In a real app we'd check password here
          if (!user.verified) {
            onVerifyNeeded(user.email);
          } else {
            db.setCurrentUser(user);
            onAuthSuccess(user);
          }
        } else {
          setError('Email not found in our records.');
        }
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#F5F2EB] flex items-center justify-center font-sans">
      <div className="max-w-md w-full animate-fade-in-up">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#A8A29E] hover:text-[#2C2A26] transition-colors mb-12"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Return
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C2A26] mb-4">
            {mode === 'login' ? 'Enter the Circle' : 'Initiate Journey'}
          </h1>
          <p className="text-[#A8A29E] text-[10px] uppercase tracking-[0.3em] font-bold">
            {mode === 'login' ? 'Access your sacred archive' : 'Become a part of the Raksham legacy'}
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-amber-900/10 border border-amber-900/20 text-amber-950 text-xs uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {mode === 'signup' && (
            <div className="relative group">
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-transparent border-b border-[#D6D1C7] py-4 text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26] transition-colors peer" 
                placeholder=" "
              />
              <label className="absolute left-0 top-4 text-[#A8A29E] text-xs uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-[10px] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-[10px]">Name</label>
            </div>
          )}
          
          <div className="relative group flex items-end gap-4">
            <div className="flex-1 relative">
              <input 
                type="email" 
                required
                disabled={isEmailVerified}
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className={`w-full bg-transparent border-b border-[#D6D1C7] py-4 text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26] transition-colors peer ${isEmailVerified ? 'opacity-50' : ''}`} 
                placeholder=" "
              />
              <label className="absolute left-0 top-4 text-[#A8A29E] text-xs uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-[10px] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-[10px]">Email Address</label>
            </div>
            
            {mode === 'signup' && !isEmailVerified && (
              <button 
                type="button"
                onClick={handleSendOtp}
                disabled={loading || otpSent}
                className="mb-2 px-4 py-2 border border-[#2C2A26] text-[10px] uppercase tracking-widest font-bold hover:bg-[#2C2A26] hover:text-white transition-all disabled:opacity-50"
              >
                {otpSent ? 'Sent' : 'Verify Email'}
              </button>
            )}
            
            {isEmailVerified && (
              <div className="mb-4 flex items-center text-green-600 gap-2 animate-fade-in-up">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-widest">Verified</span>
              </div>
            )}
          </div>

          {/* OTP Section Below Email */}
          {mode === 'signup' && otpSent && !isEmailVerified && (
            <div className="bg-white/50 border border-[#D6D1C7] p-6 space-y-4 animate-fade-in-up">
              <p className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-bold">Sacred Code Dispatched (Check Console)</p>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  maxLength={6}
                  value={otpInput}
                  onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="flex-1 bg-white border border-[#D6D1C7] px-4 py-3 text-center text-lg tracking-[0.3em] font-serif outline-none focus:border-[#2C2A26]"
                />
                <button 
                  type="button"
                  onClick={handleConfirmOtp}
                  disabled={isVerifyingOtp || otpInput.length < 6}
                  className="bg-[#2C2A26] text-white px-6 text-[10px] uppercase tracking-widest font-bold disabled:opacity-50"
                >
                  {isVerifyingOtp ? '...' : 'Confirm'}
                </button>
              </div>
            </div>
          )}

          <div className="relative group">
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full bg-transparent border-b border-[#D6D1C7] py-4 text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26] transition-colors peer" 
              placeholder=" "
            />
            <label className="absolute left-0 top-4 text-[#A8A29E] text-xs uppercase tracking-widest pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-[10px] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-[10px]">Password</label>
          </div>

          <button 
            type="submit" 
            disabled={loading || (mode === 'signup' && !isEmailVerified)}
            className="w-full py-6 bg-[#2C2A26] text-[#F5F2EB] uppercase tracking-[0.4em] text-[10px] font-bold hover:bg-amber-950 transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Step Inside' : 'Join the Circle'}
          </button>
        </form>

        <div className="mt-12 text-center">
          <button 
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setOtpSent(false);
              setGeneratedOtp('');
              setIsEmailVerified(false);
              setOtpInput('');
              setError('');
            }}
            className="text-[10px] uppercase tracking-widest font-bold text-[#A8A29E] hover:text-[#2C2A26] transition-colors border-b border-[#D6D1C7] pb-1"
          >
            {mode === 'login' ? "Don't have an archive? Create one" : "Already a seeker? Login here"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
