import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminServices {
  
  private apiUrl = environment.apiUrl + 'admin';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`, this.getAuthHeaders());
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, this.getAuthHeaders());
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, this.getAuthHeaders());
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/update`, { id, ...data }, this.getAuthHeaders());
  }

  updateUserRole(id: number, role: string): Observable<any> {
    return this.updateUser(id, { role });
  }

  getNewsAdmin(): Observable<any> {
    return this.http.get(`${this.apiUrl}/news`, this.getAuthHeaders());
  }

  toggleHighlight(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/news/highlight/${id}`, {}, this.getAuthHeaders());
  }

  deleteNews(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/news/${id}`, this.getAuthHeaders());
  }

  createNews(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/news/create`, formData, this.getAuthHeaders());
  }

  getTeamsAdmin(): Observable<any> {
    return this.http.get(`${this.apiUrl}/teams`, this.getAuthHeaders());
  }

  deleteTeam(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/teams/${id}`, this.getAuthHeaders());
  }
}