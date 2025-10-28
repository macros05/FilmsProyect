import { Component, OnInit } from '@angular/core';
import { Pelicula } from '../../interfaces/pelicula';
import { PeliculasService } from '../../services/peliculas.service';
@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: [
  ]
})
export class ListPageComponent implements OnInit {
  public peliculas: Pelicula[] = [];
  constructor(private peliculasService: PeliculasService) {}
  ngOnInit(): void {
    this.peliculasService.getPeliculas()
      .subscribe(peliculas => this.peliculas = peliculas);
  }
}
