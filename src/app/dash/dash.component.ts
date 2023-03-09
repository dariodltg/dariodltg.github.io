import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { GraficoSectoresComponent } from '../grafico-sectores/grafico-sectores.component';
import { GraficoBarrasComponent } from '../grafico-barras/grafico-barras.component';

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

  @ViewChild(GraficoBarrasComponent)
  private graficoBarras: GraficoBarrasComponent;

  year: string;
  comunidad: string;
  opcion: string;
  etiquetaSectores: string;
  datosSectores = [];
  etiquetaBarras : string;
  datosBarras = []; 
  yearList: string[] = ['2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021'];

  recibirCambioOpcion(object){
    this.year = object.y;
    this.comunidad = object.c;
    this.opcion = object.o;
    console.log(this.comunidad);
    this.actualizarComponentes();
  }

  actualizarComponentes(){
    this.getDatosCsvSectores();
    this.getDatosCsvBarras();
  }

  async getDatosCsvBarras(){
    this.datosBarras = [];
    for(let i=0; i<this.yearList.length;i++){
      var year= this.yearList[i];
      var url = "/assets/"+year+".csv";
      console.log(url);
      const response = await fetch(url);
      const datos = await response.text();
      //Quitamos las primeras 7 líneas que son los títulos y el global del país, y la última línea porque está en blanco.  
      const datosPorLinea = datos.split('\n').slice(7);
      var numFilaDeComunidad = this.getNumFilaSegunComunidad(this.comunidad);
      var filaComunidad = datosPorLinea[numFilaDeComunidad];
      console.log(filaComunidad);
      var columnas = filaComunidad.split(';');
      switch(this.opcion){
        case "Inversión en I+D (%)":{
          this.etiquetaBarras="Inversión en I+D (% del total nacional)";
          this.datosBarras.push(this.stringNumeroESPtoNumber(columnas[2]));
          break;
        }
        case "Inversión en I+D (Total)":{
          this.etiquetaBarras="Inversión en I+D (Total en miles de euros)";
          this.datosBarras.push(this.stringNumeroESPtoNumber(columnas[1]));
          break;
        }
        case "Total empleados EJC":{
          this.etiquetaBarras="Total empleados EJC";
          this.datosBarras.push(this.stringNumeroESPtoNumber(columnas[3]));
          break;
        }
        case "Total investigadores EJC":{
          this.etiquetaBarras="Total investigadores EJC";
          this.datosBarras.push(this.stringNumeroESPtoNumber(columnas[5]));
          break;
        }
      }   
    }
    console.log(this.datosBarras);
    this.graficoBarras.updateChart(this.datosBarras, this.etiquetaBarras);
  }

  getNumFilaSegunComunidad(comunidad: string){
    const comunidadList: string[] = ['Andalucía','Aragón','Asturias','Baleares','Canarias','Cantabria','Castilla y León',
  'Castilla La Mancha','Cataluña','Comunidad Valenciana','Extremadura','Galicia','Madrid','Murcia',
  'Navarra','País Vasco','La Rioja','Ceuta','Melilla'];
    return comunidadList.indexOf(comunidad);
  }

  async getDatosCsvSectores() {
    this.datosSectores = []
    const url = "/assets/"+this.year+".csv";
    const response = await fetch(url);
    const datos = await response.text();
    //Quitamos las primeras 7 líneas que son los títulos y el global del país, y la última línea porque está en blanco.  
    const datosPorLinea = datos.split('\n').slice(7); 
    for(let i=0; i<datosPorLinea.length-5;i++){
      var fila = datosPorLinea[i];
      var columnas = fila.split(';');
      switch(this.opcion){
        case "Inversión en I+D (%)":{
          this.etiquetaSectores="Inversión en I+D (% del total nacional)";
          this.datosSectores.push(this.stringNumeroESPtoNumber(columnas[2]));
          break;
        }
        case "Inversión en I+D (Total)":{
          this.etiquetaSectores="Inversión en I+D (Total en miles de euros)";
          this.datosSectores.push(this.stringNumeroESPtoNumber(columnas[1]));
          break;
        }
        case "Total empleados EJC":{
          this.etiquetaSectores="Total empleados EJC";
          this.datosSectores.push(this.stringNumeroESPtoNumber(columnas[3]));
          break;
        }
        case "Total investigadores EJC":{
          this.etiquetaSectores="Total investigadores EJC";
          this.datosSectores.push(this.stringNumeroESPtoNumber(columnas[5]));
          break;
        }
      }   
    }
    console.log(this.datosSectores);
    this.graficoSectores.updateChart(this.datosSectores, this.etiquetaSectores);
   }

   stringNumeroESPtoNumber(str:string){
    var cadena = str.replace(/\./g,'');
    cadena = cadena.replace(/,/g,'.');
    var numero: number = Number(cadena);
    return numero;
   }
}
