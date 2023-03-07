import { Component, OnInit, Input } from '@angular/core';
import {Chart, Colors} from 'chart.js/auto';

@Component({
  selector: 'app-grafico-sectores',
  templateUrl: './grafico-sectores.component.html',
  styleUrls: ['./grafico-sectores.component.css']
})
export class GraficoSectoresComponent implements OnInit {
  
  constructor() { }

  public graficoSectores: any;
  ngOnInit(): void {
    this.createChart();
  }

  createChart(){
  
    this.graficoSectores = new Chart("graficoSectores", {
      type: 'pie', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: [], 
	       datasets: [
          {
            label: "Prueba",
            data: [],
          }, 
        ]
      },
      
    });
  }

  updateChart(datos, etiquetas){
    console.log("ACTUALIZAR GRAFICO SECTORES");
    console.log(datos);
    console.log(etiquetas);
    var colors = [];
    for(let i=0; i< datos.length; i++){
      var color = this.selectColor(datos.length);
      colors.push(color);
    }
    console.log(colors);
    this.graficoSectores.data.datasets[0].data=datos;
    this.graficoSectores.data.labels=etiquetas;
    //this.graficoSectores.data.datasets[0].backgroundColor= colors;
    this.graficoSectores.update();
  }

  selectColor(number) {
    const hue = number * 137.508; // use golden angle approximation
    return `hsl(${hue},50%,75%)`;
  }

}
