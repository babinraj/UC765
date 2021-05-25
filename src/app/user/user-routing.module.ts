import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/services/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { RolesComponent } from './components/roles/roles.component';
import { UserRoleComponent } from './components/user-role/user-role.component';
import { RoleScreenComponent } from './components/role-screen/role-screen.component';

const routes: Routes = [
  { path: 'login/:language', component: LoginComponent },
  { path: 'dashboard/:language', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'users/:language', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'roles/:language', component: RolesComponent, canActivate: [AuthGuard] },
  { path: 'user-role/:language', component: UserRoleComponent, canActivate: [AuthGuard] },
  { path: 'role-screen/:language', component: RoleScreenComponent, canActivate: [AuthGuard] },
  {
    path: '',
    redirectTo: 'login/en',
    pathMatch: 'full'
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
