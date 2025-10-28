import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../../services/usuarios.service';
import { User } from '../../interfaces/user.interface';
@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  public registerForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombre_publico: ['', Validators.required],
      id_rol: [2], // Role por defecto para usuarios normales
      observaciones: ['']
    });
  }
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos requeridos', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    const newUser: User = {
      ...this.registerForm.value,
      id_usuario: 0,
      token_sesion: '',
      habilitado: true,
      rol: { id_rol: 2, rol: 'usuario', observaciones: '' }
    };
    this.usuarioService.addUsuario(newUser).subscribe({
      next: (response) => {
        if (response.ok) {
          this.snackBar.open('Usuario registrado exitosamente', 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/auth/login']);
        } else {
          this.snackBar.open(response.message || 'Error al registrar usuario', 'Cerrar', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        this.snackBar.open('Error al registrar usuario', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
}
