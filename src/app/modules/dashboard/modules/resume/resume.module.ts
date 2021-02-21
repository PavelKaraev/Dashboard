import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeComponent } from './resume/resume.component';
import { RouterModule, Routes } from '@angular/router';
import { WorkComponent } from './pages/work/work.component';
import { NewWorkComponent } from './pages/new-work/new-work.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { 
    path: '', 
    component: ResumeComponent,
    children: [
      {
        path: '',
        redirectTo: 'work',
        component: WorkComponent,
      },
      {
        path: 'work',
        component: WorkComponent
      },
      {
        path: 'work/new',
        component: NewWorkComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    ResumeComponent, 
    NewWorkComponent,
    WorkComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports:[
    RouterModule,
    SharedModule
  ]
})
export class ResumeModule { }
