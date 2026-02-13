import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment'; 
import { UserRegister, UserLogin, LoginResponse } from '../common/userinterface';

// 1. IMPORTAR LA LIBRERÍA REAL
import { jwtDecode } from "jwt-decode"; 

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) { }

  // 1. REGISTRO
  register(usuario: UserRegister): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}register`, usuario);
  }

  // 2. LOGIN (Guardar token)
  login(usuario: UserLogin): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}login`, usuario).pipe(
      tap((resp: any) => {
        if (resp.status === 200 && resp.token) {
          // Guardamos el token
          localStorage.setItem('auth_token', resp.token);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // 3. OBTENER USUARIO (USANDO LIBRERÍA jwt-decode)
  getUsuarioActual(): any {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      // Usamos la librería que instalaste
      const decoded: any = jwtDecode(token);
      
      // Devolvemos los datos mapeados correctamente
      return {
        id: decoded.uid,       // 'uid' viene del backend PHP
        username: decoded.name, // 'name' viene del backend PHP
        role: decoded.role     // 'role' viene del backend PHP
      };
    } catch (e) {
      console.error("Error al decodificar token", e);
      return null;
    }
  }

  // Obtener headers con el token para peticiones
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // --- RUTAS PROTEGIDAS ---
  
  getCapturasUsuario(userId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}pokemon/capturas/${userId}`, this.getAuthHeaders());
  }

  toggleCaptura(userId: number, pokemonId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}pokemon/toggle`, 
      { user_id: userId, pokemon_id: pokemonId },
      this.getAuthHeaders()
    );
  }
}