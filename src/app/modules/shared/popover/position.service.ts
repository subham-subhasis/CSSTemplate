import { NgModule, Injectable, Renderer2, RendererFactory2 } from '@angular/core';


// $document -> document
// $window -> window

const OVERFLOW_REGEX = {
    normal: /(auto|scroll)/,
    hidden: /(auto|scroll|hidden)/
};
const PLACEMENT_REGEX = {
    auto: /\s?auto?\s?/i,
    primary: /^(top|bottom|left|right)$/,
    secondary: /^(top|bottom|left|right|center)$/,
    vertical: /^(top|bottom)$/
};
const BODY_REGEX = /(HTML|BODY)/;

/**
 * A set of utility methods for working with the DOM.
 * It is meant to be used where we need to absolute-position elements in
 * relation to another element (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
@Injectable()
export class UIPositionService {
    private renderer: Renderer2;

    /**
     * Used by scrollbarWidth() function to cache scrollbar's width.
     * Do not access this variable directly, use scrollbarWidth() instead.
     */
    private SCROLLBAR_WIDTH;

    /**
     * scrollbar on body and html element in IE and Edge overlay
     * content and should be considered 0 width.
     */
    private BODY_SCROLLBAR_WIDTH;

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    /**
     * Provides a raw DOM element from a jQuery/jQLite element.
     *
     * @param {element} elem - The element to convert.
     *
     * @returns {element} A HTML element.
     */
    getRawNode(elem: HTMLElement) {
        return elem.nodeName ? elem : elem[0] || elem;
    }

    /**
     * Provides a parsed number for a style property.  Strips
     * units and casts invalid numbers to 0.
     *
     * @param {string} value - The style value to parse.
     *
     * @returns {number} A valid number.
     */
    parseStyle(value) {
        value = parseFloat(value);
        return isFinite(value) ? value : 0;
    }

    /**
     * Provides the closest positioned ancestor.
     *
     * @param {element} element - The element to get the offest parent for.
     *
     * @returns {element} The closest positioned ancestor.
     */
    offsetParent(elem) {
        elem = this.getRawNode(elem);

        var offsetParent = elem.offsetParent || document.documentElement;

        function isStaticPositioned(el) {
            return (window.getComputedStyle(el).position || 'static') === 'static';
        }

        while (offsetParent && offsetParent !== document.documentElement && isStaticPositioned(offsetParent)) {
            offsetParent = offsetParent.offsetParent;
        }

        return offsetParent || document.documentElement;
    }

    /**
     * Provides the scrollbar width, concept from TWBS measureScrollbar()
     * function in https://github.com/twbs/bootstrap/blob/master/js/modal.js
     * In IE and Edge, scollbar on body and html element overlay and should
     * return a width of 0.
     *
     * @returns {number} The width of the browser scollbar.
     */
    scrollbarWidth(isBody: boolean) {
        if (isBody) {
            // angular.isUndefined -> 
            if (this.BODY_SCROLLBAR_WIDTH == null) {
                var bodyElem = document.querySelector('body');
                // bodyElem.addClass('uib-position-body-scrollbar-measure');
                this.renderer.addClass(bodyElem, "uib-position-body-scrollbar-measure");
                this.BODY_SCROLLBAR_WIDTH = window.innerWidth - bodyElem[0].clientWidth;
                this.BODY_SCROLLBAR_WIDTH = isFinite(this.BODY_SCROLLBAR_WIDTH) ? this.BODY_SCROLLBAR_WIDTH : 0;
                // bodyElem.removeClass('uib-position-body-scrollbar-measure');
                this.renderer.removeClass(bodyElem, "uib-position-body-scrollbar-measure");

            }
            return this.BODY_SCROLLBAR_WIDTH;
        }

        if (this.SCROLLBAR_WIDTH == null) {
            // var scrollElem = angular.element('<div class="uib-position-scrollbar-measure"></div>');
            var scrollElem = document.createElement('<div class="uib-position-scrollbar-measure"></div>');
            // document.find('body').append(scrollElem);
            document.querySelector('body').appendChild(scrollElem);
            this.SCROLLBAR_WIDTH = scrollElem[0].offsetWidth - scrollElem[0].clientWidth;
            this.SCROLLBAR_WIDTH = isFinite(this.SCROLLBAR_WIDTH) ? this.SCROLLBAR_WIDTH : 0;
            scrollElem.remove();
        }

        return this.SCROLLBAR_WIDTH;
    }

    /**
     * Provides the padding required on an element to replace the scrollbar.
     *
     * @returns {object} An object with the following properties:
     *   <ul>
     *     <li>**scrollbarWidth**: the width of the scrollbar</li>
     *     <li>**widthOverflow**: whether the the width is overflowing</li>
     *     <li>**right**: the amount of right padding on the element needed to replace the scrollbar</li>
     *     <li>**rightOriginal**: the amount of right padding currently on the element</li>
     *     <li>**heightOverflow**: whether the the height is overflowing</li>
     *     <li>**bottom**: the amount of bottom padding on the element needed to replace the scrollbar</li>
     *     <li>**bottomOriginal**: the amount of bottom padding currently on the element</li>
     *   </ul>
     */
    scrollbarPadding(elem) {
        elem = this.getRawNode(elem);

        var elemStyle = window.getComputedStyle(elem);
        var paddingRight = this.parseStyle(elemStyle.paddingRight);
        var paddingBottom = this.parseStyle(elemStyle.paddingBottom);
        var scrollParent = this.scrollParent(elem, false, true);
        var scrollbarWidth = this.scrollbarWidth(BODY_REGEX.test(scrollParent.tagName));

        return {
            scrollbarWidth: scrollbarWidth,
            widthOverflow: scrollParent.scrollWidth > scrollParent.clientWidth,
            right: paddingRight + scrollbarWidth,
            originalRight: paddingRight,
            heightOverflow: scrollParent.scrollHeight > scrollParent.clientHeight,
            bottom: paddingBottom + scrollbarWidth,
            originalBottom: paddingBottom
        };
    }

    /**
     * Checks to see if the element is scrollable.
     *
     * @param {element} elem - The element to check.
     * @param {boolean=} [includeHidden=false] - Should scroll style of 'hidden' be considered,
     *   default is false.
     *
     * @returns {boolean} Whether the element is scrollable.
     */
    isScrollable(elem, includeHidden) {
        elem = this.getRawNode(elem);

        var overflowRegex = includeHidden ? OVERFLOW_REGEX.hidden : OVERFLOW_REGEX.normal;
        var elemStyle = window.getComputedStyle(elem);
        return overflowRegex.test(elemStyle.overflow + elemStyle.overflowY + elemStyle.overflowX);
    }

    /**
     * Provides the closest scrollable ancestor.
     * A port of the jQuery UI scrollParent method:
     * https://github.com/jquery/jquery-ui/blob/master/ui/scroll-parent.js
     *
     * @param {element} elem - The element to find the scroll parent of.
     * @param {boolean=} [includeHidden=false] - Should scroll style of 'hidden' be considered,
     *   default is false.
     * @param {boolean=} [includeSelf=false] - Should the element being passed be
     * included in the scrollable llokup.
     *
     * @returns {element} A HTML element.
     */
    scrollParent(elem, includeHidden?, includeSelf?) {
        elem = this.getRawNode(elem);

        var overflowRegex = includeHidden ? OVERFLOW_REGEX.hidden : OVERFLOW_REGEX.normal;
        var documentEl = document.documentElement;
        var elemStyle = window.getComputedStyle(elem);
        if (includeSelf && overflowRegex.test(elemStyle.overflow + elemStyle.overflowY + elemStyle.overflowX)) {
            return elem;
        }
        var excludeStatic = elemStyle.position === 'absolute';
        var scrollParent = elem.parentElement || documentEl;

        if (scrollParent === documentEl || elemStyle.position === 'fixed') {
            return documentEl;
        }

        while (scrollParent.parentElement && scrollParent !== documentEl) {
            var spStyle = window.getComputedStyle(scrollParent);
            if (excludeStatic && spStyle.position !== 'static') {
                excludeStatic = false;
            }

            if (!excludeStatic && overflowRegex.test(spStyle.overflow + spStyle.overflowY + spStyle.overflowX)) {
                break;
            }
            scrollParent = scrollParent.parentElement;
        }

        return scrollParent;
    }

    /**
     * Provides read-only equivalent of jQuery's position function:
     * http://api.jquery.com/position/ - distance to closest positioned
     * ancestor.  Does not account for margins by default like jQuery position.
     *
     * @param {element} elem - The element to caclulate the position on.
     * @param {boolean=} [includeMargins=false] - Should margins be accounted
     * for, default is false.
     *
     * @returns {object} An object with the following properties:
     *   <ul>
     *     <li>**width**: the width of the element</li>
     *     <li>**height**: the height of the element</li>
     *     <li>**top**: distance to top edge of offset parent</li>
     *     <li>**left**: distance to left edge of offset parent</li>
     *   </ul>
     */
    position(elem: HTMLElement, includeMagins?: boolean) {
        elem = this.getRawNode(elem);

        var elemOffset = this.offset(elem);
        if (includeMagins) {
            var elemStyle = window.getComputedStyle(elem);
            elemOffset.top -= this.parseStyle(elemStyle.marginTop);
            elemOffset.left -= this.parseStyle(elemStyle.marginLeft);
        }
        var parent = this.offsetParent(elem);
        var parentOffset = { top: 0, left: 0 };

        if (parent !== document.documentElement) {
            parentOffset = this.offset(parent);
            parentOffset.top += parent.clientTop - parent.scrollTop;
            parentOffset.left += parent.clientLeft - parent.scrollLeft;
        }

        return {
            // angular.isNumber -> !isNaN
            width: Math.round(!isNaN(elemOffset.width) ? elemOffset.width : elem.offsetWidth),
            height: Math.round(!isNaN(elemOffset.height) ? elemOffset.height : elem.offsetHeight),
            top: Math.round(elemOffset.top - parentOffset.top),
            left: Math.round(elemOffset.left - parentOffset.left)
        };
    }

    //HTMLElement
    /**
     * Provides read-only equivalent of jQuery's offset function:
     * http://api.jquery.com/offset/ - distance to viewport.  Does
     * not account for borders, margins, or padding on the body
     * element.
     *
     * @param {element} elem - The element to calculate the offset on.
     *
     * @returns {object} An object with the following properties:
     *   <ul>
     *     <li>**width**: the width of the element</li>
     *     <li>**height**: the height of the element</li>
     *     <li>**top**: distance to top edge of viewport</li>
     *     <li>**right**: distance to bottom edge of viewport</li>
     *   </ul>
     */
    offset(elem: HTMLElement) {
        elem = this.getRawNode(elem);

        var elemBCR = elem.getBoundingClientRect();
        return {
            width: Math.round(!isNaN(elemBCR.width) ? elemBCR.width : elem.offsetWidth),
            height: Math.round(!isNaN(elemBCR.height) ? elemBCR.height : elem.offsetHeight),
            top: Math.round(elemBCR.top + (window.pageYOffset || document.documentElement.scrollTop)),
            left: Math.round(elemBCR.left + (window.pageXOffset || document.documentElement.scrollLeft))
        };
    }

    /**
     * Provides offset distance to the closest scrollable ancestor
     * or viewport.  Accounts for border and scrollbar width.
     *
     * Right and bottom dimensions represent the distance to the
     * respective edge of the viewport element.  If the element
     * edge extends beyond the viewport, a negative value will be
     * reported.
     *
     * @param {element} elem - The element to get the viewport offset for.
     * @param {boolean=} [useDocument=false] - Should the viewport be the document element instead
     * of the first scrollable element, default is false.
     * @param {boolean=} [includePadding=true] - Should the padding on the offset parent element
     * be accounted for, default is true.
     *
     * @returns {object} An object with the following properties:
     *   <ul>
     *     <li>**top**: distance to the top content edge of viewport element</li>
     *     <li>**bottom**: distance to the bottom content edge of viewport element</li>
     *     <li>**left**: distance to the left content edge of viewport element</li>
     *     <li>**right**: distance to the right content edge of viewport element</li>
     *   </ul>
     */
    viewportOffset(elem, useDocument, includePadding?: boolean) {
        elem = this.getRawNode(elem);
        includePadding = includePadding !== false ? true : false;

        var elemBCR = elem.getBoundingClientRect();
        var offsetBCR = { top: 0, left: 0, bottom: 0, right: 0 };

        var offsetParent = useDocument ? document.documentElement : this.scrollParent(elem);
        var offsetParentBCR = offsetParent.getBoundingClientRect();

        offsetBCR.top = offsetParentBCR.top + offsetParent.clientTop;
        offsetBCR.left = offsetParentBCR.left + offsetParent.clientLeft;
        if (offsetParent === document.documentElement) {
            offsetBCR.top += window.pageYOffset;
            offsetBCR.left += window.pageXOffset;
        }
        offsetBCR.bottom = offsetBCR.top + offsetParent.clientHeight;
        offsetBCR.right = offsetBCR.left + offsetParent.clientWidth;

        if (includePadding) {
            var offsetParentStyle = window.getComputedStyle(offsetParent);
            offsetBCR.top += this.parseStyle(offsetParentStyle.paddingTop);
            offsetBCR.bottom -= this.parseStyle(offsetParentStyle.paddingBottom);
            offsetBCR.left += this.parseStyle(offsetParentStyle.paddingLeft);
            offsetBCR.right -= this.parseStyle(offsetParentStyle.paddingRight);
        }

        return {
            top: Math.round(elemBCR.top - offsetBCR.top),
            bottom: Math.round(offsetBCR.bottom - elemBCR.bottom),
            left: Math.round(elemBCR.left - offsetBCR.left),
            right: Math.round(offsetBCR.right - elemBCR.right)
        };
    }

    /**
     * Provides an array of placement values parsed from a placement string.
     * Along with the 'auto' indicator, supported placement strings are:
     *   <ul>
     *     <li>top: element on top, horizontally centered on host element.</li>
     *     <li>top-left: element on top, left edge aligned with host element left edge.</li>
     *     <li>top-right: element on top, lerightft edge aligned with host element right edge.</li>
     *     <li>bottom: element on bottom, horizontally centered on host element.</li>
     *     <li>bottom-left: element on bottom, left edge aligned with host element left edge.</li>
     *     <li>bottom-right: element on bottom, right edge aligned with host element right edge.</li>
     *     <li>left: element on left, vertically centered on host element.</li>
     *     <li>left-top: element on left, top edge aligned with host element top edge.</li>
     *     <li>left-bottom: element on left, bottom edge aligned with host element bottom edge.</li>
     *     <li>right: element on right, vertically centered on host element.</li>
     *     <li>right-top: element on right, top edge aligned with host element top edge.</li>
     *     <li>right-bottom: element on right, bottom edge aligned with host element bottom edge.</li>
     *   </ul>
     * A placement string with an 'auto' indicator is expected to be
     * space separated from the placement, i.e: 'auto bottom-left'  If
     * the primary and secondary placement values do not match 'top,
     * bottom, left, right' then 'top' will be the primary placement and
     * 'center' will be the secondary placement.  If 'auto' is passed, true
     * will be returned as the 3rd value of the array.
     *
     * @param {string} placement - The placement string to parse.
     *
     * @returns {array} An array with the following values
     * <ul>
     *   <li>**[0]**: The primary placement.</li>
     *   <li>**[1]**: The secondary placement.</li>
     *   <li>**[2]**: If auto is passed: true, else undefined.</li>
     * </ul>
     */
    parsePlacement(placement: string) {
        var autoPlace = PLACEMENT_REGEX.auto.test(placement);
        if (autoPlace) {
            placement = placement.replace(PLACEMENT_REGEX.auto, '');
        }

        let placementArr: Array<any> = placement.split('-');

        placementArr[0] = placementArr[0] || 'top';
        if (!PLACEMENT_REGEX.primary.test(placementArr[0])) {
            placementArr[0] = 'top';
        }

        placementArr[1] = placementArr[1] || 'center';
        if (!PLACEMENT_REGEX.secondary.test(placementArr[1])) {
            placementArr[1] = 'center';
        }

        if (autoPlace) {
            placementArr[2] = true;
        } else {
            placementArr[2] = false;
        }

        return placementArr;
    }

    /**
     * Provides coordinates for an element to be positioned relative to
     * another element.  Passing 'auto' as part of the placement parameter
     * will enable smart placement - where the element fits. i.e:
     * 'auto left-top' will check to see if there is enough space to the left
     * of the hostElem to fit the targetElem, if not place right (same for secondary
     * top placement).  Available space is calculated using the viewportOffset
     * function.
     *
     * @param {element} hostElem - The element to position against.
     * @param {element} targetElem - The element to position.
     * @param {string=} [placement=top] - The placement for the targetElem,
     *   default is 'top'. 'center' is assumed as secondary placement for
     *   'top', 'left', 'right', and 'bottom' placements.  Available placements are:
     *   <ul>
     *     <li>top</li>
     *     <li>top-right</li>
     *     <li>top-left</li>
     *     <li>bottom</li>
     *     <li>bottom-left</li>
     *     <li>bottom-right</li>
     *     <li>left</li>
     *     <li>left-top</li>
     *     <li>left-bottom</li>
     *     <li>right</li>
     *     <li>right-top</li>
     *     <li>right-bottom</li>
     *   </ul>
     * @param {boolean=} [appendToBody=false] - Should the top and left values returned
     *   be calculated from the body element, default is false.
     *
     * @returns {object} An object with the following properties:
     *   <ul>
     *     <li>**top**: Value for targetElem top.</li>
     *     <li>**left**: Value for targetElem left.</li>
     *     <li>**placement**: The resolved placement.</li>
     *   </ul>
     */
    positionElements(hostElem, targetElem, placement, appendToBody) {
        hostElem = this.getRawNode(hostElem);
        targetElem = this.getRawNode(targetElem);

        // need to read from prop to support tests.
        // angular.isDefined
        var targetWidth = (targetElem.offsetWidth != null) ? targetElem.offsetWidth : targetElem.prop('offsetWidth');
        var targetHeight = (targetElem.offsetHeight != null) ? targetElem.offsetHeight : targetElem.prop('offsetHeight');

        placement = this.parsePlacement(placement);

        var hostElemPos = appendToBody ? this.offset(hostElem) : this.position(hostElem);
        var targetElemPos = { top: 0, left: 0, placement: '' };

        if (placement[2]) {
            var viewportOffset = this.viewportOffset(hostElem, appendToBody);

            var targetElemStyle = window.getComputedStyle(targetElem);
            var adjustedSize = {
                width: targetWidth + Math.round(Math.abs(this.parseStyle(targetElemStyle.marginLeft) + this.parseStyle(targetElemStyle.marginRight))),
                height: targetHeight + Math.round(Math.abs(this.parseStyle(targetElemStyle.marginTop) + this.parseStyle(targetElemStyle.marginBottom)))
            };
            if (placement[0] !== 'top') {
                placement[0] = placement[0] === 'top' && adjustedSize.height > viewportOffset.top && adjustedSize.height <= viewportOffset.bottom ? 'bottom' :
                    placement[0] === 'bottom' && adjustedSize.height > viewportOffset.bottom && adjustedSize.height <= viewportOffset.top ? 'top' :
                        placement[0] === 'left' && adjustedSize.width > viewportOffset.left && adjustedSize.width <= viewportOffset.right ? 'right' :
                            placement[0] === 'right' && adjustedSize.width > viewportOffset.right && adjustedSize.width <= viewportOffset.left ? 'left' :
                                placement[0];
            }

            placement[1] = placement[1] === 'top' && adjustedSize.height - hostElemPos.height > viewportOffset.bottom && adjustedSize.height - hostElemPos.height <= viewportOffset.top ? 'bottom' :
                placement[1] === 'bottom' && adjustedSize.height - hostElemPos.height > viewportOffset.top && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom ? 'top' :
                    placement[1] === 'left' && adjustedSize.width - hostElemPos.width > viewportOffset.right && adjustedSize.width - hostElemPos.width <= viewportOffset.left ? 'right' :
                        placement[1] === 'right' && adjustedSize.width - hostElemPos.width > viewportOffset.left && adjustedSize.width - hostElemPos.width <= viewportOffset.right ? 'left' :
                            placement[1];

            if (placement[1] === 'center') {
                if (PLACEMENT_REGEX.vertical.test(placement[0])) {
                    var xOverflow = hostElemPos.width / 2 - targetWidth / 2;
                    if (viewportOffset.left + xOverflow < 0 && adjustedSize.width - hostElemPos.width <= viewportOffset.right) {
                        placement[1] = 'left';
                    } else if (viewportOffset.right + xOverflow < 0 && adjustedSize.width - hostElemPos.width <= viewportOffset.left) {
                        placement[1] = 'right';
                    }
                } else {
                    var yOverflow = hostElemPos.height / 2 - adjustedSize.height / 2;
                    if (viewportOffset.top + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom) {
                        placement[1] = 'top';
                    } else if (viewportOffset.bottom + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.top) {
                        placement[1] = 'bottom';
                    }
                }
            }
        }

        switch (placement[0]) {
            case 'top':
                targetElemPos.top = hostElemPos.top - targetHeight;
                break;
            case 'bottom':
                targetElemPos.top = hostElemPos.top + hostElemPos.height;
                break;
            case 'left':
                targetElemPos.left = hostElemPos.left - targetWidth;
                break;
            case 'right':
                targetElemPos.left = hostElemPos.left + hostElemPos.width;
                break;
        }

        switch (placement[1]) {
            case 'top':
                targetElemPos.top = hostElemPos.top;
                break;
            case 'bottom':
                targetElemPos.top = hostElemPos.top + hostElemPos.height - targetHeight;
                break;
            case 'left':
                targetElemPos.left = hostElemPos.left;
                break;
            case 'right':
                targetElemPos.left = hostElemPos.left + hostElemPos.width - targetWidth;
                break;
            case 'center':
                if (PLACEMENT_REGEX.vertical.test(placement[0])) {
                    targetElemPos.left = hostElemPos.left + hostElemPos.width / 2 - targetWidth / 2;
                } else {
                    targetElemPos.top = hostElemPos.top + hostElemPos.height / 2 - targetHeight / 2;
                }
                break;
        }

        targetElemPos.top = Math.round(targetElemPos.top);
        targetElemPos.left = Math.round(targetElemPos.left);
        targetElemPos.placement = placement[1] === 'center' ? placement[0] : placement[0] + '-' + placement[1];

        return targetElemPos;
    }

    /**
     * Provides a way to adjust the top positioning after first
     * render to correctly align element to top after content
     * rendering causes resized element height
     *
     * @param {array} placementClasses - The array of strings of classes
     * element should have.
     * @param {object} containerPosition - The object with container
     * position information
     * @param {number} initialHeight - The initial height for the elem.
     * @param {number} currentHeight - The current height for the elem.
     */
    adjustTop(placementClasses, containerPosition, initialHeight, currentHeight) {
        if (placementClasses.indexOf('top') !== -1 && initialHeight !== currentHeight) {
            return {
                top: containerPosition.top - currentHeight + 'px'
            };
        }
    }

    /**
     * Provides a way for positioning tooltip & dropdown
     * arrows when using placement options beyond the standard
     * left, right, top, or bottom.
     *
     * @param {element} elem - The tooltip/dropdown element.
     * @param {string} placement - The placement for the elem.
     */
    positionArrow(elem: HTMLElement, placement) {
        elem = this.getRawNode(elem);

        var innerElem = elem.querySelector('.tooltip-inner, .popover-inner');
        if (!innerElem) {
            return;
        }

        // var isTooltip = angular.element(innerElem).hasClass('tooltip-inner');
        var isTooltip = innerElem.classList.contains('tooltip-inner');

        var arrowElem = isTooltip ? elem.querySelector('.tooltip-arrow') : elem.querySelector('.arrow');
        if (!arrowElem) {
            return;
        }

        var arrowCss = {
            top: '',
            bottom: '',
            left: '',
            right: ''
        };

        placement = this.parsePlacement(placement);
        if (placement[1] === 'center') {
            // no adjustment necessary - just reset styles
            // angular.element(arrowElem).css(arrowCss);
            this.renderer.setStyle(arrowElem, "top", arrowCss.top);
            this.renderer.setStyle(arrowElem, "bottom", arrowCss.bottom);
            this.renderer.setStyle(arrowElem, "left", arrowCss.left);
            this.renderer.setStyle(arrowElem, "right", arrowCss.right);
            return;
        }

        var borderProp = 'border-' + placement[0] + '-width';
        var borderWidth = window.getComputedStyle(elem)[borderProp];

        var borderRadiusProp = 'border-';
        if (PLACEMENT_REGEX.vertical.test(placement[0])) {
            borderRadiusProp += placement[0] + '-' + placement[1];
        } else {
            borderRadiusProp += placement[1] + '-' + placement[0];
        }
        borderRadiusProp += '-radius';
        var borderRadius = window.getComputedStyle(isTooltip ? innerElem : elem)[borderRadiusProp];

        switch (placement[0]) {
            case 'top':
                arrowCss.bottom = isTooltip ? '0' : '-' + borderWidth;
                break;
            case 'bottom':
                arrowCss.top = isTooltip ? '0' : '-' + borderWidth;
                break;
            case 'left':
                arrowCss.right = isTooltip ? '0' : '-' + borderWidth;
                break;
            case 'right':
                arrowCss.left = isTooltip ? '0' : '-' + borderWidth;
                break;
        }

        arrowCss[placement[1]] = borderRadius;

        // angular.element(arrowElem).css(arrowCss);
        this.renderer.setStyle(arrowElem, "top", arrowCss.top);
        this.renderer.setStyle(arrowElem, "bottom", arrowCss.bottom);
        this.renderer.setStyle(arrowElem, "left", arrowCss.left);
        this.renderer.setStyle(arrowElem, "right", arrowCss.right);
    }
}

@NgModule({
    providers: [UIPositionService]
})
export class UIPositionModule { }
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