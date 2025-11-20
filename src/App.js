import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [pokedexData, setPokedexData] = useState(null);

  const getRandomPokemon = async () => {
    const randomId = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();
    setPokemon(data);
    setPokedexData(null);
  };

  useEffect(() => {
    getRandomPokemon();
  }, []);

  const getPokedexInfo = () => {
    if (pokemon) {
      setPokedexData(pokemon);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="pokedex">
          <div className="pokedex-header">
            <div className="pokedex-header-ball"></div>
          </div>
          <div className="pokedex-screen-container">
            <div className="pokedex-screen">
              {pokedexData ? (
                <div>
                  <h3>{pokedexData.name}</h3>
                  <img src={pokedexData.sprites.front_default} alt={pokedexData.name} />
                  <p>Altura: {pokedexData.height}</p>
                  <p>Peso: {pokedexData.weight}</p>
                </div>
              ) : (
                <p>Selecione um Pokémon para ver suas informações</p>
              )}
            </div>
          </div>
          <div className="pokedex-controls">
            <button className="pokedex-button" onClick={getPokedexInfo}>
              Scanear Pokémon
            </button>
          </div>
        </div>
        <div className="field">
          {pokemon && (
            <div className="pokemon-in-field">
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            </div>
          )}
          <button className="field-button" onClick={getRandomPokemon}>Novo Pokémon</button>
        </div>
      </div>
    </div>
  );
}

export default App;