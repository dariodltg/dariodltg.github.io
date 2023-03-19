import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { GraficoSectoresComponent } from '../grafico-sectores/grafico-sectores.component';
import { GraficoLineasComponent } from '../grafico-lineas/grafico-lineas.component';
import { MapaCoropletasComponent } from '../mapa-coropletas/mapa-coropletas.component';
import { MenuFiltrosComponent } from '../menu-filtros/menu-filtros.component';
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
          lineas:{cols:1, rows:2},
          sectores:{cols:1, rows:2},
          filtros:{cols:1, rows:1},
        };
      }

      return {
        columns: 2,
        mapa:{cols:2, rows:5},
        lineas:{cols:1, rows:2},
        sectores:{cols:1, rows:2},
        filtros:{cols:1, rows:1},
      };
    })
  );

  constructor(private breakpointObserver: BreakpointObserver) {}
  
  @ViewChild(GraficoSectoresComponent)
  private graficoSectores: GraficoSectoresComponent;

  @ViewChild(GraficoLineasComponent)
  private graficoBarras: GraficoLineasComponent;

  @ViewChild(MapaCoropletasComponent)
  private mapaCoropletas: MapaCoropletasComponent;
  
  @ViewChild(MenuFiltrosComponent)
  private menuFiltros: MenuFiltrosComponent;

  primera : boolean = true;

  year: string ="";
  comunidad: string="";
  opcion: string="";
  opcionSecundaria: string="";
  etiquetaSectores: string;
  datosSectores:number[] = [];
  totalNacional : number;
  etiquetaLineas : string;
  datosLineas:number[] = []; 
  yearList: string[] = ['2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021'];
  
  datosPoblacionLineas: number[] = [];
  datosPoblacionSectores: number[] = [];

  recibirCambioOpcion(object){
    if(this.primera){
      this.primera=false;
      this.opcionSecundaria = object.o2;
      this.opcion = object.o;
      this.year = object.y;
      this.comunidad = object.c;
      this.getDatosCsvSectores();
      this.getDatosCsvLineas();
    }else{
      if(this.opcion != object.o || this.opcionSecundaria != object.o2){
        this.opcion = object.o;
        this.opcionSecundaria = object.o2;
        this.getDatosCsvSectores();
        this.getDatosCsvLineas();
      }else if(this.year != object.y){
        this.year = object.y;
        this.getDatosCsvSectores();
      }else if(this.comunidad != object.c){
        this.comunidad = object.c;
        this.getDatosCsvLineas();
      }
    }
  }

  recibirClickComunidad(object){
    var idComunidad = object.id;
    this.menuFiltros.cambioComunidadPorMapa(idComunidad);
  }

  async getDatosCsvPoblacionLineas() {
    this.datosPoblacionLineas = [];
    var url = "/assets/poblacion.csv";
    const response = await fetch(url);
    const datos = await response.text();
    //Quitamos las primeras 7 líneas que son los títulos y el global del país, y la última línea porque está en blanco.  
    const datosPorLinea = datos.split('\n').slice(7);
    var numFilaDeComunidad = this.getNumFilaSegunComunidad(this.comunidad);
    var filaComunidad = datosPorLinea[numFilaDeComunidad];
    var columnas = filaComunidad.split(';');
    columnas = columnas.slice(1).reverse().slice(1);
    columnas.forEach(element => {
      this.datosPoblacionLineas.push(this.stringNumeroESPtoNumber(element))
    });
  }

  async getDatosCsvLineas(){
    this.datosLineas = [];
    await this.getDatosCsvPoblacionLineas();
    for(let i=0; i<this.yearList.length;i++){
      var year= this.yearList[i];
      var url = "/assets/"+year+".csv";
      const response = await fetch(url);
      const datos = await response.text();
      //Quitamos las primeras 7 líneas que son los títulos y el global del país, y la última línea porque está en blanco.  
      const datosPorLinea = datos.split('\n').slice(7);
      var numFilaDeComunidad = this.getNumFilaSegunComunidad(this.comunidad);
      var filaComunidad = datosPorLinea[numFilaDeComunidad];
      var columnas = filaComunidad.split(';');
      var datoNumerico: number;
      switch(this.opcion){
        case "Inversión en I+D (Total)":{
          this.etiquetaLineas="Inversión en I+D (Total en miles de euros)";
          datoNumerico = this.stringNumeroESPtoNumber(columnas[1])
          break;
        }
        case "Inversión en I+D (%)":{
          this.etiquetaLineas="Inversión en I+D (% del total nacional)";
          datoNumerico = this.stringNumeroESPtoNumber(columnas[2])
          break;
        }
        case "Personal en I+D: Total":{
          this.etiquetaLineas="Personal en I+D: Total";
          datoNumerico = this.stringNumeroESPtoNumber(columnas[3])
          if(this.opcionSecundaria == "% sobre la población"){
            datoNumerico = (datoNumerico/this.datosPoblacionLineas[i])*100
          }
          break;
        }
        case "Personal en I+D: Mujeres":{
          this.etiquetaLineas="Personal en I+D: Mujeres";
          datoNumerico = this.stringNumeroESPtoNumber(columnas[4])
          if(this.opcionSecundaria == "% sobre la población"){
            datoNumerico = (datoNumerico/this.datosPoblacionLineas[i])*100
          }
          break;
        }
        case "Investigadores: Total":{
          this.etiquetaLineas="Investigadores: Total";
          datoNumerico = this.stringNumeroESPtoNumber(columnas[5])
          if(this.opcionSecundaria == "% sobre la población"){
            datoNumerico = (datoNumerico/this.datosPoblacionLineas[i])*100
          }
          break;
        }
        case "Investigadores: Mujeres":{
          this.etiquetaLineas="Investigadores: Mujeres";
          datoNumerico = this.stringNumeroESPtoNumber(columnas[6])
          if(this.opcionSecundaria == "% sobre la población"){
            datoNumerico = (datoNumerico/this.datosPoblacionLineas[i])*100
          }
          break;
        }        
      } 
      this.datosLineas.push(datoNumerico); //Añadimos el dato para el gráfico de líneas
    }
    this.graficoBarras.updateChart(this.datosLineas, this.etiquetaLineas, this.comunidad);
  }

  async getDatosCsvSectores() {
    this.datosSectores = []
    await this.getDatosCsvPoblacionSectores();
    const url = "/assets/"+this.year+".csv";
    const response = await fetch(url);
    const datos = await response.text();
    //Quitamos las primeras 7 líneas que son los títulos y el global del país, y la última línea porque está en blanco.  
    const datosPorLinea = datos.split('\n').slice(7);
    var columnasLineaTotalNacional = datos.split('\n')[6].split(';');
    var datoNumerico: number;
    for(let i=0; i<datosPorLinea.length-5;i++){
      var fila = datosPorLinea[i];
      var columnas = fila.split(';');
      switch(this.opcion){
        case "Inversión en I+D (Total)":{
          this.etiquetaSectores="Inversión en I+D (Total en miles de euros)";
          this.totalNacional = this.stringNumeroESPtoNumber(columnasLineaTotalNacional[1])
          datoNumerico = this.stringNumeroESPtoNumber(columnas[1])
          break;
        }
        case "Inversión en I+D (%)":{
          this.etiquetaSectores="Inversión en I+D (% del total nacional)";
          this.totalNacional = this.stringNumeroESPtoNumber(columnasLineaTotalNacional[2])
          datoNumerico = this.stringNumeroESPtoNumber(columnas[2])
          break;
        }        
        case "Personal en I+D: Total":{
          this.etiquetaSectores="Personal en I+D: Total";
          this.totalNacional = this.stringNumeroESPtoNumber(columnasLineaTotalNacional[3])
          datoNumerico = this.stringNumeroESPtoNumber(columnas[3])
          if(this.opcionSecundaria == "% sobre la población"){
            datoNumerico = (datoNumerico/this.datosPoblacionSectores[i])*100
            this.totalNacional=100;
          }
          break;
        }
        case "Personal en I+D: Mujeres":{
          this.etiquetaSectores="Personal en I+D: Mujeres";
          this.totalNacional = this.stringNumeroESPtoNumber(columnasLineaTotalNacional[4])
          datoNumerico = this.stringNumeroESPtoNumber(columnas[4])
          if(this.opcionSecundaria == "% sobre la población"){
            datoNumerico = (datoNumerico/this.datosPoblacionSectores[i])*100
            this.totalNacional=100;
          }
          break;
        }
        case "Investigadores: Total":{
          this.etiquetaSectores="Investigadores: Total";
          this.totalNacional = this.stringNumeroESPtoNumber(columnasLineaTotalNacional[5])
          datoNumerico = this.stringNumeroESPtoNumber(columnas[5])
          if(this.opcionSecundaria == "% sobre la población"){
            datoNumerico = (datoNumerico/this.datosPoblacionSectores[i])*100
            this.totalNacional=100;
          }
          break;
        }
        case "Investigadores: Mujeres":{
          this.etiquetaSectores="Investigadores: Mujeres";
          this.totalNacional = this.stringNumeroESPtoNumber(columnasLineaTotalNacional[6])
          datoNumerico = this.stringNumeroESPtoNumber(columnas[6])
          if(this.opcionSecundaria == "% sobre la población"){
            datoNumerico = (datoNumerico/this.datosPoblacionSectores[i])*100
            this.totalNacional=100;
          }
          break;
        }
      }
      this.datosSectores.push(datoNumerico);
    }
    this.graficoSectores.updateChart(this.datosSectores, this.etiquetaSectores, this.year);
    this.mapaCoropletas.updateMap(this.datosSectores, this.etiquetaSectores, this.totalNacional);
   }

  async getDatosCsvPoblacionSectores() {
    this.datosPoblacionSectores = [];
    var url = "/assets/poblacion.csv";
    const response = await fetch(url);
    const datos = await response.text();
    //Quitamos las primeras 7 líneas que son los títulos y el global del país, y la última línea porque está en blanco.  
    const datosPorLinea = datos.split('\n').slice(7);
    var columnaPoblacionYear = this.yearList.reverse().indexOf(this.year) + 1;
    for(let i=0; i<datosPorLinea.length-5;i++){
      var columnas = datosPorLinea[i].split(';');
      var datoNumericoPoblacion = this.stringNumeroESPtoNumber(columnas[columnaPoblacionYear]);
      this.datosPoblacionSectores.push(datoNumericoPoblacion);
    }
  }

  stringNumeroESPtoNumber(str:string){
    var cadena = str.replace(/\./g,'');
    cadena = cadena.replace(/,/g,'.');
    var numero: number = Number(cadena);
    return numero;
   }

  getNumFilaSegunComunidad(comunidad: string){
    const comunidadList: string[] = ['Andalucía','Aragón','Asturias','Baleares','Canarias','Cantabria','Castilla y León',
  'Castilla La Mancha','Cataluña','Comunidad Valenciana','Extremadura','Galicia','Madrid','Murcia',
  'Navarra','País Vasco','La Rioja','Ceuta','Melilla'];
    return comunidadList.indexOf(comunidad);
  }
}
