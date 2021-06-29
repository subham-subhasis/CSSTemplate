// utils.ts code


export function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

export function toString(value: any): string {
  return (value !== undefined && value !== null) ? `${value}` : '';
}

export function getValueInRange(value: number, max: number, min = 0): number {
  return Math.max(Math.min(value, max), min);
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}

export function isInteger(value: any): value is number {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}

export function isDefined(value: any): boolean {
  return value !== undefined && value !== null;
}

export function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return '';
  }
}

export function regExpEscape(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}


//--------------- triggers.ts  code

export class Trigger {
  constructor(public open: string, public close?: string) {
    if (!close) {
      this.close = open;
    }
  }

  isManual() { return this.open === 'manual' || this.close === 'manual'; }
}

const DEFAULT_ALIASES = {
  'hover': ['mouseenter', 'mouseleave']
};

export function parseTriggers(triggers: string, aliases = DEFAULT_ALIASES): Trigger[] {
  const trimmedTriggers = (triggers || '').trim();

  if (trimmedTriggers.length === 0) {
    return [];
  }

  const parsedTriggers = trimmedTriggers.split(/\s+/).map(trigger => trigger.split(':')).map((triggerPair) => {
    let alias = aliases[triggerPair[0]] || triggerPair;
    return new Trigger(alias[0], alias[1]);
  });

  const manualTriggers = parsedTriggers.filter(triggerPair => triggerPair.isManual());

  if (manualTriggers.length > 1) {
    throw 'Triggers parse error: only one manual trigger is allowed';
  }

  if (manualTriggers.length === 1 && parsedTriggers.length > 1) {
    throw 'Triggers parse error: manual trigger can\'t be mixed with other triggers';
  }

  return parsedTriggers;
}

const noopFn = () => { };

export function listenToTriggers(renderer: any, nativeElement: any, triggers: string, openFn, closeFn, toggleFn) {
  const parsedTriggers = parseTriggers(triggers);
  const listeners = [];

  if (parsedTriggers.length === 1 && parsedTriggers[0].isManual()) {
    return noopFn;
  }

  parsedTriggers.forEach((trigger: Trigger) => {
    if (trigger.open === trigger.close) {
      listeners.push(renderer.listen(nativeElement, trigger.open, toggleFn));
    } else {
      listeners.push(
        renderer.listen(nativeElement, trigger.open, openFn), renderer.listen(nativeElement, trigger.close, closeFn));
    }
  });

  return () => { listeners.forEach(unsubscribeFn => unsubscribeFn()); };
}



//------------- positioning.ts 

//
// previous version:
// https://github.com/angular-ui/bootstrap/blob/07c31d0731f7cb068a1932b8e01d2312b796b4ec/src/position/position.js
export class Positioning {
  private getAllStyles(element: HTMLElement) { return window.getComputedStyle(element); }

  private getStyle(element: HTMLElement, prop: string): string { return this.getAllStyles(element)[prop]; }

  private isStaticPositioned(element: HTMLElement): boolean {
    return (this.getStyle(element, 'position') || 'static') === 'static';
  }

  private offsetParent(element: HTMLElement): HTMLElement {
    let offsetParentEl = <HTMLElement>element.offsetParent || document.documentElement;

    while (offsetParentEl && offsetParentEl !== document.documentElement && this.isStaticPositioned(offsetParentEl)) {
      offsetParentEl = <HTMLElement>offsetParentEl.offsetParent;
    }

    return offsetParentEl || document.documentElement;
  }

