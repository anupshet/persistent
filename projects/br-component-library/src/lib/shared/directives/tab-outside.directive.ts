import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[brTabOutside]'
})
export class BrTabOutsideDirective {
  @Output() brTabOutside: EventEmitter<boolean> = new EventEmitter();

  constructor(private _elementRef: ElementRef) { }

  @HostListener('document:keyup', ['$event.target'])
  onMouseEnter(targetElement) {
    const tabbedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!tabbedInside) {
      this.brTabOutside.emit(true);
    }
  }

}
