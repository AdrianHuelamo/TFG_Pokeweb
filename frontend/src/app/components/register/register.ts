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

  passwordStrength: number = 0;
  strengthColor: string = '#ccc';

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
    
    this.requirements.length = p.length >= 8;
    this.requirements.upper = /[A-Z]/.test(p);
    this.requirements.lower = /[a-z]/.test(p);
    this.requirements.number = /[0-9]/.test(p);
    this.requirements.special = /[^A-Za-z0-9]/.test(p);

    const met = Object.values(this.requirements).filter(v => v).length;
    this.passwordStrength = met * 20;

    if (this.passwordStrength < 40) this.strengthColor = '#dc3545';      
    else if (this.passwordStrength < 100) this.strengthColor = '#ffc107';
    else this.strengthColor = '#198754';                                 
  }

  getConfirmColor(): string {
    if (!this.user.confirmPassword) {
      return '#aaa'; 
    }
    return this.user.password === this.user.confirmPassword ? '#198754' : '#dc3545';
  }

  onSubmit() {
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMsg = 'Las contraseñas no coinciden.';
      return;
    }

    if (this.passwordStrength < 100) {
       this.errorMsg = 'La contraseña es muy débil. Usa mayúsculas, números y símbolos.';
       return;
    }

    this.cargando = true;
    this.errorMsg = '';
    
    this.userService.register(this.user).subscribe({
      next: (resp) => {
        this.successMsg = '¡Registrado! Vamos al login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.cargando = false;
        console.log("Error register:", err);
        
        if (err.error && err.error.messages) {
          const mensajes = err.error.messages;
          if (typeof mensajes === 'object') {
             this.errorMsg = Object.values(mensajes).join('. ');
          } else {
             this.errorMsg = String(mensajes);
          }
        } else {
          this.errorMsg = 'Error de conexión con el servidor.';
        }
      }
    });
  }
}