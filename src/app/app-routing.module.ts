import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { AuthGuardService } from './auth/guards/auth.guard';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { PublicGuard } from './auth/guards/public.guard'; // Importa el PublicGuard
import { AddFavoriteComponent } from './peliculas/pages/add-favorite/add-favorite.component';
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [PublicGuard]
  },
  {
    path: 'peliculas',
    loadChildren: () => import('./peliculas/peliculas.module').then(m => m.PeliculasModule),
    canActivate: [AuthGuardService]  // Solo permitirá el acceso si el usuario está autenticado
  },
  {
    path: '404',
    component: Error404PageComponent
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '404'
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
