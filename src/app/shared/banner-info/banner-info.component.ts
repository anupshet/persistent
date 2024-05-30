import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Icon } from '../../contracts/models/shared/icon.model';
import { icons } from '../../core/config/constants/icon.const';
import { IconService } from '../icons/icons.service';

@Component({
  selector: 'unext-banner-info',
  templateUrl: './banner-info.component.html',
  styleUrls: ['./banner-info.component.scss']
})
export class BannerInfoComponent implements OnInit {
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[48]
  ];

  @Input() loggedIn: boolean;
  @Output() closeClicked = new EventEmitter<any>();

  constructor(private iconService: IconService) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit(): void {
  }

  closeBanner() {
    this.closeClicked.emit();
  }
}
