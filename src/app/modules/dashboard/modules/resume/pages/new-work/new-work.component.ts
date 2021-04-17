import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Work } from 'src/app/shared/interfaces/work';
import { WorkService } from 'src/app/shared/services/work.service';

@Component({
  selector: 'app-new-work',
  templateUrl: './new-work.component.html',
  styleUrls: ['./new-work.component.scss']
})
export class NewWorkComponent implements OnInit {
  logo: string;
  newWorkForm: FormGroup;

  constructor(
    private work: WorkService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.newWorkForm = new FormGroup({
      companyControl: new FormControl('', Validators.required),
      logoControl: new FormControl(null),
      cityControl: new FormControl('', Validators.required),
      positionControl: new FormControl('', Validators.required),
      descriptionControl: new FormControl('', Validators.required),
      dateFromControl: new FormControl(null, Validators.required),
      dateToControl: new FormControl(null, Validators.required)
    })
  }

  setThumbnail(image): void {
    this.logo = image;

    this.newWorkForm.patchValue({
      logoControl: image
    });
  }

  onAddWork(): void {
    event.preventDefault();
    console.log(this.newWorkForm);
    if(this.newWorkForm.invalid) {
      return;
    }

    const work: Work = {
      company: this.newWorkForm.value.companyControl,
      logo: this.newWorkForm.value.logoControl,
      city: this.newWorkForm.value.cityControl,
      position: this.newWorkForm.value.positionControl,
      description: this.newWorkForm.value.descriptionControl,
      dateFrom: new Date(this.newWorkForm.value.dateFromControl),
      dateTo: new Date(this.newWorkForm.value.dateToControl)
    }

    this.work.addWork(work).subscribe( () => {
      this.newWorkForm.reset();
      this.router.navigate(['/dashboard', 'resume', 'work'])
    })
  }


}
