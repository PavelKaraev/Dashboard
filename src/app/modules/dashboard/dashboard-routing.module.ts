import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from './shared/services/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    component: DashboardComponent,
    children: [
      {
        path: 'portfolio',
        loadChildren: () => import('./modules/portfolio/portfolio.module').then(m => m.PortfolioModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'resume',
        loadChildren: () => import('./modules/resume/resume.module').then(m => m.ResumeModule),
        canActivate: [AuthGuard]
      }
    ]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
