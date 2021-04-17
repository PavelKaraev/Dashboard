import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Work } from 'src/app/shared/interfaces/work';
import { WorkService } from 'src/app/shared/services/work.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements OnInit, OnDestroy {
  deleteSub: Subscription;
  workExpSub: Subscription;
  workExperience: Work[] = null;

  constructor(
    private work: WorkService
  ) { }

  ngOnInit(): void {
    this.workExpSub = this.work.getWorkExperience().subscribe(
      (workExp: Work[]) => {
        this.workExperience = workExp;
      }
    );
  }

  ngOnDestroy(): void {
    if(this.workExpSub) {
      this.workExpSub.unsubscribe();
    }
    if(this.deleteSub) {
      this.deleteSub.unsubscribe();
    }
  }

  onDeleteWorkExp(id: string): void {
    this.deleteSub = this.work.deleteWork(id).subscribe();
  }

}
