import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonDataServices {
  private pokemonSource = new BehaviorSubject<any>(null);
  pokemon$ = this.pokemonSource.asObservable();

  // Ya no necesitamos la variable 'homeState' aquí
  // private homeState: any = null; 

  setPokemon(pokemon: any) {
    this.pokemonSource.next(pokemon);
  }

  // --- CAMBIO: USAR SESSION STORAGE ---

  saveHomeState(state: any) {
    // Convertimos el objeto a texto (JSON) para guardarlo
    sessionStorage.setItem('homeState', JSON.stringify(state));
  }

  getHomeState() {
    const state = sessionStorage.getItem('homeState');
    // Si existe, lo convertimos de texto a objeto. Si no, devolvemos null.
    return state ? JSON.parse(state) : null;
  }

  clearHomeState() {
    sessionStorage.removeItem('homeState');
  }
}