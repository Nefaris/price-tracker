import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  iconsPathFactory,
  TUI_ICONS_PATH, TuiButtonModule, TuiLinkModule,
  TuiModeModule,
  TuiNotificationsModule,
  TuiRootModule,
  TuiThemeNightModule
} from '@taiga-ui/core';
import { TuiAvatarModule, TuiIslandModule } from '@taiga-ui/kit';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TuiRootModule,
    TuiNotificationsModule,
    TuiIslandModule,
    TuiButtonModule,
    TuiLinkModule,
    TuiAvatarModule
  ],
  providers: [
    {provide: TUI_ICONS_PATH, useValue: iconsPathFactory('assets/taiga-ui/icons/')}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
