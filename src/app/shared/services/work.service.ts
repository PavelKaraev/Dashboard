import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseCreateResponse } from 'src/app/modules/dashboard/shared/interfaces/firebase-create-response';
import { environment } from 'src/environments/environment';
import { Work } from '../interfaces/work';

@Injectable({
  providedIn: 'root'
})
export class WorkService {

  constructor(
    private http: HttpClient
  ) { }

  addWork(work: Work): Observable<Work> {
    return this.http.post(`${environment.firebaseDB}/ng-resume/work.json`, work)
      .pipe(
        map((response: FirebaseCreateResponse) => {
          console.log(response);
          return {
            ...work,
            id: response.name,
          }
        })
      )
  }

  deleteWork(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.firebaseDB}/ng-resume/work/${id}.json`); 
  }

  updateWork(id: string, work: Work): Observable<Work> {
    return this.http.patch<Work>(`${environment.firebaseDB}/ng-resume/work/${id}.json`, work);
  }

  getWorkExperience(): Observable<Work[]> {
    return this.http.get<Work[]>(`${environment.firebaseDB}/ng-resume/work.json`)
      .pipe(
        map((response: {[key: string]: any}) => {
          return Object.keys(response)
            .map(key => ({
              ...response[key],
              id: key,
              dateFrom: new Date(response[key].dateFrom),
              dateTo: new Date(response[key].dateTo)
            })
          )
        })
      )
  }

  getWorkExperienceByID(id: string): Observable<Work> {
    return this.http.get<Work>(`${environment.firebaseDB}/ng-resume/work/${id}.json`)
      .pipe(map( (work: Work) => {
        return {
          ...work,
          id,
          dateFrom: new Date(work.dateFrom),
          dateTo: new Date(work.dateTo)
        }
      }))
  }
}
