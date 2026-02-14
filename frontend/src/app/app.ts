import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { UserService } from './services/userservices'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('frontend');
  
  private refreshInterval: any;

  constructor(private userService: UserService) {}

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
              next: (resp: any) => {
                  if (resp.token) {
                    this.userService.saveToken(resp.token);
                  }
              },
              error: (err) => console.error("Error renovando sesión (posiblemente expiró)", err)
          });
      }
  }
}