import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsContactWidgetComponent } from './clients-contact-widget-component';

describe('ClientsContactWidgetComponent', () => {
  let component: ClientsContactWidgetComponent;
  let fixture: ComponentFixture<ClientsContactWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsContactWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsContactWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
