import React, { useState, useRef } from 'react';
import { Category, CATEGORIES, AppConfig, GeneratedContent } from './types';
import { generateContent } from './services/geminiService';
import ReceiptItem from './components/ReceiptItem';

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>({
    category: null,
    count: 1,
    includeImage: true,
    printMode: 'separate',
  });
  const [items, setItems] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(false);
  
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleGenerate = async () => {
    if (!config.category) return;
    setLoading(true);
    // Keep items visible while loading new ones or clear them? 
    // Let's clear to show loading state clearly in the preview area.
    setItems([]); 
    
    const newItems = await generateContent(config.category, config.count);
    setItems(newItems);
    setLoading(false);
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-slate-900 text-slate-100 font-sans">
      
      {/* --- LEFT PANEL: Controls (Compact & Always Visible) --- */}
      <div className="w-full md:w-[400px] lg:w-[450px] flex flex-col h-full border-r border-slate-800 bg-slate-900 shadow-2xl z-10 no-print shrink-0">
        
        {/* Header Compacto */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900">
          <div className="bg-emerald-500/10 p-2 rounded-lg text-2xl">🖨️</div>
          <div>
            <h1 className="font-bold text-lg leading-none text-white">Gerador Térmico</h1>
            <p className="text-xs text-slate-500 mt-0.5">Configure e gere frases ilimitadas</p>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
          
          {/* 1. Categories - Grid Compacto de 3 Colunas */}
          <section>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">1. Tema</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setConfig({ ...config, category: cat.id })}
                  className={`p-2 rounded-lg border transition-all duration-150 flex flex-col items-center gap-1 text-center
                    ${config.category === cat.id 
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500' 
                      : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-400'}`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-[10px] font-bold leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 2. Settings - Compact Row */}
          <section className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <div className="flex justify-between items-center mb-3">
               <label className="text-xs font-bold text-slate-400 uppercase">2. Opções</label>
            </div>
            
            <div className="space-y-3">
              {/* Row: Count & Image */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500 mb-1">Quantidade</p>
                  <div className="flex bg-slate-900 rounded p-1 border border-slate-700">
                    {[1, 2, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => setConfig({ ...config, count: num as 1|2|4 })}
                        className={`flex-1 py-1 text-xs font-bold rounded transition-colors
                          ${config.count === num ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                   <p className="text-[10px] text-slate-500 mb-1">Imagem</p>
                   <button
                      onClick={() => setConfig({ ...config, includeImage: !config.includeImage })}
                      className={`w-full py-1.5 px-2 rounded border text-xs font-bold flex items-center justify-center gap-2 transition-colors
                        ${config.includeImage 
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' 
                          : 'border-slate-700 bg-slate-900 text-slate-500'}`}
                    >
                      {config.includeImage ? '✅ Sim' : '❌ Não'}
                    </button>
                </div>
              </div>

              {/* Row: Mode */}
              <div>
                <p className="text-[10px] text-slate-500 mb-1">Modo de Impressão</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfig({ ...config, printMode: 'separate' })}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded border text-center
                      ${config.printMode === 'separate' ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-slate-700 text-slate-500'}`}
                  >
                    ✂️ Corte (Individual)
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, printMode: 'together' })}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded border text-center
                      ${config.printMode === 'together' ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-slate-700 text-slate-500'}`}
                  >
                    📄 Lista (Contínuo)
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions - Fixed at Bottom */}
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
                <span>Criando...</span>
              </>
            ) : (
              <>
                <span>✨ Gerar Frases</span>
              </>
            )}
          </button>

          {items.length > 0 && !loading && (
            <button
              onClick={handlePrint}
              className="w-full py-3 bg-white hover:bg-gray-100 text-black rounded-lg font-bold text-sm uppercase tracking-wide shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              🖨️ Imprimir ({items.length})
            </button>
          )}
        </div>
      </div>

      {/* --- RIGHT PANEL: Preview Area --- */}
      <div className="flex-1 bg-gray-100 h-full overflow-y-auto relative flex justify-center p-4 md:p-8">
        
        {/* Placeholder State */}
        {items.length === 0 && !loading && (
          <div className="self-center text-center opacity-30 select-none">
            <div className="text-6xl mb-4 grayscale">🖨️</div>
            <p className="text-xl font-bold text-slate-800">Aguardando geração...</p>
            <p className="text-sm text-slate-600">Selecione um tema e clique em gerar</p>
          </div>
        )}

        {/* Loading Placeholder */}
        {loading && (
           <div className="w-[80mm] bg-white shadow-xl animate-pulse self-start mt-4 min-h-[300px] p-4 flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <div className="w-full h-3 bg-gray-200 rounded"></div>
              <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
              <div className="w-full h-32 bg-gray-200 rounded mt-2"></div>
              <div className="w-full h-4 bg-gray-200 rounded mt-2"></div>
           </div>
        )}

        {/* Results List */}
        {(items.length > 0 || loading) && (
          <div id="print-container" className={`print-area pb-20 ${loading ? 'hidden' : 'block'}`}>
            <div ref={printRef}>
              {items.map((item, index) => (
                <div key={item.id} style={{ pageBreakAfter: config.printMode === 'separate' ? 'always' : 'auto' }}>
                  <ReceiptItem 
                    data={item} 
                    includeImage={config.includeImage}
                    // Compact spacing for "together" mode
                    className={config.printMode === 'together' ? 'mb-4 border-b-2 border-dashed border-gray-300 pb-4' : 'mb-8 print:mb-0'}
                    showCutLine={config.printMode === 'separate' && index < items.length - 1}
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