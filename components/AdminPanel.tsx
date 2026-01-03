
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useMemo } from 'react';
import { Product, Order, User, Banner } from '../types';
import { db } from '../services/db';
import { enhanceDescription, suggestTagline, suggestBannerContent } from '../services/geminiService';

interface AdminPanelProps {
  onBack: () => void;
  onProductsChange: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, onProductsChange }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'users' | 'banners'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSuggestingTagline, setIsSuggestingTagline] = useState(false);
  const [isSuggestingBanner, setIsSuggestingBanner] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  const totalRevenue = useMemo(() => 
    orders.reduce((sum, order) => sum + (order.total || 0), 0),
    [orders]
  );

  const pendingOrders = useMemo(() => 
    orders.filter(order => order.status === 'pending').length,
    [orders]
  );

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;
    const term = productSearch.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.category.toLowerCase().includes(term)
    );
  }, [products, productSearch]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshLocalData();
    }
  }, [isAuthenticated]);

  const refreshLocalData = () => {
    setProducts(db.getProducts());
    setBanners(db.getBanners());
    setOrders(db.getOrders());
    setUsers(db.getUsers());
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.id === 'admin@raksham' && credentials.password === 'ratna@ghar') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Sutradhara credentials.');
    }
  };

  const updateEditingField = (field: keyof Product, value: any) => {
    setEditingProduct(prev => {
      const base = prev || { 
        id: Date.now().toString(), 
        name: '', 
        tagline: '', 
        description: '', 
        price: 0, 
        category: 'Home', 
        imageUrl: '', 
        features: [], 
        stock: 0,
        gallery: []
      } as Product;
      return { ...base, [field]: value };
    });
  };

  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;
    db.saveProduct(editingProduct as Product);
    onProductsChange(); 
    refreshLocalData();
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this sacred artifact?')) {
      db.deleteProduct(id);
      onProductsChange(); 
      refreshLocalData();
    }
  };

  const updateEditingBannerField = (field: keyof Banner, value: any) => {
    setEditingBanner(prev => {
      const base = prev || {
        id: Date.now().toString(),
        imageUrl: '',
        title: '',
        subtitle: '',
        link: '',
        active: true
      } as Banner;
      return { ...base, [field]: value };
    });
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    db.saveBanner(editingBanner as Banner);
    onProductsChange();
    refreshLocalData();
    setEditingBanner(null);
  };

  const handleDeleteBanner = (id: string) => {
    if (window.confirm('Remove this promotional banner?')) {
      db.deleteBanner(id);
      onProductsChange();
      refreshLocalData();
    }
  };

  const handleToggleBannerActive = (banner: Banner) => {
    const updated = { ...banner, active: !banner.active };
    db.saveBanner(updated);
    onProductsChange();
    refreshLocalData();
  };

  const handleEnhanceWithAI = async () => {
    if (!editingProduct?.name) return;
    setIsEnhancing(true);
    const enhanced = await enhanceDescription(editingProduct.name, editingProduct.description || '');
    updateEditingField('description', enhanced);
    setIsEnhancing(false);
  };

  const handleSuggestTagline = async () => {
    if (!editingProduct?.name) return;
    setIsSuggestingTagline(true);
    const suggested = await suggestTagline(editingProduct.name, editingProduct.description || '');
    if (suggested) updateEditingField('tagline', suggested);
    setIsSuggestingTagline(false);
  };

  const handleSuggestBannerCopy = async () => {
    const context = prompt("What is the essence of this promotion? (e.g. Seasonal Clearance, Himalayan Harvest)");
    if (!context) return;
    setIsSuggestingBanner(true);
    const suggested = await suggestBannerContent(context);
    if (suggested.title) {
      updateEditingBannerField('title', suggested.title);
      updateEditingBannerField('subtitle', suggested.subtitle);
    }
    setIsSuggestingBanner(false);
  };

  const handleToggleUserVerification = (email: string) => {
    const usersList = db.getUsers();
    const userIdx = usersList.findIndex(u => u.email === email);
    if (userIdx !== -1) {
      usersList[userIdx].verified = !usersList[userIdx].verified;
      localStorage.setItem('raksham_users_v1', JSON.stringify(usersList));
      refreshLocalData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#2C2A26] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#F5F2EB] p-12 shadow-2xl border border-[#D6D1C7] animate-fade-in-up">
           <div className="text-center mb-12">
             <div className="w-20 h-20 border-2 border-amber-900 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-serif text-amber-900">ॐ</div>
             <h2 className="text-3xl font-serif text-[#2C2A26]">Sutradhara Portal</h2>
             <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#A8A29E] mt-4">Internal Governance Only</p>
           </div>
           <form onSubmit={handleAdminLogin} className="space-y-6">
              <input type="text" placeholder="ID" value={credentials.id} onChange={e => setCredentials({...credentials, id: e.target.value})} className="w-full bg-white border border-[#D6D1C7] p-4 text-xs uppercase tracking-widest outline-none focus:ring-1 ring-amber-900 transition-all" />
              <input type="password" placeholder="Password" value={credentials.password} onChange={e => setCredentials({...credentials, password: e.target.value})} className="w-full bg-white border border-[#D6D1C7] p-4 text-xs uppercase tracking-widest outline-none focus:ring-1 ring-amber-900 transition-all" />
              {loginError && <p className="text-red-500 text-[10px] uppercase tracking-widest text-center mt-2">{loginError}</p>}
              <button type="submit" className="w-full py-5 bg-[#2C2A26] text-white text-[10px] uppercase tracking-[0.5em] font-bold hover:bg-amber-950 transition-all shadow-xl">Access Archive</button>
           </form>
           <button onClick={onBack} className="w-full mt-6 text-[10px] uppercase tracking-[0.3em] font-bold text-[#A8A29E] hover:text-[#2C2A26] transition-colors">Return to Sanctuary</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] flex font-sans">
      <aside className="w-72 bg-[#2C2A26] text-[#F5F2EB] flex flex-col fixed inset-y-0 left-0 z-20 shadow-2xl">
        <div className="p-8 border-b border-white/10">
          <h2 className="text-2xl font-serif tracking-widest text-amber-100 uppercase">Raksham</h2>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 mt-1">Sutradhara Control</p>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          {[
            { id: 'dashboard', label: 'Overview', icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12' },
            { id: 'products', label: 'Inventory', icon: 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-5.25v9' },
            { id: 'banners', label: 'Promotions', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
            { id: 'orders', label: 'Orders', icon: 'M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z' },
            { id: 'users', label: 'Seekers', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' }
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-4 px-4 py-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all rounded-lg ${activeTab === item.id ? 'bg-amber-900/40 text-white shadow-inner' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-white/10">
          <button onClick={onBack} className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/40 hover:text-white font-bold transition-colors">Relinquish Control</button>
        </div>
      </aside>

      <main className="flex-1 ml-72 p-12 overflow-y-auto">
        <header className="mb-12 flex justify-between items-end border-b border-[#D6D1C7] pb-8">
          <div>
            <h1 className="text-5xl font-serif text-[#2C2A26] capitalize tracking-tight">{activeTab}</h1>
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#A8A29E] mt-2 font-bold">Sacred Governance Suite</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#2C2A26]">Sutradhara Protocol V1.2</span>
            <p className="font-mono text-xs text-[#A8A29E] mt-1">{new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}</p>
          </div>
        </header>

        {activeTab === 'dashboard' && (
           <div className="space-y-12 animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="bg-white p-10 border border-[#D6D1C7] shadow-xl relative overflow-hidden group hover:border-amber-900/30 transition-all">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.546 1.16 3.743 1.16 5.289 0m-5.289-8.402l.879-.659c1.546-1.16 3.743-1.16 5.289 0m-1.333 11.123c1.18.353 2.446.353 3.626 0M17.333 6.877c1.18.353 2.446.353 3.626 0" /></svg>
                    </div>
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-[#A8A29E] mb-2 font-bold">Total Flow</span>
                    <span className="text-5xl font-serif text-[#2C2A26]">${totalRevenue.toLocaleString()}</span>
                    <div className="mt-6 flex items-center gap-2">
                       <div className="h-1 flex-1 bg-[#F5F2EB] rounded-full overflow-hidden">
                          <div className="h-full bg-green-600 w-3/4"></div>
                       </div>
                       <span className="text-[8px] uppercase tracking-widest font-bold text-green-600">+12% Growth</span>
                    </div>
                 </div>
                 <div className="bg-white p-10 border border-[#D6D1C7] shadow-xl relative overflow-hidden group hover:border-amber-900/30 transition-all">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-[#A8A29E] mb-2 font-bold">Awaiting Karma</span>
                    <span className="text-5xl font-serif text-[#2C2A26]">{pendingOrders}</span>
                    <div className="mt-6 flex items-center gap-2">
                       <div className="h-1 flex-1 bg-[#F5F2EB] rounded-full overflow-hidden">
                          <div className="h-full bg-amber-600 w-1/4"></div>
                       </div>
                       <span className="text-[8px] uppercase tracking-widest font-bold text-amber-600">Action Required</span>
                    </div>
                 </div>
                 <div className="bg-white p-10 border border-[#D6D1C7] shadow-xl relative overflow-hidden group hover:border-amber-900/30 transition-all">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-5.25v9" /></svg>
                    </div>
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-[#A8A29E] mb-2 font-bold">Sacred Catalog</span>
                    <span className="text-5xl font-serif text-[#2C2A26]">{products.length}</span>
                    <div className="mt-6 flex items-center gap-2">
                       <div className="h-1 flex-1 bg-[#F5F2EB] rounded-full overflow-hidden">
                          <div className="h-full bg-[#2C2A26] w-full"></div>
                       </div>
                       <span className="text-[8px] uppercase tracking-widest font-bold text-[#2C2A26]">Fully Manifested</span>
                    </div>
                 </div>
              </div>

              <div className="bg-[#2C2A26] p-16 text-[#F5F2EB] border border-white/10 relative overflow-hidden shadow-2xl rounded-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-900/20 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse"></div>
                <div className="relative z-10 max-w-3xl">
                  <h3 className="text-4xl font-serif mb-8 text-amber-100 italic">Sutradhara's Insight</h3>
                  <p className="text-2xl font-body italic opacity-90 leading-relaxed mb-8">
                    "Every bead you ship is a resonance anchor. Maintain the purity of the archive to ensure the seeker finds their path."
                  </p>
                  <div className="flex gap-4">
                    <button onClick={() => setActiveTab('orders')} className="bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-3 text-[10px] uppercase tracking-widest font-bold transition-all rounded-full">Review Recent Karma</button>
                    <button onClick={() => setActiveTab('products')} className="bg-amber-900 hover:bg-amber-950 px-8 py-3 text-[10px] uppercase tracking-widest font-bold transition-all rounded-full">Optimize Catalog</button>
                  </div>
                </div>
              </div>
           </div>
        )}

        {activeTab === 'banners' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 animate-fade-in-up">
            <div className="xl:col-span-4">
              <div className="bg-white p-8 border border-[#D6D1C7] shadow-xl rounded-2xl h-[75vh] flex flex-col">
                <div className="flex justify-between items-center mb-8 border-b border-[#D6D1C7] pb-6">
                    <h3 className="font-serif text-2xl text-[#2C2A26]">Promotions</h3>
                    <button onClick={() => setEditingBanner(null)} className="p-3 bg-[#2C2A26] text-white text-[9px] uppercase tracking-widest font-bold rounded-full hover:bg-amber-950 transition-colors shadow-lg">Manifest New</button>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {banners.map(banner => (
                    <div 
                      key={banner.id} 
                      onClick={() => setEditingBanner(banner)}
                      className={`group relative overflow-hidden border-2 cursor-pointer transition-all rounded-xl ${editingBanner?.id === banner.id ? 'border-amber-900 bg-amber-50 shadow-md' : 'border-[#F5F2EB] bg-white hover:border-[#D6D1C7]'}`}
                    >
                      <div className="h-24 overflow-hidden grayscale-[0.3] group-hover:grayscale-0 transition-all">
                        <img src={banner.imageUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-serif text-sm text-[#2C2A26] truncate max-w-[150px]">{banner.title || "Untitled"}</p>
                          <span className={`text-[8px] uppercase tracking-widest font-bold ${banner.active ? 'text-green-600' : 'text-[#A8A29E]'}`}>
                            {banner.active ? '● Public' : '○ Archive'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={(e) => { e.stopPropagation(); handleToggleBannerActive(banner); }} className="p-2 bg-white/50 rounded-full hover:bg-white shadow-sm transition-all">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /></svg>
                           </button>
                           <button onClick={(e) => { e.stopPropagation(); handleDeleteBanner(banner.id); }} className="p-2 bg-white/50 rounded-full hover:bg-red-50 hover:text-red-700 shadow-sm transition-all">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="xl:col-span-8">
              <div className="bg-white border border-[#D6D1C7] shadow-2xl rounded-2xl p-10 h-[75vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start mb-10 border-b border-[#D6D1C7] pb-8">
                  <h3 className="font-serif text-3xl text-[#2C2A26]">
                    {editingBanner?.id ? 'Refine Promotion' : 'Anchor New Promotion'}
                  </h3>
                  <button type="button" onClick={handleSuggestBannerCopy} disabled={isSuggestingBanner} className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-900 bg-amber-50 px-6 py-2 border-2 border-amber-200 rounded-full hover:bg-amber-100 disabled:opacity-50 transition-all shadow-sm">
                    {isSuggestingBanner ? 'Seeking Om...' : 'ॐ Divine Suggestion'}
                  </button>
                </div>

                <form onSubmit={handleSaveBanner} className="space-y-12">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-bold">Live Cinematic Preview</label>
                    <div className="relative w-full h-[300px] bg-[#2C2A26] rounded-2xl overflow-hidden group shadow-2xl border-4 border-[#F5F2EB]">
                       {editingBanner?.imageUrl ? (
                         <img src={editingBanner.imageUrl} className="w-full h-full object-cover transition-opacity duration-1000" alt="Live Preview" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-[#A8A29E] font-serif italic text-lg opacity-40">Awaiting Visual Seed</div>
                       )}
                       <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-8">
                          <h2 className="text-4xl font-serif text-[#F5F2EB] mb-4">{editingBanner?.title || "Resonance"}</h2>
                          <p className="text-xl text-[#D6D1C7] italic font-body mb-6">{editingBanner?.subtitle || "Sacred Himalayan Energy"}</p>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-bold">Image URL (Visual Core)</label>
                      <input type="text" required value={editingBanner?.imageUrl || ''} onChange={e => updateEditingBannerField('imageUrl', e.target.value)} className="w-full bg-[#F5F2EB] p-4 text-[11px] font-mono outline-none border-2 border-transparent focus:border-amber-900 rounded-xl shadow-inner transition-all" placeholder="High-resolution URL" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-bold">Title (Primary Mantra)</label>
                      <input type="text" value={editingBanner?.title || ''} onChange={e => updateEditingBannerField('title', e.target.value)} className="w-full bg-[#F5F2EB] p-4 text-sm font-serif outline-none border-2 border-transparent focus:border-amber-900 rounded-xl shadow-inner transition-all" placeholder="e.g. Mahashivratri" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-bold">Subtitle (Secondary Echo)</label>
                      <input type="text" value={editingBanner?.subtitle || ''} onChange={e => updateEditingBannerField('subtitle', e.target.value)} className="w-full bg-[#F5F2EB] p-4 text-sm italic outline-none border-2 border-transparent focus:border-amber-900 rounded-xl shadow-inner transition-all" placeholder="e.g. Discover the divine..." />
                    </div>
                    <div className="col-span-2 flex items-center gap-4 pt-6">
                      <input type="checkbox" checked={editingBanner?.active !== false} onChange={e => updateEditingBannerField('active', e.target.checked)} className="w-6 h-6 accent-[#2C2A26] cursor-pointer" id="banner-active-check" />
                      <label htmlFor="banner-active-check" className="text-[10px] uppercase tracking-[0.2em] font-bold cursor-pointer text-[#2C2A26]">Broadcast to Public Domain</label>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-[#2C2A26] text-[#F5F2EB] py-6 text-xs uppercase tracking-[0.5em] font-bold hover:bg-amber-950 transition-all shadow-2xl rounded-2xl">
                    {editingBanner?.id ? 'Commit Transformation' : 'Anchor Promotion'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 animate-fade-in-up">
            <div className="xl:col-span-4 space-y-8">
              <div className="bg-white p-8 border border-[#D6D1C7] shadow-xl rounded-2xl h-[75vh] flex flex-col">
                <div className="flex justify-between items-center mb-8 border-b border-[#D6D1C7] pb-6">
                    <h3 className="font-serif text-2xl text-[#2C2A26]">Archive</h3>
                    <button onClick={() => setEditingProduct(null)} className="p-3 bg-[#2C2A26] text-white text-[9px] uppercase tracking-widest font-bold rounded-full hover:bg-amber-950 transition-colors shadow-lg">Manifest New</button>
                </div>
                <div className="relative mb-6">
                  <input type="text" placeholder="Search archive..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="w-full bg-[#F5F2EB] p-4 text-[10px] uppercase tracking-widest font-bold outline-none border-2 border-transparent focus:border-amber-900 rounded-xl transition-all" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute right-4 top-4 text-[#A8A29E]"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {filteredProducts.map(product => (
                    <div key={product.id} className={`group flex items-center justify-between p-4 border-2 cursor-pointer transition-all rounded-xl ${editingProduct?.id === product.id ? 'border-amber-900 bg-amber-50 shadow-md' : 'border-[#F5F2EB] bg-white hover:border-[#D6D1C7]'}`} onClick={() => setEditingProduct(product)}>
                      <div className="flex items-center gap-4">
                        <img src={product.imageUrl} className="w-12 h-16 object-cover border-2 border-[#F5F2EB] rounded-lg shadow-sm" alt="" />
                        <div>
                          <p className="font-serif text-base text-[#2C2A26]">{product.name}</p>
                          <p className="text-[9px] uppercase tracking-widest text-[#A8A29E] font-bold">${product.price} • {product.category}</p>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id); }} className="text-[#A8A29E] hover:text-red-700 p-2 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="xl:col-span-8">
              <div className="bg-white border border-[#D6D1C7] p-10 shadow-2xl rounded-2xl overflow-y-auto h-[75vh] custom-scrollbar">
                <div className="flex justify-between items-start mb-10 border-b border-[#D6D1C7] pb-8">
                   <h3 className="font-serif text-3xl text-[#2C2A26]">
                     {editingProduct?.id ? 'Refine Artifact' : 'Manifest Artifact'}
                   </h3>
                   <div className="flex gap-4">
                     <button type="button" onClick={handleSuggestTagline} disabled={isSuggestingTagline} className="text-[9px] font-bold uppercase tracking-widest text-amber-900 hover:bg-amber-50 px-4 py-2 border-2 border-amber-200 rounded-full transition-all">
                       {isSuggestingTagline ? 'Seeking Mantra...' : 'Suggest Tagline'}
                     </button>
                     <button type="button" onClick={handleEnhanceWithAI} disabled={isEnhancing} className="text-[9px] font-bold uppercase tracking-widest text-[#2C2A26] hover:bg-[#F5F2EB] px-4 py-2 border-2 border-[#2C2A26] rounded-full transition-all">
                       {isEnhancing ? 'Enlightening...' : 'ॐ AI Enhance'}
                     </button>
                   </div>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-12">
                   <div className="grid grid-cols-2 gap-8">
                     <div className="col-span-2 space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-bold">Sacred Designation (Name)</label>
                        <input type="text" required value={editingProduct?.name || ''} onChange={e => updateEditingField('name', e.target.value)} className="w-full bg-[#F5F2EB] p-4 text-sm font-serif outline-none border-2 border-transparent focus:border-amber-900 rounded-xl shadow-inner transition-all" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-bold">Vibrational Value ($)</label>
                        <input type="number" required value={editingProduct?.price || ''} onChange={e => updateEditingField('price', Number(e.target.value))} className="w-full bg-[#F5F2EB] p-4 text-sm outline-none border-2 border-transparent focus:border-amber-900 rounded-xl shadow-inner transition-all" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-bold">Element Category</label>
                        <select value={editingProduct?.category || 'Home'} onChange={e => updateEditingField('category', e.target.value)} className="w-full bg-[#F5F2EB] p-4 text-[10px] font-bold uppercase outline-none border-2 border-transparent focus:border-amber-900 rounded-xl shadow-inner appearance-none cursor-pointer">
                          <option value="Home">Home Decor</option>
                          <option value="Wearable">Wearable Sacred</option>
                          <option value="Audio">Meditative Audio</option>
                          <option value="Mobile">Mobile Sanctuary</option>
                        </select>
                     </div>
                     <div className="col-span-2 space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-bold">Deep Narrative</label>
                        <textarea rows={5} required value={editingProduct?.description || ''} onChange={e => updateEditingField('description', e.target.value)} className="w-full bg-[#F5F2EB] p-4 text-sm font-body leading-relaxed outline-none border-2 border-transparent focus:border-amber-900 rounded-xl shadow-inner transition-all" />
                     </div>
                     <div className="col-span-2 space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-bold">Visual Core (Image URL)</label>
                        <input type="text" required value={editingProduct?.imageUrl || ''} onChange={e => updateEditingField('imageUrl', e.target.value)} className="w-full bg-[#F5F2EB] p-4 text-xs font-mono outline-none border-2 border-transparent focus:border-amber-900 rounded-xl shadow-inner transition-all" />
                        {editingProduct?.imageUrl && <img src={editingProduct.imageUrl} className="w-32 h-40 object-cover mt-6 border-4 border-[#F5F2EB] rounded-xl shadow-lg" alt="Preview" />}
                     </div>
                   </div>
                   <button type="submit" className="w-full bg-[#2C2A26] text-white py-8 text-xs uppercase tracking-[0.5em] font-bold hover:bg-amber-950 transition-all shadow-2xl rounded-2xl mt-12">Commit to Eternal Ledger</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white border border-[#D6D1C7] shadow-2xl rounded-2xl overflow-hidden animate-fade-in-up">
             <table className="w-full text-left">
                <thead className="bg-[#EBE7DE] text-[10px] tracking-[0.4em] font-black uppercase text-[#2C2A26]">
                  <tr>
                    <th className="p-8">Initiation ID</th>
                    <th className="p-8">Seeker Detail</th>
                    <th className="p-8">Karma Flow</th>
                    <th className="p-8">State of Being</th>
                    <th className="p-8">Intervention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D6D1C7]">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="p-8 font-mono text-[10px] text-[#A8A29E] font-bold">{order.id}</td>
                      <td className="p-8">
                        <p className="font-serif text-lg text-[#2C2A26] leading-none">{order.customerName}</p>
                        <p className="text-[9px] text-[#A8A29E] mt-2 font-bold uppercase tracking-widest">{order.customerEmail}</p>
                      </td>
                      <td className="p-8">
                        <span className="text-2xl font-serif text-[#2C2A26]">${order.total}</span>
                        <p className="text-[8px] uppercase tracking-widest text-[#A8A29E] mt-1">{order.paymentMethod}</p>
                      </td>
                      <td className="p-8">
                        <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] inline-block rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-8">
                        <select 
                          value={order.status} 
                          onChange={(e) => { db.updateOrderStatus(order.id, e.target.value as Order['status']); refreshLocalData(); }} 
                          className="bg-white border-2 border-[#D6D1C7] p-2 text-[9px] uppercase tracking-widest font-bold outline-none focus:border-[#2C2A26] transition-all rounded-lg cursor-pointer"
                        >
                          <option value="pending">PENDING</option>
                          <option value="shipped">SHIPPED</option>
                          <option value="delivered">DELIVERED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-32 text-center italic text-[#A8A29E] font-serif text-2xl opacity-40">The cosmic ledger is currently still.</td>
                    </tr>
                  )}
                </tbody>
             </table>
          </div>
        )}

        {activeTab === 'users' && (
           <div className="bg-white border border-[#D6D1C7] shadow-2xl rounded-2xl overflow-hidden animate-fade-in-up">
             <table className="w-full text-left">
               <thead className="bg-[#EBE7DE] text-[10px] tracking-[0.4em] font-black uppercase text-[#2C2A26]">
                 <tr>
                   <th className="p-8">Seeker Presence</th>
                   <th className="p-8">Celestial Coordinate</th>
                   <th className="p-8">Spiritual Degree</th>
                   <th className="p-8">Guidance</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[#D6D1C7]">
                 {users.map(user => (
                   <tr key={user.id} className="hover:bg-amber-50/30 transition-colors">
                     <td className="p-8 font-serif text-lg text-[#2C2A26]">{user.name}</td>
                     <td className="p-8 font-mono text-xs text-[#A8A29E] font-bold">{user.email}</td>
                     <td className="p-8">
                        <span className={`px-4 py-1.5 text-[9px] uppercase tracking-[0.2em] font-black inline-block rounded-full ${
                          user.verified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {user.verified ? 'Enlightened' : 'Seeker'}
                        </span>
                     </td>
                     <td className="p-8">
                       <button 
                        onClick={() => handleToggleUserVerification(user.email)} 
                        className="text-[10px] uppercase tracking-widest font-black text-amber-900 hover:text-amber-950 transition-all border-b-2 border-amber-100 hover:border-amber-900"
                       >
                         Toggle State
                       </button>
                     </td>
                   </tr>
                 ))}
                 {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-32 text-center italic text-[#A8A29E] font-serif text-2xl opacity-40">No seekers have entered the gateway yet.</td>
                    </tr>
                 )}
               </tbody>
             </table>
           </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
