import { Component, OnInit } from '@angular/core';
import * as og from "@openglobus/og";

@Component({
  selector: 'app-mapa-coropletas',
  templateUrl: './mapa-coropletas.component.html',
  styleUrls: ['./mapa-coropletas.component.css']
})
export class MapaCoropletasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const osm = new og.layer.XYZ('OpenStreetMap', {
      isBaseLayer: true,
      url: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      visibility: true,
    });
    const globus = new og.Globe({
      target: 'globus', // a HTMLDivElement which its id is `globus`
      name: 'Earth',
      terrain: new og.terrain.GlobusTerrain(),
      layers: [osm],
      autoActivated: true
    });
    globus.planet.flyLonLat(new og.LonLat(0, 37, 3000000));


    fetch("/assets/spain-communities.json")
            .then(r => {
                return r.json();
            }).then(data => {
                var countries = new og.layer.Vector("Countries", {
                    'visibility': true,
                    'isBaseLayer': false,
                    'diffuse': [0, 0, 0],
                    'ambient': [1, 1, 1]
                });

                countries.addTo(globus.planet);

                var f = data.features;
                for (var i = 0; i < f.length; i++) {
                    var fi = f[i];
                    countries.add(new og.Entity({
                        'geometry': {
                            'type': fi.geometry.type,
                            'coordinates': fi.geometry.coordinates,
                            'style': {
                                'fillColor': "rgba(255,255,255,0.6)"
                            }
                        }
                    }));
                }

                countries.events.on("mouseleave", function (e) {
                    e.pickingObject.geometry.setFillColor(1, 1, 1, 0.6);
                    e.pickingObject.geometry.setLineColor(0.2, 0.6, 0.8, 1.0);
                });
                countries.events.on("mouseenter", function (e) {
                    e.pickingObject.geometry.bringToFront();
                    e.pickingObject.geometry.setFillColor(1, 0, 0, 0.4);
                    e.pickingObject.geometry.setLineColor(1, 0, 0, 1.0);
                });
                countries.events.on("lclick", function (e) {
                    globus.planet.flyExtent(e.pickingObject.geometry.getExtent());
                });
                countries.events.on("touchstart", function (e) {
                    globus.planet.flyExtent(e.pickingObject.geometry.getExtent());
                });
            });
  }

}
