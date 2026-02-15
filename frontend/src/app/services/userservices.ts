import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment'; 
import { UserRegister, UserLogin, LoginResponse } from '../common/userinterface';
import { jwtDecode } from "jwt-decode"; 

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) { }

  register(usuario: UserRegister): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}register`, usuario);
  }

  login(usuario: UserLogin): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}login`, usuario).pipe(
      tap((resp: any) => {
        if (resp.status === 200 && resp.token) {
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

  getUsuarioActual(): any {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      
      return {
        id: decoded.uid,       
        username: decoded.name, 
        role: decoded.role    
      };
    } catch (e) {
      console.error("Error al decodificar token", e);
      return null;
    }
  }

  getUserRole(): string | null {
    const user = this.getUsuarioActual();
    return user ? user.role : null;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

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
    if (!avatarName) {
        return 'assets/profesor.png'; 
    }

    if (avatarName.startsWith('http')) {
        return avatarName;
    }
    
    let baseUrl = this.apiUrl.replace('index.php/api/', '');
    
    baseUrl = baseUrl.replace('api/', '');      
    baseUrl = baseUrl.replace('index.php/', ''); 

    if (!baseUrl.endsWith('/')) {
        baseUrl += '/';
    }

    return `${baseUrl}uploads/avatars/${avatarName}`;
  }
  uploadAvatar(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return this.http.post(`${this.apiUrl}user/avatar`, formData, this.getAuthHeaders());
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}user/password`, data, this.getAuthHeaders());
  }

  getUserData(): Observable<any> {
    return this.http.get(`${this.apiUrl}user/me`, this.getAuthHeaders());
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  saveToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  refreshToken(): Observable<any> {
    const token = this.getToken();
    if (!token) return new Observable(observer => observer.error("No hay token"));

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get(`${this.apiUrl}auth/refresh`, { headers });
  }

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