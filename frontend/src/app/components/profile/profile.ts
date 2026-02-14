import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/userservices';
import { EquiposServices } from '../../services/equiposservices';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  standalone: false
})
export class Profile implements OnInit {

  usuario: any = null;
  capturados: number[] = [];
  equipoFavorito: any = null;
  cargando: boolean = true;
  
  avatarUrl: string = 'assets/default.webp';

  porcentajeTotal: number = 0;
  statsRegiones: any[] = [];

  mostrarPassword: boolean = false;
  passData = { currentPassword: '', newPassword: '', confirmPassword: '' };
  msgError: string = '';
  msgSuccess: string = '';
  cargandoPass: boolean = false;

  constructor(
    private userService: UserService,
    private equiposService: EquiposServices,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPerfilDesdeBD();
    this.cargarEquipoFavorito();
  }

  cargarPerfilDesdeBD() {
    this.cargando = true;

    this.userService.getUserData().subscribe({
      next: (data) => {
        this.usuario = data;        
        this.avatarUrl = this.userService.getAvatarUrl(data.avatar)    
        this.cargarCapturas();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando perfil', err);
        this.cargando = false;
      }
    });
  }

  cargarEquipoFavorito() {
      this.equiposService.getEquipos().subscribe({
          next: (equipos) => {
              this.equipoFavorito = equipos.find(e => e.is_favorite == 1 || e.is_favorite === true);
          },
          error: (err) => console.log("No se pudieron cargar equipos en perfil")
      });
  }

  cargarCapturas() {
    if (!this.usuario?.id) return;

    this.userService.getCapturasUsuario(this.usuario.id).subscribe({
      next: (ids) => {
        this.capturados = ids.map(id => Number(id));
        this.calcularEstadisticas();
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // Validación básica
      if (!file.type.startsWith('image/')) {
          alert("Por favor selecciona un archivo de imagen válido.");
          return;
      }

      this.cargando = true;
      this.userService.uploadAvatar(file).subscribe({
        next: (resp: any) => {
          // Forzamos actualización de la URL con un timestamp para evitar caché del navegador
          const time = new Date().getTime();
          // Asumimos que el backend devuelve la ruta o simplemente recargamos el usuario
          this.cargarPerfilDesdeBD(); 
          this.cargando = false;
        },
        error: (err) => {
          console.error("Error subiendo avatar:", err);
          this.cargando = false;
          // Mostramos el mensaje real del servidor si existe
          const mensaje = err.error?.messages?.error || "Error al subir la imagen. Intenta con una más pequeña.";
          alert(mensaje);
        }
      });
    }
  }

  getPokemonImage(id: number): string {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }

  irADetalle(pokemonId: number) {
  this.router.navigate(['/pokemon', pokemonId]);
  }
  
  togglePasswordForm() {
      this.mostrarPassword = !this.mostrarPassword;
      if (!this.mostrarPassword) {
          this.msgError = '';
          this.msgSuccess = '';
          this.passData = { currentPassword: '', newPassword: '', confirmPassword: '' };
      }
  }

  onSubmitPassword() {
    this.msgError = '';
    this.msgSuccess = '';

    if (this.passData.newPassword !== this.passData.confirmPassword) {
        this.msgError = 'Las contraseñas no coinciden.';
        return;
    }

    this.cargandoPass = true;

    this.userService.changePassword(this.passData).subscribe({
        next: (resp) => {
            this.msgSuccess = 'Contraseña actualizada correctamente.';
            this.passData = { currentPassword: '', newPassword: '', confirmPassword: '' };
            this.cargandoPass = false;
            this.cd.detectChanges();
            setTimeout(() => { if(this.msgSuccess) this.mostrarPassword = false; this.cd.detectChanges(); }, 2000);
        },
        error: (err) => {
            this.msgError = err.error?.error || err.error?.messages || 'Error al cambiar contraseña.';
            this.cargandoPass = false;
            this.cd.detectChanges();
        }
    });
  }

  calcularEstadisticas() {
    const totalExistentes = 1025; 
    this.porcentajeTotal = (this.capturados.length / totalExistentes) * 100;

    const rawRegions = (environment as any).regions || (environment as any).pokemonRegions;
    let regionesArray: any[] = [];

    if (rawRegions && !Array.isArray(rawRegions) && typeof rawRegions === 'object') {
        regionesArray = Object.keys(rawRegions).map(key => ({ value: key, ...rawRegions[key], name: rawRegions[key].name || key }));
    } else if (Array.isArray(rawRegions)) {
        regionesArray = rawRegions;
    }

    const regionesReales = regionesArray.filter((r: any) => r.value !== 'all');

    this.statsRegiones = regionesReales.map(region => {
      const listaCapturados: number[] = [];
      const listaFaltantes: number[] = [];
      for (let id = region.min; id <= region.max; id++) {
          if (this.capturados.includes(id)) listaCapturados.push(id);
          else listaFaltantes.push(id);
      }
      const totalEnRegion = (region.max - region.min) + 1;
      return {
        nombre: region.name,
        capturados: listaCapturados.length,
        total: totalEnRegion,
        porcentaje: (listaCapturados.length / totalEnRegion) * 100,
        completado: listaCapturados.length >= totalEnRegion,
        listaCapturados, listaFaltantes, desplegado: false
      };
    });
  }

  toggleRegion(region: any) { region.desplegado = !region.desplegado; }
  getColorPorcentaje(p: number): string { return p < 10 ? '#dc3545' : p < 40 ? '#fd7e14' : p < 80 ? '#ffc107' : '#198754'; }
}