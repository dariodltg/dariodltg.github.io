import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'igev-prototipo';

  async getDatosCsv() {
    const url = "/assets/total_sectores_2021.csv";
    const response = await fetch(url);
    const datos = await response.text();
    console.log(datos);
   }
}
