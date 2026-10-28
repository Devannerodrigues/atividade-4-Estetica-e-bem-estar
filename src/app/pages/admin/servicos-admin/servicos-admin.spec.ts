import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicosAdmin } from './servicos-admin';

describe('ServicosAdmin', () => {
  let component: ServicosAdmin;
  let fixture: ComponentFixture<ServicosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicosAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicosAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
