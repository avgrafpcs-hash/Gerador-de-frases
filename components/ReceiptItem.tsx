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
  // Using picsum with seed for consistent images, grayscale + high contrast for thermal simulation
  const imageUrl = `https://picsum.photos/seed/${data.imageSeed}/380/280?grayscale`;

  return (
    <div className={`bg-white text-black font-mono p-4 mx-auto shadow-sm ${PAPER_WIDTH_CLASS} ${className}`}>
      
      {/* Branding Header */}
      <Logo />
      
      {/* Date/Time */}
      <div className="text-center text-xs mb-6 border-b-2 border-black pb-2 font-bold">
        <p>{new Date().toLocaleDateString()} - {new Date().toLocaleTimeString().slice(0,5)}</p>
        <p className="mt-1">*** MENSAGEM DO DIA ***</p>
      </div>

      {/* Optional Image */}
      {includeImage && (
        <div className="mb-6 overflow-hidden border-2 border-black">
          <img 
            src={imageUrl} 
            alt="Illustration" 
            className="w-full h-auto block filter contrast-150 brightness-100"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* Content - LARGE TEXT for legibility */}
      <div className="text-center mb-8">
        <p className="text-3xl font-black uppercase leading-snug tracking-tight mb-4 break-words text-black">
          "{data.text}"
        </p>
        <p className="text-lg font-bold italic mt-2 border-t border-black inline-block px-4 pt-1">
          — {data.authorOrSource}
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-xs font-bold border-t-2 border-black pt-2 pb-4">
        <p>Obrigado pela preferência!</p>
        <p className="text-[10px] mt-1">www.suaempresa.com.br</p>
      </div>

      {/* Cut Line Visual */}
      {showCutLine && (
        <div className="mt-10 mb-4 border-b-4 border-dotted border-gray-800 w-full relative h-4">
          <span className="absolute top-[-14px] left-1/2 transform -translate-x-1/2 bg-white px-2 text-xl">
            ✂️
          </span>
        </div>
      )}
    </div>
  );
};

export default ReceiptItem;