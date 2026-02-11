import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokeService {

  private apiUrl = environment.pokeApiUrl; 
  constructor(private http: HttpClient) { }

  getAllPokemons(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon?limit=1025&offset=0`);
  }

  getPokemonDetails(url: string): Observable<any> {
    return this.http.get(url);
  }

  getTypesList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/type`);
  }

  getPokemonsByType(type: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/type/${type}`);
  }
}