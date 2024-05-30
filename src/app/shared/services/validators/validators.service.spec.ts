
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators, FormControl } from '@angular/forms';

import { ValidatorsService } from './validators.service';

describe('Shared ValidatorsService\'', () => {

  let service: ValidatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [ValidatorsService]
    });

    service = TestBed.get(ValidatorsService);
  });

  afterEach(() => {
    service = null;
  });

  it('instance should be created', () => {
    expect(service).toBeTruthy();
  });

  it('control should return valid if email pattern match ', () => {
    const control = new FormControl('sample@email.com', [
      Validators.compose([
        Validators.email, Validators.required, ValidatorsService.ValidateEmail
      ])
    ]);
    expect(control.valid).toBe(true);
  });

  it('control should return valid if email address is uppercase', () => {
    const control = new FormControl('SAMPLE@email.com', [
      Validators.compose([
        Validators.email, Validators.required, ValidatorsService.ValidateEmail
      ])
    ]);
    expect(control.valid).toBe(true);
  });

  it('control should return invalid if email pattern do not match', () => {
    const control = new FormControl('sample@@email.com', [
      Validators.compose([
        Validators.email, Validators.required, ValidatorsService.ValidateEmail
      ])
    ]);
    expect(control.valid).toBe(false);
  });
});
