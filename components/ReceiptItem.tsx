
import React from 'react';
import { GeneratedContent } from '../types';
import Logo from './Logo';

interface ReceiptItemProps {
  data: GeneratedContent;
  includeImage: boolean;
  categoryIcon: string;
  title: string;
}

const ReceiptItem: React.FC<ReceiptItemProps> = ({ data, includeImage, categoryIcon, title }) => {
  
  const handlePrintIndividual = () => {
    document.body.classList.add('printing-single');
    const wrapper = document.getElementById(`wrapper-${data.id}`);
    if (wrapper) wrapper.classList.add('print-this-only-wrapper');
    window.print();
    document.body.classList.remove('printing-single');
    if (wrapper) wrapper.classList.remove('print-this-only-wrapper');
  };

  return (
    <div id={`wrapper-${data.id}`} className="receipt-wrapper flex flex-col items-center w-full">
      
      <div 
        className="bg-white text-black font-mono p-1 mx-auto shadow-lg border border-gray-200 relative receipt-container"
        style={{ width: '76mm', maxWidth: '100%' }} 
      >
        
        {/* Header */}
        <div className="flex flex-col items-center mb-2 pt-2">
          <div className="transform scale-90 origin-top">
            <Logo />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-0.5 mt-1 text-center">
            {title}
          </h2>
        </div>
        
        <div className="text-center text-xs mb-3 font-bold text-gray-600">
          <span>{new Date().toLocaleDateString()} • {new Date().toLocaleTimeString().slice(0,5)}</span>
        </div>

        {/* GIBI IMAGE RENDERING */}
        {data.imageUrl ? (
          <div className="mb-4 flex flex-col items-center w-full border-y-2 border-black border-dashed py-2">
            <img 
              src={data.imageUrl} 
              alt="Gibi Gerado" 
              className="w-full h-auto object-contain"
              style={{ 
                imageRendering: 'pixelated', 
                filter: 'contrast(1.5) grayscale(1) brightness(1.1)' 
              }} 
            />
            <p className="text-[10px] mt-1 font-bold italic opacity-50 uppercase tracking-tighter">Otimizado para Impressão Térmica</p>
          </div>
        ) : (
          includeImage && (
            <div className="mb-4 flex justify-center items-center py-4 border-y-2 border-black border-dashed bg-gray-50">
              <span className="text-6xl leading-none">
                {categoryIcon}
              </span>
            </div>
          )
        )}

        {/* Content */}
        <div className="text-center mb-4 px-2">
          {data.text && (
            <p className="font-sans text-xl print:text-lg font-black uppercase leading-tight tracking-tight mb-3 text-black break-words whitespace-pre-wrap">
              {data.text}
            </p>
          )}

          {data.translation && (
            <p className="text-xs font-bold text-gray-700 border-t border-dotted border-black pt-2 mt-2 mb-2 italic">
              "{data.translation}"
            </p>
          )}

          {data.answer && (
            <div className="mt-4 pt-2 border-t border-dashed border-black flex justify-center">
               <p className="text-xs font-bold transform rotate-180 select-none text-black border-2 border-dashed border-black px-2 py-1">
                 RESP: {data.answer}
               </p>
            </div>
          )}

          <p className="text-xs font-bold italic mt-3 inline-block px-3 py-1 border border-black rounded-sm bg-gray-100">
            {data.authorOrSource}
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-sm font-bold border-t-2 border-black pt-2 mt-2 pb-2 space-y-0.5">
          <p>Whatsapp: 82 99607.7308</p>
          <p>E-mail: avgraf@outlook.com</p>
        </div>
      </div>

      <button 
        onClick={handlePrintIndividual}
        className="mt-4 bg-slate-800 hover:bg-emerald-600 text-white text-xs font-bold py-3 px-8 rounded-full shadow-lg transition-all flex items-center gap-2 print:hidden"
      >
        <span>🖨️ Imprimir Este</span>
      </button>

    </div>
  );
};

export default ReceiptItem;
