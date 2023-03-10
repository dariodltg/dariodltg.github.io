import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js/auto';

@Component({
  selector: 'app-grafico-barras',
  templateUrl: './grafico-barras.component.html',
  styleUrls: ['./grafico-barras.component.css']
})
export class GraficoBarrasComponent implements OnInit {

  constructor() { }

  public graficoBarras: any;
  ngOnInit(): void {
    this.createChart();
  }

  createChart(){
  
    this.graficoBarras = new Chart("graficoBarras", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021'], 
	       datasets: [
          {
            label: "Prueba",
            data: [],
            backgroundColor: 'orange'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Line Chart'
          }
        }
      },     
    });
  }

  updateChart(datos, etiqueta){
    //console.log("ACTUALIZAR GRAFICO BARRAS");
    //console.log(datos);
    //console.log(etiqueta);
    this.graficoBarras.data.datasets[0].data=datos;
    this.graficoBarras.data.datasets[0].label=etiqueta;
    this.graficoBarras.update();
  }

}
