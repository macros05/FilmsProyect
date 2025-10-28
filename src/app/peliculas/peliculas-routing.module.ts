import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { AddFavoriteComponent } from './pages/add-favorite/add-favorite.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { PeliculasPageComponent } from './pages/peliculas-page/peliculas-page.component';
import { FavoritesListComponent } from './pages/favorites-list/favorites-list.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      {
        path: 'add-favorite',
        component: AddFavoriteComponent
      },
      {
        path: 'search',
        component: SearchPageComponent
      },
      {
        path: 'list',
        component: ListPageComponent
      },
      {
        path: 'favorites-list',
        component: FavoritesListComponent
      },
      {
        path: 'users',
        component: UsuariosComponent
      },
      {
        path: ':id',
        component: PeliculasPageComponent
      },

      {
        path: '**',
        redirectTo: 'list'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeliculasRoutingModule { }
