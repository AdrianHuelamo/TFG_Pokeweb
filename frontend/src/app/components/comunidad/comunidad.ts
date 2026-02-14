import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ComunidadServices } from '../../services/comunidadservices';
import { UserService } from '../../services/userservices';
import { Noticia } from '../../common/noticiainterfaz'; 
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.html',
  styleUrls: ['./comunidad.css'],
  standalone: false
})
export class Comunidad implements OnInit {

  noticiaDestacada: Noticia | null = null;
  restoNoticias: Noticia[] = [];
  cargando: boolean = true;
  error: boolean = false;
  usuario: any = null;

  // Calculamos la base URL para que no falle
  baseUrl: string = environment.apiUrl.replace('index.php/api/', ''); 

  mostrarModal: boolean = false;
  esEdicion: boolean = false;
  subiendoImagen: boolean = false;
  previewImagen: string | ArrayBuffer | null = null;

  formNoticia: any = {
      id: null, titulo: '', resumen: '', contenido: '', imagen: '', destacada: 0
  };

  constructor(
      private comunidadService: ComunidadServices,
      private userService: UserService,
      private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  this.cargarNoticias();
  if (this.userService.isLoggedIn()) {
      // 1. Lo asignamos inmediatamente para que los botones salgan YA
      this.usuario = this.userService.getUsuarioActual();

      // 2. Opcionalmente, refrescamos los datos en segundo plano
      this.userService.getUserData().subscribe({
          next: (data) => {
              this.usuario = data;
              this.cd.detectChanges(); // Forzamos a Angular a mirar si hay cambios
          },
          error: () => this.usuario = null
      });
  }
}

  cargarNoticias() {
    this.cargando = true;
    this.comunidadService.getNoticias().subscribe({
      next: (resp: any) => {
        const data = resp.data || resp;
        if (Array.isArray(data) && data.length > 0) {
            this.noticiaDestacada = data[0];
            this.restoNoticias = data.slice(1);
        } else {
            this.noticiaDestacada = null;
            this.restoNoticias = [];
        }
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: () => { this.error = true; this.cargando = false; }
    });
  }

  get esCampeon(): boolean { return this.usuario?.role === 'campeon'; }
  get esAdmin(): boolean { return this.usuario?.role === 'admin'; }

  esMiNoticia(noticia: Noticia): boolean {
      if (!this.usuario) return false;
      if (this.esAdmin) return true; 
      return noticia.autor_id == this.usuario.id;
  }

  onFileSelected(event: any) {
      const file: File = event.target.files[0];
      if (file) {
          this.subiendoImagen = true;
          const reader = new FileReader();
          reader.onload = (e) => this.previewImagen = e.target?.result || null;
          reader.readAsDataURL(file);

          this.comunidadService.uploadImage(file).subscribe({
              next: (resp: any) => {
                  this.formNoticia.imagen = resp.url; 
                  this.subiendoImagen = false;
              },
              error: () => {
                  alert('Error al subir la imagen');
                  this.subiendoImagen = false;
                  this.previewImagen = null;
              }
          });
      }
  }

  abrirModalCrear() {
      this.esEdicion = false;
      this.formNoticia = { id: null, titulo: '', resumen: '', contenido: '', imagen: '', destacada: 0 };
      this.previewImagen = null;
      this.mostrarModal = true;
  }

  abrirModalEditar(noticia: Noticia, event: Event) {
      event.stopPropagation();
      this.esEdicion = true;
      this.formNoticia = { ...noticia };
      this.previewImagen = this.formNoticia.imagen ? 
          (this.formNoticia.imagen.startsWith('http') ? this.formNoticia.imagen : this.baseUrl + this.formNoticia.imagen) : null;
      this.mostrarModal = true;
  }

  cerrarModal() { this.mostrarModal = false; }

  guardarNoticia() {
      if (!this.formNoticia.titulo || !this.formNoticia.contenido) {
          alert('Rellena los campos obligatorios.');
          return;
      }

      const req = this.esEdicion 
          ? this.comunidadService.updateNoticia(this.formNoticia.id, this.formNoticia)
          : this.comunidadService.createNoticia(this.formNoticia);

      req.subscribe({
          next: () => {
              this.cerrarModal();
              this.cargarNoticias();
              alert(this.esEdicion ? '¡Actualizado!' : '¡Publicado!');
          },
          error: (e) => {
              console.error('Error servidor:', e);
              let msg = 'No se pudo guardar.';
              if (e.error?.messages) msg = Object.values(e.error.messages).join('\n');
              else if (e.error?.error) msg = e.error.error;
              alert('Fallo:\n' + msg);
          }
      });
  }

  borrarNoticia(id: number, event: Event) {
      event.stopPropagation();
      if(confirm('¿Eliminar esta noticia?')) {
          this.comunidadService.deleteNoticia(id).subscribe(() => this.cargarNoticias());
      }
  }
}