import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Project } from 'src/app/shared/interfaces/project';
import { PortfolioService } from 'src/app/shared/services/portfolio.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {
  editProjectForm: FormGroup;
  project: Project;
  preview;
  screenshotsPreview: Array<string | ArrayBuffer> = [];
  thumbnail: string;
  thumbnailData: File;
  screenshots: string[] = [];
  screenshotsData: File[];

  constructor(
    private route: ActivatedRoute,
    private portfolioService: PortfolioService,
    private datePipe: DatePipe,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap( (params: Params) => {
        return this.portfolioService.getProjectByID(params['id']);
      })
    ).subscribe( (project: Project) => {
      this.project = project;

      this.editProjectForm = new FormGroup({
        titleControl: new FormControl(project.title, Validators.required),
        descriptionControl: new FormControl(project.description, Validators.required),
        thumbnailControl: new FormControl(project.thumbnailData),
        dateControl: new FormControl(this.datePipe.transform(project.date, 'yyyy-MM-dd')),
        repositoryControl: new FormControl(project.repository),
        urlControl: new FormControl(project.url),
        categoryControl: new FormControl(project.category),
        statusControl: new FormControl(project.status),
        screenshotsControl: new FormControl(project.screenshotsData)
      })


      if(project.screenshots) {
        this.screenshots = project.screenshots;
      }
    })
  }

  get title() {
    return this.editProjectForm.get('titleControl');
  }
  
  get description() {
    return this.editProjectForm.get('descriptionControl');
  }

  get thumb() {
    return this.editProjectForm.get('thumbnailControl');
  }

  setThumbnail(image): void {
    this.thumbnail = image;

    this.editProjectForm.patchValue({
      thumbnailControl: image
    });
  }

  async editProject(id: string) {
    if(this.editProjectForm.invalid) {
      console.log(this.editProjectForm);
      return;
    }    

    const project: Project = {
      title: this.editProjectForm.value.titleControl,
      description: this.editProjectForm.value.descriptionControl,
      thumbnail: this.thumbnail,
      thumbnailData: this.thumbnailData,
      screenshots: this.screenshots,
      screenshotsData: this.screenshotsData,
      date: new Date(this.editProjectForm.value.dateControl),
      repository: this.editProjectForm.value.repositoryControl,
      url: this.editProjectForm.value.urlControl,
      category: this.editProjectForm.value.categoryControl,
      status: this.editProjectForm.value.statusControl
    }

    this.portfolioService.updateProject(project, id).subscribe( () => {
      console.log('project update')
      this.router.navigate(['/dashboard', 'portfolio'])
    })
  }

  removeProject(id: string) {
    this.portfolioService.deleteProject(id).subscribe(
      () => {
        this.router.navigate(['/dashboard', 'portfolio']);
      }
    )
  }

}
