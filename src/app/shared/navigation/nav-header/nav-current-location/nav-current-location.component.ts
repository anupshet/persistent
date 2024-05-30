// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil, filter, take } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

import * as fromRoot from '../../../../state/app.state';
import * as selectors from '../../state/selectors';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../icons/icons.service';
import { TreePill } from '../../../../contracts/models/lab-setup';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { ErrorLoggerService } from '../../../services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { ownControlsNavTittle, reports } from '../../../../core/config/constants/general.const';


@Component({
  selector: 'unext-nav-current-location',
  templateUrl: './nav-current-location.component.html',
  styleUrls: ['./nav-current-location.component.scss']
})
export class NavCurrentLocationComponent implements OnInit, OnDestroy, OnChanges {
  @Input() nodeType: EntityType;
  @Input() displayTitle: string;
  @Input() useSmallFont: boolean;
  @Output() navigateToParent = new EventEmitter<TreePill[]>();
  @Output() navigateToSettings = new EventEmitter();
  @Output() navigateToDashboard = new EventEmitter();
  @Input() instrumentsGroupedByDept: boolean;
  protected cleanUp$ = new Subject<boolean>();

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.arrowBack[48]
  ];
  userLocationId: string;
  currentBranch: TreePill[];
  isVisible: boolean;
  public displayText: string;
  public currentLocationType = EntityType.LabLocation;
  reportText = reports;
  reportTextLocalized = '';
  ownControlHeader = ownControlsNavTittle;
  hideBackArrow = false;


  constructor(
    private store: Store<fromRoot.State>,
    private iconService: IconService,
    public router: Router,
    private errorLoggerService: ErrorLoggerService,
    private translate: TranslateService
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit() {
    this.reportTextLocalized = this.getTranslations('TRANSLATION.REPORTS');
    this.store.pipe(select(selectors.getCurrentBranchState),
      filter(currBranch => !!currBranch),
      takeUntil(this.cleanUp$)).subscribe((currentBranch: TreePill[]) => {
        try {
          this.currentBranch = currentBranch;
        } catch (error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
              (componentInfo.NavCurrentLocationComponent + blankSpace + Operations.FetchCurrentBranch)));
        }
      });
  }

  ngOnChanges() {
    const navTitle = this.displayTitle;
    if (this.displayTitle === this.reportText) {
      this.reportToolTipLabels();
    } else {
      this.toolTipLabels();
    }
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (this.router.url.includes('define-control')) {
          this.displayTitle = this.getTranslations('NAV.SETTING.MANAGEOWNCONTROLS');
          this.hideBackArrow = true;
          this.displayText = '';
        } else {
          this.displayTitle = navTitle;
          this.hideBackArrow = false;
        }
      }
    });
    if(this.router.url.includes('define-control')) {
      this.displayTitle = this.getTranslations('NAV.SETTING.MANAGEOWNCONTROLS');
    }
  }

  toolTipLabels() {
    switch (this.nodeType) {
      case EntityType.LabLocation: this.displayText = this.getTranslations('TRANSLATION.GOSETTINGS');
        break;
      case EntityType.LabDepartment: this.displayText = this.getTranslations('TRANSLATION.GODEPARTMENTS');
        break;
      case EntityType.LabInstrument: this.displayText = this.getTranslations('TRANSLATION.INSTRUMENTS');
        break;
      case EntityType.LabProduct: this.displayText = this.getTranslations('TRANSLATION.LISTCONTROLS');
        break;
      case EntityType.LabTest: this.displayText = this.getTranslations('TRANSLATION.LISTANALYTES');
        break;
      default:
        this.displayText = '';
    }
  }

  reportToolTipLabels() {
    switch (this.nodeType) {
      case EntityType.LabLocation:
        this.displayText = this.instrumentsGroupedByDept
          ? this.getTranslations('TRANSLATION.GODEPARTMENTS')
          : this.getTranslations('TRANSLATION.INSTRUMENTS');
        break;
      case EntityType.LabDepartment:
        this.displayText = this.getTranslations('TRANSLATION.INSTRUMENTS');
        break;
      case EntityType.LabInstrument:
        this.displayText = this.getTranslations('TRANSLATION.LISTCONTROLS');
        break;
      case EntityType.LabProduct:
        this.displayText = this.getTranslations('TRANSLATION.LISTANALYTES');
        break;
      default:
        this.displayText = '';
    }
  }

  getLabel(displayTitle: string): string {
    return displayTitle === this.reportText ? this.getTranslations('REPORTNOTIFICATIONS.REPORTS') : displayTitle;
  }

  backButtonClick(event) {
    event.preventDefault();
    if (!this.router.url.includes('define-control')) {
      if (this.nodeType === EntityType.LabLocation) {
        this.navigateToSettings.emit();
      } else {
        this.navigateToParent.emit(this.currentBranch);
      }
    }
  }

  goToDashboard(event) {
    event.preventDefault();
    this.navigateToDashboard.emit(true);
  }

  getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  ngOnDestroy() {
    this.cleanUp$.next(true);
    if (this.cleanUp$) {
      this.cleanUp$.unsubscribe();
    }
  }
}
