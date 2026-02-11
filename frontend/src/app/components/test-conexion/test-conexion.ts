import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-test-conexion',
  standalone: false,
  templateUrl: './test-conexion.html',
  styleUrl: './test-conexion.css',
})
export class TestConexion implements OnInit {

  mensaje: string = 'Esperando respuesta...';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost/TFG_Pokeweb/backend/public/api/test').subscribe({
      next: (resp) => this.mensaje = resp.mensaje,
      error: (err) => {
        console.error(err);
        this.mensaje = 'Error conectando a XAMPP';
      }
    });
  }
}