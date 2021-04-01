import { NgModule } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TuiButtonModule, TuiColorModule, TuiLinkModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiIslandModule } from '@taiga-ui/kit';


const SHARED_COMPONENTS = [
  NavbarComponent
];

const SHARED_MODULES = [
  TuiIslandModule,
  TuiButtonModule,
  TuiLinkModule,
  TuiAvatarModule,
  TuiColorModule
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
