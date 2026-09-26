import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {ClerkProvider} from '@clerk/react';
import App from './App.tsx';
import './index.css';

const app = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  ? <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      appearance={{ variables: {
        colorPrimary: '#3ecf8e',
        colorBackground: '#1d1f1e',
        borderRadius: '8px',
      } }}
    ><App /></ClerkProvider>
  : <App />;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {app}
  </StrictMode>,
);
