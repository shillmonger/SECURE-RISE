"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleOneTap() {
  const pathname = usePathname();

  useEffect(() => {
    // Only initialize on public pages (not dashboard, auth pages, etc.)
    const isPublicPage = !pathname.startsWith('/user-dashboard') &&
                        !pathname.startsWith('/auth-page') &&
                        !pathname.startsWith('/admin');

    if (!isPublicPage) return;

    // Initialize Google One Tap
    const initGoogleOneTap = () => {
      if (typeof window !== 'undefined' && window.google && window.google.accounts) {
        // Check if user is already authenticated
        const isAuthenticated = document.cookie.includes('next-auth.session-token') ||
                              document.cookie.includes('__Secure-next-auth.session-token');

        if (isAuthenticated) return;

        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed) {
            console.log('Google One Tap not displayed');
          }
          if (notification.isSkipped) {
            console.log('Google One Tap skipped');
          }
        });
      }
    };

    // Wait for Google script to load
    const checkGoogleScript = setInterval(() => {
      if (typeof window !== 'undefined' && window.google && window.google.accounts) {
        clearInterval(checkGoogleScript);
        initGoogleOneTap();
      }
    }, 100);

    // Cleanup
    return () => {
      clearInterval(checkGoogleScript);
    };
  }, [pathname]); // Re-run on route changes

  const handleCredentialResponse = async (response: any) => {
    try {
      const res = await fetch('/api/auth/google-one-tap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.redirect) {
          window.location.href = data.redirect;
        }
      } else {
        console.error('Google One Tap failed:', await res.text());
      }
    } catch (error) {
      console.error('Google One Tap error:', error);
    }
  };

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
    />
  );
}
