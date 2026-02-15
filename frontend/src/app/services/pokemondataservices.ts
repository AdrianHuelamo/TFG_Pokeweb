import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonDataServices {
  private pokemonSource = new BehaviorSubject<any>(null);
  pokemon$ = this.pokemonSource.asObservable();

  setPokemon(pokemon: any) {
    this.pokemonSource.next(pokemon);
  }

  saveHomeState(state: any) {
    sessionStorage.setItem('homeState', JSON.stringify(state));
  }

  getHomeState() {
    const state = sessionStorage.getItem('homeState');
    return state ? JSON.parse(state) : null;
  }

  clearHomeState() {
    sessionStorage.removeItem('homeState');
  }
}