import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoSectoresComponent } from './grafico-sectores.component';

describe('GraficoSectoresComponent', () => {
  let component: GraficoSectoresComponent;
  let fixture: ComponentFixture<GraficoSectoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoSectoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoSectoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
