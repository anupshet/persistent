export class LocalePreferences {
  constructor(
    public id: string,
    public locale: string,
    public language: string,
    public numberFormat: number,
    public dateFormat: number,
    public timeFormat: number
    ) {}
}