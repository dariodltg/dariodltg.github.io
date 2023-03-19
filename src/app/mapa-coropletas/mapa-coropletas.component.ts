import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as og from "@openglobus/og";
import * as chroma from "chroma-js";

@Component({
  selector: 'app-mapa-coropletas',
  templateUrl: './mapa-coropletas.component.html',
  styleUrls: ['./mapa-coropletas.component.css']
})
export class MapaCoropletasComponent implements OnInit {

  constructor() { }
  comunidadList: string[] = ['Andalucía','Aragón','Asturias','Baleares','Canarias','Cantabria','Castilla y León',
  'Castilla La Mancha','Cataluña','Comunidad Valenciana','Extremadura','Galicia','Madrid','Murcia',
  'Navarra','País Vasco','La Rioja','Ceuta','Melilla'];
  osm;
  globus;
  primera : boolean = true;
  idComunidad: number;
  miPopUp;
  
  ngOnInit() {
    this.osm = new og.layer.XYZ('OpenStreetMap', {
      isBaseLayer: true,
      url: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      visibility: true,
    });
    this.globus = new og.Globe({
      target: 'globus', // a HTMLDivElement which its id is `globus`
      name: 'Earth',
      terrain: new og.terrain.GlobusTerrain(),
      layers: [this.osm],
      autoActivated: true
    });
    this.globus.planet.flyLonLat(new og.LonLat(0, 37, 3000000));
    this.miPopUp = new og.Popup({
      planet: this.globus.planet,
      offset:[0,-25],
      visibility: false
    })
  }

  
  @Output() clickComunidad = new EventEmitter<object>(); 

  updateMap(datos, etiqueta, totalNacional){
    this.miPopUp.setVisibility(false);
    if(this.primera){
        this.primera=false;
    }else{
        this.globus.planet.layers.pop();
    }
    fetch("/assets/spain-communities.json")
    .then(r => {
        return r.json();
    }).then(data => {
        var comunidades = new og.layer.Vector("Comunidades", {
            'visibility': true,
            'isBaseLayer': false,
            'diffuse': [0, 0, 0],
            'ambient': [1, 1, 1],
        });
        comunidades.addTo(this.globus.planet);
        var f = data.features;
        f=f.sort((n1,n2) => {
            if (n1.properties.cod_ccaa > n2.properties.cod_ccaa) {
                return 1;
            }
            if (n1.properties.cod_ccaa < n2.properties.cod_ccaa) {
                return -1;
            }
            return 0;
        });
        for (var i = 0; i < f.length; i++) {
            var fi = f[i];
            var valorDato = datos[i];
            var valorMaximo = Math.max(...datos);
            var colorComunidad = this.ValorToColor(valorDato/valorMaximo);
            var stringColorComunidad = "rgba("+colorComunidad[0]+","+colorComunidad[1]+","+colorComunidad[2]+","+colorComunidad[3]+")"
            comunidades.add(new og.Entity({
                'geometry': {
                    'type': fi.geometry.type,
                    'coordinates': fi.geometry.coordinates,
                    'style': {
                        'fillColor': stringColorComunidad,
                        'lineColor': "rgba(128, 128, 128, 1.0)"
                    },
                }
            }));
        }

        

        comunidades.events.on("mouseleave", function (e) {
            e.pickingObject.geometry.setLineColor(0.5, 0.5, 0.5, 1.0);
        });
        comunidades.events.on("mouseenter", function (e) {
            
            e.pickingObject.geometry.bringToFront();
            e.pickingObject.geometry.setLineColor(0, 0, 0, 1.0);
            
        });
        comunidades.events.on("lclick",(e) => {
          //globus.planet.flyExtent(e.pickingObject.geometry.getExtent());
          this.idComunidad = e.pickingObject.id%19; //Módulo porque los ids de las geometries no paran de incrementarse
          this.clickComunidad.emit({id: this.idComunidad});
          var nombreComunidad = this.comunidadList[this.idComunidad];
          var contenidoPopup = nombreComunidad+ "<br/>"+ etiqueta + ": <br/>" + datos[this.idComunidad]
          this.miPopUp.setContent(contenidoPopup);
          let groundPos = this.globus.planet.getCartesianFromMouseTerrain();
          this.miPopUp.setCartesian3v(groundPos);
          this.miPopUp.setVisibility(true);
        });
        comunidades.events.on("touchstart", function (e) {
            this.globus.planet.flyExtent(e.pickingObject.geometry.getExtent());
        });
    });    
  }

  EmitirEvento(){
    this.clickComunidad.emit({id: this.idComunidad});
  }

  ValorToColor(weight) {
    const f = chroma.scale(['red', 'green']).mode('hsv');
    var color = chroma(f(weight).toString());
    return color.alpha(0.7).rgba();
  }

}

