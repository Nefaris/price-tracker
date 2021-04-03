import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SettingsPageComponent } from './pages/dashboard-page/pages/settings-page/settings-page.component';
import { TrackedItemsPageComponent } from './pages/dashboard-page/pages/tracked-items-page/tracked-items-page.component';


@NgModule({
  declarations: [DashboardPageComponent, SettingsPageComponent, TrackedItemsPageComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule {
}
