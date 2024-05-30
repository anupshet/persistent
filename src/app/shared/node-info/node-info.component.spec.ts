import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { MaterialModule, InfoTooltipComponent } from 'br-component-library';

import { TreePill } from '../../contracts/models/lab-setup';
import { CodelistApiService } from '../api/codelistApi.service';
import { PortalApiService } from '../api/portalApi.service';
import { NodeInfoAction } from '../state/node-info.action';
import { NodeInfoComponent } from './node-info.component';
import { NodeInfoDetailsComponent } from './node-info-details/node-info-details.component';

describe('NodeInfoComponent', () => {
  let component: NodeInfoComponent;
  let fixture: ComponentFixture<NodeInfoComponent>;
  let de: DebugElement;

  const selectedNode: Array<Array<TreePill>> = [[{
    id: '5bb2fab0-6358-412e-b606-3636c4fc0b84',
    nodeType: 5,
    parentNodeId: '4c85f20c-b507-4f82-8f78-1cc5c14f3e51',
    displayName: 'control 1',
    children: [
      {
        displayName: 'IgE',
        id: 'af56e051-3717-4b52-9244-cadf33d6e724',
        parentNodeId: '5bb2fab0-6358-412e-b606-3636c4fc0b84',
        nodeType: 6,
        children: []
      }
    ]
  }]];

  const mockPortalApiService = {
    getLabSetupAncestorsMultiple: (nodeId: string): Observable<TreePill[][]> => {
      return of(selectedNode);
    }
  };

  const mockCodelistApiService = {
    getUnits: () => {
      return of('');
    }
  };

  // const mockStore = {
  //   security: null,
  //   auth: null,
  //   userPreference: null,
  //   router: null,
  //   navigation: null,
  //   location: null,
  //   account: null,
  //   uiConfigState: null,
  //   connectivity: null
  // };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NodeInfoComponent,
        NodeInfoDetailsComponent,
        InfoTooltipComponent
      ],
      providers: [
        NodeInfoAction,
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: CodelistApiService, useValue: mockCodelistApiService }
      ],
      imports: [
        MaterialModule,
        StoreModule.forRoot([])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeInfoComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchDetails when event emitted from NodeInfoDetailsComponent', () => {
    const nodeInfoDetailsComp = de.query(By.directive(NodeInfoDetailsComponent));
    const cmp = nodeInfoDetailsComp.componentInstance;
    const spy = spyOn(component, 'fetchDetails');
    cmp.getNodeDetails.emit(true);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
});
