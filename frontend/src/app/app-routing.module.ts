import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoggedInGuard } from './core/guards/logged-in.guard';


const routes: Routes = [
  {
    path: 'auth',
    canActivate: [LoggedInGuard],
    loadChildren: () => import('./modules/authorization/authorization.module').then(m => m.AuthorizationModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {path: 'login', redirectTo: 'auth'},
  {path: '', pathMatch: 'full', redirectTo: 'auth'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
