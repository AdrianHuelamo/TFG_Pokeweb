import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/userservices';
// Importamos la interfaz correcta
import { UserLogin } from '../../common/userinterface'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: false
})
export class Login {

  // Usamos la interfaz UserLogin
  user: UserLogin = {
    email: '',
    password: ''
  };

  errorMsg: string = '';
  cargando: boolean = false;

  constructor(
    private userService: UserService, 
    private router: Router
  ) {}

  onSubmit() {
    this.cargando = true;
    this.errorMsg = '';

    this.userService.login(this.user).subscribe({
      next: (resp) => {
        this.cargando = false;
        
        // AQUÍ GUARDAMOS LA SESIÓN (TOKEN)
        if(resp.status === 200 && resp.data) {
          // Guardamos el usuario en el navegador
          localStorage.setItem('usuario', JSON.stringify(resp.data));
          
          // Redirigimos al Home o Comunidad
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error('Error login:', err);
        this.cargando = false;
        this.errorMsg = err.error.messages?.error || 'Usuario o contraseña incorrectos.';
      }
    });
  }
}