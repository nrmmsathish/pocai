import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularWaveformComponent } from './circular-waveform-component';

describe('CircularWaveformComponent', () => {
  let component: CircularWaveformComponent;
  let fixture: ComponentFixture<CircularWaveformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircularWaveformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircularWaveformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
