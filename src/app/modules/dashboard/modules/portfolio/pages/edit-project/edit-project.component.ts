import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
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
    private elementRef: ElementRef,
    private changeDetector: ChangeDetectorRef,
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
        repositoryControl: new FormControl(project.repostitory),
        urlControl: new FormControl(project.url),
        categoryControl: new FormControl(project.category),
        statusControl: new FormControl(project.status),
        screenshotsControl: new FormControl(project.screenshotsData)
      })

      if(project.thumbnail) {
        this.thumbnail = project.thumbnail;
      }
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

  changeThumbnail(files) {
    let reader = new FileReader();
    let thumbnail = this.elementRef.nativeElement.querySelector('#thumbnail-label');

    if(files && files.length) {
      const [file] = files;
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.editProjectForm.patchValue({
          thumbnailControl: file
        });
        thumbnail.classList.add('upload__label_not-empty');
        this.preview = reader.result;
      }

      this.changeDetector.markForCheck();
    } else {
      this.editProjectForm.patchValue({
        thumnailControl: ''
      });
      thumbnail.classList.remove('upload__label_not-empty');
      this.preview = null
    }
  }

  removeThumbnail() {
    let thumbnail = this.elementRef.nativeElement.querySelector('#thumbnail-label');
    this.editProjectForm.patchValue({
      thumnailControl: ''
    });
    thumbnail.classList.remove('upload__label_not-empty');
    this.preview = null
  }

  changeScreenshots(files) {
    if(files && files.length) {
      for(let file of files) {
        let reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
          this.screenshotsPreview.push(reader.result)
        }
        this.screenshotsData.push(file)
      }
    } else {
      this.screenshots.length = 0
    }
  }

  removeScreenshot(id) {
    this.screenshots.splice(id, 1);
  }

  uploadThumbnail(): Promise<string> {
    return new Promise( resolve => {
      this.portfolioService.uploadImage(this.editProjectForm.value.titleControl, this.editProjectForm.value.thumbnailControl, 'thumbnail')
      .subscribe( url => {
        resolve(url);
      })
    })
  }

  uploadScreenshots(file: File): Promise<string> {
    return new Promise( resolve => {
      this.portfolioService.uploadImage(this.editProjectForm.value.titleControl, file, 'screenshots')
        .subscribe( (url: string) => {
          resolve(url);
        })
      
    })
  }

  async editProject(id: string) {
    if(this.editProjectForm.invalid) {
      console.log(this.editProjectForm);
      return;
    }

    if (this.editProjectForm.value.thumbnailControl) {
      this.thumbnail = await this.uploadThumbnail();
    }

    if(this.screenshots.length) {
      for(const file of this.screenshotsData) {
        this.screenshots.push(await this.uploadScreenshots(file));
      }
    }
    

    const project: Project = {
      title: this.editProjectForm.value.titleControl,
      description: this.editProjectForm.value.descriptionControl,
      thumbnail: this.thumbnail,
      thumbnailData: this.thumbnailData,
      screenshots: this.screenshots,
      screenshotsData: this.screenshotsData,
      date: new Date(this.editProjectForm.value.dateControl),
      repostitory: this.editProjectForm.value.repositoryControl,
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
