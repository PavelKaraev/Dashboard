import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FileUpload } from '../../interfaces/file-upload';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit, OnDestroy {
  storageLib: Object[] = [];
  storageSub: Subscription;
  deleteSub: Subscription;
  detailImageInfo: {} = null;
  title: string;
  alt: string;
  customMetaForm: FormGroup;
  currentImage: {} = null;
  @Output() chooseImage = new EventEmitter();
  @Output() closeStorage = new EventEmitter<void>();

  constructor(
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.storageSub = this.storageService.getImageList()
      .subscribe(
        (imageList) => {
          this.storageLib = imageList;
        }
      );
  }

  ngOnDestroy(): void {
    if(this.storageSub) {
      this.storageSub.unsubscribe();
    }
    if(this.deleteSub) {
      this.deleteSub.unsubscribe();
    }
  }

  close(): void {
    this.closeStorage.emit();
  }

  chooseImageURL(url: string) {
    this.chooseImage.emit(url)
  }

  showDetailInfo(event, url, imageMetaData): void {
    let activeImage = document.querySelector('.storage__file_active');
    if(!!activeImage) {
      activeImage.classList.remove('storage__file_active');
    }
    event.target.parentElement.classList.add('storage__file_active')
    this.detailImageInfo = {
      url,
      ...imageMetaData
    };
    this.customMetaForm = new FormGroup({
      'url': new FormControl({value: url, disabled: true}),
      'title': new FormControl(this.detailImageInfo['customMetadata']?.['Title']),
      'alt': new FormControl(this.detailImageInfo['customMetadata']?.['Alt'])
    })
  }

  uploadImage(files) {
    if(files && files.length) {
      for(let file of files) {
        this.storageService.uploadImage(file).subscribe(
          (images) => {
            this.storageLib.push(...images);
          }
        )
      }
    }
  }

  deleteImage(imagePath: string): void {
    this.deleteSub = this.storageService.deleteImage(imagePath).subscribe(
      () => {
        this.storageLib = this.storageLib.filter((image) => {
          return image?.['metaData']?.['fullPath'] !== imagePath;
        })
      }
    )
  }

  updateMeta(pathRef: string): void {
    const metaData = {
      customMetadata: {
        'Title': this.customMetaForm.get('title').value,
        'Alt': this.customMetaForm.get('alt').value
      }
    }

    this.storageService.updateMetaInfo(pathRef, metaData);
  }

}
