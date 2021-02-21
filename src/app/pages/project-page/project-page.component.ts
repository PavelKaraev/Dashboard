import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Project } from 'src/app/shared/interfaces/project';
import { PortfolioService } from 'src/app/shared/services/portfolio.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent implements OnInit {
  project: Project;
  warning: boolean = false;
  danger: boolean = false;
  success: boolean = false; 
  primary: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private portfolioService: PortfolioService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap( (params: Params) => {
        return this.portfolioService.getProjectByID(params['id']);
      })
    ).subscribe( (project: Project) => {
      this.project = project;
      this.generateStatus(project.status)
    })
  }

  generateStatus(status: string) {
    switch(status) {
      case "Приостановлен":
        this.danger = true;
        break;
      case "В разработке": 
        this.primary = true;
        break;
      case "Завершен": 
        this.success = true;
        break;
    }
  }

}
