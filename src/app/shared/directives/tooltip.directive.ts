// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Directive,
  ElementRef, EmbeddedViewRef, HostListener, Injector, Input, OnDestroy } from '@angular/core';

import { TooltipData } from '../../master/reporting/models/report-info';
import { CustomTooltipComponent } from '../components/custom-tooltip/custom-tooltip.component';


@Directive({
  selector: '[unextTooltip]'
})
export class TooltipDirective implements OnDestroy {
  @Input() tooltip: TooltipData;
  @Input() position = 'right';
  showTimeout: number;
  hideTimeout: number;

  private componentRef: ComponentRef<any> | null = null;

  constructor(private elementRef: ElementRef, private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector) {
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.initializeTooltip();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.setHideTooltipTimeout();
  }

  /**
   * On mouse enter event, gets reference of custom tooltip component and attaches it as view to the body
   */
  private initializeTooltip() {
    if (this.componentRef === null) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CustomTooltipComponent);
      this.componentRef = componentFactory.create(this.injector);
      this.appRef.attachView(this.componentRef.hostView);
      const [tooltipDOMElement] = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes;
      this.setTooltipComponentProperties();
      document.body.appendChild(tooltipDOMElement);
      this.showTimeout = window.setTimeout(this.showTooltip.bind(this), 100);
    }
  }

  /**
   * Gets position coordinates of the element which has triggered tooltip and positions
   * tooltip according to that element depending on the position left or right
   */
  private setTooltipComponentProperties() {
    if (this.componentRef !== null) {
      this.componentRef.instance.tooltip = this.tooltip;
      this.componentRef.instance.position = this.position;
      const { left, right, top, bottom } = this.elementRef.nativeElement.getBoundingClientRect();
      this.componentRef.instance.checkboxTopValue = top;
      // Left properties are changed here to accommodate according to tooltip required on dynamic reporting page
      // For a different implementation make changes here
      switch (this.position) {
        case 'right': {
          this.componentRef.instance.left = this.elementRef.nativeElement.getBoundingClientRect().right + 15;
          this.componentRef.instance.top = Math.round(top + (bottom - top) / 2);
          break;
        }
        case 'left': {
          this.componentRef.instance.left = this.elementRef.nativeElement.children[0].getBoundingClientRect().left - 15;
          this.componentRef.instance.top = Math.round(top + (bottom - top) / 2);
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  /**
   * Sets tooltip visibility to true
   */
  private showTooltip() {
    if (this.componentRef !== null) {
      this.componentRef.instance.visible = true;

    }
  }

  /**
   * Hides tooltip on mouse leave event
   */
  private setHideTooltipTimeout() {
    this.hideTimeout = window.setTimeout(this.destroy.bind(this), 100);
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  /**
   * Detaches component reference from the view and destroys its ref instance
   */
  destroy(): void {
    if (this.componentRef !== null) {
      window.clearInterval(this.showTimeout);
      window.clearInterval(100);
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
