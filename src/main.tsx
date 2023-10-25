import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import { AuthProviderComponent } from './context/AuthContext';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <AuthProviderComponent>
    <App />
    </AuthProviderComponent>
  </React.StrictMode>
);