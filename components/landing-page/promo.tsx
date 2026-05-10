"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Gift } from "lucide-react";
import Link from "next/link";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PromoSection() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    const checkInstalled = () => {
      const isInStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      
      console.log('🔍 App installed check:', isInStandaloneMode);
      setIsInstalled(isInStandaloneMode);
    };

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🚀 beforeinstallprompt event fired!', e);
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      console.log('✅ Install prompt captured and stored');
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('📱 App installed successfully!');
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    checkInstalled();
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if service worker is registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log('🔧 Service Worker registrations:', registrations);
        registrations.forEach(registration => {
          console.log('📋 SW scope:', registration.scope);
          console.log('📋 SW state:', registration.active?.state);
        });
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    console.log('🔘 Install button clicked!');
    console.log('📱 Deferred prompt available:', !!deferredPrompt);
    console.log('📱 Is app installed:', isInstalled);
    
    if (!deferredPrompt) {
      console.log('❌ No install prompt available, falling back to registration');
      // In development, PWA is disabled, so we go to registration
      // In production, this means PWA criteria aren't met yet
      window.location.href = '/auth-page/register';
      return;
    }

    try {
      console.log('🚀 Triggering install prompt...');
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('📊 User choice:', outcome);
      
      if (outcome === 'accepted') {
        console.log('✅ User accepted install!');
        setDeferredPrompt(null);
        // After successful install, redirect to registration
        window.location.href = '/auth-page/register';
      } else {
        console.log('❌ User dismissed install');
      }
    } catch (error) {
      console.error('❌ Error during install prompt:', error);
      // Fallback to registration page
      window.location.href = '/auth-page/register';
    }
  };
  return (
    <section className="mx-auto max-w-[1400px] px-4 lg:px-8 py-10 w-full">
      <div className="relative overflow-hidden rounded-[1.5rem] bg-primary px-6 py-10 md:px-12 md:py-10">
        
        {/* Background Image - Positioned at right end corner */}
        <img 
          src="https://i.postimg.cc/Y0Jy39TC/install-pwa.png" 
          alt="" 
          className="absolute bottom-0 right-0 w-[250px] md:w-[350px] h-auto object-contain opacity-60 md:opacity-100 pointer-events-none translate-x-10 translate-y-10 lg:translate-x-0 lg:translate-y-5"
        />

        {/* Decorative Blur */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 border border-white/20 text-[10px] font-bold uppercase tracking-[.2em] mb-4 text-primary-foreground">
            <Gift className="w-3 h-3" />
            New User Exclusive
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4 text-primary-foreground">
            Claim Your $20 Bonus
          </h2>
          
          <p className="text-primary-foreground/90 text-sm md:text-base max-w-md mb-8 leading-relaxed">
            Install and Register today and receive an instant $20 credit. 
            Bonus becomes withdrawable alongside your first investment payout.
          </p>

<button 
  onClick={handleInstallClick}
  className="w-full lg:w-auto justify-center items-center bg-white text-primary cursor-pointer dark:bg-black dark:text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex gap-3 shadow-lg hover:scale-105 active:scale-95"
>
  {isInstalled
    ? 'Open App Now'
    : (deferredPrompt ? 'Install Our APP Now' : 'Get Started Now')
  }

  <ArrowRight className="w-4 h-4" />
</button>
        </div>
      </div>
    </section>
  );
}