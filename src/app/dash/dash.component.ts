import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { GraficoSectoresComponent } from '../grafico-sectores/grafico-sectores.component';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cardLayout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return {
          columns: 3,
          mapa:{cols:2, rows:5},
          barras:{cols:1, rows:2},
          sectores:{cols:1, rows:2},
          filtros:{cols:1, rows:1},
        };
      }

      return {
        columns: 2,
        mapa:{cols:2, rows:5},
        barras:{cols:1, rows:2},
        sectores:{cols:1, rows:2},
        filtros:{cols:1, rows:1},
      };
    })
  );

  constructor(private breakpointObserver: BreakpointObserver) {}
  
  @ViewChild(GraficoSectoresComponent)
  private graficoSectores: GraficoSectoresComponent;

  year: string;
  comunidad: string;
  opcion: string;
  etiquetasSectores = [];
  datosSectores = [];
  etiquetasBarras = [];
  datosBarras = []; 

  recibirCambioOpcion(object){
    this.year = object.y;
    this.comunidad = object.c;
    this.opcion = object.o;
    this.actualizarComponentes();
  }

  actualizarComponentes(){
    this.getDatosCsv();
  }

  async getDatosCsv() {
    this.datosSectores = []
    this.etiquetasSectores = []
    const url = "/assets/total_sectores_"+this.year+".csv";
    const response = await fetch(url);
    const datos = await response.text();
    //Quitamos las primeras 7 líneas que son los títulos y el global del país, y la última línea porque está en blanco.  
    const datosPorLinea = datos.split('\r\n').slice(7).filter(line => line.trim() !== ""); 
    
    for(let i=0; i<datosPorLinea.length;i=i+6){
      switch(this.opcion){
        case "Inversión en I+D (%)":{
          var fila = datosPorLinea[i+1];
          const columna = fila.split(';');
          this.etiquetasSectores.push(columna[1]);
          this.datosSectores.push(this.stringNumeroESPtoNumber(columna[3]));
          break;
        }
        case "Inversión en I+D (Total)":{
          var fila = datosPorLinea[i+0];
          const columna = fila.split(';');
          this.etiquetasSectores.push(columna[1]);
          this.datosSectores.push(this.stringNumeroESPtoNumber(columna[3]));
          break;
        }
        case "Total empleados EJC":{
          var fila = datosPorLinea[i+2];
          const columna = fila.split(';');
          this.etiquetasSectores.push(columna[1]);
          this.datosSectores.push(this.stringNumeroESPtoNumber(columna[3]));
          break;
        }
        case "TotalInvestigadoresEJC":{
          var fila = datosPorLinea[i+4];
          const columna = fila.split(';');
          this.etiquetasSectores.push(columna[1]);
          this.datosSectores.push(this.stringNumeroESPtoNumber(columna[3]));
          break;
        }
      }   
    }
    console.log(this.datosSectores);
    console.log(this.etiquetasSectores);
    this.graficoSectores.updateChart(this.datosSectores, this.etiquetasSectores);
   }

   stringNumeroESPtoNumber(str:string){
    var cadena = str.replace(/\./g,'');
    console.log(cadena);
    cadena = cadena.replace(/,/g,'.');
    console.log(cadena);
    var numero: number = Number(cadena);
    console.log(numero);
    return numero;
   }
}
