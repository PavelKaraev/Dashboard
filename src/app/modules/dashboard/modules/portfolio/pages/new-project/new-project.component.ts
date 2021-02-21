import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  thumbnail: string;
  thumbnailData: File;
  category: string;
  createProjectForm: FormGroup

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
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

  changeThumbnail(files) {
    let reader = new FileReader();
    let thumbnail = this.elementRef.nativeElement.querySelector('#thumbnail-label');

    if(files && files.length) {
      const [file] = files;
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.createProjectForm.patchValue({
          thumbnailControl: file
        });
        thumbnail.classList.add('upload__label_not-empty');
        this.preview = reader.result;
        this.thumbnailData = file;
      }

      this.changeDetector.markForCheck();
    } else {
      this.createProjectForm.patchValue({
        thumnailControl: null
      });
      thumbnail.classList.remove('upload__label_not-empty');
      this.preview = null
    }
  }

  removeThumbnail() {
    let thumbnail = this.elementRef.nativeElement.querySelector('#thumbnail-label');
    this.createProjectForm.patchValue({
      thumnailControl: null
    });
    thumbnail.classList.remove('upload__label_not-empty');
    this.thumbnail = null
  }

  changeScreenshots(files) {
    if(files && files.length) {
      for(let file of files) {
        let reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
          this.screenshotsPreview.push(reader.result)
          
        }
        this.screenshotsData.push(file);
      }
    } else {
      this.screenshotsPreview.length = 0
    }
  }

  removeScreenshot(id) {
    this.screenshotsPreview.splice(id, 1);
  }

  uploadThumbnail(): Promise<string> {
    return new Promise( resolve => {
      this.portfolioService.uploadImage(this.createProjectForm.value.titleControl, this.createProjectForm.value.thumbnailControl, 'thumbnail')
      .subscribe( url => {
        resolve(url);
      })
    })
  }

  uploadScreenshots(file: File): Promise<string> {
    return new Promise( resolve => {
      this.portfolioService.uploadImage(this.createProjectForm.value.titleControl, file, 'screenshots')
        .subscribe( (url: string) => {
          resolve(url);
        })
    })
  }

  async createProject() {
    if(this.createProjectForm.invalid) {
      return;
    }

    if (this.createProjectForm.value.thumbnailControl) {
      this.thumbnail = await this.uploadThumbnail();
    }

    if(this.screenshotsPreview.length) {
      for(const file of this.screenshotsData) {
        this.screenshots.push(await this.uploadScreenshots(file));
      }
    }

    const project: Project = {
      title: this.createProjectForm.value.titleControl,
      description: this.createProjectForm.value.descriptionControl,
      thumbnail: this.thumbnail,
      thumbnailData: this.thumbnailData,
      screenshots: this.screenshots,
      screenshotsData: this.screenshotsData,
      date: new Date(this.createProjectForm.value.dateControl),
      repostitory: this.createProjectForm.value.repositoryControl,
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
