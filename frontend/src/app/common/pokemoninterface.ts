export interface PokeListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Pokemon[];
}

export interface Pokemon {
    name: string;
    url: string;
    id?: number;          
    image?: string;       
    types?: PokemonType[]; 
}

export interface PokemonType {
    slot: number;
    type: {
        name: string;
        url: string;
    }
}