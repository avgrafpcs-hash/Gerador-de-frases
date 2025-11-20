import React from 'react';
import { COMPANY_LOGO_BASE64 } from '../logo';

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center mb-1">
      {/* Container com altura fixa para evitar pulos de layout */}
      <div className="h-16 flex items-center justify-center w-full">
        <img 
          src={COMPANY_LOGO_BASE64} 
          alt="Logo Empresa" 
          className="max-h-full max-w-[90%] object-contain" 
          style={{ imageRendering: 'pixelated' }} 
        />
      </div>
    </div>
  );
};

export default Logo;