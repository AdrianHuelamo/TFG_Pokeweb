import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { PokeService } from '../../services/pokewebservices';
import { PokemonDataServices } from '../../services/pokemondataservices';
import { forkJoin, fromEvent, Subscription } from 'rxjs'; 
import { environment } from '../../../environments/environment';
import { Pokemon } from '../../common/pokemoninterface';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: false
})
export class Home implements OnInit, OnDestroy {

  listaGlobal: Pokemon[] = [];      
  listaFiltrada: Pokemon[] = [];    
  pokemonsVisibles: Pokemon[] = []; 
  listaTipos: any[] = [];       
  
  offset: number = 0;
  limitePorPagina: number = 24;
  cargando: boolean = true;      
  cargandoMas: boolean = false;  

  busqueda: string = '';
  ordenActual: string = 'id-asc';
  regionSeleccionada: string = 'all';
  tipoSeleccionado: string = 'all';

  mostrarBotonSubir: boolean = false;
  private scrollSubscription: Subscription | undefined;

  constructor(
      private pokeService: PokeService, 
      private cd: ChangeDetectorRef,
      private dataService: PokemonDataServices
  ) {}

  ngOnInit(): void {
    
    // Escuchamos el scroll (Solo para cargar más pokemon y mostrar botón subir)
    this.scrollSubscription = fromEvent(window, 'scroll').subscribe(() => {
        this.checkScroll();
    });

    const estadoGuardado = this.dataService.getHomeState();

    if (estadoGuardado) {
        console.log("Restaurando datos de sesión...");
        
        // Recuperamos los datos guardados en SessionStorage
        this.listaTipos = estadoGuardado.listaTipos || []; 
        this.listaGlobal = estadoGuardado.listaGlobal;
        this.listaFiltrada = estadoGuardado.listaFiltrada;
        this.pokemonsVisibles = estadoGuardado.pokemonsVisibles;
        this.offset = estadoGuardado.offset;
        
        this.busqueda = estadoGuardado.busqueda;
        this.regionSeleccionada = estadoGuardado.regionSeleccionada;
        this.tipoSeleccionado = estadoGuardado.tipoSeleccionado;
        this.ordenActual = estadoGuardado.ordenActual;

        this.cargando = false;
        // YA NO HACEMOS SCROLL AUTOMÁTICO

    } else {
        // Carga inicial normal
        this.pokeService.getTypesList().subscribe(data => {
            this.listaTipos = data.results.filter((t: any) => 
                t.name !== 'stellar' && t.name !== 'unknown' && t.name !== 'shadow'
            );
        });

        this.cargando = true;
        this.pokeService.getAllPokemons().subscribe({
          next: (data) => {
            if(data && data.results) {
                this.listaGlobal = data.results.map((poke) => {
                    const id = poke.url.split('/').filter(Boolean).pop();
                    poke.id = parseInt(id || '0');
                    poke.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
                    return poke;
                });
                
                this.listaFiltrada = [...this.listaGlobal];
                this.cargarMas(); 
            }
          },
          error: (err) => { 
              console.error(err); 
              this.cargando = false; 
          }
        });
    }
  }

  ngOnDestroy(): void {
      if (this.scrollSubscription) {
          this.scrollSubscription.unsubscribe();
      }

      // Guardamos el estado de los DATOS (no del scroll)
      const estado = {
          listaTipos: this.listaTipos, 
          listaGlobal: this.listaGlobal,
          listaFiltrada: this.listaFiltrada,
          pokemonsVisibles: this.pokemonsVisibles,
          offset: this.offset,
          busqueda: this.busqueda,
          regionSeleccionada: this.regionSeleccionada,
          tipoSeleccionado: this.tipoSeleccionado,
          ordenActual: this.ordenActual
      };

      this.dataService.saveHomeState(estado);
  }

  async aplicarFiltros() {
    this.cargando = true; 
    this.pokemonsVisibles = [];
    this.offset = 0;

    let resultados = [...this.listaGlobal];

    if (this.tipoSeleccionado !== 'all') {
        try {
            const data = await this.pokeService.getPokemonsByType(this.tipoSeleccionado).toPromise();
            const pokemonsDeTipo = data.pokemon.map((p: any) => p.pokemon.name);
            resultados = resultados.filter(p => pokemonsDeTipo.includes(p.name));
        } catch (error) { console.error(error); }
    }

    if (this.regionSeleccionada !== 'all') {
        const rango = environment.regions[this.regionSeleccionada];
        resultados = resultados.filter(p => (p.id!) >= rango.min && (p.id!) <= rango.max);
    }

    const texto = this.busqueda.toLowerCase().trim();
    if (texto !== '') {
        resultados = resultados.filter(p => 
            p.name.includes(texto) || (p.id!).toString() === texto
        );
    }

    this.ordenarListaInterna(resultados);

    this.listaFiltrada = resultados;
    this.cargarMas();
  }

  buscar() { this.aplicarFiltros(); }

  resetearFiltros() {
      this.busqueda = '';
      this.regionSeleccionada = 'all';
      this.tipoSeleccionado = 'all';
      this.ordenActual = 'id-asc';
      this.aplicarFiltros();
  }

  ordenarListaInterna(lista: Pokemon[]) {
      if (this.ordenActual === 'id-asc') lista.sort((a, b) => (a.id!) - (b.id!));
      if (this.ordenActual === 'id-desc') lista.sort((a, b) => (b.id!) - (a.id!));
      if (this.ordenActual === 'name-asc') lista.sort((a, b) => a.name.localeCompare(b.name));
      if (this.ordenActual === 'name-desc') lista.sort((a, b) => b.name.localeCompare(a.name));
  }

  cargarMas() {
    if (this.cargandoMas) return;

    const nuevosBasicos = this.listaFiltrada.slice(this.offset, this.offset + this.limitePorPagina);
    
    if (nuevosBasicos.length === 0) {
        this.cargando = false; 
        return;
    }

    this.cargandoMas = true;

    const peticiones = nuevosBasicos.map(poke => this.pokeService.getPokemonDetails(poke.url));

    forkJoin(peticiones).subscribe({
        next: (detalles: any[]) => {
            const nuevosCompletos = nuevosBasicos.map((poke, index) => {
                return {
                    ...poke,
                    types: detalles[index].types
                };
            });

            this.pokemonsVisibles = [...this.pokemonsVisibles, ...nuevosCompletos];
            this.offset += this.limitePorPagina;
            
            this.cargando = false; 
            this.cargandoMas = false; 
            this.cd.detectChanges();
        },
        error: (err) => {
            console.error(err);
            this.cargando = false;
            this.cargandoMas = false;
        }
    });
  }

  getColor(type: string): string { 
      return environment.pokemonTypeColors[type] || '#777'; 
  }

  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    this.mostrarBotonSubir = scrollPosition >= 400;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    if ((windowHeight + scrollPosition) >= documentHeight - 500) {
        if (!this.cargando && !this.cargandoMas && this.pokemonsVisibles.length < this.listaFiltrada.length) {
            this.cargarMas();
        }
    }
  }

  subirArriba() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
  }
}