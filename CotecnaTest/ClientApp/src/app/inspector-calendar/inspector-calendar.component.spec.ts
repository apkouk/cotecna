import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectorCalendarComponent } from './inspector-calendar.component';

describe('InspectorCalendarComponent', () => {
  let component: InspectorCalendarComponent;
  let fixture: ComponentFixture<InspectorCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectorCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectorCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
