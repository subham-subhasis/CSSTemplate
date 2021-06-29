import {
  Component,
  Directive,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  Injector,
  Renderer2,
  ComponentRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  NgZone, Renderer
} from '@angular/core';

import { UIPositionService } from "./position.service";
import { positionElements, Placement, PlacementArray, PopupService, listenToTriggers } from './popover.util';
import { MSPopoverConfig } from './popover-config';
let nextId = 0;

@Component({
  selector: 'ms-popover-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"popover bs-popover-" + placement.split("-")[0]+placement',
    'role': 'tooltip',
    '[id]': 'id'
  },
  template: `
    <div class="arrow"></div>
    <div class="popover-inner">
      <h3 class="popover-title" [hidden]="!title">{{title}}</h3><div class="popover-content"><ng-content></ng-content></div>
    </div>`,
  styles: [`
  :host.popover {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1060;
    display: block;
    /*max-width: 276px;*/
    // padding: 1px;
    font-family: "Montserrat Bold", "Montserrat Regular", "Montserrat" ;
    font-size: 1.2rem; /*14px;*/
    font-style: normal;
    font-weight: normal;
    line-height: 1.42857143;
    text-align: left;
    text-align: start;
    text-decoration: none;
    text-shadow: none;
    text-transform: none;
    letter-spacing: normal;
    word-break: normal;
    word-spacing: normal;
    word-wrap: normal;
    white-space: normal;
    background-color: #fff;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid #ccc;
    border: 1px solid rgba(0, 0, 0, .2);
    /*-webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
          box-shadow: 0 5px 10px rgba(0, 0, 0, .2);*/
    /*line-break: auto;*/
  }
  :host.popover-content {
    padding: 9px 5px;
  }
  :host.popover.top {
    margin-top: -10px;
    border-bottom: 2px solid #008dbc;
  }

  :host.popover.right {
    margin-left: 10px;
    border-left: 2px solid #008dbc;
  }

  :host.popover.bottom {
    margin-top: 10px;
    border-top: 2px solid #008dbc;
  }

  :host.popover.left {
    /*margin-left: -10px;*/
    margin-left: -18px;
    border-right: 2px solid #008dbc;
  }
  :host.popover .popover-title {
    padding: 8px 14px;
    margin: 0;
    font-size: 1.4rem; /*14px;*/
    background-color: #f7f7f7;
    border-bottom: 1px solid #ebebeb;
  }
  :host.popover > .arrow,
  :host.popover > .arrow:after {
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
  }
 
  :host.popover > .arrow {
      border-width: 11px;
  }
  
  :host.popover > .arrow:after {
      content: "";
      border-width: 10px;
  }
  :host.popover.top > .arrow {
      bottom: -17px;
      // left: 50%;
      margin-left: -11px;
      border-top-color: #999;
      // border-top-color: rgba(0, 0, 0, .25);
      border-top-color: rgba(51, 122, 183, .5);
      border-bottom-width: 0;
  }
    
    :host.popover.top > .arrow:after {
            bottom: 1px;
            margin-left: -10px;
            content: " ";
            /*border-top-color: #fff;*/
            border-top-color: #008dbc;
            border-bottom-width: 0;
        }
    
        :host.popover.right > .arrow {
        // top: 50%;
        left: -17px;
        margin-top: -11px;
        border-right-color: #999;
        // border-right-color: rgba(0, 0, 0, .25);
        border-right-color: rgba(51, 122, 183, .5);
        border-left-width: 0;
    }
    
    :host.popover.right > .arrow:after {
            /*bottom: -10px;
      left: 1px;
      content: " ";
      border-right-color: #fff;
      border-left-width: 0;*/
            bottom: 0px;
            left: 1px;
            content: " ";
            border-right-color: #008dbc;
            border-left-width: 0;
            top: -10px;
        }
    
        :host.popover.bottom > .arrow {
        top: -12px;
        // left: 50%;
        margin-left: -11px;
        border-top-width: 0;
        border-bottom-color: #999;
        // border-bottom-color: rgba(0, 0, 0, .25);
        border-bottom-color: rgba(51, 122, 183, .5);
    }
    
    :host.popover.bottom > .arrow:after {
            top: 1px;
            margin-left: -10px;
            content: " ";
            border-top-width: 0;
            /*border-bottom-color: #fff;*/
            border-bottom-color: #008dbc;
        }
    
        :host.popover.left > .arrow {
        // top: 50%;
        right: -17px;
        margin-top: -11px;
        border-right-width: 0;
        border-left-color: #999;
        // border-left-color: rgba(0, 0, 0, .25);
        border-left-color: rgba(51, 122, 183, .5);
        
    }
    
    :host.popover.left > .arrow:after {
            right: 1px;
            bottom: -10px;
            content: " ";
            border-right-width: 0;
            /*border-left-color: #fff;*/
            border-left-color: #008dbc;
        }
        :host.popover > .arrow-warning,
        :host.popover > .arrow-warning:after {
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
        }
        
        :host.popover > .arrow-warning,
        :host.popover > .arrow-warning:after {
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
        }
       
        :host.popover > .arrow-warning {
            border-width: 11px;
        }
        
        :host.popover > .arrow-warning:after {
            content: "";
            border-width: 10px;
        }
        :host.popover.top > .arrow-warning {
            bottom: -17px;      
            margin-left: -11px;
            border-top-color: #999;      
            border-top-color: #ff7900;
            border-bottom-width: 0;
        }
          
          :host.popover.top > .arrow-warning:after {
                  bottom: 1px;
                  margin-left: -10px;
                  content: " ";            
                  border-top-color: #ff7900;
                  border-bottom-width: 0;
              }
          
              :host.popover.right > .arrow-warning {      
              left: -17px;
              margin-top: -11px;
              border-right-color: #999;        
              border-right-color: #ff7900;
              border-left-width: 0;
          }
          
          :host.popover.right > .arrow-warning:after {         
                  bottom: 0px;
                  left: 1px;
                  content: " ";
                  border-right-color: #ff7900;
                  border-left-width: 0;
                  top: -10px;
              }
          
              :host.popover.bottom > .arrow-warning {
              top: -17px;       
              margin-left: -11px;
              border-top-width: 0;
              border-bottom-color: #999;       
              border-bottom-color: #ff7900;
          }
          
          :host.popover.bottom > .arrow-warning:after {
                  top: 1px;
                  margin-left: -10px;
                  content: " ";
                  border-top-width: 0;                        
              }
          
              :host.popover.left > .arrow-warning {        
              right: -17px;
              margin-top: -11px;
              border-right-width: 0;
              border-left-color: #999;        
              border-left-color: #ff7900;
              
          }
          
          :host.popover.left > .arrow-warning:after {
                  right: 1px;
                  bottom: -10px;
                  content: " ";
                  border-right-width: 0;          
              }
              :host.popover > .arrow-warning,
              :host.popover > .arrow-warning:after {
                  position: absolute;
                  display: block;
                  width: 0;
                  height: 0;
                  border-color: transparent;
                  border-style: solid;
              }
    
  `]
})
export class MSPopoverWindow {
  @Input() placement: Placement | string = 'top';
  @Input() title: string;
  @Input() id: string;

