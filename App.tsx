import React, { useState, useRef } from 'react';
import { Category, CATEGORIES, AppConfig, GeneratedContent } from './types';
import { generateContent } from './services/geminiService';
import ReceiptItem from './components/ReceiptItem';

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>({
    category: null,
    count: 1,
    includeImage: true,
  });
  const [items, setItems] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(false);
  
  const handlePrintAll = () => {
    window.print();
  };

  const handleGenerate = async () => {
    if (!config.category) return;
    setLoading(true);
    setItems([]); 
    const newItems = await generateContent(config.category, config.count);
    setItems(newItems);
    setLoading(false);
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-slate-900 text-slate-100 font-sans">
      
      {/* --- LEFT PANEL: Controls --- */}
      <div className="w-full md:w-[380px] flex flex-col h-full border-r border-slate-800 bg-slate-900 shadow-2xl z-20 no-print shrink-0">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900">
          <div className="bg-emerald-500/10 p-2 rounded-lg text-2xl">🖨️</div>
          <div>
            <h1 className="font-bold text-lg leading-none text-white">Gerador Térmico</h1>
            <p className="text-xs text-slate-500 mt-0.5">Impressão 80mm</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          
          {/* 1. Categories */}
          <section className="mb-6">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">1. Escolha o Tema</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setConfig({ ...config, category: cat.id })}
                  className={`p-2 rounded-lg border transition-all duration-150 flex flex-col items-center gap-1 text-center h-20 justify-center
                    ${config.category === cat.id 
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500' 
                      : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-400'}`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-[9px] font-bold leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 2. Options */}
          <section className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">2. Configurações</label>
            
            <div className="flex gap-3">
              <div className="flex-1">
                <p className="text-[10px] text-slate-500 mb-1">Quantidade</p>
                <div className="flex bg-slate-900 rounded p-1 border border-slate-700">
                  {[1, 2, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setConfig({ ...config, count: num as 1|2|4 })}
                      className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors
                        ${config.count === num ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {num}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                  <p className="text-[10px] text-slate-500 mb-1">Imagem Ilustrativa</p>
                  <button
                    onClick={() => setConfig({ ...config, includeImage: !config.includeImage })}
                    className={`w-full py-1.5 px-2 rounded border text-xs font-bold flex items-center justify-center gap-2 transition-colors h-[34px] mt-auto
                      ${config.includeImage 
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' 
                        : 'border-slate-700 bg-slate-900 text-slate-500'}`}
                  >
                    {config.includeImage ? 'COM Imagem' : 'SEM Imagem'}
                  </button>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
          <button
            disabled={!config.category || loading}
            onClick={handleGenerate}
            className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wide shadow-lg transition-all flex items-center justify-center gap-2
              ${!config.category || loading 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                : 'bg-emerald-500 hover:bg-emerald-400 text-white hover:shadow-emerald-500/20 active:scale-95'}`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Criando Frases...</span>
              </>
            ) : (
              <>
                <span>✨ Gerar Agora</span>
              </>
            )}
          </button>

          {items.length > 0 && !loading && (
            <button
              onClick={handlePrintAll}
              className="w-full py-3 bg-white hover:bg-gray-100 text-black rounded-lg font-bold text-sm uppercase tracking-wide shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              🖨️ Imprimir Tudo ({items.length})
            </button>
          )}
        </div>
      </div>

      {/* --- RIGHT PANEL: Grid Preview --- */}
      <div className="flex-1 bg-gray-200 h-full overflow-y-auto p-4 md:p-6">
        
        {/* Empty State */}
        {items.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
            <div className="text-6xl mb-4 grayscale">🖨️</div>
            <p className="text-xl font-bold">Pronto para começar</p>
          </div>
        )}

        {/* Loading Skeletons Grid */}
        {loading && (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full max-w-[1400px] mx-auto">
              {Array.from({ length: config.count }).map((_, i) => (
                 <div key={i} className="bg-white shadow-xl animate-pulse p-4 flex flex-col items-center gap-4 h-[400px]">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
                    <div className="w-full h-32 bg-gray-200 rounded mt-2"></div>
                    <div className="w-full h-4 bg-gray-200 rounded mt-4"></div>
                    <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                 </div>
              ))}
           </div>
        )}

        {/* Results Grid - SHOW ALL AT ONCE */}
        {items.length > 0 && !loading && (
          <div className="print-area w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full max-w-[1600px] mx-auto items-start">
              {items.map((item) => (
                <div key={item.id} className="flex justify-center">
                  <ReceiptItem 
                    data={item} 
                    includeImage={config.includeImage}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;