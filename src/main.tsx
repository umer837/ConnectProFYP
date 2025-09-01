import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import AOSInit from './components/AOSInit.tsx';
import AuthWrapper from './components/AuthWrapper.tsx';

createRoot(document.getElementById("root")!).render(
  <>
    <AOSInit />
    <AuthWrapper>
      <App />
    </AuthWrapper>
  </>
);
