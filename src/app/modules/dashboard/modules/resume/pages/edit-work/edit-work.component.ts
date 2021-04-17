import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Work } from 'src/app/shared/interfaces/work';
import { WorkService } from 'src/app/shared/services/work.service';

@Component({
  selector: 'app-edit-work',
  templateUrl: './edit-work.component.html',
  styleUrls: ['./edit-work.component.scss']
})
export class EditWorkComponent implements OnInit {
  editWorkForm: FormGroup;
  logo: string;
  workExp: Work;

  constructor(
    private work: WorkService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.route.params.pipe(
      switchMap( (params: Params) => {
        return this.work.getWorkExperienceByID(params['id']);
      })
    ).subscribe(
      (workExp) => {
        this.workExp = workExp;

        this.onInitEditForm(workExp);
      }
    )
  }

  onInitEditForm(workExp): void {
    this.editWorkForm = new FormGroup({
      companyControl: new FormControl(workExp.company, Validators.required),
      logoControl: new FormControl(workExp.logo),
      cityControl: new FormControl(workExp.city, Validators.required),
      positionControl: new FormControl(workExp.position, Validators.required),
      descriptionControl: new FormControl(workExp.description, Validators.required),
      dateFromControl: new FormControl(this.datePipe.transform(workExp.dateFrom, 'yyyy-MM-dd'), Validators.required),
      dateToControl: new FormControl(this.datePipe.transform(workExp.dateTo, 'yyyy-MM-dd'), Validators.required)
    })
  }

  setThumbnail(image): void {
    this.logo = image;

    this.editWorkForm.patchValue({
      logoControl: image
    });
  }

  onEditWork(): void {
    event.preventDefault();
    console.log(this.editWorkForm);
    if(this.editWorkForm.invalid) {
      return;
    }

    const work: Work = {
      company: this.editWorkForm.value.companyControl,
      logo: this.editWorkForm.value.logoControl,
      city: this.editWorkForm.value.cityControl,
      position: this.editWorkForm.value.positionControl,
      description: this.editWorkForm.value.descriptionControl,
      dateFrom: new Date(this.editWorkForm.value.dateFromControl),
      dateTo: new Date(this.editWorkForm.value.dateToControl)
    }

    this.work.updateWork(this.workExp.id, work).subscribe( () => {
      this.editWorkForm.reset();
      this.router.navigate(['/dashboard', 'resume', 'work'])
    })
  }

}
