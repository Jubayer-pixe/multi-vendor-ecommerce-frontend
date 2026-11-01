import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { WithdrawalsComponent } from './withdrawals.component';

describe('WithdrawalsComponent', () => {
  let component: WithdrawalsComponent;
  let fixture: ComponentFixture<WithdrawalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawalsComponent],
      providers: [{ provide: HttpClient, useValue: { get: () => of([]) } }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WithdrawalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
