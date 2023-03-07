import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuFiltrosComponent } from './menu-filtros.component';

describe('MenuFiltrosComponent', () => {
  let component: MenuFiltrosComponent;
  let fixture: ComponentFixture<MenuFiltrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuFiltrosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuFiltrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
