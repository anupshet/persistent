// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import * as sharedStateSelector from '../../../shared/state/selectors';
import * as fromRoot from '../../../state/app.state';
import * as selectors from '../../../shared/navigation/state/selectors';
import * as fromNavigationSelector from '../../../shared/navigation/state/selectors';

import { LabProduct, TreePill } from '../../../contracts/models/lab-setup';
import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import * as fromAccountSelector from '../../../shared/state/selectors';
import { ManufacturerProduct } from '../../../contracts/models/lab-setup/product-list.model';
import { nonBrManufacturerIdStr } from '../../../core/config/constants/general.const';

@Component({
  selector: 'unext-nav-secondary-nav',
  templateUrl: './nav-secondary-nav.component.html',
  styleUrls: ['./nav-secondary-nav.component.scss']
})
export class NavSecondaryNavComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<boolean>();
  protected selectedDateTime: Date = new Date();
  public navigationCurrentlySelectedNode$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode));
  public getArchiveToggle$ = this.store.pipe(select(fromNavigationSelector.getIsArchiveItemsToggleOn));
  currentAccount$ = this.store.pipe(select(fromAccountSelector.getAccountState));

  label: string;
  isDisabled: boolean;
  selectedNode: TreePill;
  lotexpiredata: boolean;
  public hasOnlyNonBrControl = false;
  public labConfigurationControlsList: ManufacturerProduct[] = [];
  public accountId: string;

  constructor(private store: Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService,
    private translate: TranslateService) { }

  ngOnInit() {
    combineLatest([
      this.store.pipe(select(selectors.getCurrentlySelectedNode)),
      this.store.pipe(select(selectors.getCurrentlySelectedLeaf)),
      this.store.pipe(select(sharedStateSelector.getViewReportState))
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([selectedNode, selectedLeaf]) => {
        try {
          this.checkControlManufacturer();
          if (selectedNode && selectedNode.nodeType === EntityType.LabInstrument) {
            this.label = 'QUICKACCESSREPORT.FROMINSTRUMENT';
          } else if (selectedNode && selectedNode.nodeType === EntityType.LabProduct && !selectedLeaf) {
            this.label = 'QUICKACCESSREPORT.FROMCONTROL';
          } else if (selectedLeaf && selectedLeaf.nodeType === EntityType.LabTest) {
            this.label = 'QUICKACCESSREPORT.FROMANALYTE';
          }
        } catch (error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(error.message));
        }
      });
  }


  getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  checkControlManufacturer() {
    this.navigationCurrentlySelectedNode$.pipe(filter(currentNode => !!currentNode),
      takeUntil(this.destroy$)).subscribe((currentNode: LabProduct) => {
        // Analyte and control page returns currentNode.nodeType: 5
        this.hasOnlyNonBrControl = currentNode.nodeType === EntityType.LabControl ?
        currentNode?.productInfo?.manufacturerId?.toString() === nonBrManufacturerIdStr : this.checkManufacturerId(currentNode);
      });
  }

  checkManufacturerId(currentNode: LabProduct | TreePill): boolean {
    // Check manufacturerId for instrument (currentNode.nodeType: 4) in currentNode.children
    return currentNode?.children?.every((control: LabProduct) => control?.productInfo?.manufacturerId?.toString() === nonBrManufacturerIdStr);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
