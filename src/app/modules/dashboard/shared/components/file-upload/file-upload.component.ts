import { ChangeDetectorRef, Component, ComponentFactoryResolver, DoCheck, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { StorageDirective } from '../../directives/storage.directive';
import { StorageComponent } from '../storage/storage.component';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, DoCheck {
  @ViewChild(StorageDirective, {static: true}) appStorage: StorageDirective;
  @Input() currentImage: {};
  @Output() onSetThumbnail = new EventEmitter();
  @Output() onRemoveThumbnail = new EventEmitter();
  private componentRef;
  
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }
  
  ngDoCheck(): void {
    if(this.currentImage) {
      this.onSetThumbnail.emit(this.currentImage);
    } else {
      this.onSetThumbnail.emit(this.currentImage);
    }
  }

  showStorage() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(StorageComponent);

    const viewContainerRef = this.appStorage.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent<StorageComponent>(componentFactory);
    this.componentRef.instance.chooseImage.subscribe(
      (image) => this.setImage(image)
    )
  }

  closeStorage() {
    this.componentRef.destroy();
  }

  setImage(image): void {
    this.currentImage = image;
    this.changeDetector.markForCheck();
    this.closeStorage();
  }

  setThumbnail(image): void {
    this.onSetThumbnail.emit(image);
  }

  removeThumbnail() {
    this.currentImage = null;
  }
}
