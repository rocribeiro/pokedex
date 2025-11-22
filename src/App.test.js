import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
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
  await act(async () => {
    render(<App />);
  });

  // Aguarda o pokemon inicial carregar (devido ao useEffect) e a imagem aparecer
  const pokemonImage = await screen.findByAltText(/bulbasaur/i);
  expect(pokemonImage).toBeInTheDocument();
  
  // Verifica que a mensagem inicial está presente antes de escanear
  expect(screen.getByText(/Selecione um Pokémon para ver suas informações/i)).toBeInTheDocument();
});

test('gets a new pokemon when "Novo Pokémon" is clicked', async () => {
  await act(async () => {
    render(<App />);
  });

  // Espera o pokemon inicial carregar
  await screen.findByAltText(/bulbasaur/i);

  // Clica no botão para buscar um novo pokemon
  const button = screen.getByText(/Novo Pokémon/i);
  
  await act(async () => {
    fireEvent.click(button);
    // Aguarda um pouco para a promise do fetch resolver
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  // Aguarda a conclusão das atualizações de estado
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  // A imagem ainda deve ser do bulbasaur porque o mock retorna o mesmo pokemon
  const pokemonImage = await screen.findByAltText(/bulbasaur/i);
  expect(pokemonImage).toBeInTheDocument();
});

test('shows pokemon info in the pokedex when "Scanear Pokémon" is clicked', async () => {
  await act(async () => {
    render(<App />);
  });

  // Espera o pokemon inicial carregar no campo
  await screen.findByAltText(/bulbasaur/i);

  // Pega o botão de scanear e clica
  const pokedexButton = screen.getByText(/Scanear Pokémon/i);
  
  act(() => {
    fireEvent.click(pokedexButton);
  });

  // Agora as informações do pokemon devem aparecer na tela da Pokedex
  await waitFor(() => {
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
  });

  const height = screen.getByText(/Altura: 7/i);
  const weight = screen.getByText(/Peso: 69/i);

  expect(height).toBeInTheDocument();
  expect(weight).toBeInTheDocument();
});