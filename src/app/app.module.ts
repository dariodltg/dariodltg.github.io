import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapaCoropletasComponent } from './mapa-coropletas/mapa-coropletas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraficoBarrasComponent } from './grafico-barras/grafico-barras.component';
import { GraficoSectoresComponent } from './grafico-sectores/grafico-sectores.component';
import { MenuFiltrosComponent } from './menu-filtros/menu-filtros.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { DashComponent } from './dash/dash.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { CardComponent } from './card/card.component';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [
    AppComponent,
    MapaCoropletasComponent,
    GraficoBarrasComponent,
    GraficoSectoresComponent,
    MenuFiltrosComponent,
    DashComponent,
    CardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
