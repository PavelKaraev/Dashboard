import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Project } from 'src/app/shared/interfaces/project';
import { PortfolioService } from 'src/app/shared/services/portfolio.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {
  screenshots: string[] = [];
  screenshotsData: File[] = [];
  preview: string | ArrayBuffer;
  screenshotsPreview = [];
  thumbnail: {};
  thumbnailData: File;
  category: string;
  createProjectForm: FormGroup

  constructor(
    private portfolioService: PortfolioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createProjectForm = new FormGroup({
       titleControl: new FormControl('', Validators.required),
       descriptionControl: new FormControl('', Validators.required),
       thumbnailControl: new FormControl('', Validators.required),
       dateControl: new FormControl(null),
       repositoryControl: new FormControl(''),
       urlControl: new FormControl(''),
       categoryControl: new FormControl(null),
       statusControl: new FormControl(null)
    })
  }

  get title() {
    return this.createProjectForm.get('titleControl');
  }
  
  get description() {
    return this.createProjectForm.get('descriptionControl');
  }

  get thumb() {
    return this.createProjectForm.get('thumbnailControl');
  }

  setThumbnail(image): void {
    this.thumbnail = image;

    this.createProjectForm.patchValue({
      thumbnailControl: image
    });
  }

  createProject() {
    if(this.createProjectForm.invalid) {
      return;
    }

    const project: Project = {
      title: this.createProjectForm.value.titleControl,
      description: this.createProjectForm.value.descriptionControl,
      thumbnail: this.thumbnail,
      thumbnailData: this.thumbnailData,
      screenshots: this.screenshots,
      screenshotsData: this.screenshotsData,
      date: new Date(this.createProjectForm.value.dateControl),
      repository: this.createProjectForm.value.repositoryControl,
      url: this.createProjectForm.value.urlControl,
      category: this.createProjectForm.value.categoryControl,
      status: this.createProjectForm.value.statusControl
    }

    this.portfolioService.addPost(project).subscribe( () => {
      this.createProjectForm.reset();
      this.router.navigate(['/dashboard', 'portfolio'])
    })
  }
}
