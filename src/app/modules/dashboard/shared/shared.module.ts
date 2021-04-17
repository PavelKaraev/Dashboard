import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { QuillModule } from 'ngx-quill'
import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { StorageDirective } from './directives/storage.directive';
import { StorageComponent } from "./components/storage/storage.component";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    LoaderComponent,
    FileUploadComponent,
    StorageDirective,
    StorageComponent
  ],
  entryComponents: [
    StorageComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot()
  ],
  exports: [
    HttpClientModule,
    QuillModule,
    LoaderComponent,
    FileUploadComponent,
    StorageDirective,
  ]
})

export class SharedModule { }