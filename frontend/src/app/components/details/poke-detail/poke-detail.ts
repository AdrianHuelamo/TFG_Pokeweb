import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokeService } from '../../../services/pokewebservices';
import { PokemonDataServices } from '../../../services/pokemondataservices';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../environments/environment'; // <--- Importar

@Component({
  selector: 'app-poke-detail',
  templateUrl: './poke-detail.html',
  styleUrls: ['./poke-detail.css'],
  standalone: false
})
export class PokeDetail implements OnInit {

  pokemon: any = null;
  isShiny: boolean = false; 
  cargando: boolean = true; 
  
  // NOTA: 'allTypes' y 'typeColors' eliminados, usamos environment

  constructor(
    private route: ActivatedRoute,
    private pokeService: PokeService,
    private cd: ChangeDetectorRef,
    private dataServices: PokemonDataServices
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      const id = params['id'];
      if (id) {
        this.loadPokemonData(id);
      }
    });
  }

  loadPokemonData(id: string | number) {
    this.cargando = true; 
    this.pokemon = null; 
    this.isShiny = false; 
    
    // Aquí podríamos usar environment.pokeApiUrl pero como ya viene en el servicio, lo dejamos así o lo concatenamos
    const pokemonReq = this.pokeService.getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const speciesReq = this.pokeService.getPokemonDetails(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);

    forkJoin([pokemonReq, speciesReq]).subscribe({
      next: (resp: any) => {
        const pk = resp[0];
        const sp = resp[1];

        const entry = sp.flavor_text_entries.find((e: any) => e.language.name === 'es') || sp.flavor_text_entries.find((e: any) => e.language.name === 'en');
            
        this.pokemon = {
          id: pk.id,
          name: pk.name,
          types: pk.types,
          height: pk.height,
          weight: pk.weight,
          stats: pk.stats,
          abilities: pk.abilities,  
          moves: pk.moves,          
          eggGroups: sp.egg_groups, 
          imageNormal: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pk.id}.png`,
          imageShiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pk.id}.png`,
          description: entry ? entry.flavor_text.replace(/\f/g, ' ') : 'Sin descripción.',
          speciesUrl: sp.evolution_chain.url,
          
          weaknesses: [],
          resistances: [],
          immunities: []
        };

        if (pk.types && pk.types.length > 0) {
            const typeRequests = pk.types.map((t: any) => this.pokeService.getPokemonDetails(t.type.url));
            forkJoin(typeRequests).subscribe({
                next: (typeDataList: any) => { 
                    this.calcularDebilidades(typeDataList);
                    this.finalizarCarga();
                },
                error: (err: any) => {
                    console.error(err);
                    this.finalizarCarga(); 
                }
            });
        } else {
            this.finalizarCarga();
        }
      },
      error: (err: any) => {
          console.error('Error cargando pokemon:', err);
          this.cargando = false;
      }
    });
  }

  finalizarCarga() {
      this.dataServices.setPokemon(this.pokemon);
      this.cargando = false; 
      this.cd.detectChanges(); 
  }

  calcularDebilidades(typeDataList: any[]) {
    let multipliers: { [key: string]: number } = {};
    
    // USO DE ENVIRONMENT
    environment.pokemonTypeNames.forEach(type => multipliers[type] = 1); 

    typeDataList.forEach((typeData: any) => {
        typeData.damage_relations.double_damage_from.forEach((t: any) => multipliers[t.name] *= 2);
        typeData.damage_relations.half_damage_from.forEach((t: any) => multipliers[t.name] *= 0.5);
        typeData.damage_relations.no_damage_from.forEach((t: any) => multipliers[t.name] *= 0);
    });

    this.pokemon.weaknesses = Object.keys(multipliers)
        .filter(type => multipliers[type] > 1)
        .map(type => ({ name: type, multiplier: multipliers[type] }));

    this.pokemon.resistances = Object.keys(multipliers)
        .filter(type => multipliers[type] < 1 && multipliers[type] > 0)
        .map(type => ({ name: type, multiplier: multipliers[type] }));

    this.pokemon.immunities = Object.keys(multipliers)
        .filter(type => multipliers[type] === 0)
        .map(type => ({ name: type, multiplier: 0 }));
  }

  toggleShiny() {
      this.isShiny = !this.isShiny;
  }

  // USO DE ENVIRONMENT
  getColor(type: string): string {
      return environment.pokemonTypeColors[type] || '#777';
  }
}