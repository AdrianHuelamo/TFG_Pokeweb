import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NoticiasResponse } from '../common/noticiainterfaz';

@Injectable({
  providedIn: 'root'
})
export class ComunidadService {

  // Apunta a tu backend: http://localhost/TFG_Pokeweb/backend/public/index.php/api/
  private apiUrl = environment.apiUrl + 'noticias'; 

  constructor(private http: HttpClient) { }

  getNoticias(): Observable<NoticiasResponse> {
    return this.http.get<NoticiasResponse>(this.apiUrl);
  }
}