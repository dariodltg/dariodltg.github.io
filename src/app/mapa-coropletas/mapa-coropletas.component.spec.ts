import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaCoropletasComponent } from './mapa-coropletas.component';

describe('MapaCoropletasComponent', () => {
  let component: MapaCoropletasComponent;
  let fixture: ComponentFixture<MapaCoropletasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaCoropletasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaCoropletasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
