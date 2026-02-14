import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquiposServices {

  private apiUrl = environment.apiUrl + 'teams';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
    return {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    };
  }

  getEquipos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getAuthHeaders());
  }

  createEquipo(name: string): Observable<any> {
    return this.http.post(this.apiUrl, { name }, this.getAuthHeaders());
  }

  // --- FUNCIÓN QUE FALTABA ---
  updateEquipo(id: number, name: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { name }, this.getAuthHeaders());
  }

  deleteEquipo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  addPokemon(teamId: number, pokemonId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { team_id: teamId, pokemon_id: pokemonId }, this.getAuthHeaders());
  }

  removePokemon(memberId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/member/${memberId}`, this.getAuthHeaders());
  }

  getAllPokemonList(): Observable<any> {
    return this.http.get('https://pokeapi.co/api/v2/pokemon?limit=1025');
  }
}