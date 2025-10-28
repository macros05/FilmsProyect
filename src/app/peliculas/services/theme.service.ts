import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() {
    // Aplicar el tema al cargar la aplicación
    this.applyStoredTheme();
  }

  setTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem('theme', theme);  // Guardamos la preferencia en localStorage
    this.applyTheme(theme);  // Aplicamos el tema inmediatamente
  }

  getTheme(): 'dark' | 'light' {
    return localStorage.getItem('theme') as 'dark' | 'light' || 'light';  // Devuelve 'light' si no hay preferencia
  }
  private applyTheme(theme: 'dark' | 'light'): void {
    if (!theme) {
      console.warn('Theme value is undefined, defaulting to light theme');
      theme = 'light';
    }

    console.log(`Applying theme: ${theme}`);
    document.documentElement.setAttribute('data-theme', theme);
    const body = document.body;

    if (theme === 'dark') {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      console.log('Dark theme applied successfully');
    } else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      console.log('Light theme applied successfully');
    }
  }
  private applyStoredTheme(): void {
    const storedTheme = this.getTheme();
    this.applyTheme(storedTheme);
  }
}
