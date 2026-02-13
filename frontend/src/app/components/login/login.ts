import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/userservices';
import { UserLogin } from '../../common/userinterface'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: false
})
export class Login {

  user: UserLogin = {
    email: '',
    password: ''
  };

  errorMsg: string = '';
  cargando: boolean = false; // Variable para el botón de carga

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    this.cargando = true;
    this.errorMsg = '';

    this.userService.login(this.user).subscribe({
      next: (resp) => {
        // Guardamos el token/usuario en el servicio (ya lo hace el servicio con tap, pero aseguramos)
        // Redirigimos al Home
        setTimeout(() => {
            this.router.navigate(['/']);
            this.cargando = false;
        }, 1000); // Pequeño delay dramático estilo juego cargando
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error login:', err);
        
        // Intentar leer el mensaje de error del backend
        if (err.error && err.error.messages) {
            // Si es un objeto de mensajes
            if (typeof err.error.messages === 'object') {
                this.errorMsg = Object.values(err.error.messages).join(' ');
            } else {
                this.errorMsg = err.error.messages;
            }
        } else if (err.error && err.error.error) {
            this.errorMsg = err.error.error; // A veces viene aquí
        } else {
            this.errorMsg = 'Credenciales incorrectas o error de conexión.';
        }
      }
    });
  }
}