import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import App from './App';
import { GarageProvider } from './features/garage/GarageContext';
import '@fontsource-variable/dm-sans/wght.css';
import '@fontsource-variable/manrope/wght.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <GarageProvider>
          <App />
        </GarageProvider>
      </MotionConfig>
    </BrowserRouter>
  </React.StrictMode>,
);
