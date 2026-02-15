import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { UserService } from './services/userservices'; 
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('frontend');
  
  private refreshInterval: any;
  
  esModoAdmin: boolean = false; 

  constructor(
      private userService: UserService,
      private router: Router
  ) {
      this.router.events.pipe(
          filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
          this.esModoAdmin = event.url.includes('/admin') || event.url.includes('/dashboard');
      });
  }

  ngOnInit() {
    this.iniciarVigilanteSesion();
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  iniciarVigilanteSesion() {
    this.refreshInterval = setInterval(() => {
        this.chequearYRenovar();
    }, 60000); 
  }

  chequearYRenovar() {
      if (!this.userService.isLoggedIn()) return;
      const caducidad = this.userService.getTokenExpiration();
      if (!caducidad) return;
      const ahora = new Date();
      const tiempoRestanteMs = caducidad.getTime() - ahora.getTime();
      const minutosRestantes = tiempoRestanteMs / 1000 / 60;

      if (minutosRestantes < 30 && minutosRestantes > 0) {
          this.userService.refreshToken().subscribe({
              next: (res: any) => {
                  if (res.token) localStorage.setItem('auth_token', res.token);
              }
          });
      }
  }
}