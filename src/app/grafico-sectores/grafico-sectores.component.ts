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

  listaColores = ["red","yellow","blue","lime","fuchsia","aqua","crimson","olive","darkorange","mediumorchid","tomato","seagreen","sienna","pink","grey","darkviolet","azure","black","green"];

  createChart(){
  
    this.graficoSectores = new Chart("graficoSectores", {
      type: 'pie', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['Andalucía','Aragón','Asturias','Baleares','Canarias','Cantabria','Castilla y León',
        'Castilla La Mancha','Cataluña','Comunidad Valenciana','Extremadura','Galicia','Madrid','Murcia',
        'Navarra','País Vasco','La Rioja','Ceuta','Melilla'], 
	       datasets: [
          {
            label: "Prueba",
            data: [],
            backgroundColor: this.listaColores,
            borderColor: 'rgba(50,50,50,0.8)'
          },

        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            
          },
          title: {
            display: true,
            align: 'start',
            text: 'Distribución nacional en ',

          }       
        }
      },
      
    });
  }

  updateChart(datos, etiqueta, year){
    //console.log("ACTUALIZAR GRAFICO SECTORES");
    //console.log(datos);
    //console.log(etiqueta);
    this.graficoSectores.data.datasets[0].data=datos;
    this.graficoSectores.data.datasets[0].label=etiqueta;
    this.graficoSectores.config.options.plugins.title.text = ["Distribución nacional en "+year+" de",etiqueta];
    this.graficoSectores.update();
  }

}
