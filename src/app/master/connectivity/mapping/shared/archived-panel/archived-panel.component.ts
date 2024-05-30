// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, filter, take, concatMap } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { BrDialogComponent, DialogResult } from 'br-component-library';
import { uniqBy } from 'lodash';

import { BaseEnableDisableDelete, ProductEnableDisableDelete, TestEnableDisableDelete } from '../../../../../contracts/models/connectivity-map/base-enable-disable.model';
import { Chip } from '../../../../../contracts/models/connectivity-map/chip.model';
import { EntityType } from '../../../../../contracts/enums/entity-type.enum';
import { MappingService } from '../../mapping.service';
import { ErrorLoggerService } from '../../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../../contracts/enums/error-type.enum';
import { blankSpace, componentInfo, Operations } from '../../../../../core/config/constants/error-logging.const';
import { code as _code, nodeTypeNames } from '../../../../../core/config/constants/general.const';
import { ConnectivityMapTree } from '../../../../../contracts/models/connectivity-map/connectivity-map-tree.model';
import { BrPermissionsService } from '../../../../../security/services/permissions.service';
import { Permissions } from '../../../../../security/model/permissions.model';
import { AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../../../../../shared/models/audit-tracking.model';
import { ParsingJobConfig } from '../../../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';

@Component({
  selector: 'unext-archived-panel',
  templateUrl: './archived-panel.component.html',
  styleUrls: ['./archived-panel.component.scss']
})
export class ArchivedPanelComponent implements OnInit, OnDestroy {
  entityType: EntityType;
  entityId: string;
  disabledChips: Chip[];
  selectedChipIndex: number;
  isChipClicked = false;
  chipClickedIndex: number;
  permissions = Permissions;
  shadowUnmappedInstChips: Chip[];
  enableProduct: ProductEnableDisableDelete;
  enableTest: TestEnableDisableDelete;
  deleteProductCode: ProductEnableDisableDelete;
  deleteTestCode: TestEnableDisableDelete;
  configurations: Array<ParsingJobConfig>;

  private destroy$ = new Subject<boolean>();
  private deleteDialogRef: MatDialogRef<BrDialogComponent, any> = null;

  constructor(
    private connectivityMapService: MappingService,
    private dialog: MatDialog,
    private brPermissionsService: BrPermissionsService,
    private errorLoggerService: ErrorLoggerService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
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
          this.getDisabledChips();
        });

    this.connectivityMapService.currentSelectedChipIndex
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        selectedChipIndex => {
          this.selectedChipIndex = selectedChipIndex;
        }
      );

    this.connectivityMapService.selectedConfigurationId
      .pipe(takeUntil(this.destroy$))
      .subscribe(configurationId => {
        if (this.entityType === EntityType.LabInstrument) {
          if (configurationId) {
            this.disabledChips = this.shadowUnmappedInstChips?.filter(el => el.parsingJobConfigId === configurationId);
          } else {
            this.disabledChips = this.shadowUnmappedInstChips;
          }
        }
      }
      );

    this.connectivityMapService.configurations.pipe(takeUntil(this.destroy$))
      .subscribe(configurations => {
        if (configurations && configurations.length > 0) {
          this.configurations = configurations;
        }
      });
  }

  private onChipClick(selectedChipIndex: number): void {
    this.chipClickedIndex = selectedChipIndex;
    this.isChipClicked = !this.isChipClicked;
  }

  private getDisabledChips(): void {
    this.disabledChips = [];
    switch (+this.entityType) {
      case EntityType.LabInstrument:
        this.connectivityMapService.currentUnmappedInstChips
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            unmappedInstChips => {
              this.disabledChips = unmappedInstChips;
              this.shadowUnmappedInstChips = unmappedInstChips;
            }
          );
        break;
      case EntityType.LabProduct:
        this.connectivityMapService.currentUnmappedProdChips
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            unmappedProdChips => {
              this.disabledChips = this.getUniqueChips(unmappedProdChips);
            }
          );
        break;
      case EntityType.LabTest:
        this.connectivityMapService.currentUnmappedTestChips
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            unmappedTestChips => {
              this.disabledChips = this.getUniqueChips(unmappedTestChips);
            }
          );
        break;
      default:
        this.connectivityMapService.currentUnmappedInstChips
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            unmappedInstChips => {
              this.disabledChips = unmappedInstChips;
            }
          );
        break;
    }

    if (this.disabledChips) {
      this.sortDisabledChips();
    }

  }

  sortDisabledChips() {
    this.disabledChips = this.disabledChips.sort((a, b) => a.code.localeCompare(b.code));
  }

  public getUniqueChips(unmappedChips: Array<Chip>): Array<Chip> {
    return uniqBy(unmappedChips, (chip: Chip) => [chip.code, chip.parentId].join());
  }

  private onRestoreClick(selectedChip: Chip, selectedChipIndex: number): void {
    if (this.selectedChipIndex === selectedChipIndex) {
      this.connectivityMapService.clearSelectionStates();
      return;
    }
    this.selectedChipIndex = selectedChipIndex;

    switch (+this.entityType) {
      case EntityType.LabInstrument:
        const enableInstrument: BaseEnableDisableDelete = {
          documentId: selectedChip.documentId,
          id: selectedChip.id
        };
        this.connectivityMapService.enableInstrument(enableInstrument)
          .pipe(takeUntil(this.destroy$))
          .subscribe((tree: Array<ConnectivityMapTree>) => {
            this.connectivityMapService.updateDocument(tree);
            this.connectivityMapService.sendAuditTrailPayload(enableInstrument, nodeTypeNames[4],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Enable, AuditTrackingActionStatus.Success);
          },
            error => (
              this.connectivityMapService.sendAuditTrailPayload(enableInstrument, nodeTypeNames[4],
                AuditTrackingEvent.FileUpload, AuditTrackingAction.Enable, AuditTrackingActionStatus.Failure)
            )
          );
        break;
      case EntityType.LabProduct:
        const enableProduct = new ProductEnableDisableDelete();
        this.connectivityMapService.currentUnmappedProdChips.pipe(take(1))
          .subscribe((unmappedProdChips: Array<Chip>) => {
            const selectedChips: Array<Chip> = unmappedProdChips.filter(chip =>
              chip.code === selectedChip.code && chip.parentId === selectedChip.parentId);
            const entityDetails = Object.entries(selectedChips).map(([string, chip]) => ({
              'documentId': chip.documentId, 'id': chip.id
            }));
            enableProduct.entityDetails = entityDetails;
          });

        this.connectivityMapService.enableProduct(enableProduct).pipe(takeUntil(this.destroy$))
          .subscribe((tree: Array<ConnectivityMapTree>) => {
            this.connectivityMapService.updateDocument(tree);
            this.connectivityMapService.sendAuditTrailPayload(enableProduct, nodeTypeNames[5],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Enable, AuditTrackingActionStatus.Success);
          }, error => (
            this.connectivityMapService.sendAuditTrailPayload(enableProduct, nodeTypeNames[5],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Enable, AuditTrackingActionStatus.Failure))
          );
        break;
      case EntityType.LabTest:
        this.enableTest = {
          documentId: [],
          labProductId: selectedChip.parentId,
          code: selectedChip.code
        };
        this.connectivityMapService.currentUnmappedTestChips
          .pipe(takeUntil(this.destroy$))
          .subscribe((unmappedTestChips: Array<Chip>) => {
            const testChips: Array<Chip> = unmappedTestChips.filter(chip =>
              chip.code === selectedChip.code && chip.parentId === selectedChip.parentId);
            this.enableTest.documentId = [...new Set(testChips.map(el => String(el.documentId)))];
          }
          );
        this.connectivityMapService.enableTest(this.enableTest).pipe(takeUntil(this.destroy$))
          .subscribe((tree: Array<ConnectivityMapTree>) => {
            this.connectivityMapService.updateDocument(tree);
            this.connectivityMapService.sendAuditTrailPayload(this.enableTest, nodeTypeNames[6],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Enable, AuditTrackingActionStatus.Success);
          }, error => (
            this.connectivityMapService.sendAuditTrailPayload(this.enableTest, nodeTypeNames[6],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Enable, AuditTrackingActionStatus.Failure)
          )
          );
        break;
      default:
    }
  }

  private onDeleteClick(selectedChip: Chip, selectedChipIndex: number): void {
    try {
      this.deleteDialogRef = this.dialog.open(BrDialogComponent, {
        data: {
          title: this.getTranslations('TRANSLATION.DELETECODE'),
          cancelButton: this.getTranslations('TRANSLATION.CANCEL'),
          confirmButton: this.getTranslations('TRANSLATION.CONFIRMDELETE')
        }
      });

      const onButtonClick = this.deleteDialogRef.componentInstance.buttonClicked.subscribe(
        dialogResult => {
          switch (dialogResult) {
            case DialogResult.OK:
              return this.deleteCode(selectedChip);
            case DialogResult.Cancel:
              return this.deleteDialogRef.close();
            default:
              return DialogResult.None;
          }
        },
        error => { },
      );
      this.deleteDialogRef.afterClosed().subscribe(() => {
        onButtonClick.unsubscribe();
      });
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.ArchivedPanelComponent + blankSpace + Operations.OpenDeleteCodesDialog)
      );
    }
  }

  private deleteCode(selectedChip: Chip): void {
    switch (+ this.entityType) {
      case EntityType.LabInstrument:
        const deleteInstrumentCode: BaseEnableDisableDelete = {
          documentId: selectedChip.documentId,
          id: selectedChip.id
        };
        this.connectivityMapService.deleteInstrumentCode(deleteInstrumentCode)
          .pipe(filter(tree => !!tree), takeUntil(this.destroy$))
          .subscribe(trees => {
            for (const code of this.disabledChips) {
              trees.forEach(tree => {
                tree.codes.splice(
                  tree.codes.findIndex(chip => chip.code === code.code), 1);
              });
            }
            this.connectivityMapService.updateDocument(trees);
            this.connectivityMapService.sendAuditTrailPayload(deleteInstrumentCode, nodeTypeNames[4],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Delete, AuditTrackingActionStatus.Success);
            this.deleteDialogRef.close();
            this.getDisabledChips();
          },
            error => (
              this.connectivityMapService.sendAuditTrailPayload(deleteInstrumentCode, nodeTypeNames[4],
                AuditTrackingEvent.FileUpload, AuditTrackingAction.Delete, AuditTrackingActionStatus.Failure)
            )
          );
        break;

      case EntityType.LabProduct:
        const deleteProductCode = new ProductEnableDisableDelete();
        this.connectivityMapService.currentUnmappedProdChips.pipe(take(1))
          .subscribe(unmappedProdChips => {
            const selectedChips = unmappedProdChips.filter(prodChip =>
              prodChip.code === selectedChip.code && prodChip.parentId === selectedChip.parentId);
            const entityDetails = Object.entries(selectedChips).map(([string, chip]) => ({
              'documentId': chip.documentId, 'id': chip.id
            }));
            deleteProductCode.entityDetails = entityDetails;
          });

        this.connectivityMapService.deleteProductCode(deleteProductCode)
          .pipe(filter(tree => !!tree), takeUntil(this.destroy$))
          .subscribe(trees => {
            trees.forEach(tree => {
              for (const code of this.disabledChips) {
                tree.product.forEach(product => {
                  product.levelCodes.forEach(levelCode => {
                    levelCode.test.forEach(test => {
                      test.codes.splice(
                        test.codes.findIndex(chip => chip.code === code.code), 1
                      );
                    });
                  });
                });
              }
            });
            this.connectivityMapService.updateDocument(trees);

            this.connectivityMapService.sendAuditTrailPayload(deleteProductCode, nodeTypeNames[5],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Delete, AuditTrackingActionStatus.Success);
            this.deleteDialogRef.close();
            this.getDisabledChips();
          }, error => (
            this.connectivityMapService.sendAuditTrailPayload(deleteProductCode, nodeTypeNames[5],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Delete, AuditTrackingActionStatus.Failure))
          );
        break;

      case EntityType.LabTest:
        this.deleteTestCode = {
          documentId: [],
          code: selectedChip.code,
          labProductId: selectedChip.parentId
        };

        this.connectivityMapService.currentUnmappedTestChips
          .pipe(takeUntil(this.destroy$))
          .subscribe(unmappedTestChips => {
            const testChips: Array<Chip> = unmappedTestChips.filter(chip =>
              chip.code === selectedChip.code && chip.parentId === selectedChip.parentId);
            this.deleteTestCode.documentId = [...new Set(testChips.map(el => String(el.documentId)))];
          }
          );

        this.connectivityMapService.deleteTestCode(this.deleteTestCode)
          .pipe(filter(tree => !!tree), takeUntil(this.destroy$))
          .subscribe(trees => {
            trees.forEach(tree => {
              for (const code of this.disabledChips) {
                tree.product.forEach(product => {
                  product.levelCodes.forEach(levelCode => {
                    levelCode.test.forEach(test => {
                      test.codes.splice(
                        test.codes.findIndex(chip => chip.code === code.code), 1
                      );
                    });
                  });
                });
              }
            });
            this.connectivityMapService.updateDocument(trees);
            this.connectivityMapService.sendAuditTrailPayload(this.deleteTestCode, nodeTypeNames[6],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Delete, AuditTrackingActionStatus.Success);
            this.deleteDialogRef.close();
            this.getDisabledChips();
          }, error => (
            this.connectivityMapService.sendAuditTrailPayload(this.deleteTestCode, nodeTypeNames[6],
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Delete, AuditTrackingActionStatus.Failure))
          );
        break;
      default:
        break;
    }
  }



  public displayParentCodeToolTip(chip: Chip) {
    let parentCode;
    switch (+this.entityType) {
      case EntityType.LabInstrument:
        const configuration = this.configurations?.find(el => el.id === chip.parsingJobConfigId);
        return (configuration ? configuration.name : '');

      case EntityType.LabControl:
        this.connectivityMapService.currentInstrumentCards
          .pipe(takeUntil(this.destroy$))
          .subscribe(instCards => {
            const instrument = instCards?.find(el => el.instrumentId === chip.parentId);
            parentCode = instrument?.codes.find(el => el.documentId === chip.documentId);
          });
        return (parentCode ? parentCode.code : '');

      case EntityType.LabTest:
        this.connectivityMapService.currentProductCards
          .pipe(takeUntil(this.destroy$))
          .subscribe(productCards => {
            const product = productCards?.find(el => el.productId === chip.parentId);
            parentCode = product?.productLevels?.find(el =>
              el?.codes?.find(ele => ele.documentId === chip.documentId)
            );
          });
        const code = parentCode?.codes.find(el => el.documentId === chip.documentId);
        return (code ? code.code : '');
      default:
        return '';
    }
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
