
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BannerSlider from './components/BannerSlider';
import ProductGrid from './components/ProductGrid';
import About from './components/About';
import Journal from './components/Journal';
import Assistant from './components/Assistant';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import JournalDetail from './components/JournalDetail';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import AdminPanel from './components/AdminPanel';
import Wishlist from './components/Wishlist';
import Auth from './components/Auth';
import Account from './components/Account';
import EmailVerification from './components/EmailVerification';
import { Product, JournalArticle, ViewState, User, Banner } from './types';
import { db } from './services/db';

function App() {
  const [view, setView] = useState<ViewState>({ type: 'home' });
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize from storage
  useEffect(() => {
    // Load initial data
    setProducts(db.getProducts());
    setBanners(db.getBanners());
    setWishlistIds(db.getWishlist());
    setCurrentUser(db.getCurrentUser());
  }, []);

  // Sync state whenever database changes are signaled
  const refreshAppData = () => {
    setProducts(db.getProducts());
    setBanners(db.getBanners());
  };

  const toggleWishlist = (productId: string) => {
    const newWishlist = wishlistIds.includes(productId)
      ? wishlistIds.filter(id => id !== productId)
      : [...wishlistIds, productId];
    
    setWishlistIds(newWishlist);
    db.saveWishlist(newWishlist);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement> | null, targetId: string) => {
    if (e) e.preventDefault();
    
    if (view.type !== 'home') {
      setView({ type: 'home' });
      if (targetId) setTimeout(() => scrollToSection(targetId), 50);
    } else if (targetId) {
      scrollToSection(targetId);
    }
  };

  const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const addToCart = (product: Product) => {
    setCartItems([...cartItems, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    const newItems = [...cartItems];
    newItems.splice(index, 1);
    setCartItems(newItems);
  };

  const handleLogout = () => {
    db.setCurrentUser(null);
    setCurrentUser(null);
    setView({ type: 'home' });
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] font-sans text-[#2C2A26] selection:bg-[#D6D1C7] selection:text-[#2C2A26]">
      {view.type !== 'checkout' && view.type !== 'admin' && view.type !== 'auth' && view.type !== 'verify' && (
        <Navbar 
            onNavClick={handleNavClick} 
            cartCount={cartItems.length}
            wishlistCount={wishlistIds.length}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenWishlist={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'wishlist' });
            }}
            onOpenAuth={() => {
              if (currentUser) {
                setView({ type: 'account' });
              } else {
                setView({ type: 'auth', mode: 'login' });
              }
            }}
            currentUser={currentUser}
            onLogout={handleLogout}
        />
      )}
      
      <main>
        {view.type === 'home' && (
          <>
            <Hero />
            <BannerSlider banners={banners} />
            <ProductGrid 
              products={products}
              wishlistIds={wishlistIds}
              onToggleWishlist={toggleWishlist}
              onAddToCart={addToCart}
              onProductClick={(p) => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setView({ type: 'product', product: p });
            }} />
            <About />
            <Journal onArticleClick={(a) => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setView({ type: 'journal', article: a });
            }} />
          </>
        )}

        {view.type === 'product' && (
          <ProductDetail 
            product={view.product} 
            isWishlisted={wishlistIds.includes(view.product.id)}
            onToggleWishlist={() => toggleWishlist(view.product.id)}
            onBack={() => setView({ type: 'home' })}
            onAddToCart={addToCart}
          />
        )}

        {view.type === 'journal' && (
          <JournalDetail 
            article={view.article} 
            onBack={() => setView({ type: 'home' })}
          />
        )}

        {view.type === 'checkout' && (
            <Checkout 
                items={cartItems}
                onBack={() => {
                  setCartItems([]);
                  setView({ type: 'home' });
                }}
            />
        )}

        {view.type === 'admin' && (
          <AdminPanel 
            onBack={() => setView({ type: 'home' })}
            onProductsChange={refreshAppData}
          />
        )}

        {view.type === 'wishlist' && (
          <Wishlist 
            products={products}
            wishlistIds={wishlistIds}
            onToggleWishlist={toggleWishlist}
            onProductClick={(p) => setView({ type: 'product', product: p })}
            onBack={() => setView({ type: 'home' })}
          />
        )}

        {view.type === 'auth' && (
          <Auth 
            initialMode={view.mode}
            onAuthSuccess={(user) => {
              setCurrentUser(user);
              setView({ type: 'home' });
            }}
            onVerifyNeeded={(email) => setView({ type: 'verify', email, purpose: 'signup' })}
            onBack={() => setView({ type: 'home' })}
          />
        )}

        {view.type === 'account' && currentUser && (
          <Account 
            user={currentUser}
            onBack={() => setView({ type: 'home' })}
            onLogout={handleLogout}
            onRequestEmailChange={(email) => setView({ type: 'verify', email, purpose: 'change_email' })}
          />
        )}

        {view.type === 'verify' && (
          <EmailVerification 
            email={view.email}
            purpose={view.purpose}
            onVerified={(user) => {
              setCurrentUser(user);
              setView({ type: 'account' });
            }}
            onBack={() => setView({ type: currentUser ? 'account' : 'auth', mode: 'login' } as any)}
          />
        )}
      </main>

      {view.type !== 'checkout' && view.type !== 'admin' && view.type !== 'wishlist' && view.type !== 'auth' && view.type !== 'verify' && view.type !== 'account' && (
        <Footer onLinkClick={handleNavClick} onAdminClick={() => setView({ type: 'admin' })} />
      )}
      
      <Assistant />
      
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
            setIsCartOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setView({ type: 'checkout' });
        }}
      />
    </div>
  );
}

export default App;
