import { translations, TranslationKeys } from './locales';

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

type TranslationPath = NestedKeyOf<TranslationKeys>;

/**
 * Server-side translation function
 * Use this in server components where React hooks are not available
 */
export function getTranslation(locale: string) {
  return {
    t: (path: TranslationPath, replacements?: Record<string, string>): string => {
      const keys = path.split('.');
      let translation: any = translations[locale] || translations['en'];

      for (const key of keys) {
        if (translation && typeof translation === 'object' && key in translation) {
          translation = translation[key];
        } else {
          // Fallback to English if translation not found
          let fallback: any = translations['en'];
          for (const fallbackKey of keys) {
            if (fallback && typeof fallback === 'object' && fallbackKey in fallback) {
              fallback = fallback[fallbackKey];
            } else {
              return path; // Return path if even English translation not found
            }
          }
          translation = fallback;
          break;
        }
      }

      if (typeof translation !== 'string') {
        return path; // Return path if translation is not a string
      }

      // Apply replacements if provided
      if (replacements) {
        Object.entries(replacements).forEach(([key, value]) => {
          translation = translation.replace(new RegExp(`{${key}}`, 'g'), value);
        });
      }

      return translation;
    },
    locale,
  };
}

