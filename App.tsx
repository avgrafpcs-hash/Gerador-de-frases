import React, { useState, useRef } from 'react';
import { Category, CATEGORIES, AppConfig, GeneratedContent } from './types';
import { generateContent } from './services/geminiService';
import ReceiptItem from './components/ReceiptItem';
import Logo from './components/Logo';

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
    setConfig(prev => ({ ...prev, category: null }));
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-slate-900">
      
      {/* --- LEFT PANEL: Controls (Hidden on print) --- */}
      <div className="w-full md:w-1/2 lg:w-5/12 p-6 bg-slate-900 text-white h-full overflow-y-auto no-print border-r border-slate-800">
        <div className="max-w-xl mx-auto pb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-1 rounded">
             {/* Small preview of logo in header */}
             <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVQ4T2NkwA7+M/zHgFyGmOQZwwDInF9I0oBfM9CV4zUDWjOgm4FwM2A0DQAAAB03IAH1gV2bAAAAAElFTkSuQmCC" className="w-6 h-6 opacity-50" alt="icon" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Thermal AI Generator</h1>
          </div>

          {/* Step 1: Category Selection */}
          {!items.length && (
            <div className="space-y-6 animate-fade-in">
              <section>
                <h2 className="text-sm uppercase tracking-wider text-slate-400 font-semibold mb-4">1. Escolha o Tema</h2>
                <div className="grid grid-cols-2 gap-4">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setConfig({ ...config, category: cat.id })}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                        ${config.category === cat.id 
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                          : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-300'}`}
                    >
                      <span className="text-3xl">{cat.icon}</span>
                      <span className="font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-sm uppercase tracking-wider text-slate-400 font-semibold mb-4">2. Configurações</h2>
                
                <div className="bg-slate-800 rounded-xl p-6 space-y-6 border border-slate-700">
                  {/* Count Selector */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Quantidade de Mensagens</label>
                    <div className="flex bg-slate-900 p-1 rounded-lg">
                      {[1, 2, 4].map((num) => (
                        <button
                          key={num}
                          onClick={() => setConfig({ ...config, count: num as 1|2|4 })}
                          className={`flex-1 py-2 rounded-md text-sm font-bold transition-all
                            ${config.count === num ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                          {num}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Toggle */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Incluir Imagem Ilustrativa</label>
                    <button
                      onClick={() => setConfig({ ...config, includeImage: !config.includeImage })}
                      className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 ${config.includeImage ? 'bg-emerald-500' : 'bg-slate-600'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${config.includeImage ? 'translate-x-7' : ''}`} />
                    </button>
                  </div>

                  {/* Print Mode */}
                  <div className="pt-4 border-t border-slate-700">
                    <label className="block text-sm font-medium mb-3">Modo de Impressão</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setConfig({ ...config, printMode: 'separate' })}
                        className={`px-3 py-2 text-xs rounded border ${config.printMode === 'separate' ? 'border-emerald-500 text-emerald-400 bg-emerald-900/20' : 'border-slate-600 text-slate-400'}`}
                      >
                        ✂️ Separadas (Corte)
                      </button>
                      <button
                        onClick={() => setConfig({ ...config, printMode: 'together' })}
                        className={`px-3 py-2 text-xs rounded border ${config.printMode === 'together' ? 'border-emerald-500 text-emerald-400 bg-emerald-900/20' : 'border-slate-600 text-slate-400'}`}
                      >
                        📄 Contínuas (Lista)
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <button
                disabled={!config.category || loading}
                onClick={handleGenerate}
                className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wide shadow-lg transition-all
                  ${!config.category || loading 
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                    : 'bg-emerald-500 hover:bg-emerald-400 text-white hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transform hover:-translate-y-1'}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Gerando com IA...
                  </span>
                ) : 'Gerar Recibos'}
              </button>
            </div>
          )}

          {/* Post-Generation Actions */}
          {items.length > 0 && !loading && (
            <div className="space-y-4 animate-slide-up">
              <div className="bg-emerald-900/30 border border-emerald-500/30 p-4 rounded-lg text-emerald-200 mb-6">
                <h3 className="font-bold flex items-center gap-2">
                  <span className="text-xl">✅</span> {items.length} Mensagens Geradas!
                </h3>
                <p className="text-sm opacity-80 mt-1">Visualize a prévia ao lado (ou abaixo no celular). Ajuste o zoom do navegador se necessário.</p>
              </div>

              <button
                onClick={handlePrint}
                className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg uppercase tracking-wide shadow-xl hover:bg-gray-100 flex items-center justify-center gap-2"
              >
                🖨️ Imprimir Agora
              </button>
              
              <button
                onClick={reset}
                className="w-full py-3 bg-transparent border-2 border-slate-600 text-slate-300 rounded-xl font-semibold hover:border-white hover:text-white transition-colors"
              >
                🔄 Gerar Novas
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- RIGHT PANEL: Preview (Visible on screen, reformatted on print) --- */}
      <div className="w-full md:w-1/2 lg:w-7/12 bg-gray-200 flex justify-center p-8 md:p-12 h-full overflow-y-auto relative">
        
        {/* Visual Hint Background */}
        {items.length === 0 && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none select-none p-4 text-center">
            <span className="text-6xl mb-4 opacity-20">🖨️</span>
            <p className="text-lg font-medium opacity-50">O recibo gerado aparecerá aqui</p>
            <p className="text-sm opacity-40">Formato 80mm Térmico</p>
          </div>
        )}

        {/* Actual Print Content Area */}
        {(items.length > 0 || loading) && (
          <div id="print-container" className="relative print-area pb-20">
            {loading && (
               <div className="w-[80mm] h-[400px] bg-white animate-pulse flex flex-col items-center justify-center gap-4 shadow-2xl">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
               </div>
            )}

            {/* The list to be printed */}
            <div ref={printRef}>
              {items.map((item, index) => (
                <div key={item.id} style={{ pageBreakAfter: config.printMode === 'separate' ? 'always' : 'auto' }}>
                  <ReceiptItem 
                    data={item} 
                    includeImage={config.includeImage}
                    // Only show visual cut line if separate mode and not the last item (unless printing separate pages handles it naturally)
                    // Actually for web preview, a margin is nice.
                    className={config.printMode === 'together' ? 'mb-8 border-b-4 border-double border-black pb-8' : 'mb-16 print:mb-0'}
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