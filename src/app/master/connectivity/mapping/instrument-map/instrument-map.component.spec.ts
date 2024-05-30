import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MaterialModule } from 'br-component-library';

import { ActivatedRouteStub } from '../../../../../testing/activated-route-stub';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { MappingService } from '../mapping.service';
import { InstrumentMapComponent } from './instrument-map.component';


@Component({ selector: 'unext-dropdown-filter', template: '' })
class StubDropdownFilterComponent {
  @Input() entityType;
  @Input() entityId;
}

@Component({ selector: 'unext-connectivity-map-header', template: '' })
class StubHeaderComponent {}

const activatedRouteStub = new ActivatedRouteStub ({
  parent: {
    parent: { params: 'test' },
    params: of({ parent: {params: 'test' }})
  }
});

const mockService = {
  updateEntityType(entityType: EntityType) {},
  currentInstrumentCards: of(''),
  currentInstrumentDropdowns: of(''),
  currentSelectedChip: of(''),
  updateSelectedCardIndex(selectedCardIndex: number) {},
  currentSelectedCardIndex: of('')
};

describe('InstrumentMapComponent', () => {
  let component: InstrumentMapComponent;
  let fixture: ComponentFixture<InstrumentMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MaterialModule,
        PerfectScrollbarModule,
        BrowserAnimationsModule
      ],
      declarations: [InstrumentMapComponent, StubDropdownFilterComponent, StubHeaderComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: MappingService, useValue: mockService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
