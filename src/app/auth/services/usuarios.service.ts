import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../shared/common.service';
import { ApiResponse } from '../../shared/interfaces/api-response';
import { User } from '../interfaces/user.interface';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuarios: User[] = [];
  private baseUrl = environment.URL_BASE;
  constructor(private http: HttpClient, private commonService: CommonService) {
  }
  getAllUsuarios() {
    return this.http.get<ApiResponse>(`${this.baseUrl}/api/private/usuario.php`,
      { headers: this.commonService.getHeaders() });
  }
  addUsuario(usuario: User) {
    const body = JSON.stringify(usuario);
    return this.http.post<ApiResponse>(`${this.baseUrl}/api/private/usuario.php`,
      body,
      { headers: this.commonService.getHeaders() });
  }
  editUsuario(usuario: User, route?: string) {
    const body = JSON.stringify(usuario);
    const endpoint = route ? `?route=${route}` : '';
    return this.http.put<ApiResponse>(
      `${this.baseUrl}/api/private/usuario.php${endpoint}`,
      body,
      { headers: this.commonService.getHeaders() }
    );
  }
  deleteUsuario(id_usuario: number) {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/api/private/usuario.php?id=${id_usuario}`,
      { headers: this.commonService.getHeaders() });
  }

  removeUsuario(idUser: number) {
    this.usuarios = this.usuarios.filter(usuario => {
      return Number(usuario.id_usuario) !== Number(idUser);
    });
  }
  updateUsuario(usuario: User) {
    let index = null;
    this.usuarios.filter((usuarioFilter, indexFilter) => {
      if (usuario.id_usuario === usuarioFilter.id_usuario) {
        index = indexFilter;
      }
    });
    if (index) {
      this.usuarios[index] = usuario;
    }
  }
}
