import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/userservices';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  standalone: false
})
export class Profile implements OnInit {

  usuario: any = null;
  capturados: number[] = [];
  cargando: boolean = true;
  
  // Imagen por defecto SOLO mientras carga. Luego la BD manda.
  avatarUrl: string = 'assets/default.jpg';

  porcentajeTotal: number = 0;
  statsRegiones: any[] = [];

  // Variables Password
  mostrarPassword: boolean = false;
  passData = { currentPassword: '', newPassword: '', confirmPassword: '' };
  msgError: string = '';
  msgSuccess: string = '';
  cargandoPass: boolean = false;

  constructor(
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // 1. Cargamos datos frescos de la BASE DE DATOS
    this.cargarPerfilDesdeBD();
  }

  cargarPerfilDesdeBD() {
    this.cargando = true;

    // Llamamos al nuevo endpoint 'user/me'
    this.userService.getUserData().subscribe({
      next: (data) => {
        this.usuario = data; // Aquí tenemos el objeto real de la BD
        
        // La BD nos dice qué foto poner. Si 'data.avatar' es null, el servicio pone la default.
        this.avatarUrl = this.userService.getAvatarUrl(data.avatar);
        
        // Una vez tenemos el usuario, cargamos sus capturas
        this.cargarCapturas();
      },
      error: (err) => {
        console.error('Error cargando perfil', err);
        this.cargando = false;
      }
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

  // --- SUBIDA DE AVATAR ---
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
        this.userService.uploadAvatar(file).subscribe({
            next: (resp: any) => {
                // El backend nos devuelve el nuevo nombre de archivo
                // Actualizamos la vista inmediatamente
                this.avatarUrl = this.userService.getAvatarUrl(resp.avatar);
                alert("¡Foto actualizada y guardada en la Base de Datos!");
                this.cd.detectChanges();
                
                // Opcional: Recargar todo el perfil para asegurar consistencia
                // this.cargarPerfilDesdeBD(); 
            },
            error: (err) => alert("Error al subir imagen.")
        });
    }
  }

  // ... (El resto de métodos: togglePasswordForm, onSubmitPassword, calcularEstadisticas... siguen IGUAL)
  
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