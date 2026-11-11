import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriaService } from './categoria-service';

describe('CategoriaService', () => {
  let component: CategoriaService;
  let fixture: ComponentFixture<CategoriaService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaService],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriaService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
