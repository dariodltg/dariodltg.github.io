import { Component, OnInit } from '@angular/core';
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

  updateMap(datos, etiqueta, totalNacional){
    //console.log(this.globus.planet.layers.length);
    //console.log(this.globus.planet.layers[0]);
    //console.log(this.globus.planet.layers[1]);
    //this.globus.planet.layers = this.globus.planet.layers.slice[-1];

    if(this.primera){
        this.primera=false;
        console.log(this.primera);
    }else{
        console.log(this.globus.planet.layers.pop());
        console.log(this.primera);
    }
    
    console.log("ACTUALIZAR MAPA COROPLETAS");
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
        for (var i = 0; i < f.length; i++) {
            var fi = f[i];
            //TODO Cuidado con la correspondencia en el orden de las comunidades que aquí cambia
            var valorDato = datos[i];
            //console.log(valorDato);
            //console.log(totalNacional);
            var colorComunidad = this.ValorToColor(valorDato/totalNacional);
            //console.log(colorComunidad);
            //console.log(fi);
            countries.add(new og.Entity({
                'geometry': {
                    'type': fi.geometry.type,
                    'coordinates': fi.geometry.coordinates,
                    'style': {
                        'fillColor': colorComunidad,
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
        countries.events.on("lclick", function (e) {
            //globus.planet.flyExtent(e.pickingObject.geometry.getExtent());
            //TODO Seleccionar comunidad mediante click
            console.log(e.pickingObject.id);
        });
        countries.events.on("touchstart", function (e) {
            this.globus.planet.flyExtent(e.pickingObject.geometry.getExtent());
        });
    });    
  }

  ValorToColor(weight) {
    const f = chroma.scale(['#f00', '#0f0']).mode('lrgb');
    //console.log(f(weight).toString());
    var color = chroma(f(weight).toString());
    //console.log(color.hex());
    color = color;
    return color.rgba();
}
}

