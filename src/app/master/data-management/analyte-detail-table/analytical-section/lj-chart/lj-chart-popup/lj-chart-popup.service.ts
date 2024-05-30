import { Injectable } from '@angular/core';
import { BehaviorSubject ,  Observable } from 'rxjs';

@Injectable()
export class LjChartPopupService {
  private _source = new BehaviorSubject<any>(null);

  constructor() {}

  show(x: number, y: number, score: number): void {
    this._source.next({ x, y, score });
  }

  hide(): void {
    this._source.next(null);
  }

  getCoordinates(): Observable<any> {
    return this._source.asObservable();
  }
}
