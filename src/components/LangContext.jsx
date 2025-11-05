import { createContext, useContext, useState } from 'react';

const LANG = {
  en: {
    title: 'Thusanang FS – Digital Platform',
    lang_btn: 'Sesotho',
    upload: 'Upload Docs',
    plan: 'Plan Funeral',
    memorial: 'Memorial',
    dispatch: 'Dispatch',
    reminders: 'Reminders',
    client_name: 'Name',
    id_num: 'ID Number',
    phone: 'Phone',
    get_quote: 'Get Quote',
    post: 'Post Condolence',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    track: 'Track Live',
    no_dispatch: 'No active dispatches',
    no_cases: 'No cases yet',
    no_clients: 'No clients yet',
    no_reminders: 'No funerals tomorrow'
  },
  st: {
    title: 'Thusanang FS – Ipulatifomo Yedijithali',
    lang_btn: 'English',
    upload: 'Faka Amaphepha',
    plan: 'Hlela Umngcwabo',
    memorial: 'Isikhumbuzo',
    dispatch: 'Thumela Imoto',
    reminders: 'Izikhumbuzi',
    client_name: 'Igama',
    id_num: 'Inombolo Yesazisi',
    phone: 'Ifoni',
    get_quote: 'Thola Iquote',
    post: 'Faka Ukuzwelana',
    edit: 'Hlela',
    delete: 'Cisha',
    save: 'Gcina',
    track: 'Landela Ngqo',
    no_dispatch: 'Akukho ukuthunyelwa okusebenzayo',
    no_cases: 'Akukho amacala okwamanje',
    no_clients: 'Akukho amakhasimende okwamanje',
    no_reminders: 'Akukho imingcwabo kusasa'
  }
};

const LangContext = createContext();
export const useLang = () => useContext(LangContext);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const c = document.cookie.match(/lang=([^;]+)/);
    return c ? c[1] : 'en';
  });

  const toggle = () => {
    const newLang = lang === 'en' ? 'st' : 'en';
    document.cookie = `lang=${newLang};path=/`;
    setLang(newLang);
  };

  const txt = key => LANG[lang][key] || key;

  return (
    <LangContext.Provider value={{ lang, toggle, txt }}>
      {children}
    </LangContext.Provider>
  );
}
