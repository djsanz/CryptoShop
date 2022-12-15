import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import Traduccion from './traducciones.json';

i18n.use(initReactI18next).init({
  lng: localStorage.getItem("Idioma")?localStorage.getItem("Idioma"):'eng',
  fallbackLng: 'eng',
  resources: {
    eng: Traduccion.eng,
    es: Traduccion.es,
  },
  interpolation: {
    escapeValue: false // react already safes from xss
  }
});
  
export default i18n;