  position(element: HTMLElement, round = true): ClientRect {
    let elPosition: ClientRect;
    let parentOffset: ClientRect = { width: 0, height: 0, top: 0, bottom: 0, left: 0, right: 0 };

    if (this.getStyle(element, 'position') === 'fixed') {
      elPosition = element.getBoundingClientRect();
    } else {
      const offsetParentEl = this.offsetParent(element);

      elPosition = this.offset(element, false);

      if (offsetParentEl !== document.documentElement) {
        parentOffset = this.offset(offsetParentEl, false);
      }

      parentOffset.top += offsetParentEl.clientTop;
      parentOffset.left += offsetParentEl.clientLeft;
    }

    elPosition.top -= parentOffset.top;
    elPosition.bottom -= parentOffset.top;
    elPosition.left -= parentOffset.left;
    elPosition.right -= parentOffset.left;

    if (round) {
      elPosition.top = Math.round(elPosition.top);
      elPosition.bottom = Math.round(elPosition.bottom);
      elPosition.left = Math.round(elPosition.left);
      elPosition.right = Math.round(elPosition.right);
    }

    return elPosition;
  }

  offset(element: HTMLElement, round = true): ClientRect {
    const elBcr = element.getBoundingClientRect();
    const viewportOffset = {
      top: window.pageYOffset - document.documentElement.clientTop,
      left: window.pageXOffset - document.documentElement.clientLeft
    };

    let elOffset = {
      height: elBcr.height || element.offsetHeight,
      width: elBcr.width || element.offsetWidth,
      top: elBcr.top + viewportOffset.top,
      bottom: elBcr.bottom + viewportOffset.top,
      left: elBcr.left + viewportOffset.left,
      right: elBcr.right + viewportOffset.left
    };

    if (round) {
      elOffset.height = Math.round(elOffset.height);
      elOffset.width = Math.round(elOffset.width);
      elOffset.top = Math.round(elOffset.top);
      elOffset.bottom = Math.round(elOffset.bottom);
      elOffset.left = Math.round(elOffset.left);
      elOffset.right = Math.round(elOffset.right);
    }

    return elOffset;
  }

  positionElements(hostElement: HTMLElement, targetElement: HTMLElement, placement: string, appendToBody?: boolean):
    ClientRect {
    const hostElPosition = appendToBody ? this.offset(hostElement, false) : this.position(hostElement, false);
    const targetElStyles = this.getAllStyles(targetElement);
    const targetElBCR = targetElement.getBoundingClientRect();
    const placementPrimary = placement.split('-')[0] || 'top';
    const placementSecondary = placement.split('-')[1] || 'center';

    let targetElPosition: ClientRect = {
      'height': targetElBCR.height || targetElement.offsetHeight,
      'width': targetElBCR.width || targetElement.offsetWidth,
      'top': 0,
      'bottom': targetElBCR.height || targetElement.offsetHeight,
      'left': 0,
      'right': targetElBCR.width || targetElement.offsetWidth
    };

    switch (placementPrimary) {
      case 'top':
        targetElPosition.top =
          hostElPosition.top - (targetElement.offsetHeight + parseFloat(targetElStyles.marginBottom));
        break;
      case 'bottom':
        targetElPosition.top = hostElPosition.top + hostElPosition.height;
        break;
      case 'left':
        targetElPosition.left =
          hostElPosition.left - (targetElement.offsetWidth + parseFloat(targetElStyles.marginRight));
        break;
      case 'right':
        targetElPosition.left = hostElPosition.left + hostElPosition.width;
        break;
    }

    switch (placementSecondary) {
      case 'top':
        targetElPosition.top = hostElPosition.top;
        break;
      case 'bottom':
        targetElPosition.top = hostElPosition.top + hostElPosition.height - targetElement.offsetHeight;
        break;
      case 'left':
        targetElPosition.left = hostElPosition.left;
        break;
      case 'right':
        targetElPosition.left = hostElPosition.left + hostElPosition.width - targetElement.offsetWidth;
        break;
      case 'center':
        if (placementPrimary === 'top' || placementPrimary === 'bottom') {
          targetElPosition.left = hostElPosition.left + hostElPosition.width / 2 - targetElement.offsetWidth / 2;
        } else {
          targetElPosition.top = hostElPosition.top + hostElPosition.height / 2 - targetElement.offsetHeight / 2;
        }
        break;
    }

    targetElPosition.top = Math.round(targetElPosition.top);
    targetElPosition.bottom = Math.round(targetElPosition.bottom);
    targetElPosition.left = Math.round(targetElPosition.left);
    targetElPosition.right = Math.round(targetElPosition.right);

    return targetElPosition;
  }

