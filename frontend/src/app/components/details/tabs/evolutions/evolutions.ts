import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PokemonDataServices } from '../../../../services/pokemondataservices';
import { PokeService } from '../../../../services/pokewebservices';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-evolutions',
  standalone: false,
  templateUrl: './evolutions.html',
  styleUrl: './evolutions.css',
})
export class Evolutions implements OnInit {
  pokemon: any;
  evolutionTree: any[] = []; // Ya no es una lista plana, es una estructura de niveles
  cargando: boolean = true;

  constructor(
    private dataService: PokemonDataServices,
    private pokeService: PokeService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dataService.pokemon$.subscribe(pk => {
      if (pk) {
        this.pokemon = pk;
        if (pk.speciesUrl) {
            this.loadEvolutionChain(pk.speciesUrl);
        } else {
            this.cargando = false;
        }
      }
    });
  }

  loadEvolutionChain(url: string) {
      this.cargando = true;
      this.pokeService.getPokemonDetails(url).subscribe({
          next: (data: any) => {
              const treeNode = this.processEvolutionNode(data.chain);
              
              const allIds = this.collectIds(treeNode);
              
              this.loadImages(allIds, treeNode);
          },
          error: (err) => {
              console.error('Error:', err);
              this.cargando = false;
              this.cd.detectChanges();
          }
      });
  }

  processEvolutionNode(node: any): any {
      const speciesId = node.species.url.split('/').filter(Boolean).pop();
      let req = "";

      if (node.evolution_details && node.evolution_details.length > 0) {
          const d = node.evolution_details[0];
          if (d.min_level) req = `Nvl ${d.min_level}`;
          else if (d.item) req = d.item.name.replace(/-/g, " ");
          else if (d.min_happiness) req = "Amistad";
          else if (d.trigger.name === "trade") req = "Intercambio";
          else if (d.known_move) req = `Mov: ${d.known_move.name}`;
          else if (d.location) req = "Lugar Esp.";
          else if (d.time_of_day) req = d.time_of_day; 
          else req = "?";
      }

      return {
          name: node.species.name,
          id: speciesId,
          req: req,
          image: '', 
          evolves_to: node.evolves_to.map((child: any) => this.processEvolutionNode(child))
      };
  }

  collectIds(node: any): string[] {
      let ids = [node.id];
      if (node.evolves_to.length > 0) {
          node.evolves_to.forEach((child: any) => {
              ids = ids.concat(this.collectIds(child));
          });
      }
      return ids;
  }

  loadImages(ids: string[], rootNode: any) {
      const requests = ids.map(id => 
          this.pokeService.getPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${id}/`)
      );

      forkJoin(requests).subscribe({
          next: (responses: any[]) => {
              const imageMap: any = {};
              responses.forEach(r => {
                  imageMap[r.id] = r.sprites.other['official-artwork'].front_default;
              });

              this.applyImages(rootNode, imageMap);
              
              this.evolutionTree = [rootNode];
              this.cargando = false;
              this.cd.detectChanges();
          },
          error: () => {
              this.cargando = false;
              this.cd.detectChanges();
          }
      });
  }

  applyImages(node: any, map: any) {
      node.image = map[node.id];
      if (node.evolves_to.length > 0) {
          node.evolves_to.forEach((child: any) => this.applyImages(child, map));
      }
  }
}