import { Rol } from './rol';
export interface User {
  id_usuario: number;
  usuario: string;
  nombre_publico: string;
  id_rol:number ;
  token_sesion: string;
  habilitado: boolean;
  observaciones: string;
  rol: Rol;
  password: string;
}
