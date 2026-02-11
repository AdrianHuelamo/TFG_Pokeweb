import { Component, OnInit } from '@angular/core';
import { PokemonDataServices } from '../../../../services/pokemondataservices';
import { environment } from '../../../../../environments/environment'; // <--- Importar

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit {
  pokemon: any;
  

  constructor(private dataService: PokemonDataServices) {}
  
  ngOnInit() {
    this.dataService.pokemon$.subscribe(pk => {
      this.pokemon = pk;
    });
  }

  getWeaknessColor(type: string): string {
    return environment.pokemonTypeColors[type] || '#777';
  }
}