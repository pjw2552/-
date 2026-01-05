
import React, { useState, useEffect } from 'react';

interface EditableTextProps {
  value: string;
  isEditMode: boolean;
  onUpdate: (newValue: string) => void;
  className?: string;
  multiline?: boolean;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'div' | 'span';
  fontSize?: number;
  onFontSizeUpdate?: (newSize: number) => void;
}

const EditableText: React.FC<EditableTextProps> = ({ 
  value, 
  isEditMode, 
  onUpdate, 
  className = "", 
  multiline = false,
  tag = 'div',
  fontSize,
  onFontSizeUpdate
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const newVal = e.currentTarget.innerText;
    setLocalValue(newVal);
    onUpdate(newVal);
  };

  const Component = tag;
  const style: React.CSSProperties = {
    whiteSpace: multiline ? 'pre-line' : 'normal',
    fontSize: fontSize ? `${fontSize}px` : undefined,
    lineHeight: fontSize ? '1.3' : undefined
  };

  if (!isEditMode) {
    return <Component className={className} style={style}>{value}</Component>;
  }

  return (
    <div className="relative group/edit">
      <Component
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        className={`${className} outline-dashed outline-1 outline-blue-400/50 bg-blue-50/10 px-1 rounded transition-all hover:bg-blue-50/30 edit-pulse cursor-text`}
        style={style}
      >
        {localValue}
      </Component>
      
      {/* Admin Floating Toolbar */}
      <div className="absolute -top-10 -right-2 opacity-0 group-hover/edit:opacity-100 transition-opacity flex items-center gap-2 z-[60] pointer-events-auto">
        {onFontSizeUpdate && fontSize !== undefined && (
          <div className="bg-blue-600 text-white rounded-lg shadow-xl flex items-center p-1 border border-white/20">
            <button 
              onClick={(e) => { e.preventDefault(); onFontSizeUpdate(fontSize - 1); }}
              className="w-6 h-6 hover:bg-blue-700 rounded flex items-center justify-center transition-colors"
              title="글씨 작게"
            >
              <i className="fas fa-minus text-[10px]"></i>
            </button>
            <div className="px-2 font-black text-[11px] min-w-[40px] text-center border-x border-white/10 mx-1">
              {fontSize}px
            </div>
            <button 
              onClick={(e) => { e.preventDefault(); onFontSizeUpdate(fontSize + 1); }}
              className="w-6 h-6 hover:bg-blue-700 rounded flex items-center justify-center transition-colors"
              title="글씨 크게"
            >
              <i className="fas fa-plus text-[10px]"></i>
            </button>
          </div>
        )}
        <div className="bg-blue-600 text-white text-[10px] px-3 py-1.5 rounded-lg shadow-xl font-black flex items-center gap-1 border border-white/20">
          <i className="fas fa-pen"></i> 수정 중
        </div>
      </div>
    </div>
  );
};

export default EditableText;
