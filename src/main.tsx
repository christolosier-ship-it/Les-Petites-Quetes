import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { registerServiceWorker } from './platform/pwa/registerServiceWorker';
import './styles/tokens.css';
import './styles/global.css';
import './styles/app.css';
import './styles/forms.css';
import './styles/world.css';
import './styles/firefly-world.css';
import './styles/firefly-diorama.css';
import './styles/firefly-panorama.css';
import './styles/firefly-life.css';
import './styles/firefly-life-motion.css';
import './styles/firefly-asset-pass.css';
import './styles/finalization.css';

const root = document.getElementById('root');
if (!root) throw new Error('Élément racine #root introuvable.');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

void registerServiceWorker();
