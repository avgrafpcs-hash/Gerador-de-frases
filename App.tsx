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

  // Handling print action
  const handlePrint = () => {
    window.print();
  };

  const handleGenerate = async () => {
    if (!config.category) return;
    setLoading(true);
    setItems([]); // Clear previous
    
    const newItems = await generateContent(config.category, config.count);
    setItems(newItems);
    setLoading(false);
  };

  // Helper to reset selection
  const reset = () => {
    setItems([]);
    // Optional: Keep category selected or reset it? Let's keep it for faster re-generation
    // setConfig(prev => ({ ...prev, category: null }));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      
      {/* --- LEFT PANEL: Controls (Hidden on print) --- */}
      <div className="w-full md:w-5/12 lg:w-4/12 p-6 bg-white border-r border-slate-200 overflow-y-auto no-print shadow-xl z-10">
        <div className="max-w-lg mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-lg text-xl font-bold">
              AI
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Gerador Térmico</h1>
              <p className="text-xs text-slate-500 mt-1">Impressão 80mm Inteligente</p>
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-8">
            
            {/* 1. Category */}
            <section>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">1. Selecione o Tema</h2>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setConfig({ ...config, category: cat.id })}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 group overflow-hidden
                      ${config.category === cat.id 
                        ? 'border-black bg-black text-white shadow-lg scale-[1.02]' 
                        : 'border-slate-200 hover:border-slate-400 text-slate-600 bg-slate-50'}`}
                  >
                    <span className="text-2xl mb-2 block">{cat.icon}</span>
                    <span className="font-bold text-sm block">{cat.label}</span>
                    {config.category === cat.id && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* 2. Configuration */}
            <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">2. Personalize</h2>
              
              <div className="space-y-5">
                {/* Count */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Quantidade</label>
                  <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    {[1, 2, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => setConfig({ ...config, count: num as 1|2|4 })}
                        className={`flex-1 py-2.5 rounded-md text-sm font-bold transition-all
                          ${config.count === num 
                            ? 'bg-black text-white shadow-md' 
                            : 'text-slate-500 hover:bg-slate-100'}`}
                      >
                        {num} msg
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Toggle */}
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🖼️</span>
                    <span className="text-sm font-bold text-slate-700">Imagens</span>
                  </div>
                  <button
                    onClick={() => setConfig({ ...config, includeImage: !config.includeImage })}
                    className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${config.includeImage ? 'bg-green-500' : 'bg-slate-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${config.includeImage ? 'translate-x-5' : ''}`} />
                  </button>
                </div>

                {/* Print Mode */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Layout de Impressão</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setConfig({ ...config, printMode: 'separate' })}
                      className={`px-3 py-3 text-xs font-bold rounded-lg border-2 transition-all ${config.printMode === 'separate' ? 'border-black bg-black text-white' : 'border-slate-200 bg-white text-slate-500'}`}
                    >
                      ✂️ Separadas
                    </button>
                    <button
                      onClick={() => setConfig({ ...config, printMode: 'together' })}
                      className={`px-3 py-3 text-xs font-bold rounded-lg border-2 transition-all ${config.printMode === 'together' ? 'border-black bg-black text-white' : 'border-slate-200 bg-white text-slate-500'}`}
                    >
                      📄 Lista Contínua
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="pt-2 space-y-3">
              <button
                disabled={!config.category || loading}
                onClick={handleGenerate}
                className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-wide shadow-xl transition-all transform active:scale-95
                  ${!config.category || loading 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-2xl hover:-translate-y-1'}`}
              >
                {loading ? 'Criando Conteúdo...' : '✨ Gerar Mensagens'}
              </button>

              {items.length > 0 && !loading && (
                 <div className="grid grid-cols-2 gap-3 animate-fade-in-up">
                    <button
                      onClick={handlePrint}
                      className="py-3 bg-black text-white rounded-xl font-bold text-sm uppercase tracking-wide shadow-lg hover:bg-gray-800 flex items-center justify-center gap-2"
                    >
                      🖨️ Imprimir
                    </button>
                    <button
                      onClick={reset}
                      className="py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-sm uppercase hover:border-slate-400 transition-colors"
                    >
                      🔄 Limpar
                    </button>
                 </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* --- RIGHT PANEL: Preview --- */}
      <div className="w-full md:w-7/12 lg:w-8/12 bg-slate-200 flex justify-center p-8 md:p-12 overflow-y-auto">
        
        {/* Empty State */}
        {items.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center text-slate-400 opacity-60 select-none">
            <div className="w-32 h-48 border-4 border-dashed border-slate-300 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-6xl">📄</span>
            </div>
            <p className="text-lg font-bold">Visualização de Impressão</p>
            <p className="text-sm">Configure ao lado para começar</p>
          </div>
        )}

        {/* Content */}
        {(items.length > 0 || loading) && (
          <div id="print-container" className="relative print-area">
            
            {/* Loading Skeleton */}
            {loading && (
               <div className="w-[80mm] bg-white p-4 shadow-2xl animate-pulse flex flex-col items-center gap-6 min-h-[400px]">
                  <div className="w-32 h-12 bg-slate-200 rounded mx-auto mb-4"></div>
                  <div className="w-full aspect-video bg-slate-200 rounded"></div>
                  <div className="w-full space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
                  </div>
               </div>
            )}

            {/* Actual Receipt List */}
            {!loading && (
              <div ref={printRef} className="shadow-2xl print:shadow-none">
                {items.map((item, index) => (
                  <div key={item.id} style={{ pageBreakAfter: config.printMode === 'separate' ? 'always' : 'auto' }}>
                    <ReceiptItem 
                      data={item} 
                      includeImage={config.includeImage}
                      className={config.printMode === 'together' ? 'pb-10 mb-0 border-b-4 border-dashed border-gray-300' : 'mb-10 print:mb-0'}
                      showCutLine={config.printMode === 'separate' && index < items.length - 1}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default App;