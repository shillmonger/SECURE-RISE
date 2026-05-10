'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    
    try {
      // Try to fetch a small resource to check connectivity
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache' 
      });
      
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-6 text-center space-y-6">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <WifiOff className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">You're offline</h1>
            <p className="text-muted-foreground">
              {isOnline 
                ? 'Secure Rise is having trouble connecting. Please try again.'
                : 'Check your internet connection and try again.'
              }
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleRetry} 
            disabled={isRetrying}
            className="w-full"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </>
            )}
          </Button>
          
          <Link href="/" passHref>
            <Button variant="outline" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>

        <div className="text-xs text-muted-foreground space-y-2">
          <p>Some features may still work offline:</p>
          <ul className="text-left space-y-1">
            <li>• Previously viewed pages</li>
            <li>• Cached data</li>
            <li>• Basic navigation</li>
          </ul>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Status: {isOnline ? 'Connected' : 'Offline'}</p>
        </div>
      </div>
    </div>
  );
}
