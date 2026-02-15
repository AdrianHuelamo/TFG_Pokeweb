export const environment = {
  production: false,
  apiUrl: 'http://localhost/TFG_Pokeweb/backend/public/index.php/api/',
  pokeApiUrl: 'https://pokeapi.co/api/v2',

  pokemonTypeColors: {
    fire: '#F57D31', water: '#6493EB', grass: '#74CB48', electric: '#F9CF30',
    ice: '#9AD6DF', fighting: '#C12239', poison: '#A43E9E', ground: '#DEC16B',
    flying: '#A98FF3', psychic: '#FB5584', bug: '#A7B723', rock: '#B69E31',
    ghost: '#70559B', dragon: '#7037FF', steel: '#B8B8D0', fairy: '#E69EAC',
    normal: '#AAA67F', dark: '#705746', shadow: '#333'
  } as { [key: string]: string },

  pokemonTypeNames: [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 
    'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 
    'dragon', 'steel', 'dark', 'fairy'
  ],

  regions: {
    all:    { min: 1, max: 1025 },
    kanto:  { min: 1, max: 151 },
    johto:  { min: 152, max: 251 },
    hoenn:  { min: 252, max: 386 },
    sinnoh: { min: 387, max: 493 },
    teselia:{ min: 494, max: 649 },
    kalos:  { min: 650, max: 721 },
    alola:  { min: 722, max: 809 },
    galar:  { min: 810, max: 905 },
    paldea: { min: 906, max: 1025 }
  } as { [key: string]: { min: number, max: number } }
};