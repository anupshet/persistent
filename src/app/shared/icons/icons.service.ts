// © 2023 Bio - Rad Laboratories, Inc.All Rights Reserved.
import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { Icon } from '../../contracts/models/shared/icon.model';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) { }

  addIcon(icon: Icon) {
    const icons: Array<Icon> = [icon];
    this.addIcons(icons);
  }

  addIcons(icons: Array<Icon>) {
    icons.forEach(icon => {
      if (icon) {
        this.iconRegistry.addSvgIcon(icon.name, this.sanitizer.bypassSecurityTrustResourceUrl(icon.path));
      }
    });
  }

  replayIcon(icon: Icon) {
    const icons: Array<Icon> = [icon];
    this.replayIcons(icons);
  }

  replayIcons(icons: Array<Icon>) {
    icons.forEach(icon => {
      if (icon) {
        this.iconRegistry.addSvgIcon(icon.name, this.sanitizer.bypassSecurityTrustResourceUrl(icon.path));
      }
    });
  }
}
