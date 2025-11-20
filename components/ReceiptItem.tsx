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
  // Using picsum with seed for consistent images, grayscale for thermal simulation
  const imageUrl = `https://picsum.photos/seed/${data.imageSeed}/380/250?grayscale`;

  return (
    <div className={`bg-white text-black font-mono p-4 mx-auto shadow-sm border-b border-gray-100 ${PAPER_WIDTH_CLASS} ${className}`}>
      
      {/* Branding Header */}
      <Logo />
      
      {/* Date/Time - Typical Receipt Header */}
      <div className="text-center text-[10px] mb-4 border-b border-black pb-2">
        <p>{new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}</p>
        <p>*** MENSAGEM DO DIA ***</p>
      </div>

      {/* Optional Image */}
      {includeImage && (
        <div className="mb-4 overflow-hidden rounded-sm border border-black">
          <img 
            src={imageUrl} 
            alt="Generated Illustration" 
            className="w-full h-auto block filter contrast-125 brightness-90"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* Content */}
      <div className="text-center mb-6">
        <p className="text-xl font-bold uppercase leading-tight mb-4">
          "{data.text}"
        </p>
        <p className="text-sm italic">
          — {data.authorOrSource}
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] border-t border-black pt-2">
        <p>Obrigado pela preferência!</p>
        <p>www.suaempresa.com.br</p>
      </div>

      {/* Cut Line Visual (only for screen or separate prints) */}
      {showCutLine && (
        <div className="mt-8 border-b-2 border-dashed border-gray-400 w-full relative h-4">
          <span className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 bg-white px-2 text-xs text-gray-500 no-print">
            ✂️ Corte aqui
          </span>
        </div>
      )}
    </div>
  );
};

export default ReceiptItem;
