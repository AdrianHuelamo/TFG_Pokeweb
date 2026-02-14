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

  getAvatarUrl(avatarName: string | null): string {
    // 1. Si no hay nombre, devolvemos la imagen local (assets)
    if (!avatarName) {
        return 'assets/profesor.png'; 
    }

    // 2. Si ya es una URL completa (ej: http...), la devolvemos tal cual
    if (avatarName.startsWith('http')) {
        return avatarName;
    }

    // 3. LIMPIEZA CRÍTICA DE LA URL
    // Tu apiUrl actual es: ".../backend/public/index.php/api/"
    // El error es que al quitar solo 'api/', se queda el 'index.php'.
    
    // Paso A: Quitamos 'index.php/api/' completo si existe
    let baseUrl = this.apiUrl.replace('index.php/api/', '');
    
    // Paso B: Por si acaso tu environment fuera diferente, limpiamos restos
    baseUrl = baseUrl.replace('api/', '');      // Quita 'api/' si queda suelto
    baseUrl = baseUrl.replace('index.php/', ''); // Quita 'index.php/' si queda suelto

    // 4. Aseguramos que la URL termine en '/'
    if (!baseUrl.endsWith('/')) {
        baseUrl += '/';
    }

    // URL Final esperada: http://localhost/TFG_Pokeweb/backend/public/uploads/avatars/default.webp
    return `${baseUrl}uploads/avatars/${avatarName}`;
  }
  // Subir imagen (usa FormData porque enviamos ficheros)
  uploadAvatar(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return this.http.post(`${this.apiUrl}user/avatar`, formData, this.getAuthHeaders());
  }

  // Cambiar contraseña
  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}user/password`, data, this.getAuthHeaders());
  }

  getUserData(): Observable<any> {
    return this.http.get(`${this.apiUrl}user/me`, this.getAuthHeaders());
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // 2. Guardar el nuevo token (SOLO LOCALSTORAGE)
  saveToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  // 3. Llamar al Backend para pedir un token nuevo
  refreshToken(): Observable<any> {
    const token = this.getToken();
    if (!token) return new Observable(observer => observer.error("No hay token"));

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // IMPORTANTE: Asegúrate que la ruta coincide con tu backend (auth/refresh)
    return this.http.get(`${this.apiUrl}auth/refresh`, { headers });
  }

  // 4. Calcular cuándo caduca el token
  getTokenExpiration(): Date | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payloadDecoded = atob(parts[1]); 
      const payload = JSON.parse(payloadDecoded);

      if (!payload.exp) return null;

      return new Date(payload.exp * 1000);
    } catch (e) {
      return null;
    }
  }
}