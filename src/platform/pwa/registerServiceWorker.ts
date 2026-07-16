export const SERVICE_WORKER_UPDATE_EVENT = 'lpq:service-worker-update';
let waitingWorker: ServiceWorker | undefined;
let refreshing = false;

function announceUpdate(worker: ServiceWorker): void {
  waitingWorker = worker;
  globalThis.dispatchEvent(new CustomEvent(SERVICE_WORKER_UPDATE_EVENT));
}

export async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register(
      `${import.meta.env.BASE_URL}sw.js`,
      { scope: import.meta.env.BASE_URL },
    );
    if (registration.waiting && navigator.serviceWorker.controller) {
      announceUpdate(registration.waiting);
    }
    registration.addEventListener('updatefound', () => {
      const installing = registration.installing;
      if (!installing) return;
      installing.addEventListener('statechange', () => {
        if (installing.state === 'installed' && navigator.serviceWorker.controller) {
          announceUpdate(installing);
        }
      });
    });
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      globalThis.location.reload();
    });
    void registration.update();
  } catch (error) {
    console.error('Impossible d’enregistrer le service worker.', error);
  }
}

export function applyServiceWorkerUpdate(): void {
  waitingWorker?.postMessage('SKIP_WAITING');
}
