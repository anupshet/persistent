import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

@Injectable()
export class ValidatorsService {
  static ValidateEmail = () => Validators.pattern('^[a-zA-Z0-9.!#$%&*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$');
}
