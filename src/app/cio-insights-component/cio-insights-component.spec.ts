import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CioInsightsComponent } from './cio-insights-component';

describe('CioInsightsComponent', () => {
  let component: CioInsightsComponent;
  let fixture: ComponentFixture<CioInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CioInsightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CioInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
