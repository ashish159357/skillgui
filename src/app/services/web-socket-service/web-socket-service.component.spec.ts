import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebSocketServiceComponent } from './web-socket-service.component';

describe('WebSocketServiceComponent', () => {
  let component: WebSocketServiceComponent;
  let fixture: ComponentFixture<WebSocketServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebSocketServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebSocketServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