  constructor(private _element: ElementRef, private _renderer: Renderer2, private uiPositionService: UIPositionService) { }

  applyPlacement(_placement: Placement | string) {
    // remove the current placement classes
    this._renderer.removeClass(this._element.nativeElement, this.placement.toString().split('-')[0]);
    this._renderer.removeClass(this._element.nativeElement, this.placement.toString());

    // set the new placement classes
    this.placement = _placement;

    // apply the new placement
    this._renderer.addClass(this._element.nativeElement, this.placement.toString().split('-')[0]);
    this._renderer.addClass(this._element.nativeElement, this.placement.toString());
  }
}

/**
 * A lightweight, extensible directive for fancy popover creation.
 */
@Directive({ selector: '[MSPopover]', exportAs: 'MSPopover' })
export class MSPopover implements OnInit, OnDestroy {
  /**
   * Content to be displayed as popover.
   */
  @Input() MSPopover: string | TemplateRef<any>;
  /**
   * Title of a popover.
   */
  @Input() popoverTitle: string;
  /**
   * Placement of a popover accepts:
   *    "auto", "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right",
   *    "left", "left-top", "left-bottom", "right", "right-top", "right-bottom"
   * and array of above values.
   */
  @Input() placement: PlacementArray;
  /**
   * Specifies events that should trigger. Supports a space separated list of event names.
   */
  @Input() triggers: string;
  /**
   * A selector specifying the element the popover should be appended to.
   * Currently only supports "body".
   */
  @Input() container: string;
  @Input() adobeText: string;

