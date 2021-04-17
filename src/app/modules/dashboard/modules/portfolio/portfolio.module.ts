import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortfolioComponent } from './portfolio.component';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { NewProjectComponent } from './pages/new-project/new-project.component';
import { SharedModule } from '../../shared/shared.module';
import { EditProjectComponent } from './pages/edit-project/edit-project.component';
import { SearchPipe } from '../../shared/pipes/search.pipe';

const routes: Routes = [
  { 
    path: '', 
    component: PortfolioComponent,
    children: [
      {
        path: '',
        redirectTo: 'portfolio',
        component: ProjectsPageComponent
      },
      {
        path: '',
        component: ProjectsPageComponent
      },
      {
        path: 'project/new',
        component: NewProjectComponent
      },
      {
        path: 'project/edit/:id',
        component: EditProjectComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    PortfolioComponent, 
    NewProjectComponent,
    ProjectsPageComponent,
    EditProjectComponent,
    SearchPipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [DatePipe]
})
export class PortfolioModule { }
