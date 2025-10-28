import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/auth/services/usuarios.service';
import { RolesService } from 'src/app/auth/services/roles.service';
import { User } from 'src/app/auth/interfaces/user.interface';
import { Rol } from 'src/app/auth/interfaces/rol';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CLOSE, INVALID_FORM } from 'src/app/shared/interfaces/messages';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  users: User[] = [];
  roles: Rol[] = [];
  usuarioForm?: FormGroup;
  userFormVisible: boolean = false;
  currentUser: User | null = null;
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];
  isSuperAdmin: boolean = false;
  constructor(
    private usuarioService: UsuarioService,
    private rolesService: RolesService,
    private router: Router,
    public snackBar: MatSnackBar
  ) { }
  ngOnInit(): void {
    this.checkUserRole();
    this.loadRoles().then(() => {
      this.loadUsers();
    });
    this.initForm();
  }
  private initForm(): void {
    this.usuarioForm = new FormGroup({
      usuario: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      nombre_publico: new FormControl(''),
      id_rol: new FormControl(null, [Validators.required]),
      observaciones: new FormControl('')
    });
  }
  private checkUserRole(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.isSuperAdmin = user && Number(user.id_rol) === 1;
            if (!this.isSuperAdmin) {
        this.snackBar.open('No tienes permisos para acceder a esta sección', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/peliculas/list']);
      }
    }
  }
  loadUsers(): void {
    if (!this.isSuperAdmin) return;
    this.usuarioService.getAllUsuarios().subscribe({
      next: (response) => {
        if (response && response.data) {
            this.users = response.data.map((user: User) => {
              console.log()
              return {
                ...user,
                rol: this.roles.find((rol: Rol) => rol.id_rol === user.id_rol)
              };
            });
        }

      },
      error: (error) => {
        console.error('Error cargando usuarios:', error);
      }
    });
  }
  loadRoles(): Promise<void> {
    if (!this.isSuperAdmin) return Promise.resolve();
    return new Promise((resolve) => {
      this.rolesService.getAllRoles().subscribe(response => {
        if (response && response.data) {
          this.roles = response.data;
          resolve();
        }
      });
    });
  }
  showForm(user?: User): void {
    if (!this.isSuperAdmin) {
      this.snackBar.open('No tienes permisos para realizar esta acción', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    this.userFormVisible = true;
    if (user) {
      this.currentUser = user;
      this.usuarioForm?.setValue({
        usuario: user.usuario,
        password: '',
        nombre_publico: user.nombre_publico,
        id_rol: user.id_rol,
        observaciones: user.observaciones || ''
      });
    } else {
      this.currentUser = null;
      this.usuarioForm?.reset();
    }
  }
  saveUser(): void {
    if (!this.isSuperAdmin) {
      this.snackBar.open('No tienes permisos para realizar esta acción', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    if (this.usuarioForm?.valid) {
      const user: User = {
        id_usuario: this.currentUser ? this.currentUser.id_usuario : this.users.length + 1,
        usuario: this.usuarioForm?.value.usuario,
        nombre_publico: this.usuarioForm?.value.nombre_publico || '',
        id_rol: this.usuarioForm?.value.id_rol,
        token_sesion: '',
        habilitado: true,
        observaciones: this.usuarioForm?.value.observaciones || '',
        rol: this.roles.find(role => role.id_rol === this.usuarioForm?.value.id_rol) || { id_rol: 0, rol: '', observaciones: '' },
        password: this.usuarioForm?.value.password
      };
      if (this.currentUser) {
        this.usuarioService.editUsuario(user).subscribe(response => {
          this.snackBar.open(response.message || '', CLOSE, { duration: 5000 });
          this.updateUser(user);
          this.resetForm();
        });
      } else {
        this.usuarioService.addUsuario(user).subscribe(response => {
          this.snackBar.open(response.message || '', CLOSE, { duration: 5000 });
          this.users.push(user);
          this.resetForm();
        });
      }
    } else {
      this.snackBar.open(INVALID_FORM, CLOSE, { duration: 5000 });
    }
  }
  deleteUser(id: number): void {
    if (!this.isSuperAdmin) {
      this.snackBar.open('No tienes permisos para realizar esta acción', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    this.usuarioService.deleteUsuario(id).subscribe(() => {
      this.snackBar.open('Usuario eliminado', CLOSE, { duration: 5000 });
      this.removeUser(id);
    });
  }
  resetForm(): void {
    this.userFormVisible = false;
    this.currentUser = null;
    this.usuarioForm?.reset();
  }
  updateUser(user: User): void {
    const index = this.users.findIndex(u => u.id_usuario === user.id_usuario);
    if (index !== -1) {
      this.users[index] = user;
    }
  }
  removeUser(id: number): void {
    this.users = this.users.filter(user => user.id_usuario !== id);
  }
}
