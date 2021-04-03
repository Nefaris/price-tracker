import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { TrackedItemsPageComponent } from './pages/dashboard-page/pages/tracked-items-page/tracked-items-page.component';
import { SettingsPageComponent } from './pages/dashboard-page/pages/settings-page/settings-page.component';


const routes: Routes = [
  {
    path: '', component: DashboardPageComponent,
    children: [
      {path: 'tracked-items', component: TrackedItemsPageComponent},
      {path: 'settings', component: SettingsPageComponent},
      {path: '', pathMatch: 'full', redirectTo: 'tracked-items'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
