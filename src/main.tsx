import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './styles/tokens.css';
import './styles/global.css';
import './styles/app.css';
import './styles/forms.css';
import './styles/world.css';
import './styles/firefly-world.css';
import './styles/firefly-asset-pass.css';
import './styles/firefly-diorama.css';
import './styles/firefly-life.css';
import './styles/firefly-wildlife-polish.css';
import './styles/firefly-life-motion.css';
import './styles/firefly-panorama.css';
import './styles/gnome-village.css';
import './styles/scene-composer.css';
import './styles/finalization.css';
import { registerServiceWorker } from './platform/pwa/registerServiceWorker';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

window.setTimeout(() => {
  void import('./platform/dev/sceneComposer').then(({ startSceneComposer }) => {
    startSceneComposer();
  });
}, 0);

void registerServiceWorker();
