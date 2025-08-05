import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsManagementDashboard } from './leads-management-dashboard';

describe('LeadsManagementDashboard', () => {
  let component: LeadsManagementDashboard;
  let fixture: ComponentFixture<LeadsManagementDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsManagementDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsManagementDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
