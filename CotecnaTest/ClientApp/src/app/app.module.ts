import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from "@angular/material/icon";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { InspectorCalendarComponent } from './inspector-calendar/inspector-calendar.component';
import { DayWeatherInfoComponent } from './inspector-calendar/day-weather-info/day-weather-info.component'
import { WeatherService } from 'src/app/services/weather/weather-service';
import { GetWeatherByZipCodeService } from './services/weather/getWeatherByZipCode.resolver';
import { GetWeatherByLocationService } from './services/weather/getWeatherByLocation.resolver';

@NgModule({
  declarations: [
    AppComponent,
    InspectorCalendarComponent,
    DayWeatherInfoComponent
  ],
  entryComponents: [DayWeatherInfoComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    RouterModule.forRoot([
      {
        path: '', component: InspectorCalendarComponent,
        pathMatch: 'full',
        resolve: { getWeatherByZipCodeService: GetWeatherByZipCodeService, getWeatherByLocationService: GetWeatherByLocationService }
        
      }
    ])
  ],
  providers: [Title, WeatherService, GetWeatherByZipCodeService, GetWeatherByLocationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
