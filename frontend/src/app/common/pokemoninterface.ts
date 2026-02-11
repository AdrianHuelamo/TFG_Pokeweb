export interface PokeListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Pokemon[];
}

export interface Pokemon {
    id?: number;
    name: string;
    url: string;
    image?: string;       
    types?: PokemonType[]; 

    height?: number;
    weight?: number;
    description?: string;
    imageNormal?: string; 
    imageShiny?: string;  
    speciesUrl?: string;
    
    stats?: PokemonStat[];
    abilities?: PokemonAbility[];
    moves?: any[];        
    eggGroups?:  { name: string; url: string }[];
    
    weaknesses?: TypeMultiplier[];
    resistances?: TypeMultiplier[];
    immunities?: TypeMultiplier[];
}

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