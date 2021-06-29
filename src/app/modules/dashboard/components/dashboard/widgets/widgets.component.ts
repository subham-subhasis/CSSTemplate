import {
  Component,
  OnInit,
  ViewChild,
  ComponentFactoryResolver,
  Input,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ElementRef,
  AfterViewInit,
  Renderer2
} from '@angular/core';
import { DynamicWidgetDirective } from '../../../directives/dynamic-widget.directive';
import { BillModel } from '../../../models/bill.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from '../../../services/general.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WidgetsComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(DynamicWidgetDirective, { static: false }) adHost: DynamicWidgetDirective;
  @ViewChild('content_container', { static: false }) content_container: ElementRef;
  @Input() types: object[];
  @Input() billList: BillModel[];
  @Input() isAuthorized: boolean;
  billProfileName = '';
  init = false;
  subscription: Subscription;


  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private spinnerService: NgxSpinnerService, private gService: GeneralService,
    private renderer: Renderer2
  ) { }
  ngOnInit() {
    this.subscription = this.gService.spinnerToggle.subscribe((value) => {
      if (value === 'showWidgetSpinner') {
        this.init = true;
        setTimeout(() => {
          this.spinnerService.show('widgetSpinner');
        });
      } else if (value === 'hideWidgetSpinner') {
        this.init = false;
        this.spinnerService.hide('widgetSpinner');
      }
    });
  }

  ngAfterViewInit() {
    const height = this.gService.headerPanel.nativeElement.offsetHeight;
    //this.renderer.setStyle(this.content_container.nativeElement, 'padding-top', height + 'px');
  }

  ngOnChanges(smp: SimpleChanges) {
    if (smp['billList'] && smp['billList']['previousValue'] && this.isAuthorized) {
      if (this.types && this.types.length > 0) {
        this.adHost.viewContainerRef.clear();
        this.types.forEach((data: object) => {
          for (const key in data) {
            if (key) {
              this.loadComponent(data[key]);
            }
          }
        });
      }
      if (this.billList && this.billList.length > 0) {
        this.billProfileName = this.billList[0]['billProfileName'];
        this.gService.billId.next(this.billList[0]['pbipId']);
      }
    }
  }

  loadComponent(type: any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      type
    );
    const viewContainerRef = this.adHost.viewContainerRef;
    // viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);
  }

  togglePanel(panelObj: object) {
    if (panelObj['event'] === 'open') {
      document.getElementById('right_content').style.marginLeft =
        panelObj['value'];
    } else if (panelObj['event'] === 'close') {
      document.getElementById('right_content').style.marginLeft =
        panelObj['value'];
    }
  }

  changeBillProfileName(event: any) {
    this.billProfileName = event.billProfileName;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
