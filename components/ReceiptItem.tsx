import React from 'react';
import { GeneratedContent } from '../types';
import Logo from './Logo';

interface ReceiptItemProps {
  data: GeneratedContent;
  includeImage: boolean;
  categoryIcon: string;
}

const ReceiptItem: React.FC<ReceiptItemProps> = ({ data, includeImage, categoryIcon }) => {
  
  const handlePrintIndividual = () => {
    // Sets classes to hide other elements during print
    document.body.classList.add('printing-single');
    const wrapper = document.getElementById(`wrapper-${data.id}`);
    if (wrapper) wrapper.classList.add('print-this-only-wrapper');
    
    window.print();
    
    // Cleanup
    document.body.classList.remove('printing-single');
    if (wrapper) wrapper.classList.remove('print-this-only-wrapper');
  };

  return (
    <div id={`wrapper-${data.id}`} className="receipt-wrapper flex flex-col items-center w-full">
      
      {/* Receipt Container - Strict 80mm Width Simulation */}
      <div 
        className="bg-white text-black font-mono p-1 mx-auto shadow-lg border border-gray-200 relative receipt-container hover:shadow-xl transition-shadow duration-300"
        style={{ width: '76mm', maxWidth: '100%' }} 
      >
        
        {/* Header: Logo & Frase do Dia */}
        <div className="flex flex-col items-center mb-2 pt-2">
          <div className="transform scale-90 origin-top">
            <Logo />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-0.5 mt-1">
            Frase do Dia
          </h2>
        </div>
        
        {/* Date */}
        <div className="text-center text-sm mb-3 font-bold text-gray-600">
          <span>{new Date().toLocaleDateString()} • {new Date().toLocaleTimeString().slice(0,5)}</span>
        </div>

        {/* Icon/Symbol (Replaces Photo) */}
        {includeImage && (
          <div className="mb-4 flex justify-center items-center py-4 border-y-2 border-black border-dashed bg-gray-50">
            {/* Renderiza o ícone da categoria bem grande como se fosse uma imagem */}
            <span className="text-6xl leading-none">
              {categoryIcon}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="text-center mb-4 px-2">
          {/* Main Text */}
          <p className="text-xl print:text-lg font-black uppercase leading-tight tracking-tight mb-3 text-black break-words whitespace-pre-wrap">
            {data.text}
          </p>

          {/* Translation (For Songs) */}
          {data.translation && (
            <p className="text-xs font-bold text-gray-700 border-t border-dotted border-black pt-2 mt-2 mb-2 italic">
              "{data.translation}"
            </p>
          )}

          {/* Answer (For Riddles) - UPSIDE DOWN */}
          {data.answer && (
            <div className="mt-4 pt-2 border-t border-dashed border-black flex justify-center">
               <p className="text-xs font-bold transform rotate-180 select-none bg-black text-white px-2 py-1 rounded-sm">
                 RESP: {data.answer}
               </p>
            </div>
          )}

          {/* Author */}
          <p className="text-xs font-bold italic mt-3 inline-block px-3 py-1 border border-black rounded-sm bg-gray-100">
            {data.authorOrSource}
          </p>
        </div>

        {/* Footer: Contacts */}
        <div className="text-center text-sm font-bold border-t-2 border-black pt-2 mt-2 pb-2 space-y-0.5">
          <p>Whatsapp: 82 99607.7308</p>
          <p>E-mail: avgraf@outlook.com</p>
        </div>

        {/* Cut Line (Visual only for web) */}
        <div className="mt-2 border-b-2 border-dashed border-gray-300 w-full h-1 print:hidden"></div>
      </div>

      {/* Button for Individual Print (Below the receipt) */}
      <button 
        onClick={handlePrintIndividual}
        className="mt-4 bg-slate-800 hover:bg-emerald-600 text-white text-xs font-bold py-3 px-8 rounded-full shadow-lg transition-all flex items-center gap-2 print:hidden transform hover:scale-105"
        title="Imprimir apenas este recibo"
      >
        <span>🖨️ Imprimir Este</span>
      </button>

    </div>
  );
};

export default ReceiptItem;
