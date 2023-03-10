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
  
  osm;
  globus;
  primera : boolean = true;
  idComunidad: number;

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
  }

  @Output() clickComunidad = new EventEmitter<object>(); 

  updateMap(datos, etiqueta, totalNacional){
    if(this.primera){
        this.primera=false;
    }else{
        this.globus.planet.layers.pop();
    }
    fetch("/assets/spain-communities.json")
    .then(r => {
        return r.json();
    }).then(data => {
        var countries = new og.layer.Vector("Comunidades", {
            'visibility': true,
            'isBaseLayer': false,
            'diffuse': [0, 0, 0],
            'ambient': [1, 1, 1]
        });

        countries.addTo(this.globus.planet);
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

            var colorComunidad = this.ValorToColor(valorDato/totalNacional);
            var stringColorComunidad = "rgba("+colorComunidad[0]+","+colorComunidad[1]+","+colorComunidad[2]+","+colorComunidad[3]+")"
            countries.add(new og.Entity({
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

        countries.events.on("mouseleave", function (e) {
            e.pickingObject.geometry.setLineColor(0.5, 0.5, 0.5, 1.0);
        });
        countries.events.on("mouseenter", function (e) {
            e.pickingObject.geometry.bringToFront();
            e.pickingObject.geometry.setLineColor(0, 0, 0, 1.0);
        });
        countries.events.on("lclick",(e) => {
            //globus.planet.flyExtent(e.pickingObject.geometry.getExtent());
            this.idComunidad = e.pickingObject.id%19; //Módulo porque los ids de las geometries no paran de incrementarse
            this.clickComunidad.emit({id: this.idComunidad});
        });
        countries.events.on("touchstart", function (e) {
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

