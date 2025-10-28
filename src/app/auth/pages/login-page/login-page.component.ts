import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/auth/interfaces/user.interface';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginPageComponent {
  email: string = '';  // Variable para almacenar el email
  password: string = '';  // Variable para almacenar la contraseña

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Método para manejar el login
  onLogin(): void {
    console.log('Email:', this.email);  // Verifica que los valores de email y password se reciban correctamente
    console.log('Password:', this.password);

    // Llamamos al servicio para realizar el login
    this.authService.doLogin({ username: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          console.log('Login response:', response);
          if (response && response.data) {
            // Guardar el token en localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('usuario_id', response.data.id_usuario )
            const userData = {
              usuario: response.data.usuario,
              nombre_publico: response.data.nombre_publico,
              id_rol: response.data.id_rol,
              token_sesion: response.data.token,
              id_usuario: response.data.id_usuario  // Guardar el id_usuario
            };

            console.log("User Data:", userData); // Verifica que los datos estén correctos antes de guardar

            // Guardar los datos en localStorage
            localStorage.setItem('user', JSON.stringify(userData));

            this.router.navigate(['/peliculas/list'])
              .then(() => {
                window.location.reload(); // Forzar recarga después de la navegación
              });
          } else {
            console.error('Login fallido: respuesta no contiene datos de usuario');
            alert('Credenciales incorrectas');
          }
        },
        error: (err) => {
          console.error('Error de autenticación:', err);
          alert('Error en la autenticación. Por favor, intenta nuevamente.');
        }
      });
  }

}
