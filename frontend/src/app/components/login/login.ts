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
  cargando: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    this.cargando = true;
    this.errorMsg = '';

    this.userService.login(this.user).subscribe({
      next: (resp) => {
        setTimeout(() => {
            this.router.navigate(['/']);
            this.cargando = false;
        }, 1000);
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error login:', err);
        
        if (err.error && err.error.messages) {
            if (typeof err.error.messages === 'object') {
                this.errorMsg = Object.values(err.error.messages).join(' ');
            } else {
                this.errorMsg = err.error.messages;
            }
        } else if (err.error && err.error.error) {
            this.errorMsg = err.error.error; 
        } else {
            this.errorMsg = 'Credenciales incorrectas o error de conexión.';
        }
      }
    });
  }
}