import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminInventoryService } from './admin-inventory.service';
import { AdminInventoryComponent } from './inventory.component';

describe('AdminInventoryComponent', () => {
  let component: AdminInventoryComponent;
  let fixture: ComponentFixture<AdminInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInventoryComponent],
      providers: [{ provide: AdminInventoryService, useValue: { list: () => of([]) } }],
    }).compileComponents();
    fixture = TestBed.createComponent(AdminInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
});
