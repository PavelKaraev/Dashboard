import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AsideNavigationComponent } from './components/aside-navigation/aside-navigation.component';
import { AuthGuard } from './shared/services/auth.guard';
import { SharedModule } from './shared/shared.module';
import { AuthService } from '../shared/services/auth.service';

@NgModule({
  declarations: [
    DashboardComponent,
    AsideNavigationComponent,
  ],
  providers: [
    AuthGuard,
    AuthService,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
  ]
})
export class DashboardModule { }
