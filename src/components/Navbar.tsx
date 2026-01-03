import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, User, Play } from 'lucide-react';
import { SearchModal } from './SearchModal';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv-shows' },
    { name: 'Animes', path: '/animes' },
    { name: 'My List', path: '/my-list' },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-[60] transition-all duration-500 px-4 md:px-12 py-4 flex items-center justify-between ${isScrolled ? 'bg-[#141414] shadow-2xl' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-primary font-black text-2xl tracking-tighter">
            <Play fill="currentColor" className="w-8 h-8" />
            <span>BOLTFLIX</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors hover:text-white/70 ${
                  location.pathname === link.path ? 'text-white font-bold' : 'text-textSecondary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 text-white">
          <Search
            className="w-5 h-5 cursor-pointer hover:text-primary transition-colors"
            onClick={() => setIsSearchOpen(true)}
          />
          <Bell className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center cursor-pointer border border-primary/30 hover:border-primary transition-all">
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
