import React from 'react';
import { Link } from 'react-router-dom';
import { ToucanLogo } from './ToucanLogo';

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#EDE9FE] py-12 mt-16 text-xs text-[#6B6385]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#EDE9FE]">
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-3 md:col-span-1">
            <ToucanLogo size="md" />
            <p className="text-xs leading-relaxed text-[#6B6385]">
              AI-native travel discovery & itinerary planner. Tripadvisor-style browsing, vetted stays, and personal Telegram trip assistance.
            </p>
          </div>

          {/* Column 2: Destinations */}
          <div className="space-y-2">
            <p className="font-semibold text-[#1F1637] text-xs uppercase tracking-wider">Destinations</p>
            <ul className="space-y-1.5">
              <li><Link to="/destination/amalfi-coast" className="hover:text-[#6D28D9] transition-colors">Amalfi Coast, Italy</Link></li>
              <li><Link to="/destination/kyoto" className="hover:text-[#6D28D9] transition-colors">Kyoto, Japan</Link></li>
              <li><Link to="/destination/goa" className="hover:text-[#6D28D9] transition-colors">Goa, India</Link></li>
            </ul>
          </div>

          {/* Column 3: Tools & Integration */}
          <div className="space-y-2">
            <p className="font-semibold text-[#1F1637] text-xs uppercase tracking-wider">Travel Suite</p>
            <ul className="space-y-1.5">
              <li><Link to="/plan" className="hover:text-[#6D28D9] transition-colors">AI Itinerary Planner</Link></li>
              <li><Link to="/trips" className="hover:text-[#6D28D9] transition-colors">My Saved Trips</Link></li>
              <li><Link to="/telegram" className="hover:text-[#6D28D9] transition-colors">Telegram Bot Setup</Link></li>
              <li><Link to="/admin" className="hover:text-[#6D28D9] transition-colors">Admin Moderation Hub</Link></li>
            </ul>
          </div>

          {/* Column 4: Affiliate & Booking Disclosure */}
          <div className="space-y-2">
            <p className="font-semibold text-[#1F1637] text-xs uppercase tracking-wider">Affiliate Disclosure</p>
            <p className="text-[11px] leading-relaxed text-[#6B6385]">
              Wayfarer is a redirect-only travel platform. We never process customer payments or store booking cards. When you click partner links, Wayfarer may earn an affiliate commission at no extra cost to you.
            </p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6B6385]">
          <p>© {new Date().getFullYear()} Wayfarer AI. Built for travelers worldwide.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#1F1637]">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-[#1F1637]">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-[#1F1637]">Community Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
