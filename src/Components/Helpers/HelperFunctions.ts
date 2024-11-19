import Papa from "papaparse";
import { gapi } from "gapi-script";
import { BlobServiceClient } from "@azure/storage-blob";
import { Buffer } from "buffer";
import CryptoJS from "crypto-js";
import * as base64js from "base64-js";
import { getSettingJson, SETTING_LIST } from "../../api/storage";

let containerClient: any;
const encryptionKey = CryptoJS.enc.Hex.parse(
  "0123456789abcdef0123456789abcdef"
); // Example 32-byte key
const iv = CryptoJS.enc.Hex.parse("abcdef0123456789"); // Example 16-byte IV
export function changeFavicon(url) {
  let favicon: any =
    document.querySelector('link[rel="icon"]') ||
    document.querySelector('link[rel="shortcut icon"]');

  if (favicon) {
    favicon.href = url;
  } else {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.href = url;
    document.head.appendChild(favicon);
  }
}

export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
export function removeFavicon() {
  const favicon =
    document.querySelector('link[rel="icon"]') ||
    document.querySelector('link[rel="shortcut icon"]');

  if (favicon) {
    favicon.remove();
  }
}
export const downloadCSV = (data) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "ED.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
async function blobToString(blob: any) {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onloadend = (ev) => {
      resolve((ev.target as any).result);
    };
    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(blob);
  });
}

