// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { orderBy } from 'lodash';

import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../../shared/icons/icons.service';
import { asc } from '../../../../core/config/constants/general.const';
import { ChangeTrackerService } from '../../../../shared/guards/change-tracker/change-tracker.service';
import { AcceptLoosingChangesComponent } from '../../../../shared/components/accept-loosing-changes/accept-loosing-changes.component';
import { ConnectivityMapTree } from '../../../../contracts/models/connectivity-map/connectivity-map-tree.model';
import { ParsingEngineService } from '../../../../shared/services/parsing-engine.service';
import { ParsingInfo } from '../../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { LabLotTest, SlideGenSchedule } from '../../shared/models/lab-lot-test.model';
import { ReviewStatus } from '../../shared/models/review-status.model';
import { MappingService } from '../../mapping/mapping.service';


@Component({
  selector: 'unext-connectivity-scheduler-details',
  templateUrl: './connectivity-scheduler-details.component.html',
  styleUrls: ['./connectivity-scheduler-details.component.scss']
})
export class ConnectivitySchedulerDetailsComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild('schedulerListContainer') schedulerListContainerElement: ElementRef;
  @ViewChildren('schedulerItem') schedulerItemElements: QueryList<ElementRef>;
  @Input() disableUploadButton: boolean;
  @Input() labLocationId: string;
  @Output() backClicked = new EventEmitter();
  @Output() upload: EventEmitter<Array<SlideGenSchedule>> = new EventEmitter();

  private _analytes: Array<LabLotTest> = [];
  get analytes(): Array<LabLotTest> {
    return this._analytes;
  }

  @Input('analytes')
  set analytes(value: Array<LabLotTest>) {
    if (value && value.length > 0) {
      this._analytes = orderBy(value, [
        (analyte: LabLotTest) => analyte.departmentName.replace(/\s/g, '').toLocaleLowerCase(),
        (analyte: LabLotTest) => (analyte.instrumentCustomName || analyte.instrumentName).replace(/\s/g, '').toLocaleLowerCase(),
        (analyte: LabLotTest) => (analyte.controlCustomName || analyte.controlName).replace(/\s/g, '').toLocaleLowerCase(),
        (analyte: LabLotTest) => analyte.analyteName.replace(/\s/g, '').toLocaleLowerCase(),
      ], [asc, asc, asc]);
      this._analytes = this._analytes.map((analyte: LabLotTest) => {
        analyte.reviewStatus = analyte.reviewStatus ? analyte.reviewStatus : ReviewStatus.Empty;
        return analyte;
      });
      this.updateFilteredAnalytes();
      this.getElementHeight();
    } else {
      this._analytes = [];
    }
  }

  public analytesFiltered: Array<LabLotTest> = [];
  public reviewStatus: ReviewStatus = ReviewStatus.Empty;
  public _ReviewStatus = ReviewStatus; // tobe used in html
  public pages = [];
  public recordsPerPage = 6;
  public selectedPageNumber = 1;
  public selectedItemIndex = -1;
  public containerHeight: number;
  public schedulerItemHeight: number;
  public slideGenSchedules: Array<SlideGenSchedule> = [];
  public allAnalytesReviewed: boolean;
  public destroy$ = new Subject<boolean>();

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.navigateBefore[24],
    icons.navigateNext[24],
    icons.check[24]
  ];

  cdTranformerId: string;
  codesMapTree: ConnectivityMapTree[] = []
  vitros: Array<string> = [
    'fusion',
    '3400',
    '3600',
    '4600',
    '5600',
    '7600'
  ];

  constructor(
    private iconService: IconService,
    public dialog: MatDialog,
    private changeTrackerService: ChangeTrackerService,
    private connectivityMapService: MappingService,
    private parsingEngineService: ParsingEngineService,
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit(): void {
    this.parsingEngineService.getInstructions(this.labLocationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ParsingInfo) => {
        if(res){
          const cdTransformer = res.configs.find(el => el.isConfigured && el.transformerName.includes('Vitros CD Transformer'))
          this.cdTranformerId = cdTransformer.id;
          this.getCodesMapTree();
        }
      });

    this.setupChangeTracker();
  }

  ngAfterViewInit(): void {
    this.getElementHeight();
  }

  private getCodesMapTree(){
    this.connectivityMapService.createConnectivityMapTrees(this.labLocationId);
    this.connectivityMapService.currentConnectivityMapTrees
    .pipe(takeUntil(this.destroy$))
    .subscribe((trees: ConnectivityMapTree[]) => {
      this.codesMapTree = trees;
      this.filterAnylytesByVitrosNotMappedToVitrosCdCode(this.analytes);
    })
  }

  private getElementHeight(): void {
    setTimeout(() => {
      this.containerHeight = this.schedulerListContainerElement?.nativeElement?.offsetHeight;
      this.schedulerItemHeight = this.schedulerItemElements.length > 0 ? this.schedulerItemElements.first.nativeElement.offsetHeight : 0;
      this.adjustPagesAsPerContainerHeight(); // This has to call after height is available.
    }, 0);
  }

  private filterAnylytesByVitrosNotMappedToVitrosCdCode(analytesFilteredByStatus: LabLotTest[]): void {
    const analytesFilteredByVitrosNotMapped = analytesFilteredByStatus.filter((analyte: LabLotTest) => {
      const isValidVitro = this.vitros.some(vitroName => analyte.instrumentName.toLocaleLowerCase().includes(vitroName));
      if(!isValidVitro){
        return true;
      }
      const vitroCodeTree = this.codesMapTree.find(code => code.parsingJobConfigId === this.cdTranformerId && code.instrumentId === analyte.instrumentId);
      return vitroCodeTree === undefined;
    });

    if (analytesFilteredByVitrosNotMapped.length > 0) {
      this.analytesFiltered = analytesFilteredByVitrosNotMapped;
    }
  }

  public filterItems(reviewStatus: ReviewStatus): void {
    if (this.reviewStatus !== reviewStatus) {
      this.selectPage(1);
      this.selectedItemIndex = -1;
    }
    this.reviewStatus = reviewStatus;
    this.updateFilteredAnalytes();
  }

  public updateFilteredAnalytes(): void {
    this.analytesFiltered = this.analytes.filter((analyte: LabLotTest) => {
      return analyte.reviewStatus === this.reviewStatus;
    });
    this.filterAnylytesByVitrosNotMappedToVitrosCdCode(this.analytesFiltered);
    this.createPages();
  }

  public back(): void {
    if (this.changeTrackerService.unSavedChanges) {
      this.showLoosingChangesDialog();
    } else {
      this.backClicked.emit();
    }
  }

  private showLoosingChangesDialog(): void {
    const dialogRef = this.dialog.open(AcceptLoosingChangesComponent, {
      width: '450px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.backClicked.emit();
      }
    });
  }

  public selectPage(page: number): void {
    if (page >= 1 && page <= this.pages.length) {
      this.selectedPageNumber = page;
      this.selectedItemIndex = -1;
    }
  }

  public accept(id: string): void {
    const index = this.analytes.findIndex((analyte: LabLotTest) => analyte.id === id);
    this.analytes[index].reviewStatus = ReviewStatus.Accepted;
    this.updateFilteredAnalytes();
    this.changeTrackerService.setDirty();
  }

  public getCount(reviewStatus: ReviewStatus): number {
    const count = this.analytes.filter((analyte: LabLotTest) => {
      const analyteMapped = this.codesMapTree.find(code =>
          code.instrumentId === analyte.instrumentId &&
          this.vitros.some(vitroName => analyte.instrumentName.includes(vitroName)))

        return analyte.reviewStatus === reviewStatus && !analyteMapped;
    }).length;
    if (reviewStatus === ReviewStatus.Empty) {
      this.allAnalytesReviewed = count === 0;
    }
    return count;
  }

  public createPages(): void {
    const numberOfPages = Math.ceil(this.analytesFiltered.length / this.recordsPerPage);
    this.pages = Array(numberOfPages).fill(1).map((x, i) => i + 1); // creates and array of numbers starting from 1 to numberOfPages
    if (this.selectedPageNumber > this.pages.length || this.pages.length <= 1) {
      this.selectPage(this.pages.length);
    }
  }

  public schedulerRowsChanged(index: number): void {
    this.changeTrackerService.setDirty();
  }

  public adjustPagesAsPerContainerHeight(recalculateHeight?: boolean, index?: number): void {
    if (this.containerHeight > 0 && this.schedulerItemHeight > 0) {
      if (recalculateHeight && index >= 0) {
        const editingRowHeight = this.schedulerItemElements.toArray()[index].nativeElement.offsetHeight;
        this.recordsPerPage = Math.floor((this.containerHeight - editingRowHeight) / this.schedulerItemHeight) + 1;
      } else {
        this.recordsPerPage = Math.floor(this.containerHeight / this.schedulerItemHeight);
      }
      this.recordsPerPage -= 3;
    }
    this.createPages();
  }

  public updateSlideGenSchedules(slideGenSchedules: Array<SlideGenSchedule>): void {
    const analyteToUpdate = this.analytesFiltered.find(el => el.id === slideGenSchedules[0].labLotTestId);
    if (analyteToUpdate) {
      analyteToUpdate.slideGenSchedules = slideGenSchedules;
      analyteToUpdate.reviewStatus = ReviewStatus.Edited;
      this.filterItems(this.reviewStatus);
    }
  }

  public submit(): void {
    if (this.analytes?.length > 0) {
      for (const analyte of this.analytes) {
        if (analyte.slideGenSchedules && analyte.slideGenSchedules.length > 0) {
          this.slideGenSchedules = this.slideGenSchedules.concat(analyte.slideGenSchedules);
        }
      }
    }
    this.upload.emit(this.slideGenSchedules);
  }

  public setupChangeTracker(): void {
    this.changeTrackerService.getDialogRef(async () => {
      this.backClicked.emit();
    });
  }

  public onCancel(value) {
    if (value) {
      this.selectedItemIndex = -1; // reset the selectedItemIndex variable
      if (this.getCount(ReviewStatus.Accepted) === 0 && this.getCount(ReviewStatus.Edited) === 0) {
        this.changeTrackerService.resetDirty();
      }
      this.adjustPagesAsPerContainerHeight();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.changeTrackerService.resetDirty();
  }
}
