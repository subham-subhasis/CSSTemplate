import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicWidget]'
})
export class DynamicWidgetDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
