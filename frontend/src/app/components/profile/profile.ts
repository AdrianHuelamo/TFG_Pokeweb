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
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPerfilDesdeBD();
  }

  cargarPerfilDesdeBD() {
    this.cargando = true;

    this.userService.getUserData().subscribe({
      next: (data) => {
        this.usuario = data; 
        
        this.avatarUrl = this.userService.getAvatarUrl(data.avatar);
        
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
        this.userService.uploadAvatar(file).subscribe({
            next: (resp: any) => {
                this.avatarUrl = this.userService.getAvatarUrl(resp.avatar);
                alert("¡Foto actualizada y guardada en la Base de Datos!");
                this.cd.detectChanges();
            },
            error: (err) => alert("Error al subir imagen.")
        });
    }
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