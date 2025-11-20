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
  // Adding random param to ensure browser doesn't cache heavily if seeds repeat
  const imageUrl = `https://picsum.photos/seed/${data.imageSeed}/400/300?grayscale`;

  return (
    <div className={`bg-white text-black font-sans p-2 mx-auto ${PAPER_WIDTH_CLASS} ${className}`}>
      
      <div className="px-2 pb-4">
        {/* Branding Header */}
        <Logo />
        
        {/* Date/Time - Typical Receipt Header */}
        <div className="text-center font-mono text-[12px] mb-6 border-b-2 border-black pb-2">
          <p className="font-bold">{new Date().toLocaleDateString()} • {new Date().toLocaleTimeString().slice(0, 5)}</p>
          <p className="uppercase tracking-widest mt-1">Sua Dose de Inspiração</p>
        </div>

        {/* Optional Image */}
        {includeImage && (
          <div className="mb-6 overflow-hidden border-2 border-black rounded-sm">
            <img 
              src={imageUrl} 
              alt="Generated Illustration" 
              className="w-full h-auto block filter contrast-125 brightness-110"
              crossOrigin="anonymous"
            />
          </div>
        )}

        {/* Content */}
        <div className="text-center mb-8">
          <p className="text-3xl font-black uppercase leading-8 tracking-tight mb-5 text-black">
            "{data.text}"
          </p>
          <div className="inline-block border-t border-black pt-1 px-4">
             <p className="text-lg font-medium italic font-serif text-gray-800">
              {data.authorOrSource}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center font-mono text-[11px] border-t-2 border-black border-dashed pt-3">
          <p className="font-bold uppercase mb-1">Volte Sempre!</p>
          <p>www.suaempresa.com.br</p>
          <p>@suaempresa</p>
        </div>
      </div>

      {/* Cut Line Visual (only for screen or separate prints) */}
      {showCutLine && (
        <div className="mt-10 border-b-2 border-dashed border-gray-800 w-full relative h-4">
          <span className="absolute top-[-12px] right-0 bg-white pl-2 text-lg text-black no-print">
            ✂️
          </span>
        </div>
      )}
    </div>
  );
};

export default ReceiptItem;