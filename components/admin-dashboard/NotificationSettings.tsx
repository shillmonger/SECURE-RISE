"use client";

import React, { useState, useEffect } from "react";
import { Bell, BellOff, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useFCM } from "@/hooks/useFCM";

export default function NotificationSettings() {
  const [isVisible, setIsVisible] = useState(false);
  const { 
    token, 
    permissionStatus, 
    isLoading, 
    isSupported, 
    registerToken, 
    removeToken,
    autoRegisterForAdmin 
  } = useFCM();

  useEffect(() => {
    // Auto-register for admin users
    autoRegisterForAdmin();
  }, [autoRegisterForAdmin]);

  const handleEnableNotifications = async () => {
    const success = await registerToken();
    if (success) {
      toast.success('Push notifications enabled successfully!');
    } else {
      toast.error('Failed to enable notifications. Please check your browser settings.');
    }
  };

  const handleDisableNotifications = async () => {
    const success = await removeToken();
    if (success) {
      toast.success('Push notifications disabled');
    } else {
      toast.error('Failed to disable notifications');
    }
  };

  // Don't show if not supported
  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Floating Notification Bell */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className={`relative p-4 rounded-full shadow-lg transition-all ${
            permissionStatus === 'granted' && token
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border text-foreground hover:bg-muted'
          }`}
          title="Notification Settings"
        >
          {permissionStatus === 'granted' && token ? (
            <Bell className="w-5 h-5" />
          ) : (
            <BellOff className="w-5 h-5" />
          )}
          
          {/* Status indicator */}
          <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
            permissionStatus === 'granted' && token
              ? 'bg-green-500'
              : 'bg-orange-500'
          }`} />
        </button>
      </div>

      {/* Settings Panel */}
      {isVisible && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Notification Settings</h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ×
              </button>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${
                permissionStatus === 'granted' && token
                  ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                  : permissionStatus === 'denied'
                  ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                  : 'bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800'
              }`}>
                <div className="flex items-center gap-3">
                  {permissionStatus === 'granted' && token ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : permissionStatus === 'denied' ? (
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  )}
                  
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      {permissionStatus === 'granted' && token
                        ? 'Push notifications enabled'
                        : permissionStatus === 'denied'
                        ? 'Notifications blocked'
                        : 'Notifications not enabled'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {permissionStatus === 'granted' && token
                        ? 'You will receive notifications for new deposits and important updates.'
                        : permissionStatus === 'denied'
                        ? 'Please enable notifications in your browser settings to receive alerts.'
                        : 'Enable notifications to stay updated with new deposits and important events.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Token Info */}
              {token && (
                <div className="p-3 bg-muted/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">FCM Token:</p>
                  <p className="text-xs font-mono text-foreground break-all">{token.slice(0, 20)}...{token.slice(-20)}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {permissionStatus !== 'granted' || !token ? (
                  <button
                    onClick={handleEnableNotifications}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Enabling...
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4" />
                        Enable Notifications
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleDisableNotifications}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-card border border-border text-foreground rounded-xl font-semibold text-sm hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Disabling...
                      </>
                    ) : (
                      <>
                        <BellOff className="w-4 h-4" />
                        Disable Notifications
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Instructions */}
              {permissionStatus === 'denied' && (
                <div className="p-3 bg-muted/30 rounded-xl">
                  <p className="text-xs text-muted-foreground">
                    <strong>To enable notifications:</strong>
                    <br />
                    1. Click the lock/info icon in your browser's address bar
                    <br />
                    2. Find "Notifications" in the settings
                    <br />
                    3. Change from "Block" to "Allow"
                    <br />
                    4. Refresh the page and try again
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
