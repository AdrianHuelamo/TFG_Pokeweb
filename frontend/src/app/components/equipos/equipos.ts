import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { EquiposServices } from '../../services/equiposservices';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.html',
  styleUrls: ['./equipos.css'],
  standalone: false
})
export class Equipos implements OnInit { 

  equipos: any[] = [];
  cargando: boolean = true; 

  mostrarModalNombre: boolean = false;
  nombreEquipoInput: string = '';
  equipoEnEdicionId: number | null = null;
  guardandoEquipo: boolean = false;

  mostrarModalBuscador: boolean = false;
  teamIdSeleccionado: number = 0;
  
  listaPokemonGlobal: any[] = []; 
  listaPokemonFiltrada: any[] = []; 
  terminoBusqueda: string = '';

  constructor(
    private equiposService: EquiposServices,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEquipos();
    this.cargarListaGlobalPokemon();
  }

  cargarEquipos() {
    this.cargando = true;
    this.equiposService.getEquipos().subscribe({
      next: (data) => {
        this.equipos = data;
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        this.cd.detectChanges();
      }
    });
  }

  cargarListaGlobalPokemon() {
      this.equiposService.getAllPokemonList().subscribe((resp: any) => {
          this.listaPokemonGlobal = resp.results.map((p: any) => {
              const parts = p.url.split('/');
              const id = parseInt(parts[parts.length - 2]);
              return { name: p.name, id: id };
          });
          this.listaPokemonFiltrada = this.listaPokemonGlobal.slice(0, 20); 
      });
  }

  irADetalle(pokemonId: number) {
    this.router.navigate(['/pokemon', pokemonId]); 
  }

  abrirModalCrear() {
      this.equipoEnEdicionId = null; 
      this.nombreEquipoInput = ''; 
      this.mostrarModalNombre = true;
  }

  abrirModalEditar(equipo: any) {
      this.equipoEnEdicionId = equipo.id; 
      this.nombreEquipoInput = equipo.name;
      this.mostrarModalNombre = true;
  }

  cerrarModalNombre() {
      this.mostrarModalNombre = false;
  }

  guardarEquipo() {
      if (!this.nombreEquipoInput.trim()) return;
      this.guardandoEquipo = true;

      if (this.equipoEnEdicionId) {
          this.equiposService.updateEquipo(this.equipoEnEdicionId, this.nombreEquipoInput).subscribe({
              next: () => {
                  this.cargarEquipos();
                  this.cerrarModalNombre();
                  this.guardandoEquipo = false;
              },
              error: () => this.guardandoEquipo = false
          });
      } else {
          this.equiposService.createEquipo(this.nombreEquipoInput).subscribe({
              next: () => {
                  this.cargarEquipos();
                  this.cerrarModalNombre();
                  this.guardandoEquipo = false;
              },
              error: () => this.guardandoEquipo = false
          });
      }
  }

  deleteEquipo(id: number) {
    if(confirm("¿Seguro que quieres borrar este equipo?")) {
      this.equiposService.deleteEquipo(id).subscribe(() => this.cargarEquipos());
    }
  }

  abrirSelector(teamId: number) {
    this.teamIdSeleccionado = teamId;
    this.terminoBusqueda = '';
    this.filtrarPokemon();
    this.mostrarModalBuscador = true;
  }

  cerrarSelector() {
    this.mostrarModalBuscador = false;
  }

  filtrarPokemon() {
      const term = this.terminoBusqueda.toLowerCase().trim();
      if (!term) {
          this.listaPokemonFiltrada = this.listaPokemonGlobal.slice(0, 20);
          return;
      }
      const filtrados = this.listaPokemonGlobal.filter(p => 
          p.name.includes(term) || p.id.toString() === term
      );
      this.listaPokemonFiltrada = filtrados.slice(0, 50);
  }

  seleccionarPokemon(pokeId: number) {
      this.equiposService.addPokemon(this.teamIdSeleccionado, pokeId).subscribe({
          next: () => {
              this.cargarEquipos(); 
              this.cerrarSelector(); 
          },
          error: (err: any) => alert(err.error?.messages || "Error al añadir.")
      });
  }

  removeMember(memberId: number) {
      this.equiposService.removePokemon(memberId).subscribe(() => this.cargarEquipos());
  }

  getPokemonImage(id: number): string {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }

  getEmptySlots(currentCount: number): any[] {
      const faltan = 6 - currentCount;
      return new Array(faltan > 0 ? faltan : 0);
  }

  marcarFavorito(equipo: any) {
    if (equipo.is_favorite == 1) return;

    this.equiposService.setFavorite(equipo.id).subscribe({
      next: () => {
        this.cargarEquipos();
      },
      error: (err) => alert('Error al marcar favorito')
    });
  }
}