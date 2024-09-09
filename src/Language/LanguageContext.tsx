import React, { createContext, useState, useContext, useEffect } from 'react';
import { Language } from './Languages';
import { GetSettingValues, updateSettingData } from '../Components/Helpers/HelperFunctions';
import { gapi } from 'gapi-script';
import { updateData } from '../Components/Utils/ApiCalls/ApiCalls';
import { useSttings } from '../Components/SelectSource/store';
const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
    const[languagePartUpdate,setLanguagePartUpdate]=React.useState(false)
  const [languages, setLanguage] = useState<any>('en');
  const [translation, setTranslation] = useState({});
  const { appSettings,setAppSettings } = useSttings();
    
    function getLanguageObject(langCode) {
        
    
        Language.forEach(item => {
            const transl = item?.convertText?.find(textObj => textObj?.LangCode === langCode);
    
            if (transl) {
                translation[item.Key] = transl?.Text;
            } else {
                translation[item.Key] = item?.Text;
            }
        });
    
        return Object.keys(translation).length > 0 
            ? translation
            : Language.reduce((acc, item) => {
                acc[item.Key] = item.Text;
                return acc;
            }, {});
    }
    
  

  useEffect(() => {
    let lang;
    let settingData: any;
    GetSettingValues().then((data) => {
      settingData = data ?? appSettings;
      if (settingData?.BrowserLanguageActive) {
        lang = window.navigator.language;
      } else {
        lang = settingData?.SelectedLanguage?.key;
      }

      const newTranslation = getLanguageObject(lang);
      setTranslation(newTranslation);
      if (Object.keys(settingData)?.length) {
        updateData({ ...settingData, LaguageData: newTranslation });
        setAppSettings({ ...settingData, LaguageData: newTranslation });
      }
    });
  }, [languagePartUpdate]);

  return (
    <LanguageContext.Provider value={{languagePartUpdate,setLanguagePartUpdate, translation,setTranslation, languages, setLanguage, getLanguageObject }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
