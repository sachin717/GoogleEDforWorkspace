import { gapi } from "gapi-script";
import {
  defaultSettingList,
  defaultImagesList,
  defaultUserList,
} from "./defaultSettings";
import { decryptData } from "../Components/Helpers/HelperFunctions";

/*--------------------- DO NOT MODIFY THIS CODE -----------------------*/
export const USER_LIST: string = "users";
export const SETTING_LIST: string = "settings";
export const IMAGES_LIST: string = "images";
/*--------------------- DO NOT MODIFY THIS CODE -----------------------*/

export const createSettingJson = async (listName: string, jsonData: any) => {
  try {
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

    console.log("json file uploaded");
  } catch (err) {
    console.log("Error in createObject", err);
  }
};

export const getSettingJson = async (listName: string) => {
  try {
    const bucketName = process.env.REACT_APP_BUCKET_NAME || 'ed365';
    const token = gapi.client.getToken().access_token;
    const domain = gapi.auth2
      .getAuthInstance()
      .currentUser.le.wt.cu.split("@")[1]
      .split(".")[0];

    const api = `https://storage.googleapis.com/storage/v1/b/${bucketName}/o/${domain}%2F${listName}`;

    const response = await fetch(api, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    const jsonResponse = await response.json();

    if (jsonResponse?.error?.code == 404||jsonResponse?.error?.code == 403) {
      console.log("setting list does not exists");
      if (listName === USER_LIST) {
        createSettingJson(USER_LIST, defaultUserList);
      } else if (listName === SETTING_LIST) {
        createSettingJson(SETTING_LIST, defaultSettingList);
      } else if (listName === IMAGES_LIST) {
        createSettingJson(IMAGES_LIST, defaultImagesList);
      }
      return;
    }
    const listApi = jsonResponse.mediaLink;

    const rawData = await fetch(listApi);
    const settingList = await rawData.json();

    if (listName === USER_LIST) {
      let data;

      try {
        data = decryptData(settingList);
        data = JSON.parse(data);
      } catch (error) {
        console.log("Error decrypting Users data:", error);
        data = [];
      }

      if (data) {
        console.log(`GET - ${listName}`, data);
        return data;
      } else {
        return defaultUserList;
      }
    }

    if (listName == USER_LIST) {
    } else {
      console.log(`GET - ${listName}`, settingList);
    }

    return settingList;
  } catch (err) {
    console.log("Error in getSettingJson", err);
  }
};

export const updateSettingJson = async (listName: string, jsonData: any) => {
  try {
    if (listName === "") {
      console.log("...............INVALID LIST NAME..........");
      return;
    }

    if (listName === SETTING_LIST && Object.keys(jsonData).length < 20) {
      console.log("...............JSON DATA IS EMPTY..........");
      alert("JSON HAVE LESS THAN 20 KEYS, CAN'T UPDATE");
      return;
    }

    if (listName === IMAGES_LIST && Object.keys(jsonData).length < 1) {
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
