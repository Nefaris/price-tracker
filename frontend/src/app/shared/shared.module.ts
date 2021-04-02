import { NgModule } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TuiButtonModule, TuiColorModule, TuiLinkModule, TuiNotificationsModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiIslandModule } from '@taiga-ui/kit';
import { BaseComponent } from './components/base.component';


const SHARED_COMPONENTS = [
  NavbarComponent,
  BaseComponent
];

const SHARED_MODULES = [
  TuiIslandModule,
  TuiButtonModule,
  TuiLinkModule,
  TuiAvatarModule,
  TuiColorModule,
  TuiNotificationsModule
];

@NgModule({
  declarations: [
    SHARED_COMPONENTS
  ],
  imports: [
    SHARED_MODULES
  ],
  exports: [
    SHARED_COMPONENTS,
    SHARED_MODULES
  ]
})
export class SharedModule {
}
