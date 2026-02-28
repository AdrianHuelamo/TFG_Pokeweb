import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AdminServices } from '../../services/adminservices';
import { UserService } from '../../services/userservices';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: false
})
export class Dashboard implements OnInit {

  seccion: string = 'home';
  stats: any = { usuarios: 0, noticias: 0, equipos: 0, capturas: 0 };
  
  listaUsuarios: any[] = [];
  listaNoticias: any[] = [];
  listaEquipos: any[] = [];

  cargando: boolean = false;
  adminId: any = null; 

  modalRolOpen: boolean = false;
  modalPassOpen: boolean = false;
  modalNoticiaOpen: boolean = false;
  
  usuarioSeleccionado: any = null;
  nuevoRol: string = '';
  nuevaPassword: string = '';

  datosNoticia = { titulo: '', resumen: '', contenido: '' };
  imagenSeleccionada: File | null = null;
  previewImagen: SafeUrl | null = null; 

  constructor(
    private adminService: AdminServices,
    private userService: UserService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer 
  ) {}

  ngOnInit(): void {
    this.obtenerMiId();
    this.cargarEstadisticas();
  }

  obtenerMiId() {
    const user = this.userService.getUsuarioActual();
    if (user) this.adminId = user.uid || user.id;
  }

  esElAdmin(u: any): boolean {
      if (!this.adminId) return false;
      return String(u.id) === String(this.adminId);
  }

  cambiarSeccion(nombre: string) {
    this.seccion = nombre;
    if (nombre === 'usuarios') this.cargarUsuarios();
    if (nombre === 'noticias') this.cargarNoticias();
    if (nombre === 'equipos') this.cargarEquipos();
  }

  cargarEstadisticas() {
    this.cargando = true;
    this.adminService.getDashboardStats().subscribe({
      next: (resp: any) => { this.stats = resp.data || resp; this.cargando = false; this.cd.detectChanges(); },
      error: () => this.cargando = false
    });
  }

  cargarUsuarios() {
    this.cargando = true;
    this.adminService.getUsers().subscribe({
      next: (resp: any) => { this.listaUsuarios = resp.data || []; this.cargando = false; this.cd.detectChanges(); },
      error: () => this.cargando = false
    });
  }

  cargarNoticias() {
    this.adminService.getNewsAdmin().subscribe({
      next: (resp: any) => { this.listaNoticias = resp.data || []; this.cd.detectChanges(); }
    });
  }

  cargarEquipos() {
    this.adminService.getTeamsAdmin().subscribe({
      next: (resp: any) => { this.listaEquipos = resp.data || []; this.cd.detectChanges(); }
    });
  }

  abrirModalRol(u: any) {
    this.usuarioSeleccionado = u;
    this.nuevoRol = u.role;
    this.modalRolOpen = true;
  }
  guardarRol() {
    if (!this.usuarioSeleccionado) return;
    this.cargando = true;
    this.adminService.updateUserRole(this.usuarioSeleccionado.id, this.nuevoRol).subscribe({
      next: () => { this.cerrarModales(); this.cargarUsuarios(); this.cargando = false; },
      error: () => { alert('Error al actualizar rol'); this.cargando = false; }
    });
  }
  abrirModalPass(u: any) {
    this.usuarioSeleccionado = u;
    this.nuevaPassword = ''; 
    this.modalPassOpen = true;
  }
  guardarPassword() {
    if (!this.usuarioSeleccionado || !this.nuevaPassword.trim()) { alert('Escribe una contraseña válida'); return; }
    this.cargando = true;
    this.adminService.updateUser(this.usuarioSeleccionado.id, { password: this.nuevaPassword }).subscribe({
        next: () => { alert('Contraseña actualizada'); this.cerrarModales(); this.cargando = false; },
        error: () => { alert('Error al cambiar contraseña'); this.cargando = false; }
    });
  }
  borrarUsuario(u: any) {
    if (this.esElAdmin(u)) { alert("No puedes eliminar tu propia cuenta."); return; }
    if(confirm(`¿Eliminar usuario ${u.username}?`)) {
      this.adminService.deleteUser(u.id).subscribe({ next: () => this.cargarUsuarios() });
    }
  }

  crearNoticia() {
      this.datosNoticia = { titulo: '', resumen: '', contenido: '' };
      this.imagenSeleccionada = null;
      this.previewImagen = null;
      this.modalNoticiaOpen = true;
  }

  onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
          this.imagenSeleccionada = file;
          const objectUrl = URL.createObjectURL(file);
          this.previewImagen = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
      }
  }

  get formularioValido(): boolean {
      return this.datosNoticia.titulo.trim().length > 0 && 
             this.datosNoticia.contenido.trim().length > 0;
  }

  guardarNoticia() {
      if (!this.formularioValido) return;

      this.cargando = true;
      const formData = new FormData();
      formData.append('titulo', this.datosNoticia.titulo);
      formData.append('resumen', this.datosNoticia.resumen);
      formData.append('contenido', this.datosNoticia.contenido);
      
      if (this.imagenSeleccionada) {
          formData.append('imagen', this.imagenSeleccionada);
      }

      this.adminService.createNews(formData).subscribe({
          next: () => {
              alert("Noticia publicada correctamente");
              this.cerrarModales();
              this.cargarNoticias();
              this.cargando = false;
          },
          error: (err) => {
              console.error(err);
              alert("Error al publicar. Verifica la consola.");
              this.cargando = false;
          }
      });
  }

  cerrarModales() {
    this.modalRolOpen = false;
    this.modalPassOpen = false;
    this.modalNoticiaOpen = false;
    this.usuarioSeleccionado = null;
    this.previewImagen = null;
    this.cd.detectChanges();
  }

  toggleDestacada(n: any) {
    this.adminService.toggleHighlight(n.id).subscribe({
        next: () => { n.destacada = (n.destacada == 1) ? 0 : 1; this.cd.detectChanges(); }
    });
  }
  borrarNoticia(n: any) {
    if(confirm(`¿Borrar noticia?`)) this.adminService.deleteNews(n.id).subscribe(() => this.cargarNoticias());
  }
  verNoticia(id: number) { this.router.navigate(['/noticia', id]); }
  borrarEquipo(t: any) {
    if(confirm(`¿Borrar equipo?`)) this.adminService.deleteTeam(t.id).subscribe(() => this.cargarEquipos());
  }
  irWebPublica() { this.router.navigate(['/home']); }
  logout() { this.userService.logout(); this.router.navigate(['/login']); }
}