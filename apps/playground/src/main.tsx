import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SceneStateProvider } from '@ssc/react';
import { createEmptyState } from '@ssc/core';

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SceneStateProvider initialState={createEmptyState()}>
      <App />
    </SceneStateProvider>
  </StrictMode>,
);
