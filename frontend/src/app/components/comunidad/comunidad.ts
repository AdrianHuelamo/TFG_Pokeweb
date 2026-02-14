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
        if (resp.status == 200 && resp.data && resp.data.length > 0) {
          
          const todas = resp.data;

          this.noticiaDestacada = todas[0];

          this.restoNoticias = todas.slice(1);
          
        } else {
            this.noticiaDestacada = null;
            this.restoNoticias = [];
        }
        
        this.cargando = false;
        this.cd.detectChanges(); 
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