import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunidadService } from '../../services/comunidadservices';
import { Noticia } from '../../common/noticiainterfaz';

@Component({
  selector: 'app-noticia-details', 
  templateUrl: './noticia-details.html',
  styleUrls: ['./noticia-details.css'],
  standalone: false
})
export class NoticiaDetails implements OnInit { 

  noticia: Noticia | null = null;
  cargando: boolean = true;
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private comunidadService: ComunidadService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if(id) {
        this.cargarNoticia(id);
      } else {
        this.volver();
      }
    });
  }

  cargarNoticia(id: number) {
    this.cargando = true;
    this.error = false;
    
    this.comunidadService.getNoticiaById(id).subscribe({
      next: (resp) => {
        if(resp.status == 200 && resp.data) {
          this.noticia = resp.data;
        } else {
          this.error = true;
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

  volver() {
    this.router.navigate(['/comunidad']);
  }
}