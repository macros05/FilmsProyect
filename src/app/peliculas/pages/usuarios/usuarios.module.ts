import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module'; // Asegúrate de que este módulo esté correctamente importado
import { UsuarioService } from 'src/app/auth/services/usuarios.service';
import { RolesService } from 'src/app/auth/services/roles.service';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule
  ],
  providers: [UsuarioService, RolesService],
  exports: []
})
export class UsuariosModule { }
