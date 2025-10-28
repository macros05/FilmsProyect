import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Pelicula } from '../../interfaces/pelicula';
import { PeliculasService } from '../../services/peliculas.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: []
})
export class SearchPageComponent implements OnInit {
  public searchInput = new FormControl('');
  public peliculas: Pelicula[] = [];
  public selectedPelicula?: Pelicula;
  constructor(private peliculasService: PeliculasService) {
    // Suscribirse a los cambios del input
    this.searchInput.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.searchPelicula();
      });
  }
  ngOnInit(): void { }
  searchPelicula(): void {
    const value: string = this.searchInput.value || '';
    if (value.trim().length === 0) {
      this.peliculas = [];
      return;
    }
    this.peliculasService.searchPelicula(value)
      .subscribe(peliculas => {
        this.peliculas = peliculas.filter(pelicula =>
          pelicula.title.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 10); // Limitar a 10 resultados
        this.selectedPelicula = undefined; // Resetear la película seleccionada
      });
  }
  onSelectedOption(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      this.selectedPelicula = undefined;
      return;
    }
    const pelicula: Pelicula = event.option.value;
    this.searchInput.setValue(pelicula.title, { emitEvent: false });
    this.selectedPelicula = pelicula;
  }
}
