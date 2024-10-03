import { createContext, useContext, useEffect, useState } from "react";
import {
  getSettingJson,
  IMAGES_LIST,
  SETTING_LIST,
  USER_LIST,
} from "../api/storage";

const Context = createContext<any>(null);

export const ContextProvider = ({ children }) => {
  const [settingContextList, setSettingContextList] = useState(null);
  const [imagesContextList, setImagesContextList] = useState(null);
  const [usersContextList, setUsersContextList] = useState(null);

  const getSettingsData = async () => {
    const settingJson = await getSettingJson(SETTING_LIST);
    const imagesJson = await getSettingJson(IMAGES_LIST);
    const usersJson = await getSettingJson(USER_LIST);
    setSettingContextList(settingJson);
    setImagesContextList(imagesJson);
    setUsersContextList(usersJson);
  };

  useEffect(() => {
    getSettingsData();
  }, []);

  const values = {
    settingContextList,
    imagesContextList,
    usersContextList,
    setSettingContextList,
    setImagesContextList,
    setUsersContextList
  };

  return <Context.Provider value={values}>{children}</Context.Provider>;
};

export const useListContext = () => useContext(Context);
