import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('crée le code parent, un profil puis ouvre l’espace enfant', async () => {
    render(<App />);

    await screen.findByRole('heading', { name: 'Les petites actions deviennent des aventures' });
    fireEvent.click(screen.getByRole('button', { name: 'Espace parent' }));

    fireEvent.change(screen.getByLabelText('Code à quatre chiffres'), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: 'Créer le code' }));
    await screen.findByRole('heading', { name: 'Préparer les petites aventures' });

    fireEvent.click(screen.getByRole('button', { name: /Enfants/ }));
    fireEvent.change(screen.getByLabelText('Prénom ou pseudonyme'), { target: { value: 'Maddie' } });
    fireEvent.click(screen.getByRole('button', { name: 'Créer le profil' }));
    await waitFor(() => expect(screen.getByText('Maddie')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Accueil' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Espace enfant' }));
    expect(await screen.findByRole('heading', { name: 'La Forêt des Lucioles' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Mes quêtes/ })).toBeInTheDocument();
  });
});
