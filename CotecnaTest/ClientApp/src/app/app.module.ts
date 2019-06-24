import { BrowserModule, Title} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { InspectorCalendarComponent } from './inspector-calendar/inspector-calendar.component';
import { WeatherService } from 'src/app/services/weather/weather-service';
import { WeatherServiceResolver } from './services/weather/weather-service-resolver';

@NgModule({
  declarations: [
    AppComponent,
    InspectorCalendarComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    MatSelectModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {
        path: '', component: InspectorCalendarComponent,
        pathMatch: 'full',
        resolve: { weatherServiceResolver: WeatherServiceResolver }
      }
    ])
  ],
  providers: [Title, WeatherService, WeatherServiceResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
