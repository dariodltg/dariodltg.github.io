import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-filtros',
  templateUrl: './menu-filtros.component.html',
  styleUrls: ['./menu-filtros.component.css']
})
export class MenuFiltrosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  seasons: string[] = ['Inversión en I+D (%)', 'Inversión en I+D (Total)', 'Total empleados EJC', 'TotalInvestigadoresEJC'];
  opcionSeleccionada: string = this.seasons[0];
}
