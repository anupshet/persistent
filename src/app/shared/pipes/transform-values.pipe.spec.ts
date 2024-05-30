import { DecimalPipe } from '@angular/common';
import {
  TransformSummaryStatsPipe,
  TransformValuePipe,
  TransformZscorePipe
 } from './transform-values.pipe';

describe('Pipe: TransformValues', () => {
  let pipe: TransformValuePipe;
  let zScorePipe: TransformZscorePipe;
  let summStatsPipe: TransformSummaryStatsPipe;
  let decimalPipe: DecimalPipe;

  beforeEach(() => {
     decimalPipe = new DecimalPipe('en-US');
    pipe = new TransformValuePipe('en-US', decimalPipe);
    zScorePipe = new TransformZscorePipe('en-US', decimalPipe);
    summStatsPipe = new TransformSummaryStatsPipe('en-US', decimalPipe);
  });

  it('should return zScore value with two decimal places', () => {
     expect(pipe.transform(33.333333)).toBe('33.33');
  });

  it('should return zScore value with two decimal places', () => {
    expect(pipe.transform(4.444444, '0')).toBe('4');
  });

  it('should return zScore value with two decimal places', () => {
    expect(pipe.transform(2.1234567, '1')).toBe('2.1');
  });

  it('should return zScore value with two decimal places', () => {
    expect(pipe.transform(5.5555555, '2')).toBe('5.56');
  });

  it('should return value with two decimal places if > 1', () => {
    expect(pipe.transform(134.256, '2')).toBe('134.26');
  });

  it('should return value with three decimal places if < 1', () => {
    expect(pipe.transform(0.9678, '3')).toBe('0.968');
  });

  it('should transformValue to accept upto 8 digits', () => {
    expect(pipe.transform(123.4567, '4')).toBe('123.4567');
  });

  it('should return zScore value with two decimal places', () => {
    expect(zScorePipe.transform(2.1234567)).toBe('2.12');
  });

  it('should return zScore value with two decimal places', () => {
    expect(zScorePipe.transform(6.6666)).toBe('6.67');
  });

  it('should return zScore value with two decimal places', () => {
    expect(zScorePipe.transform(7.7777, '1')).toBe('7.78');
  });

  it('should return zScore value with two decimal places', () => {
    expect(zScorePipe.transform(8.8888, '3')).toBe('8.89');
  });

  it('should return value with two decimal places if > 1', () => {
    expect(summStatsPipe.transform(134.256, '2')).toBe('134.26');
  });

  it('should return value with three decimal places if < 1', () => {
    expect(summStatsPipe.transform(0.9678, '3')).toBe('0.968');
  });
});
