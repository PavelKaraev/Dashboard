import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appStorage]'
})
export class StorageDirective {

  constructor(
    public viewContainerRef: ViewContainerRef
  ) { }

}
