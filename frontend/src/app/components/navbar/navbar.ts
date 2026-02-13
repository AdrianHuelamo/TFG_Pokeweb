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

  // Ya no necesitamos la variable 'usuario' local porque usamos el servicio en el HTML
  // para mayor reactividad, pero la podemos dejar por si acaso la usas en otro lado.
  usuario: any = null;
  
  menuAbierto: boolean = false;      
  desplegableAbierto: boolean = false; 

  constructor(public userService: UserService, private router: Router) {}

  ngOnInit(): void {
    // Carga inicial (opcional ahora que el HTML llama al servicio)
    this.usuario = this.userService.getUsuarioActual();
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  toggleMenuDesplegable(event: Event) {
    event.preventDefault(); 
    event.stopPropagation();
    this.desplegableAbierto = !this.desplegableAbierto;
  }

  // Cierra el menú si se hace click fuera (HostListener opcional)
  // Por ahora lo simplificamos en el cerrar sesión
  
  cerrarSesion() {
    this.desplegableAbierto = false;
    this.menuAbierto = false;
    this.userService.logout();
    this.usuario = null;
    this.router.navigate(['/home']);
  }
}