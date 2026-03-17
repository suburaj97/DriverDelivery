declare module 'i18next' {
  type InitOptions = Record<string, unknown>;

  export interface I18nLike {
    language: string;
    use: (plugin: unknown) => I18nLike;
    init: (options: InitOptions) => Promise<unknown> | unknown;
    t: (key: string, options?: Record<string, unknown>) => string;
    changeLanguage: (lng: string) => Promise<unknown>;
  }

  const i18n: I18nLike;
  export default i18n;
}

declare module 'react-i18next' {
  export const initReactI18next: unknown;

  export function useTranslation(): {
    t: (key: string, options?: Record<string, unknown>) => string;
    i18n: unknown;
  };
}

declare module 'react-native-localize' {
  export type Locale = { languageCode: string };

  export function getLocales(): Locale[];
  export function addEventListener(
    event: 'change',
    callback: () => void,
  ): void;
}

declare module '@os-team/i18next-react-native-language-detector' {
  const detector: unknown;
  export default detector;
}
