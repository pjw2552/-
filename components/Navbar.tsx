
import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants';
import { SiteContent } from '../types';

interface NavbarProps {
  content?: SiteContent;
  isEditMode?: boolean;
  onImageClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ content, isEditMode, onImageClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '도장소개', href: '#intro' },
    { name: '교육철학', href: '#philosophy' },
    { name: '수련안내', href: '#programs' },
    { name: '도장소식', href: '#notice' },
    { name: '상담문의', href: '#contact' },
    { name: '무료체험신청', href: '#apply', highlight: true },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      setIsOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 shadow-md py-0' : 'bg-white py-2'
    } backdrop-blur-sm border-b border-gray-100`}>
      <div className="container mx-auto px-4 lg:px-20 h-20 flex justify-between items-center">
        
        {/* Logo and Brand Name */}
        <div className="flex items-center gap-3">
          {/* Editable Logo Image */}
          <div 
            className={`relative h-10 md:h-12 w-auto flex items-center group/logo ${isEditMode ? 'cursor-pointer' : ''}`}
            onClick={isEditMode ? onImageClick : undefined}
          >
            {content?.logoImg ? (
              <img 
                src={content.logoImg} 
                alt="연세효 태권도 로고" 
                className="h-full w-auto object-contain transition-transform group-hover/logo:scale-105"
              />
            ) : (
              <div className="h-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-image text-gray-300"></i>
              </div>
            )}
            {isEditMode && (
              <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center rounded-lg transition-opacity border-2 border-dashed border-blue-600">
                <i className="fas fa-camera text-blue-600"></i>
              </div>
            )}
          </div>

          <a 
            href="#" 
            onClick={(e) => handleLinkClick(e, '#')}
            className="text-xl md:text-2xl font-black tracking-tighter flex items-center group cursor-pointer"
          >
            <span style={{ color: COLORS.primaryBlue }}>연세</span>
            <span style={{ color: COLORS.primaryRed }} className="mr-1">효</span>
            <span className="group-hover:text-blue-700 transition-colors">태권도</span>
          </a>
        </div>

        {/* Desktop GNB */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={`font-bold transition-all duration-300 relative group ${
                link.highlight 
                ? 'bg-[#CD2E3A] text-white px-5 py-2.5 rounded-full hover:bg-red-700 shadow-lg shadow-red-100 hover:scale-105 active:scale-95' 
                : 'text-gray-700 hover:text-blue-700'
              }`}
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              {link.name}
              {!link.highlight && (
                <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-blue-700 transition-all duration-300 group-hover:w-full"></span>
              )}
            </a>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-2xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <i className={`fas ${isOpen ? 'fa-times text-red-600' : 'fa-bars text-gray-800'}`}></i>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-white z-[49] animate-fade-in-down shadow-xl overflow-y-auto h-screen pb-40">
          <div className="flex flex-col p-6 space-y-2">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`text-xl font-black py-5 border-b border-gray-50 flex items-center justify-between group active:bg-gray-50 px-4 rounded-xl transition-colors ${
                  link.highlight ? 'text-red-600 bg-red-50/50' : 'text-gray-800'
                }`}
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                <span>{link.name}</span>
                <i className={`fas fa-chevron-right text-sm opacity-30 group-hover:opacity-100 transition-opacity`}></i>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
