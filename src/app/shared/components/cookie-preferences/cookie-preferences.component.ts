import { Component, OnInit } from '@angular/core';

import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../icons/icons.service';

@Component({
  selector: 'unext-cookie-preferences',
  templateUrl: './cookie-preferences.component.html',
  styleUrls: ['./cookie-preferences.component.scss']
})
export class CookiePreferencesComponent implements OnInit {

  icons = icons;
  iconsUsed: Array<Icon> = [this.icons.langDark[24]];

  constructor(private iconService: IconService) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit(): void {
  }

}

