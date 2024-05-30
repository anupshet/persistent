import { Component, OnInit, ContentChild, TemplateRef, Input } from '@angular/core';

@Component({
  selector: 'br-info-tooltip',
  templateUrl: './info-tooltip.component.html',
})
export class InfoTooltipComponent implements OnInit {
  @Input() biggerIcon: boolean;

  @ContentChild(TemplateRef) template: TemplateRef<any>;

  ngOnInit() { }
}
