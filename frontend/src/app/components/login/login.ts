import { Component } from '@angular/core';
import { UserService } from '../../services/userservices';
import { UserLogin } from '../../common/userinterface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: false,
})
export class Login {
  user: UserLogin = {
    email: '',
    password: '',
  };

  mensajeError: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  onSubmit() {
    this.userService.login(this.user).subscribe({
      next: (response) => {
        if (response.status === 200) {
          localStorage.setItem('usuario', JSON.stringify(response.data));
          this.router.navigate(['/home']);
        } else {
          this.mensajeError = response.mensaje;
        }
      },
      error: (error) => {
        console.error(error);
        this.mensajeError = 'Error de conexión';
      },
    });
  }
}
