import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(Backend) // 加载翻译文件
    .use(LanguageDetector) // 自动检测用户语言
    .use(initReactI18next) // 绑定 react-i18next
    .init({
        backend: {
            loadPath: 'locales/{{lng}}/{{ns}}.json', // 翻译文件路径
        },
        lng: 'en', // 默认语言
        fallbackLng: 'en', // 回退语言
        interpolation: {
            escapeValue: false, // react 已经安全处理
        },
    });

export default i18n;
