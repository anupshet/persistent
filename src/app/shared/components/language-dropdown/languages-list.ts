// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export type Language = {
  name: string,
  value: string
  lcid: string
}

export const Languages: Array<Language> = [
  {name: 'ENUS', value: 'en', lcid: 'en-US'},
  {name: 'ENGB', value: 'en', lcid: 'en-GB'},
  {name: 'DE', value: 'de', lcid: 'de-DE'},
  {name: 'FR', value: 'fr', lcid: 'fr-FR'},
  {name: 'FRCA', value: 'fr', lcid: 'fr-CA'},
  {name: 'IT', value: 'it', lcid: 'it-IT'},
  {name: 'ES', value: 'es', lcid: 'es-ES'},
  {name: 'ZHCN', value: 'zh', lcid: 'zh-CN'},
  {name: 'JA', value: 'ja', lcid: 'ja-JP'},
  {name: 'KO', value: 'ko', lcid: 'ko-KR'},
  {name: 'PT', value: 'pt', lcid: 'pt-PT'},
  {name: 'RU', value: 'ru', lcid: 'ru-RU'},
  {name: 'PL', value: 'pl', lcid: 'pl-PL'},
  {name: 'HU', value: 'hu', lcid: 'hu-HU'}
];
