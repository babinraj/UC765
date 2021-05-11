import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'domains', loadChildren: () => import('./domains/domains.module').then(m => m.DomainsModule) },
  { path: 'routemodel', loadChildren: () => import('./route-model/route-model.module').then(m => m.RouteModelModule) },
  { path: 'app', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full'
  },
  { path: 'pagenotfound', component: PageNotFoundComponent },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'pagenotfound',
  },
];

/* @NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
}) */
@NgModule({
 imports: [RouterModule.forRoot(routes, { useHash: true })],
 exports: [RouterModule]
})
export class AppRoutingModule { }
