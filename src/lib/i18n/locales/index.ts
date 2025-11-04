import { en, TranslationKeys } from './en';
import { zh } from './zh';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { ja } from './ja';
import { ko } from './ko';
import { vi } from './vi';
import { pt } from './pt';
import { id as idLocale } from './id';

export const translations: Record<string, TranslationKeys> = {
  en,
  zh,
  es,
  fr,
  de,
  ja,
  ko,
  vi,
  pt,
  id: idLocale,
};

export type { TranslationKeys } from './en';

