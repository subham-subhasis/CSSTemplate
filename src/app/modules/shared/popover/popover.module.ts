import { NgModule, ModuleWithProviders } from '@angular/core';
import { MSPopover, MSPopoverWindow } from './popover';
import { MSPopoverConfig } from './popover-config';
import { UIPositionModule } from './position.service';
export { MSPopoverConfig } from './popover-config';
export { Placement } from './popover.util';

@NgModule({
  declarations: [MSPopover, MSPopoverWindow],
  imports: [UIPositionModule],
  exports: [MSPopover],
  entryComponents: [MSPopoverWindow],
  providers: [MSPopoverConfig]
})
export class MSPopoverModule {
  static forRoot(): ModuleWithProviders { return { ngModule: MSPopoverModule, providers: [MSPopoverConfig] }; }
}
