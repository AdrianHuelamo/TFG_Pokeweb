import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { PokeService } from '../../services/pokewebservices';
import { PokemonDataServices } from '../../services/pokemondataservices';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment'; 
import { Pokemon } from '../../common/pokemoninterface';
import { UserService } from '../../services/userservices';


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

  constructor(
      private pokeService: PokeService, 
      private cd: ChangeDetectorRef,
      private dataService: PokemonDataServices,
      public userService: UserService
  ) {}

  ngOnInit(): void {

    this.usuario = this.userService.getUsuarioActual();
    if (this.usuario?.id) {
      this.cargarCapturas();
    }
    const estadoGuardado = this.dataService.getHomeState();

    if (estadoGuardado) {
        console.log("Restaurando sesión anterior...");
        
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

        setTimeout(() => {
            window.scrollTo(0, estadoGuardado.scrollPosition);
        }, 50);

    } else {
        this.pokeService.getTypesList().subscribe(data => {
            this.listaTipos = data.results.filter((t: any) => 
                t.name !== 'stellar' && t.name !== 'unknown' && t.name !== 'shadow'
            );
        });

        this.cargando = true;
        this.pokeService.getAllPokemons().subscribe({
          next: (data) => {
            if(data && data.results) {
                this.listaGlobal = data.results.map((poke: any) => {
                    const id = poke.url.split('/').filter(Boolean).pop();
                    poke.id = parseInt(id);
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
      const estado = {
          listaTipos: this.listaTipos, 
          listaGlobal: this.listaGlobal,
          listaFiltrada: this.listaFiltrada,
          pokemonsVisibles: this.pokemonsVisibles,
          offset: this.offset,
          busqueda: this.busqueda,
          regionSeleccionada: this.regionSeleccionada,
          tipoSeleccionado: this.tipoSeleccionado,
          ordenActual: this.ordenActual,
          scrollPosition: window.scrollY
      };

      this.dataService.saveHomeState(estado);
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
        resultados = resultados.filter(p => p.id !>= rango.min && p.id! <= rango.max);
    }

    const texto = this.busqueda.toLowerCase().trim();
    if (texto !== '') {
        resultados = resultados.filter(p => 
            p.name.includes(texto) || p.id!.toString() === texto
        );
    }

    this.ordenarListaInterna(resultados);

    this.listaFiltrada = resultados;
    this.cargarMas();
  }

  buscar() {
      this.aplicarFiltros(); 
  }

  resetearFiltros() {
      this.busqueda = '';
      this.regionSeleccionada = 'all';
      this.tipoSeleccionado = 'all';
      this.ordenActual = 'id-asc';

      this.aplicarFiltros();
  }

  ordenarListaInterna(lista: any[]) {
      if (this.ordenActual === 'id-asc') lista.sort((a, b) => a.id - b.id);
      if (this.ordenActual === 'id-desc') lista.sort((a, b) => b.id - a.id);
      if (this.ordenActual === 'name-asc') lista.sort((a, b) => a.name.localeCompare(b.name));
      if (this.ordenActual === 'name-desc') lista.sort((a, b) => b.name.localeCompare(a.name));
  }

  

  cargarMas() {
    const nuevosBasicos = this.listaFiltrada.slice(this.offset, this.offset + this.limitePorPagina);
    
    if (nuevosBasicos.length === 0) {
        this.cargando = false; 
        return;
    }

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
            this.cd.detectChanges();
        },
        error: (err) => {
            console.error(err);
            this.cargando = false;
        }
    });
  }

  getColor(type: string): string { 
      return environment.pokemonTypeColors[type] || '#777'; 
  }

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.mostrarBotonSubir = scrollPosition >= 400;
  }

  subirArriba() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
  }

  get esAdmin(): boolean {
    return this.userService.getUserRole() === 'admin';
}

    get esUsuarioNormal(): boolean {
        return this.userService.getUserRole() === 'entrenador' || this.userService.getUserRole() === 'campeon';
    }
}