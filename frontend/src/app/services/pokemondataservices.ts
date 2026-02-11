import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonDataServices {
  private pokemonSource = new BehaviorSubject<any>(null);
  pokemon$ = this.pokemonSource.asObservable();

  private homeState: any = null;

  setPokemon(pokemon: any) {
    this.pokemonSource.next(pokemon);
  }

  saveHomeState(state: any) {
    this.homeState = state;
  }

  getHomeState() {
    return this.homeState;
  }

  clearHomeState() {
    this.homeState = null;
  }
}