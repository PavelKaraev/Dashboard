import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { QuillModule } from 'ngx-quill'
import { LoaderComponent } from "src/app/shared/components/loader/loader.component";
import { FileUploadComponent } from './components/file-upload/file-upload.component';


@NgModule({
  declarations: [
    LoaderComponent,
    FileUploadComponent,
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot()
  ],
  exports: [
    HttpClientModule,
    QuillModule,
    LoaderComponent
  ],
})

export class SharedModule { }