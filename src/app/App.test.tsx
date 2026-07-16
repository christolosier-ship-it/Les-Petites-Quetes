import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('termine l’onboarding et ouvre la forêt avec les premières quêtes', async () => {
    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Bienvenue dans Les Petites Quêtes' })).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Je confirme un usage familial privé.'));
    fireEvent.click(screen.getByRole('button', { name: 'Créer le premier profil' }));

    fireEvent.change(screen.getByLabelText('Prénom ou pseudonyme'), { target: { value: 'Maddie' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continuer' }));

    fireEvent.change(screen.getByLabelText('Code parent à quatre chiffres'), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir la forêt' }));

    expect(await screen.findByRole('heading', { name: 'La Forêt des Lucioles' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Mes quêtes/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Mes quêtes/ }));
    expect(await screen.findAllByRole('button', { name: /L’armure du matin|Les crocs du dragon|La tenue des rêves/ })).toHaveLength(3);
  });
});
