import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  iconsPathFactory,
  TUI_ICONS_PATH,
  TuiRootModule,
} from '@taiga-ui/core';
import { SharedModule } from './shared/shared.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TuiRootModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireMessagingModule,
    AngularFireAuthModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production, registrationStrategy: 'registerImmediately'})
  ],
  providers: [
    {provide: TUI_ICONS_PATH, useValue: iconsPathFactory('assets/taiga-ui/icons/')}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
