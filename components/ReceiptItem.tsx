import React from 'react';
import { GeneratedContent } from '../types';
import { PAPER_WIDTH_CLASS } from '../constants';
import Logo from './Logo';

interface ReceiptItemProps {
  data: GeneratedContent;
  includeImage: boolean;
  showCutLine?: boolean;
  className?: string;
}

const ReceiptItem: React.FC<ReceiptItemProps> = ({ data, includeImage, showCutLine, className = '' }) => {
  const imageUrl = `https://picsum.photos/seed/${data.imageSeed}/380/250?grayscale`;

  return (
    <div className={`bg-white text-black font-mono p-2 mx-auto shadow-sm ${PAPER_WIDTH_CLASS} ${className}`}>
      
      {/* Compact Header */}
      <div className="transform scale-75 origin-top -mb-2">
        <Logo />
      </div>
      
      {/* Compact Date */}
      <div className="text-center text-[10px] leading-tight mb-2 border-b border-black pb-1 font-bold">
        <span>{new Date().toLocaleDateString()} • {new Date().toLocaleTimeString().slice(0,5)}</span>
      </div>

      {/* Image - Reduced Margin */}
      {includeImage && (
        <div className="mb-3 overflow-hidden border-2 border-black">
          <img 
            src={imageUrl} 
            alt="Art" 
            className="w-full h-auto block filter contrast-125 brightness-110"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* Content - Compact Vertical Spacing but LARGE Text */}
      <div className="text-center mb-3 px-1">
        <p className="text-2xl font-black uppercase leading-none tracking-tighter mb-2 text-black">
          {data.text}
        </p>
        <p className="text-sm font-bold italic mt-1 inline-block px-2">
          — {data.authorOrSource}
        </p>
      </div>

      {/* Compact Footer */}
      <div className="text-center text-[10px] font-bold border-t border-black pt-1">
        <p>www.suaempresa.com.br</p>
      </div>

      {/* Minimal Cut Line */}
      {showCutLine && (
        <div className="mt-6 mb-0 border-b-2 border-dotted border-gray-400 w-full relative h-2 flex justify-center">
          <span className="bg-white px-1 text-xs text-gray-500 relative -top-3">✂️</span>
        </div>
      )}
    </div>
  );
};

export default ReceiptItem;