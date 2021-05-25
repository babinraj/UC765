import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { I18nModule } from '../i18n/i18n.module';
import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ImportExportModule } from '../import-export/import-export.module';
import { UsersComponent } from './components/users/users.component';
import { RolesComponent } from './components/roles/roles.component';
import { UserRoleComponent } from './components/user-role/user-role.component';
import { RoleScreenComponent } from './components/role-screen/role-screen.component';
import { SortUserDirective } from '../../directives/sortUser.directive';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MenuComponent } from './components/menu/menu.component';
import { ListComponent } from './components/list/list.component';
import { ScreenComponent } from './components/screen/screen.component';
@NgModule({
  declarations: [LoginComponent, DashboardComponent, UsersComponent, RolesComponent, UserRoleComponent, RoleScreenComponent,SortUserDirective, MenuComponent, ListComponent, ScreenComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    FormsModule,
    I18nModule,
    ImportExportModule,
    Ng2SearchPipeModule
  ]
})
export class UserModule { }
