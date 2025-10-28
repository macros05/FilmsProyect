import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { PeliculasService } from '../../services/peliculas.service'; // Importa el servicio de peliculas
import { CommonService } from '../../../shared/common.service'; // Si tienes un servicio común para headers
import { Pelicula } from '../../interfaces/pelicula';
import { forkJoin, Observable } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-favorites-list',
  templateUrl: './favorites-list.component.html',
  styleUrls: []
})
export class FavoritesListComponent implements OnInit {
  favoritos: Pelicula[] = []; // Lista de favoritos usando la interfaz Pelicula
  loading: boolean = false;
  error: string = '';
  constructor(
    private peliculasService: PeliculasService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar

  ) { }
  ngOnInit(): void {
    this.getFavoritos();
  }
  getFavoritos(): void {
    this.loading = true;
    this.error = '';
    // Get the token from CommonService which handles the Authorization header
    const headers = this.commonService.getHeaders();

    this.peliculasService.getFavoritos().subscribe({
      next: (favoritos) => {
        if (!favoritos || favoritos.length === 0) {
          this.favoritos = [];
          this.loading = false;
          return;
        }
        const requests = favoritos.map(favorito =>
          this.peliculasService.getPeliculaById(favorito.pelicula_id.toString())
        );
        forkJoin(requests).subscribe({
          next: (peliculas) => {
            this.favoritos = peliculas
              .filter((pelicula): pelicula is Pelicula => pelicula !== undefined)
              .map(pelicula => ({
                ...pelicula,
                poster_path: pelicula.poster_path && pelicula.poster_path.startsWith('http')
                  ? pelicula.poster_path
                  : `https://image.tmdb.org/t/p/w500${pelicula.poster_path || ''}`  // Asegúrate de que sea una cadena válida
              }));

            this.loading = false;
          },
          error: (error) => {
            console.error('Error al obtener detalles de películas:', error);
            this.error = 'Error al cargar los detalles de las películas';
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar favoritos:', error);
        this.error = 'No se pudieron cargar los favoritos';
        this.loading = false;
      }
    });
  }


}
