import React, { createContext, useState, useContext, useEffect } from "react";
import { Language } from "./Languages";
import { gapi } from "gapi-script";
import { updateData } from "../Components/Utils/ApiCalls/ApiCalls";
import { useSttings } from "../Components/SelectSource/store";
import { getSettingJson, IMAGES_LIST, SETTING_LIST,  } from "../api/storage";
const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [languagePartUpdate, setLanguagePartUpdate] = React.useState(false);
  const [languages, setLanguage] = useState<any>("en");
  const [translation, setTranslation] = useState({});
  const { appSettings, setAppSettings } = useSttings();

  function getLanguageObject(langCode) {
    Language.forEach((item) => {
      const transl = item?.convertText?.find(
        (textObj) => textObj?.LangCode === langCode
      );

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
  const updateSettingJson = async (listName:string, jsonData:any) => {
    try {
      if(listName === ""){
        console.log("...............INVALID LIST NAME..........")
        return;
      }
  
      if(listName === SETTING_LIST && Object.keys(jsonData).length < 20){
        console.log("...............JSON DATA IS EMPTY..........");
        alert("JSON HAVE LESS THAN 20 KEYS, CAN'T UPDATE");
        return;
      }
  
      if(listName === IMAGES_LIST && Object.keys(jsonData).length < 1){
        alert("JSON HAVE LESS THAN 20 KEYS, CAN'T UPDATE");
        return;
      }
      
      const bucketName = process.env.REACT_APP_BUCKET_NAME || 'ed365';
      const token = gapi.client.getToken().access_token;
      const domain = gapi.auth2
        .getAuthInstance()
        .currentUser.le.wt.cu.split("@")[1]
        .split(".")[0];
  
      const api = `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?name=${domain}%2F${listName}&uploadType=resumable`;
  
      const response: any = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
  
      const uploadUrl = [...response.headers].find(
        ([key]) => key === "location"
      )[1];
  
      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });
  
      console.log(`POST - ${listName} : `, jsonData);
    } catch (err) {
      console.log("Error in createObject", err);
      return false;
    }
  };
  useEffect(() => {
    let lang;
    let settingData: any;
    // GetSettingValues().then((data) => {
       getSettingJson(SETTING_LIST).then((data)=>{

         settingData =data;
      
      if (settingData?.BrowserLanguageActive) {
        lang = window.navigator.language;
      } else {
        lang = settingData?.SelectedLanguage?.key;
      }

      const newTranslation = getLanguageObject(lang);
      setTranslation(newTranslation);
      console.log("only one",newTranslation)
      if (settingData && Object?.keys(settingData)?.length) {
        
          updateSettingJson(SETTING_LIST, { ...settingData, LanguageData: newTranslation });
     
        setAppSettings({ ...settingData, LanguageData: newTranslation });
      }
    });
  }, [languagePartUpdate]);

  return (
    <LanguageContext.Provider
      value={{
        languagePartUpdate,
        setLanguagePartUpdate,
        translation,
        setTranslation,
        languages,
        setLanguage,
        getLanguageObject,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
