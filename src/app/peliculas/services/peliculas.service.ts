import { CommonService } from 'src/app/shared/common.service';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiResponse } from '../../shared/interfaces/api-response';
import { Pelicula } from '../interfaces/pelicula';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  constructor(
    private http: HttpClient,
    @Inject('API_KEY') private apiKey: string,
    private commonService: CommonService
  ) { }

  // Obtener todas las películas desde la API pública (TMDb)
  getPeliculas(): Observable<Pelicula[]> {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}`;  // API de TMDb con la API_KEY inyectada
    return this.http.get<ApiResponse>(url).pipe(
      map(response => response.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,  // URL completa de la imagen
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        
      })))
    );
  }
  // Buscar películas por término de búsqueda
  searchPelicula(query: string): Observable<Pelicula[]> {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`;
    return this.http.get<ApiResponse>(url).pipe(
      map(response => response.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '../../assets/no-image.png',
        vote_average: movie.vote_average,
        vote_count: movie.vote_count
      })))
    );
  }
  // Obtener una película por ID desde la API pública (TMDb)
  getPeliculaById(id: string): Observable<Pelicula | undefined> {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}`;  // Endpoint de TMDb con la API_KEY inyectada
    return this.http.get<Pelicula>(url);
  }

  getFavoritos(): Observable<{ pelicula_id: number }[]> {
    return this.http.get<ApiResponse>(
      `${environment.URL_BASE}/api/private/favoritos.php`,
      { headers: this.commonService.getHeaders() }
    ).pipe(
      map(response => {
        if (response.ok && response.data) {
          return response.data.map((fav: any) => ({
            pelicula_id: fav.pelicula_id
          }));
        }
        return [];
      }),
      catchError(error => {
        console.error('Error al obtener favoritos:', error);
        return of([]);
      })
    );
  }



  addFavorito( peliculaId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${environment.URL_BASE}/api/private/favoritos.php`,
      { pelicula_id: peliculaId },
      { headers: this.commonService.getHeaders() }
    );
  }

  deleteFavorito(peliculaId: number): Observable<ApiResponse> {
    const body = { pelicula_id: peliculaId };
    return this.http.delete<ApiResponse>( `${environment.URL_BASE}/api/private/favoritos.php`, { body, headers: this.commonService.getHeaders() })
      .pipe(
        map(response => {
          if (response.ok) {
            return response;
          } else {
            throw new Error(response.message || 'Error al eliminar película');
          }
        })
      );
  }
}
