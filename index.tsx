import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (e) {
  console.error("Failed to mount React app:", e);
  if (rootElement) {
    rootElement.innerHTML = '<div style="color:red; padding:20px; text-align:center;"><h1>Erro ao carregar aplicação</h1><p>Verifique o console para mais detalhes.</p></div>';
  }
}
