import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { forkJoin, from, Observable } from "rxjs";
import { catchError, combineAll, concatMap, finalize, map, switchMap, tap } from "rxjs/operators";
import { AngularFireStorage, AngularFireUploadTask } from "@angular/fire/storage";
import { FileUpload } from '../interfaces/file-upload';
import { StorageComponent } from '../components/storage/storage.component';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storageRef = this.storage.ref('uploads');
  firebase;
  imageURL;
  storageLib;

  constructor(
    private storage: AngularFireStorage,
  ) { }

  uploadImage(file: File) {
    const { name } = file;
    const filePath = `uploads/${name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask: AngularFireUploadTask = this.storage.upload(filePath, file);
    return from(uploadTask).pipe(
      map(() => {
        return forkJoin({
          url: storageRef.getDownloadURL(),
          metaData: storageRef.getMetadata()
        });
      }),
      combineAll()
    )
    
  }

  deleteImage(fullPath: string): Observable<Boolean> {
    return this.storage.ref(fullPath).delete();
  }

  getImageList() {
    return this.storageRef.listAll().pipe(
      concatMap( (data) => {
        return data.items;
      }),
      map((item) => {
        return forkJoin({
          url: this.storage.ref(item.fullPath).getDownloadURL(),
          metaData: this.storage.ref(item.fullPath).getMetadata()
        })
      }),
      combineAll()
    )
  }

  updateMetaInfo(pathRef: string, customMetadata) {
    console.log(pathRef, customMetadata);
    this.storage.ref(pathRef).updateMetadata(customMetadata)
      .pipe(
        tap(
          (metadata) => {
            console.log(metadata);
          }
        ),
        catchError(
          (error) => {
            console.log(error);
            return error;
          }
        )
      )
  }
}
