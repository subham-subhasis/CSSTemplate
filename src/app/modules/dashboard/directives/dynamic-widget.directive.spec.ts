import { DynamicWidgetDirective } from './dynamic-widget.directive';
import { ViewContainerRef } from '@angular/core';

describe('DynamicWidgetDirective', () => {
  it('should create an instance', () => {
    let vrf: ViewContainerRef;
    const directive = new DynamicWidgetDirective(vrf);
    expect(directive).toBeTruthy();
  });
});
