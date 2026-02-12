import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // <--- IMPORTANTE: Faltaba esto
import { environment } from '../../environments/environment'; 

import { UserRegister, UserLogin, LoginResponse } from '../common/userinterface'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Recuerda: en tu environment.development.ts la URL ya termina en '/'
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) { }

  // 1. REGISTRO
  register(usuario: UserRegister): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}register`, usuario);
  }

  // 2. LOGIN (Modificado para guardar sesión automáticamente)
  login(usuario: UserLogin): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}login`, usuario).pipe(
      tap((resp) => {
        if (resp.status === 200 && resp.data) {
          this.guardarSesion(resp.data);
        }
      })
    );
  }

  // --- GESTIÓN DE SESIÓN (NUEVO) ---

  // Guardar usuario en el navegador (LocalStorage)
  private guardarSesion(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('usuario');
  }

  // Comprobar si está logueado (devuelve true o false)
  isLoggedIn(): boolean {
    return !!localStorage.getItem('usuario');
  }

  // Obtener datos del usuario (Nombre, ID, etc)
  getUsuarioActual(): any {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }
}