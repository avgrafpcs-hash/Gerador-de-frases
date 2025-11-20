import React from 'react';
import { COMPANY_LOGO_BASE64 } from '../constants';

const Logo: React.FC = () => {
  return (
    <div className="flex justify-center items-center mb-4">
      <img 
        src={COMPANY_LOGO_BASE64} 
        alt="Logo Empresa" 
        className="max-w-[80%] h-auto object-contain filter grayscale contrast-125"
        style={{ maxHeight: '60px' }}
      />
    </div>
  );
};

export default Logo;