  // get the availble placements of the target element in the viewport dependeing on the host element
  getAvailablePlacements(hostElement: HTMLElement, targetElement: HTMLElement): string[] {
    let availablePlacements: Array<string> = [];
    let hostElemClientRect = hostElement.getBoundingClientRect();
    let targetElemClientRect = targetElement.getBoundingClientRect();
    let html = document.documentElement;

    // left: check if target width can be placed between host left and viewport start and also height of target is
    // inside viewport
    if (targetElemClientRect.width < hostElemClientRect.left) {
      // check for left only
      if ((hostElemClientRect.top + hostElemClientRect.height / 2 - targetElement.offsetHeight / 2) > 0) {
        availablePlacements.splice(availablePlacements.length, 1, 'left');
      }
      // check for left-top and left-bottom
      this.setSecondaryPlacementForLeftRight(hostElemClientRect, targetElemClientRect, 'left', availablePlacements);
    }

    // top: target height is less than host top
    if (targetElemClientRect.height < hostElemClientRect.top) {
      availablePlacements.splice(availablePlacements.length, 1, 'top');
      this.setSecondaryPlacementForTopBottom(hostElemClientRect, targetElemClientRect, 'top', availablePlacements);
    }

    // right: check if target width can be placed between host right and viewport end and also height of target is
    // inside viewport
    if ((window.innerWidth || html.clientWidth) - hostElemClientRect.right > targetElemClientRect.width) {
      // check for right only
      if ((hostElemClientRect.top + hostElemClientRect.height / 2 - targetElement.offsetHeight / 2) > 0) {
        availablePlacements.splice(availablePlacements.length, 1, 'right');
      }
      // check for right-top and right-bottom
      this.setSecondaryPlacementForLeftRight(hostElemClientRect, targetElemClientRect, 'right', availablePlacements);
    }

    // bottom: check if there is enough space between host bottom and viewport end for target height
    if ((window.innerHeight || html.clientHeight) - hostElemClientRect.bottom > targetElemClientRect.height) {
      availablePlacements.splice(availablePlacements.length, 1, 'bottom');
      this.setSecondaryPlacementForTopBottom(hostElemClientRect, targetElemClientRect, 'bottom', availablePlacements);
    }

    return availablePlacements;
  }

  /**
   * check if secondary placement for left and right are available i.e. left-top, left-bottom, right-top, right-bottom
   * primaryplacement: left|right
   * availablePlacementArr: array in which available placemets to be set
   */
  private setSecondaryPlacementForLeftRight(
    hostElemClientRect: ClientRect, targetElemClientRect: ClientRect, primaryPlacement: string,
    availablePlacementArr: Array<string>) {
    let html = document.documentElement;
    // check for left-bottom
    if (targetElemClientRect.height <= hostElemClientRect.bottom) {
      availablePlacementArr.splice(availablePlacementArr.length, 1, primaryPlacement + '-bottom');
    }
    if ((window.innerHeight || html.clientHeight) - hostElemClientRect.top >= targetElemClientRect.height) {
      availablePlacementArr.splice(availablePlacementArr.length, 1, primaryPlacement + '-top');
    }
  }

  /**
   * check if secondary placement for top and bottom are available i.e. top-left, top-right, bottom-left, bottom-right
   * primaryplacement: top|bottom
   * availablePlacementArr: array in which available placemets to be set
   */
  private setSecondaryPlacementForTopBottom(
    hostElemClientRect: ClientRect, targetElemClientRect: ClientRect, primaryPlacement: string,
    availablePlacementArr: Array<string>) {
    let html = document.documentElement;
    // check for left-bottom
    if ((window.innerWidth || html.clientWidth) - hostElemClientRect.left >= targetElemClientRect.width) {
      availablePlacementArr.splice(availablePlacementArr.length, 1, primaryPlacement + '-left');
    }
    if (targetElemClientRect.width <= hostElemClientRect.right) {
      availablePlacementArr.splice(availablePlacementArr.length, 1, primaryPlacement + '-right');
    }
  }
}

