import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PeliculasService } from '../../services/peliculas.service';
@Component({
  selector: 'app-add-favorite',
  templateUrl: './add-favorite.component.html',
  styles: []
})
export class AddFavoriteComponent implements OnInit {
  public favoritoForm: FormGroup;
  public peliculas: any[] = [];  // Array para almacenar las películas disponibles
  public selectedPelicula: any;  // Película seleccionada para agregar a favoritos
  private idUsuario!: number;
  constructor(
    private fb: FormBuilder,
    private peliculasService: PeliculasService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.favoritoForm = this.fb.group({
      peliculaId: ['', [Validators.required]]
    });
  }
  ngOnInit(): void {
    // Cargar todas las películas cuando el componente se inicialice
    this.peliculasService.getPeliculas().subscribe(peliculas => {
      this.peliculas = peliculas;
    });
    // Obtener el id_usuario del localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      this.idUsuario = userData.id_usuario;
      if (!this.idUsuario) {
        this.showSnackbar('No se encontró el ID de usuario');
        this.router.navigate(['/auth/login']);
      }
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
  onSubmit(): void {
    if (this.favoritoForm.invalid) {
      this.favoritoForm.markAllAsTouched();
      return;
    }
    const peliculaId = this.favoritoForm.value.peliculaId;

    if (!this.idUsuario) {
      this.showSnackbar('No se encontró el ID de usuario');
      this.router.navigate(['/auth/login']);
      return;
    }
    this.peliculasService.addFavorito( peliculaId).subscribe({
      next: (response) => {
        if (response.ok) {
          this.showSnackbar('Película agregada a favoritos');
          this.router.navigate(['/peliculas/favorites-list']);
        } else {
          this.showSnackbar(response.message || 'Error al agregar la película a favoritos');
        }
      },
      error: (error) => {
        console.error('Error al agregar favorito:', error);
        this.showSnackbar('Error al agregar la película a favoritos');
      }
    });
  }
  private showSnackbar(message: string): void {
    this.snackbar.open(message, 'Cerrar', {
      duration: 3000
    });
  }
}
