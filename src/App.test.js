import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Pokedex/i);
  expect(linkElement).toBeInTheDocument();
});

test('gets a random pokemon', async () => {
  render(<App />);
  const button = screen.getByText(/Get Random Pokémon/i);
  fireEvent.click(button);
  const pokemonName = await screen.findByText(/bulbasaur/i);
  expect(pokemonName).toBeInTheDocument();
});

test('gets pokedex info', async () => {
  render(<App />);
  const randomButton = screen.getByText(/Get Random Pokémon/i);
  fireEvent.click(randomButton);
  await screen.findByText(/bulbasaur/i);
  const pokedexButton = screen.getByText(/Get Pokedex Info/i);
  fireEvent.click(pokedexButton);
  const height = await screen.findByText(/Height/i);
  expect(height).toBeInTheDocument();
});