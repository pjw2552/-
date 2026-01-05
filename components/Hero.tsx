
import React, { useState, useEffect } from 'react';
import { SiteContent, ContentKey } from '../types';
import EditableText from './EditableText';
import { DEFAULT_CONTENT } from '../constants';

interface HeroProps {
  content: SiteContent;
  isEditMode: boolean;
  onUpdate: (key: ContentKey, value: string) => void;
  onFontSizeUpdate: (key: string, size: number) => void;
  onImageClick: (index: number) => void;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
}

const Hero: React.FC<HeroProps> = ({ 
  content, 
  isEditMode, 
  onUpdate, 
  onFontSizeUpdate,
  onImageClick, 
  onAddImage, 
  onRemoveImage,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const images = (Array.isArray(content.heroImages) && content.heroImages.length > 0) 
    ? content.heroImages 
    : DEFAULT_CONTENT.heroImages;

  useEffect(() => {
    if (images.length <= 1 || isEditMode) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length, isEditMode]);

  useEffect(() => {
    if (currentIdx >= images.length) {
      setCurrentIdx(Math.max(0, images.length - 1));
    }
  }, [images.length, currentIdx]);

  const handleApplyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('apply');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    onRemoveImage(idx);
  };

  return (
    <section className="relative h-[85vh] mt-20 flex items-center justify-center text-center text-white overflow-hidden">
      {/* Background Images Layer */}
      {images.map((img, idx) => (
        <div
          key={`hero-bg-${idx}-${img.length}`}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            idx === currentIdx ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${img || DEFAULT_CONTENT.heroImages[0]}') center/cover no-repeat`
          }}
        />
      ))}

      {/* Admin Panel: Floating Background Manager */}
      {isEditMode && (
        <div className="absolute inset-x-0 bottom-28 z-40 flex flex-col items-center gap-4 animate-fade-in-down">
          <div className="bg-white/95 backdrop-blur-xl px-6 py-4 rounded-[2rem] shadow-2xl border border-blue-100 flex items-center gap-5">
            <div className="flex -space-x-3">
              {images.map((img, idx) => (
                <button 
                  key={`thumb-${idx}-${img.length}`} 
                  onClick={() => setCurrentIdx(idx)}
                  className={`relative w-14 h-14 rounded-2xl border-4 transition-all overflow-hidden shadow-sm ${
                    idx === currentIdx ? 'border-blue-600 scale-110 z-10 shadow-blue-200' : 'border-white opacity-40 hover:opacity-80'
                  }`}
                >
                  <img src={img || DEFAULT_CONTENT.heroImages[0]} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
              <button 
                onClick={onAddImage}
                className="w-14 h-14 rounded-2xl border-4 border-white bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm"
                title="슬라이드 추가"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>

            <div className="h-10 w-[1px] bg-gray-200"></div>

            <div className="flex gap-2">
              <button 
                onClick={() => onImageClick(currentIdx)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-2 transition-transform active:scale-95"
              >
                <i className="fas fa-sync-alt"></i> 사진 변경
              </button>
              {images.length > 1 && (
                <button 
                  onClick={(e) => handleDelete(e, currentIdx)}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-2 transition-transform active:scale-95"
                >
                  <i className="fas fa-trash"></i> 삭제
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Text */}
      <div className="container mx-auto px-4 max-w-4xl z-10">
        <EditableText 
          tag="h2"
          value={content.heroTitle}
          isEditMode={isEditMode}
          onUpdate={(val) => onUpdate('heroTitle', val)}
          fontSize={content.fontSizes?.heroTitle}
          onFontSizeUpdate={(size) => onFontSizeUpdate('heroTitle', size)}
          className="font-black mb-6 leading-tight text-shadow-hero"
          multiline
        />
        <EditableText 
          tag="p"
          value={content.heroDesc}
          isEditMode={isEditMode}
          onUpdate={(val) => onUpdate('heroDesc', val)}
          fontSize={content.fontSizes?.heroDesc}
          onFontSizeUpdate={(size) => onFontSizeUpdate('heroDesc', size)}
          className="font-light mb-10 text-shadow-hero opacity-90"
        />
        {!isEditMode && (
          <a 
            href="#apply" 
            onClick={handleApplyClick}
            className="inline-block bg-[#CD2E3A] hover:bg-[#b01b26] transition-all transform hover:-translate-y-1 text-white font-bold py-5 px-12 rounded-full text-xl shadow-2xl cursor-pointer"
          >
            지금 무료 체험 신청하기
          </a>
        )}
      </div>

      {/* Navigation Dots (Public Mode Only) */}
      {!isEditMode && images.length > 1 && (
        <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center gap-3">
          {images.map((_, idx) => (
            <button
              key={`dot-${idx}`}
              onClick={() => setCurrentIdx(idx)}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === currentIdx ? 'bg-white w-10' : 'bg-white/30 w-2 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
