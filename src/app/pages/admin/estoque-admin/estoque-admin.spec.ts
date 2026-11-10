import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstoqueAdmin } from './estoque-admin';

describe('EstoqueAdmin', () => {
  let component: EstoqueAdmin;
  let fixture: ComponentFixture<EstoqueAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstoqueAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(EstoqueAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
