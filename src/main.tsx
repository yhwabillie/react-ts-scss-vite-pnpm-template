import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';

import '@/styles/_index.scss';
import ModalProvider from './components/ui/molecules/Modal/ModalProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModalProvider>
      <App />
    </ModalProvider>
  </StrictMode>,
);
