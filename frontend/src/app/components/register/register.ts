import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/userservices';
import { UserRegister } from '../../common/userinterface'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  standalone: false
})
export class Register {

  user: UserRegister = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  errorMsg: string = '';
  successMsg: string = '';
  cargando: boolean = false;

  // Feedback de contraseña
  passwordStrength: number = 0;
  strengthColor: string = 'transparent';
  strengthText: string = '';

  // Requisitos individuales
  requirements = {
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  };

  constructor(private userService: UserService, private router: Router) {}

  checkStrength() {
    const p = this.user.password || '';
    
    // Evaluar requisitos individuales
    this.requirements.length = p.length >= 8;
    this.requirements.upper = /[A-Z]/.test(p);
    this.requirements.lower = /[a-z]/.test(p);
    this.requirements.number = /[0-9]/.test(p);
    this.requirements.special = /[^A-Za-z0-9]/.test(p);

    // Calcular progreso
    const met = Object.values(this.requirements).filter(v => v).length;
    this.passwordStrength = met * 20;

    // Configurar color y texto
    if (this.passwordStrength === 0) {
      this.strengthColor = 'transparent';
      this.strengthText = '';
    } else if (this.passwordStrength <= 40) {
      this.strengthColor = '#dc3545'; // Rojo
      this.strengthText = 'Contraseña débil';
    } else if (this.passwordStrength <= 80) {
      this.strengthColor = '#ffc107'; // Amarillo
      this.strengthText = 'Contraseña media';
    } else {
      this.strengthColor = '#198754'; // Verde
      this.strengthText = 'Contraseña fuerte y segura';
    }
  }

  onSubmit() {
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMsg = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;
    this.errorMsg = '';
    this.userService.register(this.user).subscribe({
      next: (resp) => {
        this.successMsg = '¡Registro completado! Redirigiendo...';
        this.cargando = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.cargando = false;
        if (err.error && err.error.messages) {
          const firstError = Object.values(err.error.messages)[0];
          this.errorMsg = typeof firstError === 'string' ? firstError : 'Error en el registro';
        } else {
          this.errorMsg = 'Error al registrar. Inténtalo más tarde.';
        }
      }
    });
  }
}