import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('navigue entre l’accueil et les deux espaces', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Espace enfant' }));
    expect(screen.getByRole('heading', { name: 'Les quêtes arrivent bientôt' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Revenir à l’accueil' }));
    fireEvent.click(screen.getByRole('button', { name: 'Espace parent' }));
    expect(screen.getByRole('heading', { name: 'Le poste de préparation est prêt' })).toBeInTheDocument();
  });
});
