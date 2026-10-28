import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProdutosAdmin } from './produtos-admin';

describe('ProdutosAdmin', () => {
  let component: ProdutosAdmin;
  let fixture: ComponentFixture<ProdutosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutosAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutosAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
