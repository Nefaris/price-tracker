import { NgModule } from '@angular/core';
import {
  TuiButtonModule,
  TuiColorModule, TuiLabelModule,
  TuiLinkModule,
  TuiNotificationsModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import {
  TuiAvatarModule, TuiBadgeModule,
  TuiFieldErrorModule,
  TuiInputModule, TuiInputNumberModule,
  TuiInputPasswordModule,
  TuiIslandModule,
  TuiTabsModule,
  TuiToggleModule
} from '@taiga-ui/kit';
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
  TuiFieldErrorModule,
  TuiToggleModule,
  TuiTabsModule,
  TuiSvgModule,
  TuiLabelModule,
  TuiInputNumberModule,
  TuiBadgeModule
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
