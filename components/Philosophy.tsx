
import React from 'react';
import { SiteContent, ContentKey } from '../types';
import EditableText from './EditableText';
import { COLORS } from '../constants';

interface PhilosophyProps {
  content: SiteContent;
  isEditMode: boolean;
  onUpdate: (key: ContentKey, value: string) => void;
  onFontSizeUpdate: (key: string, size: number) => void;
}

const Philosophy: React.FC<PhilosophyProps> = ({ content, isEditMode, onUpdate, onFontSizeUpdate }) => {
  const items = [
    { keyT: 'philo1T' as ContentKey, keyD: 'philo1D' as ContentKey, icon: 'fa-heart', color: COLORS.primaryBlue },
    { keyT: 'philo2T' as ContentKey, keyD: 'philo2D' as ContentKey, icon: 'fa-fist-raised', color: COLORS.primaryRed },
    { keyT: 'philo3T' as ContentKey, keyD: 'philo3D' as ContentKey, icon: 'fa-users', color: COLORS.primaryBlue },
    { keyT: 'philo4T' as ContentKey, keyD: 'philo4D' as ContentKey, icon: 'fa-running', color: COLORS.primaryRed },
  ];

  return (
    <div className="container mx-auto px-4 py-20 lg:px-20">
      <div className="text-center mb-16">
        <h3 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative after:content-[''] after:block after:w-16 after:h-1 after:bg-[#0047A0] after:mx-auto after:mt-4">
          연세효 <span style={{ color: COLORS.primaryBlue }}>교육가치</span>
        </h3>
        <p className="text-gray-500 mt-2 text-lg">4가지 핵심 가치를 통해 아이들을 지도합니다</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-gray-50"
              style={{ color: item.color }}
            >
              <i className={`fas ${item.icon} text-3xl`}></i>
            </div>
            <EditableText 
              tag="h4"
              value={content[item.keyT] as string}
              isEditMode={isEditMode}
              onUpdate={(v) => onUpdate(item.keyT, v)}
              fontSize={content.fontSizes?.philoT}
              onFontSizeUpdate={(size) => onFontSizeUpdate('philoT', size)}
              className="font-bold mb-3"
            />
            <EditableText 
              tag="p"
              value={content[item.keyD] as string}
              isEditMode={isEditMode}
              onUpdate={(v) => onUpdate(item.keyD, v)}
              fontSize={content.fontSizes?.philoD}
              onFontSizeUpdate={(size) => onFontSizeUpdate('philoD', size)}
              className="text-gray-500 leading-relaxed break-keep"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Philosophy;
