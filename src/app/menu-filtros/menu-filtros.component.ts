import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-menu-filtros',
  templateUrl: './menu-filtros.component.html',
  styleUrls: ['./menu-filtros.component.css']
})
export class MenuFiltrosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  opciones: string[] = ['Inversión en I+D (%)', 'Inversión en I+D (Total)', 'Total empleados EJC', 'TotalInvestigadoresEJC'];
  opcionSelected: string = this.opciones[0];

  yearList: string[] = ['2021','2020','2019'];
  yearSelected = this.yearList[0];

  comunidadList: string[] = ['Castilla y León','Madrid','Andalucía'];
  comunidadSelected = this.comunidadList[0];

  cambioOpcion($event: MatRadioChange) {
    console.log($event.source.name, $event.value);
    this.actualizarDatos();
  }

  yearChange(change: MatSelectChange) {
    console.log(change.value);
    this.actualizarDatos();
  }

  comunidadChange(change: MatSelectChange) {
    console.log(change.value);
    this.actualizarDatos();
  }

  actualizarDatos(){
    var year = this.yearSelected;
    var comunidad = this.comunidadSelected;
    var opcion = this.opcionSelected;
    this.getDatosCsv(year, comunidad, opcion)
  }

  async getDatosCsv(year, comunidad, opcion) {
    const url = "/assets/total_sectores_"+year+".csv";
    const response = await fetch(url);
    const datos = await response.text();
    console.log(datos);

    


   }
}
