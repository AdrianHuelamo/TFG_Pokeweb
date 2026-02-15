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
  
  menuAbierto: boolean = false;      
  desplegableAbierto: boolean = false; 

  constructor(public userService: UserService, private router: Router) {}

  ngOnInit(): void {
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
  
  cerrarSesion() {
    this.desplegableAbierto = false;
    this.menuAbierto = false;
    this.userService.logout();
    this.usuario = null;
    this.router.navigate(['/home']);
  }

  get esAdmin(): boolean {
    return this.userService.getUserRole() === 'admin';
}
}