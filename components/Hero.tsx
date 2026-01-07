
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
  
  // content.heroImages가 없거나 비어있는 경우를 위한 철저한 방어 로직
  const images = (Array.isArray(content.heroImages) && content.heroImages.length > 0) 
    ? content.heroImages 
    : [...DEFAULT_CONTENT.heroImages];

  useEffect(() => {
    if (images.length <= 1 || isEditMode) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length, isEditMode]);

  useEffect(() => {
    if (currentIdx >= images.length) {
      setCurrentIdx(0);
    }
  }, [images.length, currentIdx]);

  return (
    <section className="relative h-[85vh] mt-20 flex items-center justify-center text-center text-white overflow-hidden bg-gray-900">
      {/* Background Images Layer */}
      {images.map((img, idx) => (
        <div
          key={`hero-bg-${idx}`}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            idx === currentIdx ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url('${img || DEFAULT_CONTENT.heroImages[0]}') center/cover no-repeat`
          }}
        />
      ))}

      {isEditMode && (
        <div className="absolute inset-x-0 bottom-24 z-40 flex flex-col items-center gap-4 px-4">
          <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-2xl flex items-center gap-4 overflow-x-auto max-w-full">
            <div className="flex gap-2 shrink-0">
              {images.map((img, idx) => (
                <button 
                  key={`thumb-${idx}`} 
                  onClick={() => setCurrentIdx(idx)}
                  className={`relative w-12 h-12 rounded-lg border-2 overflow-hidden ${
                    idx === currentIdx ? 'border-blue-600 scale-110 shadow-lg' : 'border-white opacity-50'
                  }`}
                >
                  <img src={img || DEFAULT_CONTENT.heroImages[0]} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
              <button 
                onClick={onAddImage}
                className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 flex items-center justify-center hover:bg-gray-50"
              >
                <i className="fas fa-plus text-xs"></i>
              </button>
            </div>

            <div className="flex gap-1 shrink-0 ml-2">
              <button onClick={() => onImageClick(currentIdx)} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-[10px] font-black">교체</button>
              {images.length > 1 && (
                <button onClick={() => onRemoveImage(currentIdx)} className="bg-red-500 text-white px-3 py-2 rounded-lg text-[10px] font-black">삭제</button>
              )}
            </div>
          </div>
        </div>
      )}

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
          <a href="#apply" className="inline-block bg-[#CD2E3A] hover:bg-[#b01b26] transition-all transform hover:-translate-y-1 text-white font-bold py-4 px-10 rounded-full text-lg shadow-2xl">
            지금 무료 체험 신청하기
          </a>
        )}
      </div>

      {!isEditMode && images.length > 1 && (
        <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center gap-2">
          {images.map((_, idx) => (
            <button
              key={`dot-${idx}`}
              onClick={() => setCurrentIdx(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === currentIdx ? 'bg-white w-8' : 'bg-white/40 w-1.5'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
