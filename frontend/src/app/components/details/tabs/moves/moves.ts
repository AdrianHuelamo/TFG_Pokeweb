import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PokemonDataServices } from '../../../../services/pokemondataservices';
import { PokeService } from '../../../../services/pokewebservices';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-moves',
  standalone: false,
  templateUrl: './moves.html',
  styleUrl: './moves.css',
})
export class Moves implements OnInit {
  pokemon: any;
  
  movesList: any[] = [];   
  movesToShow: any[] = [];  
  
  cargando: boolean = true;
  
  currentPage: number = 1;
  totalPages: number = 0;
  elementsPP: number = 4; 
  constructor(
      private dataService: PokemonDataServices,
      private pokeService: PokeService,
      private cd: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.dataService.pokemon$.subscribe(pk => {
      if (pk) {
        this.pokemon = pk;
        this.procesarMovimientos(pk.moves);
      }
    });
  }

  procesarMovimientos(moves: any[]) {
      this.cargando = true;
      this.currentPage = 1;
      this.movesToShow = [];

      const nivelMoves = moves.filter((m: any) => {
          const lastDetail = m.version_group_details[m.version_group_details.length - 1];
          return lastDetail.move_learn_method.name === 'level-up';
      });

      let tempMoves = nivelMoves.map((m: any) => {
          const lastDetail = m.version_group_details[m.version_group_details.length - 1];
          return {
              name: m.move.name.replace(/-/g, ' '),
              level: lastDetail.level_learned_at,
              url: m.move.url, 
              type: 'unknown'
          };
      });

      tempMoves.sort((a: any, b: any) => a.level - b.level);

      if (tempMoves.length === 0) {
          this.movesList = [];
          this.cargando = false;
          return;
      }

      const requests = tempMoves.map((m: any) => this.pokeService.getPokemonDetails(m.url));

      forkJoin(requests).subscribe({
          next: (detalles: any[]) => {
              this.movesList = tempMoves.map((move: any, index: number) => {
                  return {
                      ...move,
                      type: detalles[index].type.name 
                  };
              });

              this.totalPages = Math.ceil(this.movesList.length / this.elementsPP);

              this.updateView();

              this.cargando = false;
              this.cd.detectChanges(); 
          },
          error: (err) => {
              console.error('Error cargando tipos de movimientos', err);
              this.movesList = tempMoves; 
              this.updateView();
              this.cargando = false;
              this.cd.detectChanges(); 
          }
      });
  }

  updateView() {
      const start = (this.currentPage - 1) * this.elementsPP;
      const end = start + this.elementsPP;
      this.movesToShow = this.movesList.slice(start, end);
  }

  prevPage() {
      if (this.currentPage > 1) {
          this.currentPage--;
          this.updateView();
      }
  }

  nextPage() {
      if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.updateView();
      }
  }

  goToPage(page: number) {
      this.currentPage = page;
      this.updateView();
  }

  getColor(type: string): string {
      return environment.pokemonTypeColors[type] || '#777';
  }
}