import { Component, OnInit, Input } from '@angular/core';
import {Chart, Colors} from 'chart.js/auto';
import * as chroma from "chroma-js";

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
      type: 'doughnut', //this denotes tha type of chart

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
            font: {
              size: 15,
              style: 'normal',
              lineHeight: 1.2
            },
            color: "black",
          }       
        }
      },
      
    });
  }

  updateChart(datos, etiqueta, year, totalNacional){
    //console.log("ACTUALIZAR GRAFICO SECTORES");
    //console.log(datos);
    //console.log(etiqueta);

    //Ordenamos los datos de menor a mayor valor, junto con sus etiquetas y colores.
    var listaEtiquetasComunidades = ['Andalucía','Aragón','Asturias','Baleares','Canarias','Cantabria','Castilla y León',
    'Castilla La Mancha','Cataluña','Comunidad Valenciana','Extremadura','Galicia','Madrid','Murcia',
    'Navarra','País Vasco','La Rioja','Ceuta','Melilla']; 
    var listaColores = [];
    var valorMaximo = Math.max(...datos);
    for(var i = 0; i<datos.length; i++){
      var colorComunidad = this.ValorToColor(datos[i]/valorMaximo);
      var stringColorComunidad = "rgba("+colorComunidad[0]+","+colorComunidad[1]+","+colorComunidad[2]+","+colorComunidad[3]+")"
      listaColores.push(stringColorComunidad);
    }

    var listaCompuesta = []
    for(var j=0; j<datos.length; j++){
      listaCompuesta.push({"dato": datos[j], "etiqueta": listaEtiquetasComunidades[j], "color":listaColores[j]})
    }
    listaCompuesta.sort(function(a,b){
      return ((a.dato > b.dato) ? -1 : ((a.dato == b.dato) ? 0 : 1));
    });
    var listaValoresDatosOrdenados = []
    for(var k=0; k<listaCompuesta.length; k++){
      listaValoresDatosOrdenados[k] = listaCompuesta[k].dato;
      listaEtiquetasComunidades[k] = listaCompuesta[k].etiqueta;
      listaColores[k]= listaCompuesta[k].color;
    }
    this.graficoSectores.data.datasets[0].backgroundColor = listaColores;
    this.graficoSectores.data.labels= listaEtiquetasComunidades;
    this.graficoSectores.data.datasets[0].data=listaValoresDatosOrdenados;
    this.graficoSectores.data.datasets[0].label=etiqueta;
    this.graficoSectores.config.options.plugins.title.text = ["Distribución nacional en "+year+" de",etiqueta];
    this.graficoSectores.update();
  }

  ValorToColor(weight) {
    const f = chroma.scale(['red', 'green']).mode('hsv');
    var color = chroma(f(weight).toString());
    return color.alpha(0.7).rgba();
  }

}
