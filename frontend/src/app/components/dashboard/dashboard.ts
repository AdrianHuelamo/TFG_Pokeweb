import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AdminServices } from '../../services/adminservices';
import { ComunidadServices } from '../../services/comunidadservices';
import { UserService } from '../../services/userservices';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: false
})
export class Dashboard implements OnInit {

  seccion: string = 'home';
  stats: any = { usuarios: 0, noticias: 0, equipos: 0, capturas: 0 };
  
  // Inicializamos arrays para evitar errores de "undefined" en el HTML
  listaUsuarios: any[] = [];
  listaNoticias: any[] = [];
  listaEquipos: any[] = [];

  cargando: boolean = false;

  constructor(
    private adminService: AdminServices,
    private comunidadService: ComunidadServices,
    private userService: UserService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cambiarSeccion(nombre: string) {
    this.seccion = nombre;
    if (nombre === 'usuarios') this.cargarUsuarios();
    if (nombre === 'noticias') this.cargarNoticias();
    if (nombre === 'equipos') this.cargarEquipos();
  }

  // --- CARGADORES ---

  cargarEstadisticas() {
    this.cargando = true;
    this.adminService.getDashboardStats().subscribe({
      next: (resp: any) => {
        this.stats = resp.data || resp; 
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: () => this.cargando = false
    });
  }

  cargarUsuarios() {
    this.cargando = true;
    this.adminService.getUsers().subscribe({
      next: (resp: any) => {
        this.listaUsuarios = resp.data || [];
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: () => this.cargando = false
    });
  }

  cargarNoticias() {
    this.cargando = true;
    this.comunidadService.getNoticias().subscribe({
      next: (resp: any) => {
        console.log('DATOS RECIBIDOS (Noticias):', resp.data); // MIRA LA CONSOLA
        this.listaNoticias = resp.data || [];
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (e) => {
        console.error(e);
        this.cargando = false;
      }
    });
  }

  cargarEquipos() {
    this.cargando = true;
    this.adminService.getAllTeams().subscribe({
      next: (resp: any) => {
        this.listaEquipos = resp.data || [];
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: () => this.cargando = false
    });
  }

  // --- ACCIONES NOTICIAS ---

  toggleDestacada(n: any) {
    // CORRECCIÓN: Comprobar "1" (string) y 1 (number)
    const estadoActual = (n.destacada == 1 || n.destacada == '1');
    const nuevoEstado = estadoActual ? 0 : 1;

    this.comunidadService.updateNoticia(n.id, { destacada: nuevoEstado }).subscribe({
      next: () => {
        n.destacada = nuevoEstado; // Actualizar vista
        this.cd.detectChanges();
      }
    });
  }

  verNoticia(id: number) {
    // CORRECCIÓN: Esta ruta debe coincidir con tu routing module
    // Si tu ruta es 'noticia/:id', esto funciona:
    console.log("Navegando a noticia ID:", id);
    this.router.navigate(['/noticia', id]);
  }

  borrarNoticia(n: any) {
    if(confirm(`¿Borrar noticia: "${n.titulo}"?`)) {
        this.comunidadService.deleteNoticia(n.id).subscribe(() => this.cargarNoticias());
    }
  }

  crearNoticia() {
    alert("Función pendiente: Abrir modal de creación");
  }

  // --- OTRAS ACCIONES ---

  borrarUsuario(u: any) {
    if(confirm(`¿Borrar usuario ${u.username}?`)) {
      this.adminService.deleteUser(u.id).subscribe(() => this.cargarUsuarios());
    }
  }

  editarUsuario(u: any) {
    const rol = prompt('Nuevo rol (admin, entrenador, campeon):', u.role);
    if(rol && rol !== u.role) {
        this.adminService.updateUser({ id: u.id, role: rol }).subscribe(() => this.cargarUsuarios());
    }
  }

  borrarEquipo(t: any) {
      if(confirm(`¿Borrar equipo "${t.name}"?`)) {
          this.adminService.deleteTeamAny(t.id).subscribe(() => this.cargarEquipos());
      }
  }

  irWebPublica() { this.router.navigate(['/home']); }
  
  logout() {
      this.userService.logout();
      this.router.navigate(['/login']);
  }
}