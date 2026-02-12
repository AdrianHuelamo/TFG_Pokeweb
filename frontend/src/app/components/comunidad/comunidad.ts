import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ComunidadService } from '../../services/comunidadservices';
import { Noticia } from '../../common/noticiainterfaz';

@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.html',
  styleUrls: ['./comunidad.css'],
  standalone: false
})
export class Comunidad implements OnInit {

  noticiaDestacada: Noticia | null = null;
  restoNoticias: Noticia[] = [];
  cargando: boolean = true;
  error: boolean = false;

  constructor(
      private comunidadService: ComunidadService,
      private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.comunidadService.getNoticias().subscribe({
      next: (resp) => {
        // Verificamos si la respuesta es correcta (status 200 o similar)
        if (resp.status == 200 && resp.data && resp.data.length > 0) {
          
          const todas = resp.data;

          // 1. Buscamos la noticia destacada (la primera del array, ya que el backend las ordena)
          this.noticiaDestacada = todas[0];

          // 2. El resto de noticias van al grid (quitamos la primera)
          this.restoNoticias = todas.slice(1);
          
        } else {
            // Si no hay noticias, dejamos las listas vacías
            this.noticiaDestacada = null;
            this.restoNoticias = [];
        }
        
        this.cargando = false;
        this.cd.detectChanges(); // Forzamos la actualización de la vista por si acaso
      },
      error: (err) => {
        console.error('Error cargando noticias:', err);
        this.error = true;
        this.cargando = false;
        this.cd.detectChanges();
      }
    });
  }
}