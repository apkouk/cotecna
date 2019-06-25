import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayWeatherInfoComponent } from './day-weather-info.component';

describe('DayWeatherInfoComponent', () => {
  let component: DayWeatherInfoComponent;
  let fixture: ComponentFixture<DayWeatherInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DayWeatherInfoComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayWeatherInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
