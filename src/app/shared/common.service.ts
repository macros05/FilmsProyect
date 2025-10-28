import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private token: string | null;

  constructor(private cookieService: CookieService) {
    this.token = localStorage.getItem('token');
  }

  // Método para obtener los headers con el token actual
  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`  // Usamos el token del localStorage
    });
  }

  // Si necesitas cambiar el token en algún momento
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Si deseas limpiar el token
  clearToken(): void {
    this.token = null;
    localStorage.removeItem('token');
  }
}
