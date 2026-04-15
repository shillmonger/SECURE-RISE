"use client";


import React, { useState } from "react";

import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";
import Testimonials from "@/components/landing-page/Testimonials";
import NumbersThatSpeaks from "@/components/landing-page/numbers-that-speaks";

export default function UserTestimonialsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);


  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
          <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    
          <div className="flex-1 flex flex-col overflow-hidden text-foreground">
            <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar">

          {/* Testimonial Content */}
          <div className="py-8 pb-20 lg:pb-0">
            <div className="p-0 lg:px-15">
            <Testimonials />
            </div>

            
            <div className="border-t border-border">
               <NumbersThatSpeaks />
            </div>
          </div>
             <UserNav />

        </main>
      </div>

      {/* Tailwind Animation Injections - Essential for the marquee effect */}
      <style jsx global>{`
        @keyframes marquee-up {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        @keyframes marquee-down {
          from { transform: translateY(-50%); }
          to { transform: translateY(0); }
        }
        .animate-marquee-up {
          animation: marquee-up 50s linear infinite;
        }
        .animate-marquee-down {
          animation: marquee-down 50s linear infinite;
        }
      `}</style>
    </div>
  );
}