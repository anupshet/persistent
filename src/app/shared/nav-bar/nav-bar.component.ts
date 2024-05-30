import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { unsubscribe } from '../../core/helpers/rxjs-helper';
import { Icon } from '../../contracts/models/shared/icon.model';
import { icons } from '../../core/config/constants/icon.const';
import { IconService } from '../icons/icons.service';
import { unRouting } from '../../core/config/constants/un-routing-methods.const';

@Component({
  selector: 'unext-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {
  @Input() title: string;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.help[24],
  ];

  private routerEventSubscription: Subscription;

  constructor(
    private router: Router,
    private iconService: IconService,
    public translate: TranslateService
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  public home(event) {
    event.stopPropagation();
    this.router.navigate([unRouting.actionableDashboard]);
  }

  ngOnInit() {
    this.updateTitle();
    this.routerEventSubscription = this.router.events.subscribe(val => {
      this.updateTitle();
    });
  }

  ngOnDestroy() {
    unsubscribe(this.routerEventSubscription);
  }

  updateTitle() {
    const routeName = this.router.url.split('/')[1];
    const title = this.getTranslations('TRANSLATION.TITLE');
    const dashboardTitle = this.getTranslations('TRANSLATION.DASHBOARD');

    // nav bar lives at the root, so this must be set here
    this.title = routeName.toLowerCase() === unRouting.actionableDashboard ? title : '<' + dashboardTitle;
  }

  openHelpCenter() {
    // TODO: Hard-coded URL for now
    const url = 'https://qcnet.com/unitynexthelp';
    window.open(url, '_blank');
  }
  
  private getTranslations(codeToTranslate: string): string {
    let translatedContent:string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }
}
