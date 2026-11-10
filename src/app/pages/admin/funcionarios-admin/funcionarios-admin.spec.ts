import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuncionariosAdmin } from './funcionarios-admin';

describe('FuncionariosAdmin', () => {
  let component: FuncionariosAdmin;
  let fixture: ComponentFixture<FuncionariosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionariosAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(FuncionariosAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
