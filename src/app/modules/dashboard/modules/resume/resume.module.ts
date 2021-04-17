import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ResumeComponent } from './resume/resume.component';
import { RouterModule, Routes } from '@angular/router';
import { WorkComponent } from './pages/work/work.component';
import { NewWorkComponent } from './pages/new-work/new-work.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EditWorkComponent } from './pages/edit-work/edit-work.component';
import { TimeDifferencePipe } from 'src/app/shared/pipes/time-difference.pipe';


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
      },
      {
        path: 'work/edit/:id',
        component: EditWorkComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    ResumeComponent, 
    NewWorkComponent,
    WorkComponent,
    EditWorkComponent,
    TimeDifferencePipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[
    RouterModule,
    SharedModule
  ],
  providers: [DatePipe]
})
export class ResumeModule { }
