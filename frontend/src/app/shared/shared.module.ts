import { NgModule } from '@angular/core';
import { TuiButtonModule, TuiColorModule, TuiLinkModule, TuiNotificationsModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiFieldErrorModule, TuiInputModule, TuiInputPasswordModule, TuiIslandModule } from '@taiga-ui/kit';
import { BaseComponent } from './components/base.component';
import { ReactiveFormsModule } from '@angular/forms';


const SHARED_COMPONENTS = [
  BaseComponent
];

const SHARED_MODULES = [
  ReactiveFormsModule,
  TuiIslandModule,
  TuiButtonModule,
  TuiLinkModule,
  TuiAvatarModule,
  TuiColorModule,
  TuiNotificationsModule,
  TuiInputModule,
  TuiInputPasswordModule,
  TuiFieldErrorModule
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
