import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

const mockPokemon = {
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  },
};

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockPokemon),
    })
  );
});

test('renders initial message', () => {
  render(<App />);
  const linkElement = screen.getByText(/Selecione um Pokémon para ver suas informações/i);
  expect(linkElement).toBeInTheDocument();
});

test('gets a new pokemon', async () => {
  render(<App />);
  const button = screen.getByText(/Novo Pokémon/i);
  fireEvent.click(button);
  const pokemonName = await screen.findByText(/bulbasaur/i);
  expect(pokemonName).toBeInTheDocument();
});

test('gets pokedex info', async () => {
  render(<App />);
  const randomButton = screen.getByText(/Novo Pokémon/i);
  fireEvent.click(randomButton);
  await screen.findByText(/bulbasaur/i);
  const pokedexButton = screen.getByText(/Scanear Pokémon/i);
  fireEvent.click(pokedexButton);
  const height = await screen.findByText(/Altura/i);
  expect(height).toBeInTheDocument();
});