// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, HostListener, OnDestroy, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../../shared/icons/icons.service';
import { uniqBy, orderBy } from 'lodash';

import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { BaseEnableDisableDelete, ProductEnableDisableDelete, TestEnableDisableDelete } from '../../../../contracts/models/connectivity-map/base-enable-disable.model';
import { Chip } from '../../../../contracts/models/connectivity-map/chip.model';
import { MappingService } from '../mapping.service';
import { MappingDialogComponent } from '../shared/mapping-dialog/mapping-dialog.component';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { blankSpace, componentInfo, Operations } from '../../../../core/config/constants/error-logging.const';
import { asc, code as _code, nodeTypeNames } from '../../../../core/config/constants/general.const';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { ParsingInfo, ParsingJobConfig } from '../../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../../../../shared/models/audit-tracking.model';
import { ParsingEngineService } from '../../../../shared/services/parsing-engine.service';

@Component({
  selector: 'unext-connectivity-map-header',
  templateUrl: './map-header.component.html',
  styleUrls: ['./map-header.component.scss']
})
export class MapHeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  entityType: EntityType;
  entityId: string;
  unmappedChips: Array<Chip>;
  isDialogOpen: boolean;
  isCancel: boolean;
  selectedChipIndex: number;
  shadow = false;
  arrow = true;
  configurationsList: Array<ParsingJobConfig>;
  shadowUnmappedInstChips: Array<Chip>;
  selectedConfiguration: ParsingJobConfig;
  configurations: ParsingInfo;

  hSliderPos: number;
  permissions = Permissions;

  @Input() labLocationId: string;
  @ViewChild('horizontalScroll')
  horizontalScroll: PerfectScrollbarComponent;
  private destroy$ = new Subject<boolean>();

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.navigateNext[24],
    icons.navigateBefore[24]
  ];
  disableProduct: ProductEnableDisableDelete;
  disableTest: TestEnableDisableDelete;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private connectivityMapService: MappingService,
    public confirmLinkDialog: MatDialog,
    private dialogRef: MatDialogRef<any>,
    private iconService: IconService,
    private brPermissionsService: BrPermissionsService,
    private errorLoggerService: ErrorLoggerService,
    private parsingEngineService: ParsingEngineService
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit() {
    this.parsingEngineService.getInstructions(this.labLocationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ParsingInfo) => {
        this.setConfigurations(res);
      });

    this.connectivityMapService.currentEntityType
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        entityType => {
          this.entityType = entityType;
        }
      );

    this.connectivityMapService.currentEntityId
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        entityId => {
          this.entityId = entityId;
          this.getUnmappedChips();
          this.filterChips();
        });

    this.connectivityMapService.selectedConfigurationId
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        configurationId => {
          if (this.entityType === EntityType.LabInstrument && this.configurations) {
            if (configurationId) {
              this.selectedConfiguration = this.configurations?.configs?.find(el => el.id === configurationId);
              this.unmappedChips = this.shadowUnmappedInstChips.filter(el => el.parsingJobConfigId === configurationId);
            } else {
              this.unmappedChips = this.shadowUnmappedInstChips;
              this.selectedConfiguration = null;
            }
          }
        }
      );

    this.isDialogOpen = false;
    this.isCancel = false;
    this.hSliderPos = 0;

    this.connectivityMapService.triggerDataRefresh
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.dataRefresh();
        }
      );

    this.connectivityMapService.currentSelectedChipIndex
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        selectedChipIndex => {
          this.selectedChipIndex = selectedChipIndex;
        }
      );

    this.connectivityMapService.clearUnlinkedCodes();
  }

  ngAfterViewInit() {
    this.changeDetector.detectChanges();
  }

  private setConfigurations(config: ParsingInfo) {
    if (config) {
      this.configurations = config;
      this.configurationsList = this.configurations.configs.filter(el => el.isConfigured);
      this.configurationsList = orderBy(this.configurationsList, [el => el.name.replace(/\s/g, '')
        .toLocaleLowerCase()], [asc]);
      this.connectivityMapService.updateConfigurations(this.configurationsList);
    }
  }

  private dataRefresh(): void {
    this.getUnmappedChips();
    this.filterChips();
    this.shiftLatestUnmappedCodeToLeftMost();
  }

  private shiftLatestUnmappedCodeToLeftMost(): void {
    this.connectivityMapService.currentUnlinkedCodes
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        unlinkedCodes => {
          try {
            if (
              unlinkedCodes != null &&
              unlinkedCodes.length > 0 &&
              this.unmappedChips.length > 0
            ) {
              unlinkedCodes.forEach(code => {
                this.unmappedChips.unshift(
                  this.unmappedChips.splice(
                    this.unmappedChips.findIndex(chip => chip.code === code),
                    1
                  )[0]
                );
              });
            }
          } catch (err) {
            this.errorLoggerService.logErrorToBackend(
              this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
                (componentInfo.MapHeaderComponent + blankSpace + Operations.ShiftLatestUnmappedCodeToLeftMost)));
          }
        }
      );
  }

  private getUnmappedChips(): void {
    this.unmappedChips = [];

    switch (+this.entityType) {
      case EntityType.LabInstrument:
        this.connectivityMapService.currentUnmappedInstChips
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            unmappedInstChips => {
              this.shadowUnmappedInstChips = unmappedInstChips;
              this.unmappedChips = unmappedInstChips;
              if (this.selectedConfiguration) {
                this.onConfigurationChange(this.selectedConfiguration);
              }
            }
          );
        break;
      case EntityType.LabProduct:
        this.connectivityMapService.currentUnmappedProdChips
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            unmappedProdChips => {
              this.unmappedChips = this.getUniqueChips(unmappedProdChips);
            }
          );
        break;
      case EntityType.LabTest:
        this.connectivityMapService.currentUnmappedTestChips
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            unmappedTestChips => {
              this.unmappedChips = this.getUniqueChips(unmappedTestChips);
            }
          );
        break;
      default:
        this.connectivityMapService.currentUnmappedInstChips
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            unmappedInstChips => {
              this.unmappedChips = unmappedInstChips;
            }
          );
        break;
    }
  }

  private filterChips(): void {
    if (this.entityId != null) {
      switch (+this.entityType) {
        case EntityType.LabInstrument:
          break;
        case EntityType.LabProduct:
          this.unmappedChips = this.filterChipsByEntityId();
          break;
        case EntityType.LabTest:
          this.unmappedChips = this.filterChipsByEntityId();
          break;
        default:
          break;
      }
    }
  }

  private filterChipsByEntityId(): Array<Chip> {
    return this.unmappedChips.filter(chip => chip.parentId === this.entityId);
  }

  public getUniqueChips(unmappedChips: Array<Chip>): Array<Chip> {
    return uniqBy(unmappedChips, (chip: Chip) => [chip.code, chip.parentId].join());
  }

  public hasUnmappedCode() {
    const code = this.unmappedChips.filter(el => !el.disabled);
    return code?.length > 0;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    clearInterval(this.sliderTimer);
  }

  sliderTimer: any;
  arrowLeft = false;
  sliderLastLeft = 0;

  updateScrollY(ev) {
    if (ev.target.scrollTop > 0) {
      this.shadow = true;
    } else {
      this.shadow = false;
    }
  }

  updateEnabled() {
    this.arrowLeft = false;
    this.arrow = true;
    this.sliderLastLeft = 0;
  }

  updateDisabled() {
    this.arrow = false;
    this.arrowLeft = false;
  }

  updateScrollX(e: Event): void {
    this.arrowLeft = true;
    this.arrow = true;
  }

  onSliderMouseDown(direction) {
    clearInterval(this.sliderTimer);
    this.sliderTimer = setInterval(() => {
      if (this.arrow) {
        this.moveSlider(direction);
      }
    }, 50);
  }

  moveSlider(direction) {
    const pos =
      direction === 'right'
        ? (this.sliderLastLeft = this.sliderLastLeft + 20)
        : (this.sliderLastLeft = this.sliderLastLeft - 20);
    this.horizontalScroll.directiveRef.scrollToX(pos);
  }

  public onChipClick(selectedChip: Chip, selectedChipIndex?: number): void {
    if (this.selectedChipIndex === selectedChipIndex) {
      this.connectivityMapService.clearSelectionStates();
      return;
    }

    this.selectedChipIndex = selectedChipIndex;

    this.connectivityMapService.updateSelectedChip(selectedChip);

    if (this.isDialogOpen === false) {
      this.openConfirmLinkDialog();
      this.isDialogOpen = true;
    }
  }

  private openConfirmLinkDialog(): void {
    this.dialogRef = this.confirmLinkDialog.open(MappingDialogComponent, {
      width: '80%',
      position: { bottom: '0px', left: '300px' },
      hasBackdrop: false,
      data: {
        entityType: this.entityType,
        labLocationId: this.labLocationId
      }
    });

    if (this.isDialogOpen === false) {
      this.dialogRef.afterClosed().subscribe(result => {
        this.isDialogOpen = false;
      });
    }
  }

  public onDisableClick(selectedChip: Chip, selectedChipIndex?: number): void {
    if (this.selectedChipIndex === selectedChipIndex) {
      this.connectivityMapService.clearSelectionStates();
      return;
    }
    this.selectedChipIndex = selectedChipIndex;

    switch (+this.entityType) {
      case EntityType.LabInstrument:
        const disableInstrument: BaseEnableDisableDelete = {
          documentId: selectedChip.documentId,
          id: selectedChip.id
        };
        this.connectivityMapService.disableInstrument(disableInstrument)
          .pipe(takeUntil(this.destroy$))
          .subscribe(tree => {
            this.connectivityMapService.updateDocument(tree);
            this.connectivityMapService.sendAuditTrailPayload(disableInstrument, nodeTypeNames[4],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Disable, AuditTrackingActionStatus.Success);
          },
            error => (
              this.connectivityMapService.sendAuditTrailPayload(disableInstrument, nodeTypeNames[4],
                AuditTrackingEvent.FileUpload, AuditTrackingAction.Disable, AuditTrackingActionStatus.Failure)
            )
          );
        break;
      case EntityType.LabProduct:
        const disableProduct = new ProductEnableDisableDelete();
        this.connectivityMapService.currentUnmappedProdChips.pipe(take(1))
          .subscribe(unmappedProdChips => {
            const productChips = unmappedProdChips.filter(chip =>
              chip.code === selectedChip.code && chip.parentId === selectedChip.parentId);
            const entityDetails = Object.entries(productChips).map(([string, chip]) => ({
              'documentId': chip.documentId, 'id': chip.id
            }));
            disableProduct.entityDetails = entityDetails;
          });

        this.connectivityMapService.disableProduct(disableProduct).pipe(takeUntil(this.destroy$))
          .subscribe(tree => {
            this.connectivityMapService.updateDocument(tree);
            this.connectivityMapService.sendAuditTrailPayload(disableProduct, nodeTypeNames[5],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Disable, AuditTrackingActionStatus.Success);
          }, error => (
            this.connectivityMapService.sendAuditTrailPayload(disableProduct, nodeTypeNames[5],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Disable, AuditTrackingActionStatus.Failure))
          );
        break;
      case EntityType.LabTest:
        this.disableTest = {
          documentId: [],
          labProductId: selectedChip.parentId,
          code: selectedChip.code
        };

        this.connectivityMapService.currentUnmappedTestChips
          .pipe(take(1))
          .subscribe(unmappedTestChips => {
            const testChips: Array<Chip> = unmappedTestChips.filter(chip =>
              chip.code === selectedChip.code && chip.parentId === selectedChip.parentId);
            this.disableTest.documentId = [...new Set(testChips.map(el => String(el.documentId)))];

          }
          );
        this.connectivityMapService.disableTest(this.disableTest).pipe(takeUntil(this.destroy$))
          .subscribe(tree => {
            this.connectivityMapService.updateDocument(tree);
            this.connectivityMapService.sendAuditTrailPayload(this.disableTest, nodeTypeNames[6],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Disable, AuditTrackingActionStatus.Success);
          }, error => (
            this.connectivityMapService.sendAuditTrailPayload(this.disableTest, nodeTypeNames[6],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Disable, AuditTrackingActionStatus.Failure))
          );
        break;
      default:
        break;
    }
  }

  public onConfigurationChange(selectedConfiguration: ParsingJobConfig) {
    this.selectedConfiguration = selectedConfiguration;
    this.connectivityMapService.updateSelectedConfigurationId(selectedConfiguration ? selectedConfiguration.id : undefined);
  }

  public displayParentCodeToolTip(chip: Chip) {
    let parentCode;
    switch (+this.entityType) {
      case EntityType.LabInstrument:
        const configuration = this.configurations?.configs?.find(el => el.id === chip.parsingJobConfigId);
        return (configuration ? configuration.name : '');
      case EntityType.LabControl:
        this.connectivityMapService.currentInstrumentCards.pipe(take(1))
          .subscribe(instCards => {
            const instrument = instCards?.find(el => el.instrumentId === chip.parentId);
            parentCode = instrument?.codes.find(el => el.documentId === chip.documentId);
          });
        return (parentCode ? parentCode.code : '');
      case EntityType.LabTest:
        this.connectivityMapService.currentProductCards.pipe(take(1))
          .subscribe(productCards => {
            const product = productCards?.find(el => el.productId === chip.parentId);
            parentCode = product?.productLevels?.find(el =>
              el?.codes?.find(ele => ele.documentId === chip.documentId));
          });
        const code = parentCode?.codes.find(el => el.documentId === chip.documentId);
        return (code ? code.code : '');
      default:
        return '';
    }
  }

  // checking Permissions
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
