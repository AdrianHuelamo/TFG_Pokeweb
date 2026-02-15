import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComunidadServices {

  private apiUrl = environment.apiUrl + 'noticias'; 
  private uploadUrl = environment.apiUrl + 'upload/noticia';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getNoticias(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getNoticia(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createNoticia(noticia: any): Observable<any> {
    return this.http.post(this.apiUrl, noticia, this.getAuthHeaders());
  }

  updateNoticia(id: number, noticia: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, noticia, this.getAuthHeaders());
  }

  deleteNoticia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  uploadImage(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('image', file);
  const token = localStorage.getItem('auth_token');
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  return this.http.post(environment.apiUrl + 'upload/noticia', formData, { headers });
  }
}