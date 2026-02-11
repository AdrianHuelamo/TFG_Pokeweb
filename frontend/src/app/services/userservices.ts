import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { UserLogin, LoginResponse } from '../common/userinterface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private URI: string = environment.apiUrl + 'login'; 

  constructor(private http: HttpClient) {}

  login(user: UserLogin): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.URI, user);
  }
}