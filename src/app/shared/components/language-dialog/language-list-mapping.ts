// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export type Language = {
  name: string,
  country: string,
  locale: string,
  language: string,
  dateFormatValues: Array<any>,
  numberFormat: number,
  timeFormat: number,
  dateFormat: number

};

export type Numeric = {
  numeric: string,
  numericValue: number,
};

export type Time = {
  time: string,
  timeValue: number,
};

export const LanguagesMapping: Array<Language> = [
  { country: 'US', locale: 'en-US', language: 'en', name: 'English', numberFormat: 0, timeFormat: 0, dateFormat: 0, dateFormatValues: [{ 'date': 'Jan 30 1963', 'value': 0 }, { 'date': '30 Jan 1963', 'value': 1 }, { 'date': '1963 Jan 30', 'value': 2 }] },  // Unites States
  { country: 'GB', locale: 'en-GB', language: 'en', name: 'English UK', numberFormat: 0, timeFormat: 1, dateFormat: 1, dateFormatValues: [{ 'date': 'Jan 30 1963', 'value': 0 }, { 'date': '30 Jan 1963', 'value': 1 }, { 'date': '1963 Jan 30', 'value': 2 }] }, // United Kingdom
  { country: 'DE', locale: 'de-DE', language: 'de', name: 'Deutsch', numberFormat: 2, timeFormat: 1, dateFormat: 1, dateFormatValues: [{ 'date': 'Jan 30 1963', 'value': 0 }, { 'date': '30 Jan 1963', 'value': 1 }, { 'date': '1963 Jan 30', 'value': 2 }] }, // German
  { country: 'FR', locale: 'fr-FR', language: 'fr', name: 'Français', numberFormat: 1, timeFormat: 1, dateFormat: 1, dateFormatValues: [{ 'date': 'janv 30 1963', 'value': 0 }, { 'date': '30 janv 1963', 'value': 1 }, { 'date': '1963 janv 30', 'value': 2 }] }, // France
  { country: 'CA', locale: 'fr-CA', language: 'fr', name: 'Français Canada', numberFormat: 1, timeFormat: 1, dateFormat: 1, dateFormatValues: [{ 'date': 'janv 30 1963', 'value': 0 }, { 'date': '30 janv 1963', 'value': 1 }, { 'date': '1963 janv 30', 'value': 2 }] }, // France Canada 
  { country: 'IT', locale: 'it-IT', language: 'it', name: 'Italiano', numberFormat: 2, timeFormat: 1, dateFormat: 1, dateFormatValues: [{ 'date': 'gen 30 1963', 'value': 0 }, { 'date': '30 gen 1963', 'value': 1 }, { 'date': '1963 gen 30', 'value': 2 }] }, // Italy
  { country: 'ES', locale: 'es-ES', language: 'es', name: 'Español', numberFormat: 2, timeFormat: 1, dateFormat: 1, dateFormatValues: [{ 'date': 'ene 30 1963', 'value': 0 }, { 'date': '30 ene 1963', 'value': 1 }, { 'date': '1963 ene 30', 'value': 2 }] }, // Spain
  { country: 'CN', locale: 'zh-CN', language: 'zh', name: '简体中文', numberFormat: 0, timeFormat: 1, dateFormat: 2, dateFormatValues: [{ 'date': '1月 30 1963', 'value': 0 }, { 'date': '30 1月 1963', 'value': 1 }, { 'date': '1963 1月 30', 'value': 2 }] }, // China
  { country: 'JP', locale: 'ja-JP', language: 'ja', name: '日本語', numberFormat: 0, timeFormat: 1, dateFormat: 2, dateFormatValues: [{ 'date': '1月 30 1963', 'value': 0 }, { 'date': '30 1月 1963', 'value': 1 }, { 'date': '1963 1月 30', 'value': 2 }] }, // Japan
  { country: 'KR', locale: 'ko-KR', language: 'ko', name: '한국어', numberFormat: 0, timeFormat: 0, dateFormat: 2, dateFormatValues: [{ 'date': '1월 30 1963', 'value': 0 }, { 'date': '30 1월 1963', 'value': 1 }, { 'date': '1963 1월 30', 'value': 2 }] }, // Korea
  { country: 'PT', locale: 'pt-PT', language: 'pt', name: 'Português', numberFormat: 1, timeFormat: 1, dateFormat: 1, dateFormatValues: [{ 'date': 'jan 30 1963', 'value': 0 }, { 'date': '30 jan 1963', 'value': 1 }, { 'date': '1963 jan 30', 'value': 2 }] }, // Portugal
  { country: 'RU', locale: 'ru-RU', language: 'ru', name: 'Русский', numberFormat: 1, timeFormat: 1, dateFormat: 1, dateFormatValues: [{ 'date': 'янв 30 1963', 'value': 0 }, { 'date': '30 янв 1963', 'value': 1 }, { 'date': '1963 янв 30', 'value': 2 }] }, // Russian Federation
  { country: 'PL', locale: 'pl-PL', language: 'pl', name: 'Polksi', numberFormat: 1, timeFormat: 1, dateFormat: 1, dateFormatValues: [{ 'date': 'sty 30 1963', 'value': 0 }, { 'date': '30 sty 1963', 'value': 1 }, { 'date': '1963 sty 30', 'value': 2 }] }, // Poland
  { country: 'HU', locale: 'hu-HU', language: 'hu', name: 'Magyar', numberFormat: 1, timeFormat: 1, dateFormat: 2, dateFormatValues: [{ 'date': 'jan 30 1963', 'value': 0 }, { 'date': '30 jan 1963', 'value': 1 }, { 'date': '1963 jan 30', 'value': 2 }] }, // Hungary
];

export const numericFormat: Array<Numeric> = [
  { numeric: '98,765.23', numericValue: 0 },
  { numeric: '98.765,23', numericValue: 2 },
  { numeric: '98 765,23', numericValue: 1 },
]

export const timeFormat: Array<Time> = [
  { time: '07:39:07 PM', timeValue: 0 },
  { time: '19:41:44', timeValue: 1 },
]
