import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock para a API fetch
const mockPokemon = {
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  },
};

// antes de cada teste, mockamos a função fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockPokemon),
    })
  );
});

// limpa os mocks depois de cada teste
afterEach(() => {
  jest.restoreAllMocks();
});

test('renders initial message and loads a pokemon', async () => {
  render(<App />);

  // Verifica a mensagem inicial
  expect(screen.getByText(/Selecione um Pokémon para ver suas informações/i)).toBeInTheDocument();

  // useEffect chama getRandomPokemon no mount. Devemos esperar a imagem aparecer.
  const pokemonImage = await screen.findByAltText(/bulbasaur/i);
  expect(pokemonImage).toBeInTheDocument();
});

test('gets a new pokemon when "Novo Pokémon" is clicked', async () => {
  render(<App />);

  // Espera o pokemon inicial carregar
  await screen.findByAltText(/bulbasaur/i);

  // Clica no botão para buscar um novo pokemon
  const button = screen.getByText(/Novo Pokémon/i);
  fireEvent.click(button);

  // Verifica se a função fetch foi chamada novamente
  // A primeira chamada é no useEffect, a segunda é no click.
  expect(global.fetch).toHaveBeenCalledTimes(2);

  // A imagem ainda deve ser do bulbasaur porque o mock retorna o mesmo pokemon
  const pokemonImage = await screen.findByAltText(/bulbasaur/i);
  expect(pokemonImage).toBeInTheDocument();
});

test('shows pokemon info in the pokedex when "Scanear Pokémon" is clicked', async () => {
  render(<App />);

  // Espera o pokemon inicial carregar no campo
  await screen.findByAltText(/bulbasaur/i);

  // Pega o botão de scanear e clica
  const pokedexButton = screen.getByText(/Scanear Pokémon/i);
  fireEvent.click(pokedexButton);

  // Agora as informações do pokemon devem aparecer na tela da Pokedex
  const pokemonName = await screen.findByText(/bulbasaur/i);
  const height = screen.getByText(/Altura: 7/i);
  const weight = screen.getByText(/Peso: 69/i);

  expect(pokemonName).toBeInTheDocument();
  expect(height).toBeInTheDocument();
  expect(weight).toBeInTheDocument();
});