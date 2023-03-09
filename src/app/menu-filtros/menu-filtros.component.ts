import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
    this.actualizarDatos();
  }
  opciones: string[] = ['Inversión en I+D (%)', 'Inversión en I+D (Total)', 'Total empleados EJC', 'Total investigadores EJC'];
  opcionSelected: string = this.opciones[0];

  yearList: string[] = ['2021','2020','2019','2018','2017','2016','2015','2014','2013','2012','2011'];
  yearSelected = this.yearList[0];

  comunidadList: string[] = ['Andalucía','Aragón','Asturias','Baleares','Canarias','Cantabria','Castilla y León',
  'Castilla La Mancha','Cataluña','Comunidad Valenciana','Extremadura','Galicia','Madrid','Murcia',
  'Navarra','País Vasco','La Rioja','Ceuta','Melilla'];
  comunidadSelected = this.comunidadList[0];

  @Output() actualizar = new EventEmitter<object>(); 

  cambioOpcion($event: MatRadioChange) {
    console.log($event.value);
    this.opcionSelected=$event.value;
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
    console.log(opcion);
    console.log(year);
    console.log(comunidad);
    this.actualizar.emit({y: year, c: comunidad, o:opcion})
  }
}
