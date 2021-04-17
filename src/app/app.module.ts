import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Provider } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './modules/dashboard/shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { AngularFireModule } from '@angular/fire';
import { firebaseConfig } from 'src/environments/environment';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';

import ruLocale from '@angular/common/locales/ru';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './modules/dashboard/shared/services/auth.interceptor';
import { AuthService } from './modules/shared/services/auth.service';
import { registerLocaleData } from '@angular/common';
import { ProjectPageComponent } from './pages/project-page/project-page.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { TimeDifferencePipe } from './shared/pipes/time-difference.pipe';

registerLocaleData(ruLocale, 'ru');

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthInterceptor
}

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ProjectCardComponent,
    ProjectPageComponent,
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    QuillModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
  ],
  exports: [
    SharedModule,
    QuillModule
  ],
  providers: [
    AuthService,
    INTERCEPTOR_PROVIDER
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
