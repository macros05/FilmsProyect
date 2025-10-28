import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['../../../app.component.css']
})
export class LayoutPageComponent implements OnInit {
  public isSuperAdmin: boolean = false;
  public sidebarItems: { label: string; icon: string; url: string; }[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.checkUserRole();
  }

  ngOnInit(): void {
    this.initializeSidebarItems();
  }

  private checkUserRole(): void {
    const userData = localStorage.getItem('user');

    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.isSuperAdmin = user && Number(user.id_rol) === 1;
      } catch (error) {
        console.error('Error al parsear el usuario desde localStorage:', error);
        this.redirectToLogin();
      }
    } else {
      this.redirectToLogin();
    }
  }

  // Redirigir al usuario al login si no tiene rol o si hay algún error con el almacenamiento
  private redirectToLogin(): void {
    this.router.navigate(['/auth/login']);
    window.location.reload();
  }

  // Inicializa los ítems del sidebar en función del rol del usuario
  private initializeSidebarItems(): void {
    const baseItems = [
      { label: 'Listado', icon: 'label', url: './list' },
      { label: 'Favoritos', icon: 'add', url: './favorites-list' },
      { label: 'Buscar', icon: 'search', url: './search' }
    ];

    // Si el usuario es SuperAdmin, añade la opción de "Usuarios" al sidebar
    if (this.isSuperAdmin) {
      baseItems.push({ label: 'Usuarios', icon: 'verified_user', url: './users' });
    }

    this.sidebarItems = baseItems;
  }

  // Función para cerrar sesión
  onLogout() {
    this.authService.doLogout();
    this.router.navigate(['/auth/login']);
    window.location.reload();
  }

  // Función para alternar entre temas (claro/oscuro)
  toggleTheme(): void {
    const currentTheme = this.themeService.getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.themeService.setTheme(newTheme);
  }
}
