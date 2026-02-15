import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunidadServices } from '../../services/comunidadservices';
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
    private comunidadService: ComunidadServices,
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
    
    this.comunidadService.getNoticia(id).subscribe({
      next: (resp: any) => {
        if (resp.status == 200 && resp.data) {
            this.noticia = resp.data;
        } else if (resp.id) {
            this.noticia = resp;
        } else {
            this.error = true;
        }
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error("Error cargando noticia", err);
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