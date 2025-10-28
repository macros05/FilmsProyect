import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { CommonService } from '../../shared/common.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/interfaces/api-response';
import { Rol } from '../interfaces/rol';
import { NumberValueAccessor } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class RolesService {
  roles: Rol[] = [];
  private baseUrl = environment.URL_BASE;
  constructor(private http: HttpClient, private commonService: CommonService) {
  }
  getAllRoles(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/api/private/rol.php`,
      { headers: this.commonService.getHeaders() });
  }
  addRol(rol: Rol) {
    const body = JSON.stringify(rol);
    return this.http.post<ApiResponse>(`${this.baseUrl}/api/private/rol.php`,
      body,
      { headers: this.commonService.getHeaders() });
  }
  editRol(rol: Rol) {
    const body = JSON.stringify(rol);
    return this.http.put<ApiResponse>(`${this.baseUrl}/api/private/rol.php`,
      body,
      { headers: this.commonService.getHeaders() });
  }
  deleteRol(idRol: string | number) {
    return this.http.delete<ApiResponse>(
      `${this.baseUrl}/api/private/roles.php?id=${idRol}`,
      { headers: this.commonService.getHeaders() }
    );
  }
  removeRol(idRol: number) {
    this.roles = this.roles.filter(rol => {
      return Number(rol.id_rol) !== Number(idRol);
    });
  }
  updateRol(rol: Rol) {
    let index = null;
    this.roles.filter((rolFilter, indexFilter) => {
      if (rol.id_rol === rolFilter.id_rol) {
        index = indexFilter;
      }
    });
    if (index) {
      this.roles[index] = rol;
    }
  }
}
