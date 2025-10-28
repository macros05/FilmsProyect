import { Component, Input, OnInit } from '@angular/core';
import { Pelicula } from '../../interfaces/pelicula';
@Component({
  selector: 'app-pelicula-card',
  templateUrl: './card.component.html',
  styleUrls: ['../../../app.component.css']
})
export class PeliculasCardComponent implements OnInit {
  @Input() pelicula!: Pelicula ;

  ngOnInit(): void {
  }
}
