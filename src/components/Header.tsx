'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Products', href: '/products', dropdown: [
    { name: 'Mental Health Range', href: '/mental-healthrange' },
    { name: 'Post Treatment Skincare', href: '/post-treatment-skincare' },
    { name: 'All Products', href: '/products' },
  ]},
  { name: 'FAQs', href: '/faq' },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'Contact Us', href: '/contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: '#1a3a8f' }}>
        <div className="container mx-auto px-4 lg:px-6 flex items-center justify-between h-9">
          {/* Social icons */}
          <div className="flex items-center gap-3">
            <a href="https://facebook.com/botanicalaid" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/80 hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://x.com/botanicalaid" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className="text-white/80 hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://instagram.com/botanicalaid" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/80 hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
              </svg>
            </a>
          </div>
          {/* Shipping message */}
          <p className="text-white text-xs font-medium tracking-wide">FREE Shipping for orders over $99</p>
          {/* Phone */}
          <a href="tel:1300895132" className="hidden sm:flex items-center gap-1.5 text-white text-xs hover:text-white/80 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            1300 895 132
          </a>
        </div>
      </div>

      {/* Main Nav */}
      <nav
        ref={dropdownRef}
        className={`fixed top-9 left-0 right-0 z-40 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'border-b border-gray-100'}`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-[72px]">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 hover:opacity-90 transition-opacity">
              <Image
                src="/assets/logo-white.png"
                alt="Botanical Aid"
                width={147}
                height={51}
                unoptimized
                className="h-12 w-auto"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.dropdown ? (
                    <button
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                      className="flex items-center gap-0.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#1a3a8f] transition-colors rounded"
                    >
                      {item.name}
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#1a3a8f] transition-colors block rounded relative group"
                    >
                      {item.name}
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1a3a8f] scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
                    </Link>
                  )}

                  {item.dropdown && activeDropdown === item.name && (
                    <div
                      className="absolute top-full left-0 mt-0 w-56 bg-white border border-gray-100 shadow-xl rounded-b-lg py-1 z-50"
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.dropdown.map((d) => (
                        <Link
                          key={d.name}
                          href={d.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1a3a8f] transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {d.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/cart" className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-[#1a3a8f] transition-colors rounded-full hover:bg-gray-50" aria-label="Cart">
                <ShoppingCart className="h-4.5 w-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#22c55e] text-white text-[10px] font-bold rounded-full min-w-[17px] min-h-[17px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href="/products"
                className="ml-2 px-5 py-2 rounded text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#1a3a8f' }}
              >
                SHOP NOW
              </Link>
            </div>

            {/* Mobile */}
            <div className="lg:hidden flex items-center gap-1.5">
              <Link href="/cart" className="relative w-9 h-9 flex items-center justify-center text-gray-600 hover:text-[#1a3a8f]">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#22c55e] text-white text-[10px] font-bold rounded-full min-w-[17px] h-[17px] flex items-center justify-center px-0.5">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-[#1a3a8f]"
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {isMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-100 py-3 space-y-0.5">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <div>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                        className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-medium text-gray-700 hover:text-[#1a3a8f] hover:bg-blue-50 rounded"
                      >
                        {item.name}
                        <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      {activeDropdown === item.name && (
                        <div className="pl-4 space-y-0.5">
                          {item.dropdown.map((d) => (
                            <Link key={d.name} href={d.href} className="block py-2 px-3 text-sm text-gray-600 hover:text-[#1a3a8f] hover:bg-blue-50 rounded" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}>
                              {d.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link href={item.href} className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:text-[#1a3a8f] hover:bg-blue-50 rounded" onClick={() => setIsMenuOpen(false)}>
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-2 px-3">
                <Link href="/products" className="block text-center py-2.5 rounded text-sm font-semibold text-white" style={{ backgroundColor: '#1a3a8f' }} onClick={() => setIsMenuOpen(false)}>
                  SHOP NOW
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
