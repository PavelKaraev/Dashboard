import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Project } from '../interfaces/project';
import { FirebaseCreateResponse } from 'src/app/modules/dashboard/shared/interfaces/firebase-create-response';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  constructor(
    private http: HttpClient,
  ) { }

  addPost(project: Project): Observable<Project> {
    return this.http.post(`${environment.firebaseDB}/ng-portfolio/projects.json`, project)
      .pipe(
        map((response: FirebaseCreateResponse) => {
          return {
            ...project,
            id: response.name,
            date: new Date(project.date),
          }
        })
      )
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.firebaseDB}/ng-portfolio/projects.json`)
      .pipe(map( (response: {[key: string] : any}) => {
        return Object.keys(response)
          .map(key => ({
            ...response[key],
            id: key,
            date: new Date(response[key].date)
          }))
      }))
  }

  getProjectByID(id): Observable<Project> {
    return this.http.get<Project>(`${environment.firebaseDB}/ng-portfolio/projects/${id}.json`)
      .pipe(map( (project: Project) => {
        return {
          ...project,
          id,
          date: new Date(project.date)
        }
      }))
  }

  deleteProject(id): Observable<void> {
    return this.http.delete<void>(`${environment.firebaseDB}/ng-portfolio/projects/${id}.json`);
  }

  updateProject(project: Project, id: string): Observable<Project> {
    return this.http.patch<Project>(`${environment.firebaseDB}/ng-portfolio/projects/${id}.json`, project);
  }
}
