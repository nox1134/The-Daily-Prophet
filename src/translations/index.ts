import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './en.json';
import { storage } from '@utils/storage/api';
import moment from 'moment';

moment.locale('en');

export const SHOW_LANGUAGE_SELECT_IN_SETTINGS = false;

export const availableTranslations = ['en'] as const;

export type Language = typeof availableTranslations[number];

export const availableTranslationsPrettyNames = {
    'en': 'English',
} satisfies Record<Language, string>;

const resources = {
    en: enTranslation,
} satisfies Record<Language, any>;

export const languageDirections = {
    en: 'ltr',
} satisfies Record<Language, 'rtl' | 'ltr'>;

export const initTranslation = async () => {
    const lang = await storage.getOne('language') || 'en';
    const html = document.querySelector('html');
    if (html) {
        html.setAttribute('lang', lang);
        html.setAttribute('dir', languageDirections[lang]);
    }

    moment.updateLocale('ar', {
        postformat: (x: any) => x,
    });

    moment.locale(lang);
    i18n.use(initReactI18next).init({
        debug: true,
        returnNull: false,
        fallbackLng: 'en',
        lng: lang,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        resources,
    });
};

export const switchTranslationLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    moment.locale(lang.toLowerCase());
    const html = document.querySelector('html');
    if (html) {
        html.setAttribute('lang', lang);
        html.setAttribute('dir', languageDirections[lang]);
    }
};

export const translate = i18n.t;
