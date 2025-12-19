import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';

import '@/styles/_index.scss';
import ModalProvider from './components/ui/molecules/Modal/ModalProvider';
import { ToastProvider } from './components/ui/molecules/Toast/ToastProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModalProvider>
      <ToastProvider position='bottom-right'>
        <App />
      </ToastProvider>
    </ModalProvider>
  </StrictMode>,
);
