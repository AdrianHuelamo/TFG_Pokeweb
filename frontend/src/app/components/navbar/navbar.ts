import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/userservices';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: false
})
export class Navbar implements OnInit {

  usuario: any = null;
  menuAbierto: boolean = false;      // Para el menú móvil
  desplegableAbierto: boolean = false; // Para el menú de usuario

  constructor(public userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.usuario = this.userService.getUsuarioActual();
  }

  // Abre/Cierra el menú hamburguesa en móvil
  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  // Abre/Cierra el desplegable del usuario
  toggleMenuDesplegable(event: Event) {
    event.preventDefault(); // Evita que el enlace recargue o haga cosas raras
    event.stopPropagation();
    this.desplegableAbierto = !this.desplegableAbierto;
  }

  cerrarSesion() {
    this.desplegableAbierto = false;
    this.userService.logout();
    this.router.navigate(['/home']);
  }
}