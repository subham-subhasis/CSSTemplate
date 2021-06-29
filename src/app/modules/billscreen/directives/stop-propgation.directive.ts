import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appStopPropgation]'
})
export class StopPropgationDirective {

  constructor() { }
  @HostListener('click', ['$event'])
    public onClick(event: any): void {
        event.stopPropagation();
    }
}
