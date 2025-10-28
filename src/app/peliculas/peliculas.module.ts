import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeliculasRoutingModule } from './peliculas-routing.module';
import { PeliculasPageComponent } from './pages/peliculas-page/peliculas-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { AddFavoriteComponent } from './pages/add-favorite/add-favorite.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MaterialModule } from '../material/material.module';
import { PeliculasCardComponent } from './components/card/card.component';
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from '@angular/forms';
import { FavoritesListComponent } from './pages/favorites-list/favorites-list.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';

@NgModule({

  declarations: [
    PeliculasPageComponent,
    LayoutPageComponent,
    ListPageComponent,
    AddFavoriteComponent,
    SearchPageComponent,
    PeliculasCardComponent,
    FavoritesListComponent,
    UsuariosComponent,
  ],
  imports: [
    CommonModule,
    PeliculasRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class PeliculasModule { }
