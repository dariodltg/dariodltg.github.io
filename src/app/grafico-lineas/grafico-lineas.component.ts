import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js/auto';

@Component({
  selector: 'app-grafico-lineas',
  templateUrl: './grafico-lineas.component.html',
  styleUrls: ['./grafico-lineas.component.css']
})
export class GraficoLineasComponent implements OnInit {

  constructor() { }

  public graficoLineas: any;
  ngOnInit(): void {
    this.createChart();
  }

  createChart(){
  
    this.graficoLineas = new Chart("graficoLineas", {
      type: 'line', 

      data: {
        labels: ['2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021'], 
	       datasets: [
          {
            label: "Prueba",
            data: [],
            backgroundColor: 'orange',
            borderColor:'rgba(50,50,50,0.8)',
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
            text: 'Evolución histórica de '
          }
        },
        scales:{
          y:{
            min:0,
          }
        }
      },     
    });
  }

  updateChart(datos, etiqueta, comunidad){
    //console.log("ACTUALIZAR GRAFICO BARRAS");
    //console.log(datos);
    //console.log(etiqueta);
    this.graficoLineas.data.datasets[0].data=datos;
    this.graficoLineas.data.datasets[0].label=etiqueta;
    this.graficoLineas.config.options.plugins.title.text = "Evolución histórica de "+comunidad;
    this.graficoLineas.update();
  }

}
