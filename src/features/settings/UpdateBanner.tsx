import { useEffect, useState } from 'react';
import { Button } from '../../components/primitives/Button';
import {
  applyServiceWorkerUpdate,
  SERVICE_WORKER_UPDATE_EVENT,
} from '../../platform/pwa/registerServiceWorker';

export function UpdateBanner() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const announce = () => setAvailable(true);
    globalThis.addEventListener(SERVICE_WORKER_UPDATE_EVENT, announce);
    return () => globalThis.removeEventListener(SERVICE_WORKER_UPDATE_EVENT, announce);
  }, []);

  if (!available) return null;
  return (
    <aside className="update-banner" role="status">
      <span>Une nouvelle version de la forêt est prête.</span>
      <Button onClick={applyServiceWorkerUpdate}>Mettre à jour</Button>
      <Button variant="quiet" onClick={() => setAvailable(false)}>Plus tard</Button>
    </aside>
  );
}
