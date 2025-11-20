import React from 'react';
import { GeneratedContent } from '../types';
import Logo from './Logo';

interface ReceiptItemProps {
  data: GeneratedContent;
  includeImage: boolean;
}

const ReceiptItem: React.FC<ReceiptItemProps> = ({ data, includeImage }) => {
  const imageUrl = `https://picsum.photos/seed/${data.imageSeed}/380/250?grayscale`;

  const handlePrintIndividual = () => {
    // This sets a temporary class on the body to hide other items via CSS
    document.body.classList.add('printing-single');
    const element = document.getElementById(`receipt-${data.id}`);
    if (element) element.classList.add('print-this-only');
    
    window.print();
    
    // Cleanup after print dialog closes
    document.body.classList.remove('printing-single');
    if (element) element.classList.remove('print-this-only');
  };

  return (
    <div className="relative group">
      {/* Overlay Button for Individual Print */}
      <button 
        onClick={handlePrintIndividual}
        className="absolute -top-3 -right-3 bg-blue-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 print:hidden"
        title="Imprimir apenas este"
      >
        🖨️
      </button>

      {/* Receipt Container - Strict 80mm Width Simulation */}
      <div 
        id={`receipt-${data.id}`}
        className="bg-white text-black font-mono p-1 mx-auto shadow-sm border border-gray-200 relative receipt-container"
        style={{ width: '76mm', maxWidth: '100%' }} 
      >
        
        {/* Header */}
        <div className="transform scale-75 origin-top -mb-2 opacity-90">
          <Logo />
        </div>
        
        {/* Date */}
        <div className="text-center text-[9px] mb-2 border-b border-black pb-1 font-bold tracking-tighter">
          <span>{new Date().toLocaleDateString()} • {new Date().toLocaleTimeString().slice(0,5)}</span>
        </div>

        {/* Image */}
        {includeImage && (
          <div className="mb-2 overflow-hidden border-2 border-black">
            <img 
              src={imageUrl} 
              alt="Art" 
              className="w-full h-auto block filter contrast-125 brightness-110"
              crossOrigin="anonymous"
            />
          </div>
        )}

        {/* Content */}
        <div className="text-center mb-2 px-1">
          {/* Main Text */}
          <p className="text-xl font-black uppercase leading-none tracking-tight mb-2 text-black break-words whitespace-pre-wrap">
            {data.text}
          </p>

          {/* Translation (For Songs) */}
          {data.translation && (
            <p className="text-xs font-bold text-gray-700 border-t border-dotted border-black pt-1 mt-1 mb-1 italic">
              "{data.translation}"
            </p>
          )}

          {/* Answer (For Riddles) - UPSIDE DOWN */}
          {data.answer && (
            <div className="mt-3 pt-2 border-t border-dashed border-black flex justify-center">
               <p className="text-xs font-bold transform rotate-180 select-none bg-black text-white px-1">
                 RESP: {data.answer}
               </p>
            </div>
          )}

          {/* Author */}
          <p className="text-xs font-bold italic mt-2 inline-block px-2 border border-black rounded-sm">
            {data.authorOrSource}
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-[9px] font-bold border-t-2 border-black pt-1 mt-2">
          <p>www.suaempresa.com.br</p>
        </div>

        {/* Cut Line (Visual only) */}
        <div className="mt-4 border-b-2 border-dashed border-gray-400 w-full h-1 print:hidden"></div>
      </div>
    </div>
  );
};

export default ReceiptItem;