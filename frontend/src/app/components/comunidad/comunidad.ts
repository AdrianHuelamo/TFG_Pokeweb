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

  noticiaSeleccionada: Noticia | null = null;

  cargando: boolean = true;
  error: boolean = false;

  constructor(
      private comunidadService: ComunidadService,
      private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.comunidadService.getNoticias().subscribe({
      next: (resp) => {
        if(resp.status == 200 && resp.data.length > 0) {
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
        console.error(err);
        this.error = true;
        this.cargando = false;
        this.cd.detectChanges();
      }
    });
  }

  abrirNoticia(noticia: Noticia) {
    this.noticiaSeleccionada = noticia;
    document.body.style.overflow = 'hidden';
  }

  cerrarNoticia() {
    this.noticiaSeleccionada = null;
    document.body.style.overflow = 'auto';
  }
}