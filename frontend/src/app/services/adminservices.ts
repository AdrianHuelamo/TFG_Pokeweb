import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminServices {
  // Solo apuntamos al controlador Admin
  private apiUrl = environment.apiUrl + 'admin';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    };
  }

  // --- 1. DASHBOARD STATS ---
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`, this.getAuthHeaders());
  }

  // --- 2. GESTIÓN DE USUARIOS (Esto NO está en UserService) ---
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, this.getAuthHeaders());
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, this.getAuthHeaders());
  }

  updateUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/update`, data, this.getAuthHeaders());
  }

  // --- 3. GESTIÓN DE EQUIPOS (Vista Admin) ---
  // EquiposServices te da tus equipos, este te da TODOS los de la base de datos
  getAllTeams(): Observable<any> {
    return this.http.get(`${this.apiUrl}/teams`, this.getAuthHeaders());
  }

  deleteTeamAny(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/teams/${id}`, this.getAuthHeaders());
  }
}