export function getCurrentUser() {
  const auth2 = gapi.auth2.getAuthInstance();
  if (auth2.isSignedIn.get()) {
    return auth2.currentUser.get().getBasicProfile();
  } else {
    return null;
  }
}
export function formatDate(date: Date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${day}-${month}`;
}

export async function GetSettingValues() {
  var domain = gapi.auth2?.getAuthInstance().currentUser.le.wt.cu.split("@")[1];
  //console.log(domain);
  var _domain = domain?.replace(/\./g, "_");
  var storagedetails =
    '[{"storageaccount":"mystorageaccountparj","containername":"parjinder1","blobfilename":"' +
    _domain +
    '.json"}]';
  var mappedcustomcol = JSON.parse(storagedetails);
  const sasToken =
    "sv=2022-11-02&ss=b&srt=sco&sp=rwdlaciytfx&se=2028-02-28T12:24:45Z&st=2024-02-29T04:24:45Z&spr=https&sig=FrbdvHpW929m3xVikmm5HiBL6Q00lHjk0a5CPuw1H2U%3D";
  const blobStorageClient = new BlobServiceClient(
    // this is the blob endpoint of your storage acccount. Available from the portal
    // they follow this format: <accountname>.blob.core.windows.net for Azure global
    // the endpoints may be slightly different from national clouds like US Gov or Azure China
    "https://" +
      mappedcustomcol[0].storageaccount +
      ".blob.core.windows.net?" +
      sasToken
    //   ,
    // null
    //new InteractiveBrowserCredential(signInOptions)
  );
  containerClient = blobStorageClient.getContainerClient(
    mappedcustomcol[0].containername
  );
  const blobClient = containerClient.getBlobClient(
    mappedcustomcol[0].blobfilename
  );

  const exists = await blobClient.exists();

  console.log("exists.........", exists);

  if (exists) {
    const downloadBlockBlobResponse = await blobClient.download();
    const downloaded: any = await blobToString(
      await downloadBlockBlobResponse.blobBody
    );
    //console.log("Downloaded blob content11", downloaded,'2');
    // const jsonData = downloadBlockBlobResponse.toString();
    // Parse the JSON data
    //const buf = new ArrayBuffer(downloaded.maxByteLength);
    const decoder = new TextDecoder();
    const str = decoder.decode(downloaded);
    //_parsedData=str;
    let parsedData = JSON.parse(str);
    return parsedData;
  }
}

export function filterTrueValues(obj) {
  return Object?.fromEntries(
    Object?.entries(obj)?.filter(([key, value]) => value === true) // Filter out only true values
  );
}
export function getFirstAvailableView(views) {
  if (views.grid) return "Grid";
  if (views.list) return "List";
  if (views.tile) return "Tile";
  if (views.imported) return "imported";
  return null; // No view available
}
export function removeDuplicatesFromObject(arr, prop) {
  const unique = arr?.filter(
    (obj, index, self) => index === self.findIndex((t) => t[prop] === obj[prop])
  );
  return unique;
}
export const ExcludeUsers = (staffList, parsedData) => {
  return staffList?.filter((item) => {
    const departmentMatch = parsedData?.ExcludeByDepartment?.some(
      (exclusion) =>
        exclusion?.value?.toLowerCase() ===
        item?.organizations[0]?.department?.toLowerCase()
    );

    const jobTitleMatch = parsedData?.ExcludeByJobTitle?.some(
      (exclusion) =>
        exclusion?.value?.toLowerCase() ===
        item?.organizations[0]?.title?.toLowerCase()
    );

    const emailMatch = parsedData?.ExcludeByDomain?.some(
      (exclusion) =>
        exclusion?.value?.toLowerCase() ===
        item?.primaryEmail?.split("@")[1].toLowerCase()
    );
    const fullemailMatch = parsedData?.ExcludedByEmail?.some(
      (exclusion) =>
        exclusion?.value?.toLowerCase() == item?.primaryEmail?.toLowerCase()
    );
    const userNameMatch = parsedData?.ExcludeByName?.some((exclusion) =>
      exclusion?.value
        ?.toLowerCase()
        ?.includes(item?.name?.fullName?.toLowerCase())
    );
    const userNameContainsMatch = parsedData?.ExcludedByContains?.some(
      (exclusion) =>
        // exclusion?.value?.toLowerCase()?.includes(item?.name?.fullName.toLowerCase());
        item?.name?.fullName
          ?.toLowerCase()
          .includes(exclusion?.value?.toLowerCase())
    );
    // const BulkByNameMatch = parsedData?.ExcludeUsersBulk?.some(
    //   (exclusion) =>
    //     exclusion?.name?.fullName?.toLowerCase() ==
    //     item?.name?.fullName?.toLowerCase()
    // );
    const BulkByNameMatch = parsedData?.ExcludeUsersBulk?.some((exclusion) => {
      const name: any = exclusion?.name;
      console.log("exclusion->", name, parsedData?.ExcludeUsersBulk);
      return (
        typeof name?.fullName === "string" && name.fullName === item?.fullName
      );
    });

    // let loc =
    // item?.locations[0]?.buildingId +
    // " " +
    // item?.locations[0]?.floorName +
    // " " +
    // item?.locations[0]?.floorSection;

    let loc = "";
    if (item?.location !== undefined) {
      loc =
        item?.locations[0]?.buildingId +
        " " +
        item?.locations[0]?.floorName +
        " " +
        item?.locations[0]?.floorSection;
    }

    const locationMatch = parsedData?.ExcludeByLocation?.some((exclusion) =>
      exclusion?.value?.toLowerCase()?.includes(loc?.toLowerCase())
    );

    return !(
      departmentMatch ||
      jobTitleMatch ||
      emailMatch ||
      userNameMatch ||
      locationMatch ||
      BulkByNameMatch ||
      fullemailMatch ||
      userNameContainsMatch
    );
  });
};

export const ExcludeExternalUsers = (staffList, parsedData) => {
  return staffList.filter((item) => {
    // Ensure properties are accessed correctly from item
    const department = item?.department?.toLowerCase() || "";
    const job = item?.job?.toLowerCase() || "";
    const emailDomain = item?.email?.split("@")[1]?.toLowerCase() || "";
    const fullEmail = item?.email?.toLowerCase() || "";
    const fullName = item?.name?.fullName?.toLowerCase() || "";
    const location =
      (item?.buildingid || "") +
      " " +
      (item?.floorname || "") +
      " " +
      (item?.floorsection || "");

    const departmentMatch = parsedData?.ExcludeByDepartment?.some(
      (exclusion) => exclusion?.value?.toLowerCase() === department
    );

    const jobTitleMatch = parsedData?.ExcludeByJobTitle?.some(
      (exclusion) => exclusion?.value?.toLowerCase() === job
    );

    const emailMatch = parsedData?.ExcludeByDomain?.some(
      (exclusion) => exclusion?.value?.toLowerCase() === emailDomain
    );

    const fullEmailMatch = parsedData?.ExcludedByEmail?.some(
      (exclusion) => exclusion?.value?.toLowerCase() === fullEmail
    );

    const userNameMatch = parsedData?.ExcludeByName?.some((exclusion) =>
      exclusion?.value?.toLowerCase()?.includes(fullName)
    );

    const userNameContainsMatch = parsedData?.ExcludedByContains?.some(
      (exclusion) => fullName.includes(exclusion?.value?.toLowerCase())
    );

    const bulkByNameMatch = parsedData?.ExcludeUsersBulk?.some(
      (exclusion) => exclusion?.name?.fullName?.toLowerCase() === fullName
    );

    const locationMatch = parsedData?.ExcludeByLocation?.some((exclusion) =>
      exclusion?.value?.toLowerCase()?.includes(location.toLowerCase())
    );

    return !(
      departmentMatch ||
      jobTitleMatch ||
      emailMatch ||
      fullEmailMatch ||
      userNameMatch ||
      userNameContainsMatch ||
      bulkByNameMatch ||
      locationMatch
    );
  });
};

export const decryptData = (encryptedData) => {
  try {
    if (encryptData?.length) {
      const bytes = CryptoJS?.AES.decrypt(encryptedData, encryptionKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      let data = bytes?.toString(CryptoJS.enc.Utf8) || null;
      return data;
    }
    // Converts bytes to UTF-8 string
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

export const encryptData = (plaintext) => {
  const encrypted = CryptoJS.AES.encrypt(plaintext, encryptionKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

export async function isUserAdmin(email) {
  // const currentUser = getCurrentUser()?.cu;

  if (!email) {
    return false;
  }

  try {
    // const data = await GetSettingValues();
    // return data?.IsAdmin?.includes(email) ?? false;
  } catch (error) {
    console.error("Error fetching setting values:", error);
    return false;
  }
}

export function isUserAdminCheck(users, email) {
  const currentUser = getCurrentUser()?.cu;
  const DataUser = users.find((item) => {
    return item.email == currentUser;
  });

  if (!email) {
    return false;
  }

  try {
    return DataUser?.isAdmin;
    // return true;
  } catch (error) {
    console.log("Error fetching setting values:", error);
    return false;
  }
}

export function formatDatesInArray(dataArray) {
  return dataArray?.map((item) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date?.toISOString().split("T")[0];
    };

    return {
      ...item,
      DOB: item?.DOB ? formatDate(item.DOB) : null,
      DOJ: item?.DOJ ? formatDate(item.DOJ) : null,
    };
  });
}

export const customFunctionFilter = (users: any[], parsedData: any) => {
  const filters = parsedData?.CustomFunctionData;
  if (filters?.length === 0) return users;
  let ans = [];
  for (let i = 0; i < users?.length; i++) {
    filters?.map((x: any) => {
      const u = users[i];
      const p = u[x.property];
      const v = x.value;
      if (p === v) {
        ans.push(u);
      }
    });
  }
  return removeDuplicatesFromObject(ans, "email");
};

export async function generateUniqueId(email) {
  const encoder = new TextEncoder();
  const data = encoder.encode(email);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex.substring(0, 16); // Shorten to 16 characters
}

export function getRestrictedAccess(data, currentUser) {
  try {
    let result = [];
    const activeAccess = data?.filter((val) => val?.active === true);

    activeAccess?.forEach((item) => {
      let fields = {};

      let isDepartmentIncludes = item.departmentCriteria?.departments?.some(
        (val) =>
          val.value.toLowerCase() === currentUser.department?.toLowerCase() ||
          item.departmentCriteria?.departmentContains
            ?.toLowerCase()
            .includes(currentUser.department?.toLowerCase())
      );

      let isLocationIncludes = item.locationCriteria?.locations?.some(
        (val) =>
          val.value.toLowerCase() === currentUser.location?.toLowerCase() ||
          item.locationCriteria?.locationContains
            ?.toLowerCase()
            .includes(currentUser.location?.toLowerCase())
      );

      let isJobTitleIncludes = item.jobTitleCriteria?.jobTitles?.some(
        (val) =>
          val.value.toLowerCase() === currentUser.jobTitle?.toLowerCase() ||
          item.jobTitleCriteria?.jobTitleContains
            ?.toLowerCase()
            .includes(currentUser.jobTitle?.toLowerCase())
      );

      let isUserIncludes = item.userCriteria?.users?.some(
        (val) =>
          val.value.toLowerCase() === currentUser.email?.toLowerCase() ||
          item.userCriteria?.userContains
            ?.toLowerCase()
            .includes(currentUser.email?.toLowerCase())
      );

      const fieldIncludes = {
        department: isDepartmentIncludes,
        location: isLocationIncludes,
        jobtitle: isJobTitleIncludes,
        user: isUserIncludes,
      };

      let condition = true;
      for (let field of Object.keys(item.radioValue)) {
        const cond = item.radioValue[field];
        if (cond === "or") {
          if (fieldIncludes[field]) {
            condition = true;
            break;
          } else {
            condition = false;
          }
        } else if (cond === "and") {
          if (fieldIncludes[field] == false) {
            condition = false;
            break;
          } else {
            condition = true;
            break;
          }
        }
      }

      if (condition) {
        item.proprties.forEach((col) => {
          fields[col.value] = item.accessType === "Include" ? true : false;
        });
      }

      result.push(fields);
    });
    return result;
  } catch (err) {
    console.error(err);
  }
}

export function applyRestrictions(users, restrictions) {
  return users.map((user) => {
    let updatedUser = { ...user };

    for (let key in restrictions[0]) {
      if (restrictions[0][key] === false) {
        updatedUser[key] = "";
      }
    }

    return updatedUser;
  });
}

export function convertToISO(dateString) {
  const [month, day, year] = dateString.split("/");

  const paddedMonth = month.padStart(2, "0");
  const paddedDay = day.padStart(2, "0");

  return `${year}-${paddedMonth}-${paddedDay}`;
}

export const sendEmail = async () => {
  const accessToken = gapi.client.getToken().access_token;

  if (!accessToken) {
    console.log("No access token found.");
    return;
  }

  // Static data
  const recipientValue = "kambojsama84@gmail.com";
  const subject = "SMS Forwarding from akash";
  const body = "hii";

  const message = [
    `To: ${recipientValue}`,
    `Subject: ${subject}`,
    "",
    body,
  ].join("\n");

  // Encode the message to base64 and replace characters for URL safety
  const encodedMessage = base64js
    .fromByteArray(new TextEncoder().encode(message))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  console.log(accessToken, "accessToken");

  try {
    const response = await fetch(
      "https://www.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: encodedMessage }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error sending email: ${response.statusText}`);
    }

    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
