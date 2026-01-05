
import React, { useState } from 'react';
import { SiteContent, ContentKey } from '../types';
import EditableText from './EditableText';
import { COLORS } from '../constants';

interface IntroProps {
  content: SiteContent;
  isEditMode: boolean;
  onUpdate: (key: ContentKey, value: string) => void;
  onImageClick: (key: ContentKey) => void;
  onImageDrop?: (key: ContentKey, file: File) => void;
}

const Intro: React.FC<IntroProps> = ({ content, isEditMode, onUpdate, onImageClick, onImageDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/') && onImageDrop) {
      onImageDrop('masterImg', file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 lg:px-20">
      <div className="text-center mb-16">
        <h3 className="text-3xl md:text-4xl font-bold mb-4 inline-block relative after:content-[''] after:block after:w-16 after:h-1 after:bg-[#0047A0] after:mx-auto after:mt-4">
          관장님 <span style={{ color: COLORS.primaryBlue }}>인사말</span>
        </h3>
        <EditableText 
          value={content.introSub}
          isEditMode={isEditMode}
          onUpdate={(v) => onUpdate('introSub', v)}
          className="text-gray-500 mt-2 text-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div 
          className={`group relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
            isEditMode ? 'cursor-pointer hover:scale-[1.02] border-2 border-dashed border-blue-400' : ''
          } ${isDragOver ? 'drag-active' : ''}`}
          onClick={() => onImageClick('masterImg')}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <img 
            src={content.masterImg} 
            alt="관장님" 
            className="w-full h-auto object-cover min-h-[400px]"
          />
          {isEditMode && (
            <div className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white font-bold transition-opacity ${isDragOver ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <i className={`fas ${isDragOver ? 'fa-cloud-upload-alt text-5xl' : 'fa-camera text-2xl'} mb-2`}></i>
              <p>{isDragOver ? '이미지를 여기에 놓으세요' : '클릭하거나 드래그하여 교체'}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <EditableText 
            tag="h4"
            value={content.masterTitle}
            isEditMode={isEditMode}
            onUpdate={(v) => onUpdate('masterTitle', v)}
            className="text-2xl md:text-3xl font-black text-gray-800 italic"
          />
          <EditableText 
            value={content.masterText}
            isEditMode={isEditMode}
            onUpdate={(v) => onUpdate('masterText', v)}
            className="text-gray-600 leading-relaxed text-lg"
            multiline
          />
        </div>
      </div>
    </div>
  );
};

export default Intro;
