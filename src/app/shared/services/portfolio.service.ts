import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { from, Observable, of, forkJoin } from "rxjs";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Project } from '../interfaces/project';
import { FirebaseCreateResponse } from 'src/app/modules/dashboard/shared/interfaces/firebase-create-response';
import { AngularFireStorage, AngularFireUploadTask } from "@angular/fire/storage";

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  firebase;
  imageURL;

  constructor(
    private http: HttpClient,
    private storage: AngularFireStorage
  ) { }


  uploadImage(projectName: string, file: File, baseFolder: string) {
    const { name } = file;
    const filePath = `projects/${projectName}/${baseFolder}/${name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask: AngularFireUploadTask = this.storage.upload(filePath, file);
    return from(uploadTask).pipe(
      switchMap(() => {
        return from(storageRef.getDownloadURL()).pipe(
          map(downloadURL => {
            this.imageURL = downloadURL;
            return downloadURL;
          })
        );
      })
    )
  }

  addPost(project: Project): Observable<Project> {
    return this.http.post(`${environment.firebaseDB}/ng-portfolio/projects.json`, project)
      .pipe(
        map((response: FirebaseCreateResponse) => {
          console.log(project);
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
