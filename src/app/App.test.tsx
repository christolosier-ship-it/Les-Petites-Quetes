import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('termine l’onboarding et ouvre le carrefour des six univers', async () => {
    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Bienvenue dans Les Petites Quêtes' })).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Je confirme un usage familial privé.'));
    fireEvent.click(screen.getByRole('button', { name: 'Créer le premier profil' }));

    fireEvent.change(screen.getByLabelText('Prénom ou pseudonyme'), { target: { value: 'Maddie' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continuer' }));

    fireEvent.change(screen.getByLabelText('Code parent à quatre chiffres'), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir les univers' }));

    expect(await screen.findByRole('heading', { name: 'Choisis ton univers' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /La Forêt des Lucioles/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /La Montagne du Dragon/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /La Station Spatiale/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Le Village des Lutins/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Nature et découvertes/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /L’Atelier créatif/ })).toBeInTheDocument();
  });
});