  /**
   * Emits an event when the popover is shown
   */
  @Output() shown = new EventEmitter();
  /**
   * Emits an event when the popover is hidden
   */
  @Output() hidden = new EventEmitter();

  @Input() closeOnClickOutside: boolean;
  @Input() warning: boolean;

  private _msPopoverWindowId = `ms-popover-${nextId++}`;
  private _popupService: PopupService<MSPopoverWindow>;
  private _windowRef: ComponentRef<MSPopoverWindow>;
  private _unregisterListenersFn;
  private _zoneSubscription: any;

  constructor(
    private _elementRef: ElementRef, private _renderer: Renderer2, injector: Injector,
    componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, config: MSPopoverConfig,
    // tslint:disable-next-line: deprecation
    ngZone: NgZone, private _rd: Renderer, private uiPositionService: UIPositionService) {
    this.placement = config.placement;
    this.triggers = config.triggers;
    this.container = config.container;
    this.adobeText = config.adobeText;


    this._popupService = new PopupService<MSPopoverWindow>(
      MSPopoverWindow, injector, viewContainerRef, _renderer, componentFactoryResolver);

    this._zoneSubscription = ngZone.onStable.subscribe(() => {
      if (this._windowRef) {
        let targetElement = this._windowRef.location.nativeElement;
        let p = this.uiPositionService.positionElements(this._elementRef.nativeElement, targetElement, this.placement, this.container === 'body');
        targetElement.style.top = `${p.top}px`;
        targetElement.style.left = `${p.left}px`;
        this._windowRef.instance.applyPlacement(p.placement);
        this.uiPositionService.positionArrow(targetElement, p.placement);
        this.repositionArrow(targetElement, p.placement);
        // positionElements(
        // this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement,
        // this.container === 'body'));
      }
    });
  }

  /**
   * Opens an element’s popover. This is considered a “manual” triggering of the popover.
   * The context is an optional value to be injected into the popover template when it is created.
   */
  open(context?: any) {
    if (!this._windowRef) {
      if (this.adobeText != null && this.adobeText != "") {
        // this.utlservie.logAdobeDataField(Constants.ADOBE_ADVC_POPOVER ,  this.adobeText);
      }
      this._windowRef = this._popupService.open(this.MSPopover, context);
      this._windowRef.instance.title = this.popoverTitle;
      this._windowRef.instance.id = this._msPopoverWindowId;

      this._renderer.setAttribute(this._elementRef.nativeElement, 'aria-describedby', this._msPopoverWindowId);

      if (this.container === 'body') {
        window.document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
      }

      // apply styling to set basic css-classes on target element, before going for positioning
      this._windowRef.changeDetectorRef.detectChanges();
      this._windowRef.changeDetectorRef.markForCheck();

      // position popover along the element
      let targetElement = this._windowRef.location.nativeElement;
      let p = this.uiPositionService.positionElements(this._elementRef.nativeElement, targetElement, this.placement, this.container === 'body');
      targetElement.style.top = `${p.top}px`;
      targetElement.style.left = `${p.left}px`;
      this._windowRef.instance.applyPlacement(p.placement);
      this.uiPositionService.positionArrow(targetElement, p.placement);
      this.repositionArrow(targetElement, p.placement);

      // this._windowRef.instance.applyPlacement(
      //   positionElements(
      //     this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement,
      //     this.container === 'body'));

      this.shown.emit();
      if (this.closeOnClickOutside) {
        this.listenClickFunc = this._rd.listenGlobal("document", "click", (event: any) => this.onDocumentMouseDown(event));
      }

    }
  }

