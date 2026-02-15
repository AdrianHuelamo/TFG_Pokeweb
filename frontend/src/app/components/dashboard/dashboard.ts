import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminServices } from '../../services/adminservices';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: false
})
export class Dashboard implements OnInit {

  stats: any = {
    usuarios: 0,
    noticias: 0,
    equipos: 0,
    capturas: 0
  };
  cargando: boolean = true;

  constructor(
    private adminService: AdminServices,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.cargando = true;
    this.adminService.getDashboardStats().subscribe({
      next: (resp: any) => {
        this.stats = resp.data;
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando stats admin', err);
        this.cargando = false;
        this.cd.detectChanges();
      }
    });
  }

  irAVistaPublica() {
    this.router.navigate(['/home']);
  }
  
  logout() {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      this.router.navigate(['/login']);
  }
}