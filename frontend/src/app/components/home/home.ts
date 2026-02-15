import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { PokeService } from '../../services/pokewebservices';
import { PokemonDataServices } from '../../services/pokemondataservices';
import { UserService } from '../../services/userservices'; 
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
  
  capturados: number[] = [];
  usuario: any = null;

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
      private dataService: PokemonDataServices,
      public userService: UserService 
  ) {}

  ngOnInit(): void {
    const savedState = this.dataService.getHomeState();
    this.cargarCapturas();
    if (savedState) {
        this.restaurarEstado(savedState);
    } else {
        this.cargarPokemonsIniciales();
    }
    
    this.iniciarScrollListener();
    this.pokeService.getTypesList().subscribe(data => this.listaTipos = data.results);

    this.usuario = this.userService.getUsuarioActual();
    
    if (this.usuario && this.usuario.id) {
        this.cargarCapturas();
    } else {
        console.warn("No hay usuario logueado, no cargo capturas.");
    }
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
    this.dataService.saveHomeState({
        listaGlobal: this.listaGlobal,
        listaFiltrada: this.listaFiltrada,
        pokemonsVisibles: this.pokemonsVisibles,
        offset: this.offset,
        filtros: {
            busqueda: this.busqueda,
            orden: this.ordenActual,
            region: this.regionSeleccionada,
            tipo: this.tipoSeleccionado
        },
        scroll: window.scrollY
    });
  }

  cargarCapturas() {
    if (!this.usuario?.id) return;
    
    this.userService.getCapturasUsuario(this.usuario.id).subscribe({
        next: (ids: any[]) => {
            this.capturados = ids.map(id => Number(id));            
            console.log("Capturas cargadas y convertidas:", this.capturados);
            this.cd.detectChanges(); 
        },
        error: (err) => console.error('Error cargando capturas', err)
    });
  }

  toggleCaptura(pokemonId: number | undefined, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (!pokemonId) return;
    if (!this.userService.isLoggedIn()) {
        alert("Inicia sesión para capturar Pokémon");
        return;
    }

    const index = this.capturados.indexOf(pokemonId);
    if (index === -1) {
        this.capturados.push(pokemonId);
    } else {
        this.capturados.splice(index, 1);
    }

    this.userService.toggleCaptura(this.usuario.id, pokemonId).subscribe({
        next: () => console.log('Captura OK'),
        error: (err) => {
            console.error(err);
            this.cargarCapturas();
        }
    });
  }

  esCapturado(id: number | undefined): boolean {
    if (!id) return false;
    return this.capturados.includes(id);
  }

  cargarPokemonsIniciales() {
    this.cargando = true;
    this.pokeService.getAllPokemons().subscribe({
      next: (response) => {
          this.listaGlobal = response.results.map((poke: any) => {
              const urlParts = poke.url.split('/');
              const id = parseInt(urlParts[urlParts.length - 2]);
              return {
                  id: id,
                  name: poke.name,
                  url: poke.url,
                  image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
                  types: []
              };
          });

          this.listaFiltrada = [...this.listaGlobal];
          this.cargarDetallesDeVisibles();
      },
      error: (err) => {
          console.error('Error cargando lista:', err);
          this.cargando = false;
      }
    });
  }

  cargarDetallesDeVisibles() {
    const nuevosBasicos = this.listaFiltrada.slice(this.offset, this.offset + this.limitePorPagina);
    
    if (nuevosBasicos.length === 0) {
        this.cargando = false;
        this.cargandoMas = false;
        return;
    }

    const peticiones = nuevosBasicos.map(p => this.pokeService.getPokemonDetails(p.url));

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

  cargarMas() {
    if (this.cargandoMas || this.pokemonsVisibles.length >= this.listaFiltrada.length) return;
    this.cargandoMas = true;
    this.cargarDetallesDeVisibles();
  }

  aplicarFiltros() {
    let res = this.listaGlobal;

    if (this.regionSeleccionada !== 'all') {
       const regions: any[] = (environment as any).pokemonRegions || [];
       const regionData = regions.find(r => r.value === this.regionSeleccionada);
       
       if (regionData) {
           res = res.filter(p => (p.id || 0) >= regionData.min && (p.id || 0) <= regionData.max);
       }
    }

    if (this.busqueda.trim()) {
       const term = this.busqueda.toLowerCase();
       res = res.filter(p => p.name.includes(term) || (p.id ? p.id.toString() : '') === term);
    }

    this.listaFiltrada = res;
    this.pokemonsVisibles = [];
    this.offset = 0;
    this.cargando = true;
    this.cargarDetallesDeVisibles();
  }

  buscar() { this.aplicarFiltros(); }
  resetearFiltros() {
      this.busqueda = '';
      this.regionSeleccionada = 'all';
      this.tipoSeleccionado = 'all';
      this.aplicarFiltros();
  }

  getColor(type: string): string { 
      const colors: any = (environment as any).pokemonTypeColors || {};
      return colors[type] || '#777'; 
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

  iniciarScrollListener() {
      this.scrollSubscription = fromEvent(window, 'scroll').subscribe(() => {
          this.checkScroll();
      });
  }

  subirArriba() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  restaurarEstado(state: any) {
      this.listaGlobal = state.listaGlobal || [];
      this.listaFiltrada = state.listaFiltrada || [];
      this.pokemonsVisibles = state.pokemonsVisibles || [];
      this.offset = state.offset || 0;
      this.busqueda = state.filtros?.busqueda || '';
      this.regionSeleccionada = state.filtros?.region || 'all';
      this.tipoSeleccionado = state.filtros?.tipo || 'all';

      if (state.scroll) {
          setTimeout(() => window.scrollTo(0, state.scroll), 100);
      }
      this.cargando = false;
  }

  get esAdmin(): boolean {
    return this.userService.getUserRole() === 'admin';
}

    get esUsuarioNormal(): boolean {
        return this.userService.getUserRole() === 'entrenador' || this.userService.getUserRole() === 'campeon';
    }
  
}