import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/shared/interfaces/project';
import { PortfolioService } from 'src/app/shared/services/portfolio.service';

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss']
})
export class ProjectsPageComponent implements OnInit, OnDestroy {
  projects: Project[];
  projectsSub: Subscription;
  deleteSub: Subscription;
  searchString: string = '';


  constructor(
    private portfolioService: PortfolioService
  ) { }

  ngOnInit(): void {
    this.getProjects()
  }

  ngOnDestroy(): void {
    if(this.projectsSub) {
      this.projectsSub.unsubscribe()
    }
    if(this.deleteSub) {
      this.deleteSub.unsubscribe()
    }
  }
  
  getProjects() {
    this.projectsSub = this.portfolioService.getProjects()
      .subscribe( (projects: Project[]) => {
        this.projects = projects;
      })
  }

  removeProject(id: string) {
    this.deleteSub = this.portfolioService.deleteProject(id).subscribe(
      () => {
        this.projects = this.projects.filter( project => project.id !== id );
      }
    )
  }

  getSuccess(status: string): boolean {
    return status === "Завершен";
  }

  getDevelop(status: string): boolean {
    return status === "В разработке";
  }

  getStop(status: string): boolean {
    return status === "Приостановлен";
  }
}
