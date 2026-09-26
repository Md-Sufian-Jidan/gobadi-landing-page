"use client";

import { useState, useEffect } from "react";
import { WifiOff, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);

      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-[24px] shadow-2xl flex flex-col items-center max-w-sm w-full text-center mx-4 gap-4 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-2">
          <WifiOff className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A1A]">No Internet Connection</h2>
        <p className="text-[#525252] text-sm mb-2">
          It looks like you are offline. Please check your internet connection and try again.
        </p>
        <Button 
          onClick={() => window.location.reload()}
          className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-[16px] flex items-center justify-center gap-2 font-semibold text-base transition-all"
        >
          <RefreshCcw className="w-5 h-5" />
          Retry Connection
        </Button>
      </div>
    </div>
  );
}
