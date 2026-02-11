// Respuesta de la API para la lista (Home)
export interface PokeListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Pokemon[];
}

// El modelo principal de Pokémon (Sirve para Home y Detalles)
export interface Pokemon {
    // Campos básicos (Home)
    id?: number;
    name: string;
    url: string;
    image?: string;       // Usado en Home
    types?: PokemonType[]; 

    // Campos detallados (PokeDetail) - Opcionales (?)
    height?: number;
    weight?: number;
    description?: string;
    imageNormal?: string; // Usado en Detalle
    imageShiny?: string;  // Usado en Detalle
    speciesUrl?: string;
    
    // Arrays de datos complejos
    stats?: PokemonStat[];
    abilities?: PokemonAbility[];
    moves?: any[];        // Dejamos moves como any[] por ahora porque es gigante
    eggGroups?:  { name: string; url: string }[];
    
    // Combate
    weaknesses?: TypeMultiplier[];
    resistances?: TypeMultiplier[];
    immunities?: TypeMultiplier[];
}

// Sub-interfaces para mantener el orden
export interface PokemonType {
    slot: number;
    type: {
        name: string;
        url: string;
    }
}

export interface PokemonStat {
    base_stat: number;
    stat: {
        name: string;
        url: string;
    }
}

export interface PokemonAbility {
    is_hidden: boolean;
    ability: {
        name: string;
        url: string;
    }
}

export interface TypeMultiplier {
    name: string;
    multiplier: number;
}