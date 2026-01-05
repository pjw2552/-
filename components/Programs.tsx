
import React, { useState } from 'react';
import { SiteContent, ContentKey } from '../types';
import EditableText from './EditableText';
import { COLORS } from '../constants';

interface ProgramsProps {
  content: SiteContent;
  isEditMode: boolean;
  onUpdate: (key: ContentKey, value: string) => void;
  onFontSizeUpdate: (key: string, size: number) => void;
  onImageClick: (key: ContentKey) => void;
  onImageDrop?: (key: ContentKey, file: File) => void;
}

const Programs: React.FC<ProgramsProps> = ({ content, isEditMode, onUpdate, onFontSizeUpdate, onImageClick, onImageDrop }) => {
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  const programs = [
    {
      type: 'preschool',
      tag: '유치부 키즈반',
      titleKey: 'prog1Title' as ContentKey,
      descKey: 'prog1Desc' as ContentKey,
      imgKey: 'prog1Img' as ContentKey,
      featureKeys: ['prog1F1', 'prog1F2', 'prog1F3'] as ContentKey[]
    },
    {
      type: 'elementary',
      tag: '초등부 정규반',
      titleKey: 'prog2Title' as ContentKey,
      descKey: 'prog2Desc' as ContentKey,
      imgKey: 'prog2Img' as ContentKey,
      featureKeys: ['prog2F1', 'prog2F2', 'prog2F3'] as ContentKey[]
    },
    {
      type: 'rope',
      tag: '줄넘기 전문반',
      titleKey: 'prog3Title' as ContentKey,
      descKey: 'prog3Desc' as ContentKey,
      imgKey: 'prog3Img' as ContentKey,
      featureKeys: ['prog3F1', 'prog3F2', 'prog3F3'] as ContentKey[]
    },
    {
      type: 'advanced',
      tag: '시범단 · 중고등부',
      titleKey: 'prog4Title' as ContentKey,
      descKey: 'prog4Desc' as ContentKey,
      imgKey: 'prog4Img' as ContentKey,
      featureKeys: ['prog4F1', 'prog4F2', 'prog4F3'] as ContentKey[]
    }
  ];

  const handleDragOver = (e: React.DragEvent, key: string) => {
    if (!isEditMode) return;
    e.preventDefault();
    setDragOverKey(key);
  };

  const handleDragLeave = () => {
    setDragOverKey(null);
  };

  const handleDrop = (e: React.DragEvent, key: ContentKey) => {
    if (!isEditMode) return;
    e.preventDefault();
    setDragOverKey(null);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/') && onImageDrop) {
      onImageDrop(key, file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 lg:px-12">
      <div className="text-center mb-16">
        <h3 className="text-3xl md:text-5xl font-black mb-4 inline-block relative after:content-[''] after:block after:w-20 after:h-1.5 after:bg-[#0047A0] after:mx-auto after:mt-6">
          수련 <span style={{ color: COLORS.primaryBlue }}>프로그램</span>
        </h3>
        <p className="text-gray-500 mt-6 text-lg md:text-xl font-medium">우리 아이의 성장에 맞춘 4가지 전문 커리큘럼</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {programs.map((prog, idx) => (
          <div 
            key={idx} 
            className="group flex flex-col bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full"
          >
            {/* Image Section */}
            <div 
              className={`relative aspect-[4/3] w-full overflow-hidden bg-gray-100 transition-all ${
                isEditMode ? 'cursor-pointer' : ''
              } ${dragOverKey === prog.imgKey ? 'ring-4 ring-inset ring-blue-500' : ''}`}
              onClick={() => onImageClick(prog.imgKey)}
              onDragOver={(e) => handleDragOver(e, prog.imgKey)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, prog.imgKey)}
            >
              {content[prog.imgKey] ? (
                <img 
                  src={content[prog.imgKey] as string} 
                  alt={prog.tag} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <i className="fas fa-image text-4xl"></i>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40"></div>
              
              <div className="absolute top-5 left-5 z-10">
                <span className="backdrop-blur-md bg-[#0047A0]/80 text-white text-[10px] md:text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg border border-white/20">
                  {prog.tag}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8 flex flex-col flex-1">
              <EditableText 
                tag="h4"
                value={content[prog.titleKey] as string}
                isEditMode={isEditMode}
                onUpdate={(v) => onUpdate(prog.titleKey, v)}
                fontSize={content.fontSizes?.progTitle}
                onFontSizeUpdate={(size) => onFontSizeUpdate('progTitle', size)}
                className="font-black mb-4 text-gray-900 min-h-[3.5rem] flex items-center leading-tight break-keep"
              />
              <EditableText 
                value={content[prog.descKey] as string}
                isEditMode={isEditMode}
                onUpdate={(v) => onUpdate(prog.descKey, v)}
                fontSize={content.fontSizes?.progDesc}
                onFontSizeUpdate={(size) => onFontSizeUpdate('progDesc', size)}
                className="text-gray-500 mb-8 leading-relaxed flex-1 break-keep"
                multiline
              />
              
              <div className="space-y-2 mt-auto">
                {prog.featureKeys.map((fKey, i) => (
                  <div key={i} className="flex items-center text-gray-800 font-bold bg-gray-50 px-3 py-3 md:px-4 md:py-3.5 rounded-2xl border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all duration-300">
                    <i className="fas fa-check-circle text-[#CD2E3A] mr-2 md:mr-3 shrink-0 text-xs"></i> 
                    <div className="flex-1">
                      <EditableText 
                        value={content[fKey] as string}
                        isEditMode={isEditMode}
                        onUpdate={(v) => onUpdate(fKey, v)}
                        fontSize={content.fontSizes?.progFeature}
                        onFontSizeUpdate={(size) => onFontSizeUpdate('progFeature', size)}
                        className="text-[11px] md:text-[12px] leading-tight break-keep"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Programs;
