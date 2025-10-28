import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { PeliculasService } from '../../services/peliculas.service';
import { Pelicula } from '../../interfaces/pelicula';

@Component({
  selector: 'app-peliculas-page',
  templateUrl: './peliculas-page.component.html',
  styles: []
})
export class PeliculasPageComponent implements OnInit {
  public pelicula?: Pelicula;
  private tokenSesion!: string;
  public isFavorite: boolean = false;
  snackBar: any;

  constructor(
    private peliculasService: PeliculasService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/auth/login']);
      return;
    }
    const currentUser = JSON.parse(storedUser);
    this.tokenSesion = currentUser.token;

    this.activatedRoute.params.subscribe((params) => {
      const peliculaId = params['id'];
      if (peliculaId) {
        this.peliculasService.getPeliculaById(peliculaId).subscribe(pelicula => {
          this.pelicula = pelicula;
          this.peliculasService.getFavoritos().subscribe(favoritos => {
            this.isFavorite = favoritos.some(fav => fav.pelicula_id === this.pelicula?.id);
          });
        });
      }
    });
  }

  private showSnackbar(message: string): void {
    this.snackbar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }

  onAddToFavorites(): void {
    if (!this.pelicula) {
      this.showSnackbar('No se ha seleccionado ninguna película');
      return;
    }
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.showSnackbar('Usuario no autenticado');
      this.router.navigate(['/auth/login']);
      return;
    }
    const userData = JSON.parse(userStr);
    if (!userData.id_usuario) {
      this.showSnackbar('ID de usuario no encontrado');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.peliculasService.addFavorito(this.pelicula.id).subscribe({
      next: (response) => {
        if (response.ok) {
          this.showSnackbar('Película agregada a favoritos');
          this.router.navigate(['/peliculas/list']);
        } else {
          this.showSnackbar(response.message || 'Error al agregar la película a favoritos');
        }
      },
      error: (error) => {
        console.error('Error al agregar a favoritos:', error);
        this.showSnackbar('Error al agregar la película a favoritos');
      }
    });
  }

  onDeleteFavorito(id_pelicula: number): void {
    console.log(id_pelicula);
    this.peliculasService.deleteFavorito(id_pelicula)
      .subscribe({
        next: () => {
          this.showSnackbar('Película eliminada de favoritos');
          this.router.navigate(['/peliculas/favorites-list']);
        },
        error: (error) => {
          console.error('Error al eliminar favorito:', error);
          this.showSnackbar('Error al eliminar la película de favoritos');
        }
      });
  }
}