const positionService = new Positioning();

/*
 * Accept the placement array and applies the appropriate placement dependent on the viewport.
 * Returns the applied placement.
 * In case of auto placement, placements are selected in order 'top', 'bottom', 'left', 'right'.
 * */
export function positionElements(
  hostElement: HTMLElement, targetElement: HTMLElement, placement: string | Placement | PlacementArray,
  appendToBody?: boolean): Placement {
  let placementVals: Array<Placement> = Array.isArray(placement) ? placement : [placement as Placement];

  // replace auto placement with other placements
  let hasAuto = placementVals.findIndex(val => val === 'auto');
  if (hasAuto >= 0) {
    ['top', 'right', 'bottom', 'left'].forEach(function (obj) {
      if (placementVals.find(val => val.search('^' + obj + '|^' + obj + '-') !== -1) == null) {
        placementVals.splice(hasAuto++, 1, obj as Placement);
      }
    });
  }

  // coordinates where to position
  let topVal = 0, leftVal = 0;
  let appliedPlacement: Placement;
  // get available placements
  let availablePlacements = positionService.getAvailablePlacements(hostElement, targetElement);
  // iterate over all the passed placements
  for (let { item, index } of toItemIndexes(placementVals)) {
    // check if passed placement is present in the available placement or otherwise apply the last placement in the
    // passed placement list
    if ((availablePlacements.find(val => val === item) != null) || (placementVals.length === index + 1)) {
      appliedPlacement = <Placement>item;
      const pos = positionService.positionElements(hostElement, targetElement, item, appendToBody);
      topVal = pos.top;
      leftVal = pos.left;
      break;
    }
  }
  targetElement.style.top = `${topVal}px`;
  targetElement.style.left = `${leftVal}px`;
  return appliedPlacement;
}

// function to get index and item of an array
function toItemIndexes<T>(a: T[]) {
  return a.map((item, index) => ({ item, index }));
}

export type Placement = 'auto' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' |
  'bottom-right' | 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';

export type PlacementArray = Placement | Array<Placement>;

//-------------------popup.ts  code
import {
  Injector,
  TemplateRef,
  ViewRef,
  ViewContainerRef,
  Renderer2,
  ComponentRef,
  ComponentFactory,
  ComponentFactoryResolver
} from '@angular/core';

export class ContentRef {
  constructor(public nodes: any[], public viewRef?: ViewRef, public componentRef?: ComponentRef<any>) { }
}

export class PopupService<T> {
  private _windowFactory: ComponentFactory<T>;
  private _windowRef: ComponentRef<T>;
  private _contentRef: ContentRef;

  constructor(
    type: any, private _injector: Injector, private _viewContainerRef: ViewContainerRef, private _renderer: Renderer2,
    componentFactoryResolver: ComponentFactoryResolver) {
    this._windowFactory = componentFactoryResolver.resolveComponentFactory<T>(type);
  }

  open(content?: string | TemplateRef<any>, context?: any): ComponentRef<T> {
    if (!this._windowRef) {
      this._contentRef = this._getContentRef(content, context);
      this._windowRef =
        this._viewContainerRef.createComponent(this._windowFactory, 0, this._injector, this._contentRef.nodes);
    }
    return this._windowRef;
  }

  close() {
    if (this._windowRef) {
      this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._windowRef.hostView));
      this._windowRef = null;
      if (this._contentRef.viewRef) {
        this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._contentRef.viewRef));
        this._contentRef = null;
      }
    }
  }

  private _getContentRef(content: string | TemplateRef<any>, context?: any): ContentRef {
    if (!content) {
      return new ContentRef([]);
    } else if (content instanceof TemplateRef) {
      const viewRef = this._viewContainerRef.createEmbeddedView(<TemplateRef<T>>content, context);
      return new ContentRef([viewRef.rootNodes], viewRef);
    } else {
      return new ContentRef([[this._renderer.createText(`${content}`)]]);
    }
  }
}


