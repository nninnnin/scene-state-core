import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SceneStateProvider } from '@ssc/react';

import App from './App.tsx';
import { createEmptyState } from '@ssc/core';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SceneStateProvider initialState={createEmptyState()}>
      <App />
    </SceneStateProvider>
  </StrictMode>,
);
