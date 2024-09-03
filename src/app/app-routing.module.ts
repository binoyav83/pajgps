import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'map',
    canActivate: [AuthGuard],
    loadChildren: () => import('./map/map.module').then(m => m.MapPageModule)
  },
  {
    path: 'device-list',
    canActivate: [AuthGuard],
    loadChildren: () => import('./device-list/device-list.module').then(m => m.DeviceListPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
