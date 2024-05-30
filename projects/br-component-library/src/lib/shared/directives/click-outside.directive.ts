import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[brClickOutside]'
})
export class BrClickOutsideDirective {
  @Output() brClickOutside: EventEmitter<boolean> = new EventEmitter();

  constructor(private _elementRef: ElementRef) { }

  @HostListener('document:click', ['$event.target'])
  onMouseEnter(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.brClickOutside.emit(true);
    }
  }
}
