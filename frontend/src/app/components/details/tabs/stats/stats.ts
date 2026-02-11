import { Component, OnInit } from '@angular/core';
import { PokemonDataServices } from '../../../../services/pokemondataservices';

@Component({
  selector: 'app-stats',
  standalone: false,
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats implements OnInit {
  pokemon: any;

  constructor(private dataService: PokemonDataServices) {}

  ngOnInit() {
    this.dataService.pokemon$.subscribe(pk => {
      this.pokemon = pk;
    });
  }

  formatName(name: string): string {
    const map: any = {
      'hp': 'PS',              
      'attack': 'Ataque',      
      'defense': 'Defensa',   
      'special-attack': 'At. Esp.', 
      'special-defense': 'Def. Esp.',
      'speed': 'Velocidad'    
    };
    return map[name] || name;
  }

  getBarColor(stat: number): string {
    if (stat >= 100) return '#00c853'; 
    if (stat >= 70)  return '#64dd17'; 
    if (stat >= 50)  return '#ffeb3b'; 
    return '#ff5252';                  
  }

  getTotalStats(): number {
      if(!this.pokemon) return 0;
      return this.pokemon.stats.reduce((acc: number, curr: any) => acc + curr.base_stat, 0);
  }
}