  /**
   * Closes an element’s popover. This is considered a “manual” triggering of the popover.
   */
  close(): void {
    if (this._windowRef) {
      this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
      this._popupService.close();
      this._windowRef = null;
      this.hidden.emit();
      if (this.closeOnClickOutside) {
        this.listenClickFunc();
      }
    }
  }

  /**
   * Toggles an element’s popover. This is considered a “manual” triggering of the popover.
   */
  toggle(): void {
    if (this._windowRef) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Returns whether or not the popover is currently being shown
   */
  isOpen(): boolean { return this._windowRef != null; }

  repositionArrow(elem: Element, placement) {
    var innerElem = elem.querySelector('.popover-inner');
    if (!innerElem) {
      return;
    }
    var arrowElem = elem.querySelector('.arrow');
    if (!arrowElem) {
      return;
    }

    placement = this.uiPositionService.parsePlacement(placement);

    switch (placement[0]) {
      case 'top':
        this._renderer.removeStyle(arrowElem, "bottom");
        (placement[1] != "center") ? this._renderer.setStyle(arrowElem, "margin-left", "0px") : this._renderer.setStyle(arrowElem, "left", "50%");
        break;
      case 'bottom':
        this._renderer.removeStyle(arrowElem, "top");
        (placement[1] != "center") ? this._renderer.setStyle(arrowElem, "margin-left", "0px") : this._renderer.setStyle(arrowElem, "left", "50%");
        break;
      case 'left':
        this._renderer.removeStyle(arrowElem, "right");
        (placement[1] != "center") ? this._renderer.setStyle(arrowElem, "margin-top", "0px") : this._renderer.setStyle(arrowElem, "top", "50%");
        break;
      case 'right':
        this._renderer.removeStyle(arrowElem, "left");
        (placement[1] != "center") ? this._renderer.setStyle(arrowElem, "margin-top", "0px") : this._renderer.setStyle(arrowElem, "top", "50%");
        break;
    }
    if (this.warning) {
      this._renderer.setStyle(elem, "border-left", "7px solid #ff7900");
      this._renderer.removeClass(elem.querySelector('.arrow'), elem.querySelector('.arrow').classList[0]);
      this._renderer.addClass(elem.firstElementChild, "arrow-warning");
      (placement[1] != "center") ? this._renderer.setStyle(arrowElem, "margin-top", "0px") : this._renderer.setStyle(arrowElem, "top", "4%");
    }
  }

  ngOnInit() {
    this._unregisterListenersFn = listenToTriggers(
      this._renderer, this._elementRef.nativeElement, this.triggers, this.open.bind(this), this.close.bind(this),
      this.toggle.bind(this));

  }

  ngOnDestroy() {
    this.close();
    this._unregisterListenersFn();
    this._zoneSubscription.unsubscribe();

    if (this.closeOnClickOutside && this.listenClickFunc) {
      this.listenClickFunc();
    }
  }

  /*create property  click outside.and popover should close on document click.copycode from old popup*/



  /**
   * Closes dropdown if user clicks outside of this directive.
   */
  onDocumentMouseDown = (event: any) => {
    const element = this._elementRef.nativeElement;
    if (!element || !this._windowRef) return;
    if (element.contains(event.target) || this._windowRef.location.nativeElement.contains(event.target)) return;
    this.close();
  };

  // -------------------------------------------------------------------------
  // Lifecycle callbacks
  // -------------------------------------------------------------------------

  listenClickFunc: any;
  listenMouseFunc: any;
  ngAfterViewInit(): void {

  }
}