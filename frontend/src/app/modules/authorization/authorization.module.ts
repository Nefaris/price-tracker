import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SharedModule } from '../../shared/shared.module';
import { AuthorizationRoutingModule } from './authorization-routing.module';


@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    CommonModule,
    AuthorizationRoutingModule,
    SharedModule
  ]
})
export class AuthorizationModule {
}
