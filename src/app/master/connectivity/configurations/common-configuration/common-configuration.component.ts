// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, } from '@angular/core';
import { Subject } from 'rxjs';

import { orderBy } from 'lodash';

import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { blankSpace, componentInfo, Operations } from '../../../../core/config/constants/error-logging.const';
import { ParsingInfo, ParsingJobConfig } from '../../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { OrchestratorApiService } from '../../../../shared/api/orchestratorApi.service';
import { asc } from '../../../../core/config/constants/general.const';
import { Transformer } from '../../../../contracts/models/account-management/transformers.model';

@Component({
  selector: 'unext-common-configuration',
  templateUrl: './common-configuration.component.html',
  styleUrls: ['./common-configuration.component.scss'],
})
export class CommonConfigurationComponent implements OnInit, OnDestroy {
  @Input() accountId: string;
  @Input() existingConfigurationsNames: string[];
  @Input() labLocationId: string;
  @Input() selectedTransformerId: string;
  @Output() showListing: EventEmitter<boolean> = new EventEmitter();

  public instructions: ParsingInfo;
  public showCancel = true;
  public destroy$ = new Subject<boolean>();

  assignedTransformerList: Array<Transformer>;
  public showEdgeForm = false;
  public showTransformersForm = false;
  selectedInstruction: ParsingJobConfig;

  constructor(
    private orchestratorApiService: OrchestratorApiService,
    private errorLoggerService: ErrorLoggerService,
  ) { }

  ngOnInit() {
    this.assignedTransformerList = [];
    try {
      this.orchestratorApiService.getConnectivityTransformers(this.accountId, this.labLocationId).then((transformers) => {
        if (transformers) {
          this.assignedTransformerList = transformers.filter(el => el.isAssigned === true);
          this.assignedTransformerList = orderBy(this.assignedTransformerList, [el => el.displayName.replace(/\s/g, '')
            .toLocaleLowerCase()], [asc]);
          if (this.selectedTransformerId) {
            transformers.forEach(el => {
              if (el.id === this.selectedTransformerId) {
                this.createEdgeOrTransformer(this.selectedTransformerId);
              }
            });
          }
        }
      });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(
          ErrorType.Script, err.stack, err.message, componentInfo.TransformerConfigurationComponent +
          blankSpace + Operations.GetTransformersFormFields)
      );
    }
  }

  createEdgeOrTransformer(transformer: string) {
    if (this.assignedTransformerList.length > 0) {
      const selectedInstruction = this.assignedTransformerList.find(
        (item) => item.id === transformer
      );
      const date = new Date();
      this.selectedInstruction = new ParsingJobConfig();
      this.selectedInstruction.id = selectedInstruction.id;
      this.selectedInstruction.name = selectedInstruction.displayName;
      this.showCancel = false;
      if (this.selectedInstruction.name.includes('ASTM')) {
        this.showEdgeForm = true;
        this.showTransformersForm = false;
      } else {
        this.showEdgeForm = false;
        this.showTransformersForm = true;
      }
    }
  }

  showConfigurations(reloadNeeded?: boolean) {
    this.showListing.emit(true);
  }

  ngOnDestroy(): void {
    this.selectedTransformerId = undefined;
    this.destroy$.next(true);
    this.destroy$.unsubscribe();

  }
}
