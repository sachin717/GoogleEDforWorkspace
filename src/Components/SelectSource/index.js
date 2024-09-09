import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CommandBar from "./CommandBar";
import { gapi } from "gapi-script";
import DefaultImage from "../assets/images/DefaultImg1.png";
import DirectoryImage from "../assets/images/directory-logo.png";
import { style } from "./styles";
import useStore, { useSttings } from "./store";
import { BlobServiceClient } from "@azure/storage-blob";
import { Buffer } from "buffer/";
import SettingsPage from "../Pages/SettingsPage";
import Home from "../Pages/Home";
import styles from "../SCSS/Ed.module.scss";
import OrgChartPage from "../Pages/OrgChartPage";
import {
  changeFavicon,
  decryptData,
  downloadCSV,
  ExcludeExternalUsers,
  ExcludeUsers,
  filterTrueValues,
  getFirstAvailableView,
  removeDuplicatesFromObject,
  removeFavicon,
  customFunctionFilter,
} from "../Helpers/HelperFunctions";

import { usePDF } from "react-to-pdf";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SearchFilters from "../SearchFilters/SearchFilters";
import { LanguageProvider, useLanguage } from "../../Language/LanguageContext";
import ExportToCsv from "../Pages/ExportToCsv";
import BirthdayAndAnniversary from "../BithdayAndAnniversary";
import Dashboard from "../Dashboard";
import { useFields } from "../../context/store";
import { employees } from "../SmapleEmployees";
import ImportUsers from "./ImportUsers";

const Container = styled.div`
  ${style}
`;

let _customgrps = ["Groups"];
let resultgrpCf = [];
// let resultgrpCf1=[];
var _arraygrpcf = [],
  _arraygrpcf1 = [];
var CLIENT_ID =
  "236717214097-jmdc31nh8d2h5mim0it1gbdvrja94cg2.apps.googleusercontent.com";
var API_KEY = "AIzaSyARbVgWR0mkXN7Ntozoumstt2SNzLcCdqE";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  "https://admin.googleapis.com/$discovery/rest?version=directory_v1",
];
const scopes =
  "https://www.googleapis.com/auth/admin.directory.group.readonly https://www.googleapis.com/auth/admin.directory.user https://www.googleapis.com/auth/admin.directory.group.member.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/admin.directory.user.readonly https://www.googleapis.com/auth/admin.directory.user.security";

let allUsers = [];
var allletter = "ALL";
var parsedData = "";
var sortby = "";
var _gridWidth = "";
var _grpsOn = "";
var _arraygrpcf1 = [];
var isCurrentUserAdmin = false;
var specifieduser;
var specifiedmanager;
var _excspecuser = [];
var _excspecuserss = "";
var arrmanager = [];
var _excmgruserss = "";
var DefaultView = "";

const GoogleEmployeeDirectory = () => {
  // ---------------STATES----------------
  const [isBirthAndAnivModalOpen, setBirthAndAnivModalOpen] = useState(false);
  const [NonM365, setNonM365] = useState([]);
  const [isGrid, setisGrid] = useState(false);
  const [isTile, setisTile] = useState(false);
  const [isImportedUser, setImpotedUser] = useState(false);
  const [selectedGrp, setselectedGrp] = useState([]);
  const [isList, setisList] = useState(false);
  const [recordsToload, setRecordsToload] = useState(25);
  const [UserArray, setUserArray] = useState([]);
  const [showDashboard, setshowDashboard] = useState(false);
  const [showProgress, setshowProgress] = useState(false);
  const [groupsOptions, setGroupsOptions] = useState([]);

  // ------------PAGES STATES------------------
  const [showOrgChart, setShowOrgChart] = useState(false);
  const [showHomePage, setShowHomePage] = useState(true);
  const [Setting, setSettings] = useState(false);
  const [isDownloadCsvModal, setDownloadCsvModal] = useState(false);

  // -------------- GLOBAL STATE------------
  const {
    changeTopManager,
    changeVariable,
    changeUserData,
    changeUserArray,
    changeCheckboxesCheckedListView,
    checkboxesCheckedListView,
    searchFilters,
    changeGridWidth,
    checkboxesChecked,
    changeCheckboxesChecked,
    changeUserGridView,
    userGridView,
    changeExcludeByDepartment,
    changeSearchFilters,
    view,
    setView,
  } = useStore();
  const {
    setDepartments,
    setLocations,
    setJobTitles,
    setDepDropDown,
    setJobDropDown,
    setLocationDropDown,
    setExcludeOptionsForDomain,
    setEmails,
  } = useFields();
  const { appSettings, setAppSettings } = useSttings();

  useEffect(() => {
    // Add event listener on mount
    window.addEventListener("resize", changeView);

    function changeView() {
      if (window.innerWidth < 768) {
        let temp = {
          ...parsedData,
          defaultMobileView: appSettings?.defaultMobileView,
        };

        setView(appSettings?.defaultMobileView);

        // if (Object.keys(parsedData).length > 0) {
        //   updateSettingData(temp);
        // }
      } else {
        setView(appSettings.DefaultView);
        console.log("Not in mobile view. Function not called.");
      }
    }
    // saveDefaultMobileView();mobile

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", changeView);
    };
  }, [window.innerWidth]);

  useEffect(() => {
    if (view == "Grid") {
      setisGrid(true);
      setisList(false);
      setisTile(false);
    } else if (view == "List") {
      setisGrid(false);
      setisList(true);
      setisTile(false);
    } else if (view == "Tile") {
      setisGrid(false);
      setisList(false);
      setisTile(true);
    } else if (view == "NonM365") {
      setisGrid(false);
      setisList(false);
      setisTile(false);
      setImpotedUser(true);
    }
    // console.log("feom index",view)
  }, [view]);

  //--------------AUTH SERVICES STARTS------------------

  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [showLoginScreen, setShowLoginScreen] = useState(false);

  const signIn = () => {
    gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(() => {
        blobCall();
        setShowLoginScreen(false);
        setIsUserSignedIn(true);
      })
      .catch(() => {
        setShowLoginScreen(true);
        setIsUserSignedIn(false);
      });
  };

  const signOut = () => {
    gapi.auth2
      .getAuthInstance()
      .signOut()
      .then(() => {
        setShowLoginScreen(true);
        setIsUserSignedIn(false);
      });
  };

  const signInWithGoogle = () => {
    gapi.load("client:auth2", async () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: scopes,
        })
        .then(() => {
          const userSignInState = gapi.auth2.getAuthInstance().isSignedIn.get();
          setIsUserSignedIn(userSignInState);
          if (userSignInState) {
            blobCall();
          } else {
            setShowLoginScreen(true);
          }
        });
    });
  };

  const signInWithPopup = () => {
    gapi.load("client:auth2", async () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: scopes,
        })
        .then(() => {
          const userSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
          setIsUserSignedIn(userSignedIn);
          signIn();
        });
    });
  };

  useEffect(() => {
    signInWithGoogle();
  }, [isUserSignedIn]);

  //--------------AUTH SERVICES EDNS------------------

  // ---------------------FUNCTIONS---------------------
  const fetchUsersWithFilters = async (filters, sortby, pageToken) => {
    console.log("Filters:", filters);

    if (!filters || filters?.length === 0) {
      console.warn("No filters provided.");
      return;
    }

    const constructQuery = (filters) => {
      return filters
        ?.map((filter) => {
          const fieldMap = {
            department: "orgDepartment",
            job: "orgTitle",
            manager: "directManager",
            custom: `OtherFields.${filter.email}`,
          };
          const field = fieldMap[filter.email] || filter?.email;
          return `${field}:"${filter?.fetchedValue}"`;
        })
        .join(" OR ");
    };

    const query = constructQuery(filters);
    console.log("Query:", query);

    try {
      const response = await gapi.client.directory.users.list({
        customer: "my_customer",
        projection: "full",
        orderBy: sortby,
        query: query,
        maxResults: 100,
        pageToken: pageToken,
      });

      console.log("Users fetched:", response);
      return response;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  async function getAllUsersInOrg() {
    let page = "";
    let pageToken = "";
    let staffList = [];
    do {
      page = await gapi.client.directory.users.list({
        customer: "my_customer",
        projection: "full",
        orderBy: sortby,
        query:
          allletter == "ALL"
            ? "" + sortby + ":*"
            : "" + sortby + ':"' + allletter + '"*',
        maxResults: 100,
        pageToken: pageToken,
      });

      staffList = staffList?.concat(page?.result?.users).filter((user) => {
        if (parsedData?.ExcludeByDepartment !== undefined) {
          const excludedDepartments = parsedData?.ExcludeByDepartment?.map(
            (dept) => dept.value
          );
          if (
            user &&
            excludedDepartments.includes(user.organizations[0].department)
          ) {
            return false;
          }
        }
        if (parsedData.ExcludeByJobTitle !== undefined) {
          const excludedByJob = parsedData.ExcludeByJobTitle.map(
            (job) => job?.value
          );
          if (user && excludedByJob.includes(user?.organizations[0]?.title)) {
            return false;
          }
        }

        if (parsedData.ExcludeUsersBulk !== undefined) {
          const excludeByName = parsedData.ExcludeUsersBulk.map((user) =>
            user?.name?.fullName?.toLowerCase().trim()
          );
          const userGivenNameLower = user?.name?.fullName.toLowerCase().trim();
          if (excludeByName.includes(userGivenNameLower)) {
            return false;
          }
        }
        if (parsedData?.ExcludeByDomain != undefined) {
          let excludedDomains = parsedData?.ExcludeByDomain.map((item) => {
            return item.value;
          });
          if (user && excludedDomains.includes(user?.primaryEmail)) {
            return false;
          }
        }

        return true;
      });

      pageToken = page.nextPageToken;
    } while (pageToken);

    let res = ExcludeUsers(staffList, parsedData);
    return res;
  }

  async function blobCall() {
    setshowProgress(true);
    var domain = gapi.auth2
      .getAuthInstance()
      .currentUser.le.wt.cu.split("@")[1];
    // changeTopManager("james@megazap.us");
    // console.log(gapi.auth2.getAuthInstance().currentUser.le.wt.cu);
    var _domain = domain.replace(/\./g, "_");
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
        sasToken,
      null
      //new InteractiveBrowserCredential(signInOptions)
    );
    var containerClient = blobStorageClient.getContainerClient(
      mappedcustomcol[0].containername
    );
    const blobClient = containerClient.getBlobClient(
      mappedcustomcol[0].blobfilename
    );
    const exists = await blobClient.exists();
    // console.log(getCurrentUser(), "current user");
    if (exists) {
      const downloadBlockBlobResponse = await blobClient.download();
      const downloaded = await blobToString(
        await downloadBlockBlobResponse.blobBody
      );
      // console.log("Downloaded blob content", downloaded);

      // const jsonData = downloadBlockBlobResponse.toString();
      // Parse the JSON data
      //const buf = new ArrayBuffer(downloaded.maxByteLength);
      const decoder = new TextDecoder();
      const str = decoder.decode(downloaded);
      console.log("Setting List ->", JSON.parse(str));
      setAppSettings(JSON.parse(str));

      parsedData = JSON.parse(str);
      // console.log(decryptData(parsedData.Users, "decripted data"));

      // updateSettingData(a)
      // setAppSettings(parsedData);
      setAdditionalManagers(JSON.parse(str).AdditionalManagerData);
      setAssistant(JSON.parse(str).AssistantData);

      setRecordsToload(parsedData?.records_to_load);
      if (parsedData?.Favicon?.isFavIconShow) {
        changeFavicon(parsedData?.Favicon?.url);
      } else {
        removeFavicon();
      }

      if (parsedData.ListViewPrope) {
        const updatedCheckboxes = { ...checkboxesCheckedListView };
        for (const key in parsedData.ListViewPrope) {
          if (key in updatedCheckboxes) {
            updatedCheckboxes[key] = parsedData.ListViewPrope[key];
          }
        }
        changeCheckboxesCheckedListView(updatedCheckboxes);
      } else {
        changeCheckboxesCheckedListView(checkboxesCheckedListView);
        console.log(
          "ListViewPrope property not found in the downloaded object"
        );
      }
      if (parsedData.ProfileViewPrope) {
        const updatedCheckboxesProfile = { ...checkboxesChecked };
        for (const key in parsedData.ProfileViewPrope) {
          if (key in updatedCheckboxesProfile) {
            updatedCheckboxesProfile[key] = parsedData.ProfileViewPrope[key];
          }
        }
        changeCheckboxesChecked(updatedCheckboxesProfile);
      } else {
        changeCheckboxesChecked(checkboxesCheckedListView);
        console.log("profile property not found in the downloaded object");
      }
      if (parsedData.sortby) {
        sortby =
          parsedData.sortby == "FirstName"
            ? "givenName"
            : parsedData.sortby == "familyName"
            ? "familyName"
            : "givenName";
      }
      if (parsedData.GridViewPrope) {
        const updatedPeople = parsedData?.GridViewPrope?.map((person) => {
          const updatedPerson = parsedData["GridViewPrope"].find(
            (data) => data.id === person.id
          );
          if (updatedPerson) {
            return {
              ...person,
              checkbox: updatedPerson.checkbox,
            };
          }
          return person;
        });

        changeUserGridView(updatedPeople);
      } else {
        console.log("Grid  property not found in the downloaded object");
        changeUserGridView(userGridView);
      }

      _gridWidth = parsedData.gridWidth;

      if (parsedData?.ExcludeByDepartment) {
        // console.log("calling", parsedData?.ExcludeByDepartment);
        changeExcludeByDepartment(parsedData.ExcludeByDepartment);
      }
      if (view == "Grid") {
        setisGrid(true);
        setisList(false);
        setisTile(false);
      } else if (view == "List") {
        setisGrid(false);
        setisList(true);
        setisTile(false);
      } else if (view == "Tile") {
        setisGrid(false);
        setisList(false);
        setisTile(true);
      } else if (view == "NonM365") {
        setisGrid(false);
        setisList(false);
        setisTile(false);
        setImpotedUser(true);
      }
      let availableViews = filterTrueValues(parsedData?.hideShowViews);
      let selectingVisibleView = getFirstAvailableView(availableViews);
      // setshowDashboard(parsedData?.showDashboard)
      if (
        window.innerWidth < 768 &&
        Object.keys(availableViews).includes(
          parsedData?.defaultMobileView?.toLowerCase()
        )
      ) {
        setView(parsedData?.defaultMobileView ?? "Grid");
      } else if (
        window.innerWidth < 768 &&
        parsedData?.defaultMobileView != selectingVisibleView
      ) {
        setView(selectingVisibleView ?? "Grid");
      } else {
        setView(parsedData?.DefaultView);
      }

      if (parsedData.sortby) {
        changeVariable(parsedData.sortby);
      }
    } else {
      const jsonData = {
        sortby: "LastName",
        DefaultView: "Grid",
        gridWidth: "150",
        IsAdmin:
          gapi.auth2
            .getAuthInstance()
            .currentUser.le.wt.Ad.replace(/,/g, "#%#")
            .replace(/-/g, "#%%#") +
          "-" +
          gapi.auth2.getAuthInstance().currentUser.le.wt.cu,
        IsSpecificUser: "",
        HideManager: "",
        GridViewPrope: userGridView,
        ProfileViewPrope: checkboxesChecked,
        SearchFiltersPrope: searchFilters,
        records_to_load: 25,
        Favicon: { isFavIconShow: false, url: "" },
        IsExportToCsv: false,
        CustomHomePageUrl: {
          homeCustomUrl: "",
          homeCustomUrlIconName: "",
          CustomHomePageLinkActive: false,
        },
        GroupsOn: "off",
        profileIconName: "",
        ExcludedByContains: [],
        ExcludedByEmail: [],
        ExcludeByName: [],
        BrandLogo: "",
      };
      setisGrid(true);
      setisList(false);
      setisTile(false);
      setImpotedUser(false);
      setView("Grid");
      changeCheckboxesChecked(checkboxesCheckedListView);
      changeUserGridView(userGridView);
      changeCheckboxesCheckedListView(checkboxesCheckedListView);
      changeSearchFilters(searchFilters);
      // const { buffer } = event.file;
      parsedData = JSON.stringify(jsonData);
      await containerClient
        .getBlockBlobClient(mappedcustomcol[0].blobfilename)
        .upload(parsedData, Buffer.byteLength(parsedData));
    }
    DefaultView = parsedData.DefaultView;
    sortby =
      parsedData.sortby == "FirstName"
        ? "givenName"
        : parsedData.sortby == "familyName"
        ? "familyName"
        : "givenName";
    _gridWidth = parsedData.gridWidth;
    _grpsOn = parsedData.GroupsOn;
    var empisadmin = parsedData.IsAdmin;
    if (empisadmin != "" && empisadmin != undefined) {
      if (empisadmin.indexOf(";") > -1) {
        var _anthsplit = empisadmin.split(";");
        for (var y = 0; y < _anthsplit.length; y++) {
          var _frst = _anthsplit[y].split("-")[0];

          if (
            _frst.replace("#%#", ",").replace("#%%#", "-") ==
            gapi.auth2.getAuthInstance().currentUser.le.wt.Ad
          ) {
            isCurrentUserAdmin = true;
          }
        }
      } else {
        // if()
        /*  IsAdmin:
          gapi.auth2
            .getAuthInstance()
            .currentUser.le.wt.Ad.replace(/,/g, "#%#")
            .replace(/-/g, "#%%#") +
          "-" +
          gapi.auth2.getAuthInstance().currentUser.le.wt.cu,
        IsSpecificUser: "",
        HideManager: "",
        GroupsOn:"off" */
        if (empisadmin.indexOf(",") > -1) {
          // var usrdn=empisadmin.split(',');

          empisadmin = empisadmin.replace(/,/g, ";");
          if (empisadmin.indexOf(";") > -1) {
            var _anthsplit = empisadmin.split(";");
            for (var y = 0; y < _anthsplit.length; y++) {
              var _frst = _anthsplit[y].split("-")[0];

              if (
                _frst.replace("#%#", ",").replace("#%%#", "-") ==
                gapi.auth2.getAuthInstance().currentUser.le.wt.Ad
              ) {
                isCurrentUserAdmin = true;
              }
            }
          }
        } else {
          var _frst = empisadmin.split("-")[0];

          if (
            _frst.replace("#%#", ",").replace("#%%#", "-") ==
            gapi.auth2.getAuthInstance().currentUser.le.wt.Ad
          ) {
            isCurrentUserAdmin = true;
          }
        }
      }
    }
    specifieduser = parsedData.IsSpecificUser;
    if (specifieduser != "" && specifieduser != undefined) {
      if (specifieduser.indexOf(";") > -1) {
        specifieduser = specifieduser
          .replace(/#%#/g, ",")
          .replace(/#%%#/g, "-")
          .replace(/[']/g, "%27%27");
      } else {
        if (specifieduser.indexOf(",") > -1) {
          specifieduser = specifieduser.replace(/,/g, ";");
        } else {
          specifieduser = specifieduser
            .replace(/#%#/g, ",")
            .replace(/#%%#/g, "-")
            .replace(/[']/g, "%27%27");
        }
      }
      if (specifieduser != null) {
        var excspecuser = specifieduser.replace(/<[^>]+>/g, "");
        var _excspecusers = excspecuser.split(";");
        for (var dropclmn = 0; dropclmn < _excspecusers.length; dropclmn++) {
          if (dropclmn > 0 && dropclmn <= _excspecusers.length - 1) {
            _excspecuserss += ";";
          }
          _excspecuserss += _excspecusers[dropclmn].split("!!")[0];
        }
        _excspecuser = _excspecuserss.split(";");
      }
    }
    specifiedmanager = parsedData.HideManager;
    if (specifiedmanager != "" && specifiedmanager != undefined) {
      if (specifiedmanager.indexOf(";") > -1) {
        specifiedmanager = specifiedmanager
          .replace(/#%#/g, ",")
          .replace(/#%%#/g, "-")
          .replace(/[']/g, "%27%27");
      } else {
        if (specifiedmanager.indexOf(",") > -1) {
          specifiedmanager = specifiedmanager.replace(/,/g, ";");
        } else {
          specifiedmanager = specifiedmanager
            .replace(/#%#/g, ",")
            .replace(/#%%#/g, "-")
            .replace(/[']/g, "%27%27");
        }
      }
      if (specifiedmanager != "") {
        var _excmgrusers = specifiedmanager.split(";");
        for (var dropclmn = 0; dropclmn < _excmgrusers.length; dropclmn++) {
          if (dropclmn > 0 && dropclmn <= _excmgrusers.length - 1) {
            _excmgruserss += ";";
          }
          _excmgruserss += _excmgrusers[dropclmn].split("!!")[1];
        }
        arrmanager = _excmgruserss.split(";");
      }
    }
    if (_grpsOn) {
      getAllUsersGrpInOrg().then((groups) => {
        //console.log(groups);
        groups.map((group) => {
          _arraygrpcf1.push(group);
        });
      });
    }

    listFiles();
  }

  async function getAllUsersGrpInOrg() {
    let page = "";
    let pageToken = "";
    let staffList = [];

    do {
      page = await gapi.client.directory.groups.list({
        //userKey: userEmail,
        customer: "my_customer",
        maxResults: 100,
        pageToken: pageToken,
      });

      staffList = staffList.concat(page.result.groups);

      pageToken = page.nextPageToken;
    } while (pageToken);

    return staffList;
  }

  async function blobToString(blob) {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onloadend = (ev) => {
        resolve(ev.target.result);
      };
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(blob);
    });
  }

  const filterByLetter = (Letter) => {
    allletter = Letter;
    listFiles();
    setSettings(false);
  };

  async function getAllUsersInOrg1(value, mode) {
    let page = "";
    let pageToken = "";
    let staffList = [];

    do {
      page = await gapi.client.directory.users.list({
        customer: "my_customer",
        projection: "full",
        orderBy: sortby,
        query:
          value === undefined
            ? allletter == "ALL"
              ? "" + sortby + ":*"
              : "" + sortby + ':"' + allletter + '"*'
            : mode === "name"
            ? // ? "" + sortby + ':"' + value + '"*'
              "" + sortby + ':"' + value + ""
            : mode === "title" || mode === "titles"
            ? "orgTitle:" + value + ""
            : mode === "departments"
            ? "orgDepartment:" + value + ""
            : mode == "custom"
            ? `OtherFields.CF1:"${value}"`
            : "",
        maxResults: 100,
        pageToken: pageToken,
      });

      staffList = staffList.concat(page.result.users);

      pageToken = page.nextPageToken;
    } while (pageToken);
    let res = ExcludeUsers(staffList, parsedData);
    return res;
  }

  function getUserOrgWPItem(user) {
    if (user.hasOwnProperty("phones")) {
      const primaryOrg = user.phones.filter((x) => x.type === "work")[0].value;

      return primaryOrg;
    } else {
      return "";
    }
  }

  function getUserOrgMBItem(user) {
    if (user.hasOwnProperty("phones")) {
      const primaryOrg = user.phones.filter((x) => x.type === "mobile")[0]
        .value;

      return primaryOrg;
    } else {
      return "";
    }
  }

  function getUserOrgMGItem(user) {
    if (user.hasOwnProperty("relations")) {
      const primaryOrg = user.relations.filter((x) => x.type === "manager")[0]
        .value;

      return primaryOrg;
    } else {
      return "";
    }
  }

  function getUserOrgEIDItem(user) {
    if (user.hasOwnProperty("externalIds")) {
      const primaryOrg = user.externalIds.filter(
        (x) => x.type === "organization"
      )[0].value;

      return primaryOrg;
    } else {
      return "";
    }
  }

  function getUserOrgADDItem(user) {
    if (user.hasOwnProperty("addresses")) {
      const primaryOrg = user.addresses.filter((x) => x.type === "work")[0]
        .formatted;

      return primaryOrg;
    } else {
      return "";
    }
  }

  function getUserOrgLOCItem(user) {
    if (user.hasOwnProperty("locations")) {
      var bid = user.locations[0].hasOwnProperty("buildingId")
        ? user.locations[0].buildingId
        : "";
      var floorname = user.locations[0].hasOwnProperty("floorName")
        ? user.locations[0].floorName
        : "";
      var floorsection = user.locations[0].hasOwnProperty("floorSection")
        ? user.locations[0].floorSection
        : "";
      return bid + " " + floorname + " " + floorsection;
    } else {
      return "";
    }
  }

  const getFilterAttributesValues = (valuesArray, field) => {
    const res = valuesArray
      ?.filter((value) => value.Active === true)
      ?.map((value) => ({ value: value[field], label: value[field] }));
    return res;
  };

  const listFiles = () => {
    // setloader(true);
    // setshowProgress(true);
    gapi.client.load("admin", "directory_v1", () => {});
    changeTopManager("adele.v@megazap.us");
    let additionManagerData = [];
    let AssistantData = [];
    getAllUsersInOrg().then((data) => {
      setUnFormatedUserData(data);
      console.log("getAllUsersInOrg...................", data);
      changeTopManager("adele.v@megazap.us");
      changeUserData(data);
      var mappedfields =
        '[{"ExistingList":"About Me","ExternalList":"About_Me"},{"ExistingList":"School","ExternalList":"CF1"},{"ExistingList":"Date of Birth","ExternalList":"DOB"},{"ExistingList":"Date of Join","ExternalList":"DOJ"},{"ExistingList":"Skills","ExternalList":"Skills"},{"ExistingList":"Projects","ExternalList":"Projects"},{"ExistingList":"Hobbies","ExternalList":"Hobbies"}]';

      if (typeof data[0] === "undefined") {
        setUserArray([]);
      } else {
        let staffMember = data.map((user) => {
          var arr123 = {};
          var man = {};
          if (user.hasOwnProperty("customSchemas")) {
            const cfield = user.customSchemas;

            Object.keys(cfield).map((key) => {
              var exchangefld = cfield[key];

              for (var i in exchangefld) {
                arr123[i] =
                  exchangefld[i] instanceof Array
                    ? exchangefld[i].reduce((a, b) => {
                        return (
                          (a.value?.toString() || a?.toString()) +
                          " !! " +
                          b.value
                        );
                      })
                    : exchangefld[i];
              }

              return [key];
            });
          }

          if (user?.name?.givenName != null) {
            var names = user?.name?.givenName.split(" "),
              initials = names[0].substring(0, 1).toUpperCase();
            if (names.length > 1) {
              initials += names[names.length - 1].substring(0, 1).toUpperCase();
            }
          }

          var _allex, _allexu;
          if (_excspecuser != null && _excspecuser != undefined) {
            _allexu =
              _excspecuser.filter(
                (x) =>
                  user?.name?.fullName.toLowerCase().indexOf(x.toLowerCase()) >
                  -1
              ).length > 0;
          } else {
            _allexu = null;
          }
          _allex = _allexu;
          var _allexuHide =
            arrmanager.filter(
              (x) =>
                user.primaryEmail.toLowerCase().indexOf(x.toLowerCase()) > -1
            ).length > 0;

          const y = parsedData?.AdditionalManagerData?.map((item) => {
            if (user?.customSchemas?.OtherFields[item.email]) {
              additionManagerData.push(
                user?.customSchemas?.OtherFields[item.email]
              );
            }
          });
          const assistResult = parsedData?.AssistantData?.map((item) => {
            if (user?.customSchemas?.OtherFields[item.email]) {
              AssistantData.push(user?.customSchemas?.OtherFields[item.email]);
            }
          });

          const xx = {
            ...arr123,
            firstName: user?.name?.givenName,
            lastName: user?.name?.familyName,
            name: user?.name?.fullName,
            email: user.primaryEmail,
            id: user.id,
            job: user.hasOwnProperty("organizations")
              ? user.organizations[0].hasOwnProperty("title")
                ? user.organizations[0].title
                : ""
              : "",
            initials: initials,
            department: user.hasOwnProperty("organizations")
              ? user.organizations[0].hasOwnProperty("department")
                ? user.organizations[0].department
                : ""
              : "",

            workphone: getUserOrgWPItem(user),
            mobile: _allex ? "" : getUserOrgMBItem(user),
            manager: _allexuHide ? "" : getUserOrgMGItem(user),
            employeeid: getUserOrgEIDItem(user),
            costcenter: user.hasOwnProperty("organizations")
              ? user.organizations[0].hasOwnProperty("costCenter")
                ? user.organizations[0].costCenter
                : ""
              : "",
            buildingid: user.hasOwnProperty("locations")
              ? user.locations[0].hasOwnProperty("buildingId")
                ? user.locations[0].buildingId
                : ""
              : "",
            floorname: user.hasOwnProperty("locations")
              ? user.locations[0].hasOwnProperty("floorName")
                ? user.locations[0].floorName
                : ""
              : "",
            floorsection: user.hasOwnProperty("locations")
              ? user.locations[0].hasOwnProperty("floorSection")
                ? user.locations[0].floorSection
                : ""
              : "",
            location: getUserOrgLOCItem(user),
            address: getUserOrgADDItem(user),
            image: user.hasOwnProperty("thumbnailPhotoUrl")
              ? user.thumbnailPhotoUrl
              : DefaultImage,
            mappedfields: mappedfields,
            AdditionalManager: additionManagerData,
            AssistantData: AssistantData,
          };
          additionManagerData = [];
          AssistantData = [];

          return xx;
        });
      
        const customFunctionUser = customFunctionFilter(
          staffMember,
          parsedData
        );

        changeUserArray(staffMember);

        const domainOptions = staffMember.map((user) => ({
          value: user.email.split("@")[1],
          label: user.email.split("@")[1],
        }));

        console.log("staffMember................", staffMember);

        const userEmails = staffMember.map((user) => ({
          key: user.email,
          text: user.email,
        }));

        const userDeps = staffMember.map((x)=>({value:x.department, label:x.department}));

        let settingListDeps = parsedData.FilterAttribute.departments.filter((x)=>{
          if(x.Active){
            return x;
          }
        }).map((x)=>({label:x.Department, value:x.Department}));

        const uniqueDep = removeDuplicatesFromObject([...userDeps, ...settingListDeps],"value")
        setDepDropDown(uniqueDep);

        const filterAttribute = parsedData?.FilterAttribute;
        const allFADepartments = filterAttribute?.departments;
        const allFAJobTitles = filterAttribute?.jobTitles;
        const allFALocations = filterAttribute?.locations;

        setDepartments(allFADepartments);
        setJobTitles(allFAJobTitles);
        setLocations(allFALocations);
        setEmails(userEmails);

        const visibleDeprtments = getFilterAttributesValues(
          allFADepartments,
          "Department"
        );
        const visibleJobTitles = getFilterAttributesValues(
          allFAJobTitles,
          "JobTitle"
        );
        const visibleLocations = getFilterAttributesValues(
          allFALocations,
          "Location"
        );

        // setDepDropDown(visibleDeprtments);
        setJobDropDown(visibleJobTitles);
        setLocationDropDown(visibleLocations);

        setExcludeOptionsForDomain(
          removeDuplicatesFromObject(domainOptions, "value")
        );

        // allUsers = employees;

        if (
          parsedData?.Users &&
          parsedData?.SyncUserInfoFrom == "Google & Imported User"
        ) {
          let usersData = ExcludeExternalUsers(staffMember, parsedData);
          //     setUserArray(usersData);
          setUserArray(usersData);
          let decryptedData = decryptData(parsedData.Users);
          setNonM365(JSON.parse(decryptedData));

          // try {
          //   decryptedData = JSON.parse(decryptedData);
          //   console.log(decryptedData, "Parsed Data");
          //   if (Array.isArray(decryptedData)) {
          //     let usersData = [...staffMember, ...decryptedData];
          //     usersData = ExcludeExternalUsers(usersData, parsedData);
          //     setUserArray(usersData);
          //     console.log(
          //       "list fs",
          //       ExcludeExternalUsers(usersData, parsedData)
          //     );
          //     console.log(usersData, "Merged Data");
          //   } else {
          //     setUserArray(staffMember);
          //   }
          // } catch (error) {
          //   console.error("Error parsing JSON or merging data:", error);
          //   setUserArray(staffMember);
          // }
        } else if (
          parsedData?.Users &&
          parsedData?.SyncUserInfoFrom?.toLowerCase() == "importeduser"
        ) {
          let decryptedData = decryptData(parsedData.Users);
          console.log(decryptedData, "Decrypted Data");

          decryptedData = JSON.parse(decryptedData);

          if (Array.isArray(decryptedData)) {
            let usersData = [...decryptedData];
            usersData = ExcludeExternalUsers(usersData, parsedData);
            setUserArray(usersData);
          }
        } else {
          setUserArray(staffMember);
        }
        setFormatedUserData(staffMember);

        //   if (recordsToload == 25) {
        //     // setUserArray(staffMember?.slice(0, 25));
        //     setUserArray(employees?.slice(0, 25));
        //   } else if (recordsToload == 50) {
        //     // setUserArray(staffMember?.slice(0, 50));
        //     setUserArray(employees?.slice(0, 50));
        //   } else if (recordsToload == 100) {
        //     // setUserArray(staffMember?.slice(0, 100));
        //     setUserArray(employees?.slice(0, 100));
        //   } else {
        //     // setUserArray(staffMember?.slice(0, 25));
        //     setUserArray(employees?.slice(0, 25));
        //   }
        setUserArray(customFunctionUser);
      }
      if (parsedData?.GroupsOn) {
        showGroups();
      }
      // setloader(false);
      setshowProgress(false);
    });
  };

  // const GetAccessTokenFromServiceAccount = (function () {
  //   const _url = "https://www.googleapis.com/oauth2/v4/token";
  //   const _grant_type = "urn:ietf:params:oauth:grant-type:jwt-bearer";

  //   function _main(_obj) {
  //     return new Promise((resolve, reject) => {
  //       const { private_key, client_email, scopes } = _obj;
  //       if (!private_key || !client_email || !scopes) {
  //         throw new Error(
  //           "No required values. Please set 'private_key', 'client_email' and 'scopes'"
  //         );
  //       }
  //       const header = { alg: "RS256", typ: "JWT" };
  //       const now = Math.floor(Date.now() / 1000);
  //       const claim = {
  //         iss: client_email,
  //         scope: scopes.join(" "),
  //         aud: _url,
  //         exp: (now + 3600).toString(),
  //         iat: now.toString(),
  //       };
  //       if (_obj.userEmail) {
  //         claim.sub = _obj.userEmail;
  //       }
  //       const signature =
  //         btoa(JSON.stringify(header)) + "." + btoa(JSON.stringify(claim));
  //       const sign = new JSEncrypt();
  //       sign.setPrivateKey(private_key);
  //       const jwt =
  //         signature + "." + sign.sign(signature, CryptoJS.SHA256, "sha256");
  //       const params = {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           assertion: jwt,
  //           grant_type: _grant_type,
  //         }),
  //       };
  //       fetch(_url, params)
  //         .then((res) => res.json())
  //         .then((res) => {
  //           console.log("USER LOGGED IN......", res);
  //         })
  //         .then((res) => resolve(res))
  //         .catch((err) => {
  //           console.log("USER NOT LOGGED IN......", err);
  //           reject(err);
  //         });
  //     });
  //   }

  //   return { do: _main };
  // })();
  // const updateSigninStatus = (isSignedIn) => {
  //   if (isSignedIn) {
  //     // Set the signed in user
  //     //setSignedInUser(gapi.auth2.getAuthInstance().currentUser.je.Qt);
  //     // setSignedInUser(true);
  //     // setIsLoadingGoogleDriveApi(false);
  //     // list files if user is authenticated
  //     // setisShowGrid("Grid");
  //     // setisShowList("List");
  //     // setisShowTile("Tile");
  //     //console.log(gapi.auth2.getAuthInstance().currentUser.le.wt.Ad);

  //     // console.log(gapi.auth2.getAuthInstance().currentUser.le.wt.cu);
  //     blobCall();
  //   } else {
  //     // prompt user to sign in
  //     handleAuthClick();
  //   }
  // };
  // const handleAuthClick = (event) => {
  //   gapi.auth2.getAuthInstance().signIn();
  // };
  // const initClient = async () => {
  //   setIsLoadingGoogleDriveApi(true);
  //   const object = {
  //     private_key:
  //       "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC59b/hiKv2x3iH\ni/0GVuTxU3pFw1BAizg6KEj/7lt5ffhzmQODtwS+ZCimzF2wT4/XGjy2U4tqpTJb\nClUZfJQpK+NuOa5Ymz10kGxoHyvb0dP1i0hH6omJrl30vJDbyFixGpSx2a1JUDR5\nIHUF3JhpGgDradZ75kL/8IoO9qzrr0ZRWm6zilzqMJf19moAzHU3mkaKaCL2fg5r\n8TgYkxvMILe/BI1cJ9y+bJ9p2WLl2JAly6IuJHQY2Qe086PGSzCgm4KJlNANPcVY\n0b13p05Elqed8vZfrtUw6QHCjQSkt5XSsBaugOaI2FkL3eJsnl79TYjkUhEQ7EXu\nW1pGB4X/AgMBAAECggEAGx7DLQCyLPY6q/Csu5PI+tr/o5Slq8Fst1VFuYbecgb+\n84OWzCBRFvU41S6hNpk73eqL0n63qpt3ZGigMEHcwm5jUkwjkvTnpGF7Cz+0ipqn\njLwTPrhuoOo8S04u2tF1VzWMXFhl2cx9LUcgWfT/M0t2uTPWcyZfPMACBRxQ7A7Z\nuQDxL6sqNd0KKuo26k4SEeGPlmLRPGqqTifUSWGpITNAdDCE1syIjdu7Rda2dWSO\nGhTQLw4ooZYswricuYImph2geGJvaohVWm+mtvXl8XKrtjmW3aJ+gYVs0VNX1ru1\nnkrU1aXMDwg+I9/JAIpKX1PtOFJJyTFmdlDAZWTrYQKBgQDdv3IMY1+W2HT409FU\ntVGyksCIxLDiA7IBP9FM/w6rQP4y9zGOX/1PoguUcf19twhkSnDe5yVsXgYxwODO\nji6cCjdlZhBjh5H8hZEAW9zrLPqOuYyU4ENrG+sby4NYAWT4P80S5JK3hUjeoDkZ\nNGAZ8umTf0sOeu8FS4iJi38InwKBgQDWryW4MIsTUsotlR6jHgSb8SD3UeF1QscW\nAKndE7BOvIqreNn0aPxBBiP0B682B0rkiRa7g24oZCHl8STjED33ohfH23BSus8T\na9WFgqA8US8d0+f3I+EHiscUYCBOoupKRkar3q4lUEoZBm6nXVKfpzjzW1qDBGXt\nBwkmjPSmoQKBgQCCBDBApzty3LOo+bkxK6cdRwJwrrLvsi76oIp91MarDs5834dE\n7W8+88pKXZO91EWtWCBZ8bl1kqObJHYrZh5aC3tzjqZpVSH5p+7fAP3FPngimxSc\nbenZsWLmxyrZvOeQzwfU3gRQamvRbKxN5PG8BTuC6g3+DYJ73k/OJeZ0DQKBgHMT\nFRvi4VltQjQmv3Jd78iK+sm3GSvarI5tsp9vI01BIO+C6wlokPZlzTXMPK2wQQO5\nO/ctHwoFimoP1V7k4OJw/2BAjre5rK/TWHOlLjDGr4PEh41grQl26PlSAV9FUmKX\nwt/zj9Muc1lwqjWJ/3TWlN9VM3IRFHV2FQCWA7mhAoGAPGTXEjFcftCfDJ+uI4u3\nPHM3Sf/ErPGVx2TqV4LkK654Bse/H57y0xobGnwvlylYBUnW9/9Ta4Q2xB93hw8Q\np8BxJVRF6R273L4iVKO9S5cnQkZ+6QGyOFCT9DWZ3DlHSrgPTbFEmYJaiHXCcbe9\ngpevDqpyEjZeBUS6HUED+uE=\n-----END PRIVATE KEY-----\n",
  //     client_email: "parjinder@argon-magnet-408506.iam.gserviceaccount.com",
  //     scopes: [
  //       "https://www.googleapis.com/auth/admin.directory.group.readonly",
  //       "https://www.googleapis.com/auth/admin.directory.user",
  //       "https://www.googleapis.com/auth/admin.directory.group.member.readonly",
  //       "https://www.googleapis.com/auth/calendar.readonly",
  //       "https://www.googleapis.com/auth/admin.directory.user.readonly",
  //       "https://www.googleapis.com/auth/admin.directory.user.security",
  //     ],
  //   };

  //   // var token=await GetAccessTokenFromServiceAccount.do(object);
  //   //  console.log(token);
  //   //   await gapi.auth2.authorize({
  //   //    'client_id':'101887144792089449398',
  //   //    'scope': scopes,
  //   //     'serverAuth': {
  //   //         'access_token': token.access_token
  //   //     }
  //   // });

  //   // gapi.client.request({ headers: {
  //   //   'Authorization': 'Bearer ' + token.access_token
  //   // }});

  //   // try {
  //   //   console.log(gapi.auth2.getAuthInstance());
  //   // } catch (err) {
  //   //   setSignedInUser(false);
  //   // }

  //   gapi.auth.setToken(await GetAccessTokenFromServiceAccount.do(object));

  //   //  gapi.client
  //   //   .init({
  //   //    //apiKey: API_KEY,
  //   //   //  clientId: CLIENT_ID,
  //   //    discoveryDocs: DISCOVERY_DOCS,
  //   //   // scope: scopes,
  //   //   })
  //   //   .then(()=>{

  //   // gapi.client.load("admin", "directory_v1",async () => {
  //   //  await gapi.client
  //   // .request({
  //   //   path: "https://content-admin.googleapis.com/admin/directory/v1/users?customer=my_customer&orderBy=givenName&projection=full",
  //   //   // method: "GET",
  //   //   // headers: {
  //   //   //   "Content-Type":"application/json",
  //   //   //   "Authorization": "Bearer " + gapi.client.getToken().access_token,
  //   //   // },
  //   // })
  //   // .then(
  //   //   (response) => {
  //   //     console.log(response);
  //   //   },
  //   //   function (err) {
  //   //     console.log(err);

  //   //   }
  //   // );

  //   // });

  //   // })
  //   // var url = 'https://content-admin.googleapis.com/admin/directory/v1/users?customer=my_customer&orderBy=givenName&projection=full';
  //   // var response = await UrlFetchApp.fetch(url, {
  //   //   headers: {
  //   //     Authorization: 'Bearer ' + gapi.auth.getToken().access_token,
  //   //   },
  //   // });
  //   // console.log(response);
  //   // await gapi.client.directory.users.list({

  //   //   headers: {
  //   //       'Authorization': 'Bearer ' + gapi.auth.getToken().access_token
  //   //     },
  //   //   customer: "my_customer",
  //   //   projection: "full",
  //   //   orderBy: "givenName"

  //   // })
  //   // .headers: {
  //   //       'Authorization': 'Bearer ' + gapi.auth.getToken().access_token
  //   //     }

  //   // await gapi.client.directory.users.list({

  //   //   customer: "my_customer",
  //   //   projection: "full",
  //   //   orderBy: "givenName",

  //   // });

  //   //gapi.client.setToken(await GetAccessTokenFromServiceAccount.do(object))
  //   //gapi.auth2.authorize

  //   gapi.client
  //     .init({
  //       apiKey: API_KEY,
  //       clientId: CLIENT_ID,
  //       discoveryDocs: DISCOVERY_DOCS,
  //       scope: scopes,
  //     })
  //     .then(
  //       function () {
  //         // GoogleUser.getAuthResponse().access_token;
  //         // GoogleUser.reloadAuthResponse();
  //         // Listen for sign-in state changes.
  //         gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
  //         // console.log(gapi.auth2.getAuthInstance(), "sign");
  //         // Handle the initial sign-in state.

  //         updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

  //         // gapi.auth2
  //         //   .getAuthInstance()
  //         //   .signIn()
  //         //   .then(async () => {
  //         //     gapi.client.load("admin", "directory_v1", () => {
  //         //       // now we can use:
  //         //       // gapi.client.admin
  //         //       // gapi.client.directory
  //         //     });
  //         //     const res1 = await gapi.client.directory.groups.list({
  //         //       customer: "my_customer",
  //         //     });
  //         //     console.log(res1.result.groups);

  //         //     const res1x = await gapi.client.directory.users.list({
  //         //       customer: "my_customer",
  //         //       //viewType:'domain_public',
  //         //       //query: "orgUnitPath='/'",
  //         //       // query:'orgTitle=Developer',
  //         //       //query:'MyCustomField.CF2=parjinder',
  //         //       //query: "MyCustomField.CF4>1987-08-05",

  //         //       projection: "full",
  //         //       orderBy: "givenName",
  //         //       sortOrder: "descending",
  //         //     });
  //         //     // console.log(res1x);
  //         //     const connections1 = res1x.result.users;
  //         //     if (!connections1 || connections1.length === 0) {
  //         //       console.log("No connections found.");
  //         //       return;
  //         //     }
  //         //     connections1.forEach((person) => {
  //         //       console.log(person);
  //         //     });
  //         //   });
  //       },
  //       function (error) {
  //         console.log(error);
  //       }
  //     );
  // };

  // const showGrid = (name) => {
  //   if ((name = "Grid")) {
  //     setisShowGrid(name);
  //     setisGrid(true);
  //     setisList(false);
  //     setisTile(false);
  //   } else {
  //     setisShowTile("");
  //     setisShowList("");
  //   }
  // };

  // const showList = (name) => {
  //   if ((name = "List")) {
  //     setisShowList(name);
  //     setisGrid(false);
  //     setisList(true);
  //     setisTile(false);
  //   } else {
  //     setisShowGrid("");
  //     setisShowTile("");
  //   }
  // };

  // const showTile = (name) => {
  //   if ((name = "Tile")) {
  //     setisShowTile(name);
  //     setisGrid(false);
  //     setisList(false);
  //     setisTile(true);
  //   } else {
  //     setisShowGrid("");
  //     setisShowList("");
  //   }
  // };
  // const handleClientLoad = () => {
  //   gapi.load("client:auth2", initClient);
  // };

  const {
    setAdditionalManagers,
    setAssistant,
    setUnFormatedUserData,
    setFormatedUserData,
  } = useFields();

  const clearFilters = () => {
    listFiles();
  };

  const optimization = (value, mode) => {
    // setloader(true);
// alert(isImportedUser)
    setshowProgress(true);
    gapi.client.load("admin", "directory_v1", () => {});

    getAllUsersInOrg1(value, mode).then((data) => {
      console.log(data, "SDfsadfasdfASD");
      var mappedfields =
        '[{"ExistingList":"About Me","ExternalList":"About_Me"},{"ExistingList":"School","ExternalList":"CF1"},{"ExistingList":"Date of Birth","ExternalList":"DOB"},{"ExistingList":"Date of Join","ExternalList":"DOJ"},{"ExistingList":"Skills","ExternalList":"Skills"},{"ExistingList":"Projects","ExternalList":"Projects"},{"ExistingList":"Hobbies","ExternalList":"Hobbies"}]';

      if (typeof data[0] === "undefined") {
        setUserArray([]);
      } else {
        let staffMember = data.map((user) => {
          var arr123 = {};
          var man = {};
          var mgremail = getUserOrgMGItem(user);
          var dataofmang = data.filter(
            (person) => person.primaryEmail == mgremail
          );
          if (dataofmang.length > 0) {
            console.log(dataofmang);
            man = {
              firstName: dataofmang[0].name?.givenName,
              lastName: dataofmang[0].name?.familyName,
              name: dataofmang[0].name?.fullName,
              email: dataofmang[0].primaryEmail,
              id: dataofmang[0].id,
              job: dataofmang[0].hasOwnProperty("organizations")
                ? dataofmang[0].organizations[0].hasOwnProperty("title")
                  ? dataofmang[0].organizations[0].title
                  : ""
                : "",
              //initials: initials,
              department: dataofmang[0].hasOwnProperty("organizations")
                ? dataofmang[0].organizations[0].hasOwnProperty("department")
                  ? dataofmang[0].organizations[0].department
                  : ""
                : "",
              image: dataofmang[0].hasOwnProperty("thumbnailPhotoUrl")
                ? dataofmang[0].thumbnailPhotoUrl
                : DefaultImage,
            };
          }
          if (user.hasOwnProperty("customSchemas")) {
            const cfield = user.customSchemas;

            Object.keys(cfield).map((key) => {
              var exchangefld = cfield[key];

              for (var i in exchangefld) {
                arr123[i] =
                  exchangefld[i] instanceof Array
                    ? exchangefld[i].reduce((a, b) => {
                        return (
                          (a.value?.toString() || a?.toString()) +
                          " !! " +
                          b.value
                        );
                      })
                    : exchangefld[i];
              }

              return [key];
            });
          }
          if (user.name?.givenName != null) {
            var names = user.name?.givenName.split(" "),
              initials = names[0].substring(0, 1).toUpperCase();
            if (names.length > 1) {
              initials += names[names.length - 1].substring(0, 1).toUpperCase();
            }
          }
          var _allex, _allexu;
          if (_excspecuser != null && _excspecuser != undefined) {
            _allexu =
              _excspecuser.filter(
                (x) =>
                  user?.name?.fullName?.toLowerCase().indexOf(x.toLowerCase()) >
                  -1
              ).length > 0;
          } else {
            _allexu = null;
          }
          _allex = _allexu;
          var _allexuHide =
            arrmanager.filter(
              (x) =>
                user.primaryEmail.toLowerCase().indexOf(x.toLowerCase()) > -1
            ).length > 0;
          return {
            ...arr123,
            firstName: user?.name?.givenName,
            lastName: user?.name?.familyName,
            name: user?.name?.fullName,
            email: user.primaryEmail,
            id: user.id,
            job: user.hasOwnProperty("organizations")
              ? user.organizations[0].hasOwnProperty("title")
                ? user.organizations[0].title
                : ""
              : "",
            initials: initials,
            department: user.hasOwnProperty("organizations")
              ? user.organizations[0].hasOwnProperty("department")
                ? user.organizations[0].department
                : ""
              : "",
            workphone: getUserOrgWPItem(user),
            mobile: _allex ? "" : getUserOrgMBItem(user),
            manager: _allexuHide ? "" : getUserOrgMGItem(user),
            employeeid: getUserOrgEIDItem(user),

            costcenter: user.hasOwnProperty("organizations")
              ? user.organizations[0].hasOwnProperty("costCenter")
                ? user.organizations[0].costCenter
                : ""
              : "",
            buildingid: user.hasOwnProperty("locations")
              ? user.locations[0].hasOwnProperty("buildingId")
                ? user.locations[0].buildingId
                : ""
              : "",
            floorname: user.hasOwnProperty("locations")
              ? user.locations[0].hasOwnProperty("floorName")
                ? user.locations[0].floorName
                : ""
              : "",
            floorsection: user.hasOwnProperty("locations")
              ? user.locations[0].hasOwnProperty("floorSection")
                ? user.locations[0].floorSection
                : ""
              : "",
            location: getUserOrgLOCItem(user),
            address: getUserOrgADDItem(user),
            image: user.hasOwnProperty("thumbnailPhotoUrl")
              ? user.thumbnailPhotoUrl
              : DefaultImage,
            mappedfields: mappedfields,
            managerprofilecard: man,
          };
        });
        console.log(staffMember);
     
        if (mode == "free search") {
          if (value == "") {
            setUserArray(staffMember);
          } else {
            let data = staffMember;
            let results = [];

            results = data?.filter((user) =>
              [
                "name",
                "workphone",
                "job",
                "location",
                "department",
                "email",
                "CF1",
              ].some(
                (key) =>
                  typeof user[key] === "string" &&
                  user[key].toLowerCase().includes(value.toLowerCase())
              )
            );

            setUserArray(results);
          }
        } else {
          setUserArray(staffMember);
        }
      



      }

      // setloader(false);
      setshowProgress(false);
    });
    let nongoogleUsers=JSON.parse(decryptData(parsedData.Users));
    console.log("isimported user",isImportedUser)
   if(isImportedUser){
    if(value==""){
    setNonM365(nongoogleUsers)
    }else{
     if (mode == "free search") {
       if (value == "") {
         setNonM365(nongoogleUsers);
       } else {
         let data = nongoogleUsers;
         let results = [];

         results = data?.filter((user) =>
           [
             "name",
             "workphone",
             "job",
             "location",
             "department",
             "email",
             "CF1",
           ].some((key) =>{
                 console.log("user[key].toLowerCase()",user,user[key].toLowerCase(),value,typeof user[key] === "string" && user[key].toLowerCase().includes(value.toLowerCase()))
               return typeof user[key] === "string" && user[key].toLowerCase().includes(value.toLowerCase())
           }
           )
         );

         setNonM365(results);
         console.log(results,NonM365,"res90")
       }
     } else if(mode=="departments"){
      // alert("dept")
       let result=nongoogleUsers.filter((item)=>{
        console.log("inner->" ,item?.department.toLowerCase(),value?.toLowerCase())
         return item?.department?.toLowerCase().includes(value?.toLowerCase());
       })
       console.log("mode=>",mode,result,nongoogleUsers,value?.toLowerCase())
       setNonM365(result);
     }else if(mode=="title"||mode=="titles"){
      // alert("titles")
       let res=nongoogleUsers.filter((item)=>{
         return item?.job?.toLowerCase()?.includes(value?.toLowerCase());
       })
       setNonM365(res);
     }else if(mode=="name"){
       console.log("mode=>",mode)
       let res=nongoogleUsers.filter((item)=>{
       console.log("ittem",item)
         return item?.name?.toLowerCase()?.includes(value?.toLowerCase());
       })
       console.log("mode=>",mode,res,nongoogleUsers,value?.toLowerCase())
       setNonM365(res);
     }
    
    }


   }
  };
  async function getUserInfo(userEmail) {
    let page = "";
    let staffList = [];
    page = await gapi.client.directory.users.get({
      userKey: userEmail,
      projection: "full",
      orderBy: "givenName",
    });
    staffList = staffList.concat(page.result);
    return staffList;
  }

  const filterByTaxonomySearchMultiGrp = (item) => {
    console.log("group options", item);
    if (item == null) {
      item = [];
    } else {
      item = [item];
    }
    // setloader(true);
    setshowProgress(true);
    if (item.length > 1) {
      // setselectedGrp(item?.slice(1));
    } else {
      setselectedGrp(item);
    }
    if (item?.length > 0) {
      //arrayofgroup=[];
      let arrayofgroup = [];
      var uniquegrp = item?.length > 1 ? item?.slice(1) : item;
      getAllUsersGrpMInOrg(uniquegrp[0]?.key).then((data1) => {
        console.log("data1", data1);

        var mappedfields =
          '[{"ExistingList":"About Me","ExternalList":"About_Me"},{"ExistingList":"School","ExternalList":"CF1"},{"ExistingList":"Date of Birth","ExternalList":"DOB"},{"ExistingList":"Date of Join","ExternalList":"DOJ"},{"ExistingList":"Skills","ExternalList":"Skills"},{"ExistingList":"Projects","ExternalList":"Projects"},{"ExistingList":"Hobbies","ExternalList":"Hobbies"}]';
        let grpcount = 0;
        data1.map((user) => {
          getUserInfo(user.email).then((getuser) => {
            if (getuser.length > 0) {
              grpcount++;
              var arr123 = {};
              var man = {};

              // getAllUserManInOrg(user.primaryEmail).then((data) => {
              //   console.log(data);

              // })
              if (getuser.hasOwnProperty("customSchemas")) {
                const cfield = getuser[0].customSchemas;

                Object.keys(cfield).map((key) => {
                  var exchangefld = cfield[key];

                  for (var i in exchangefld) {
                    arr123[i] =
                      exchangefld[i] instanceof Array
                        ? exchangefld[i].reduce((a, b) => {
                            return (
                              (a.value?.toString() || a?.toString()) +
                              " !! " +
                              b.value
                            );
                          })
                        : exchangefld[i];
                  }

                  return [key];
                });

                //console.log(arr123);
              }

              //console.log(getuser);
              if (getuser[0].name.givenName != null) {
                var names = getuser[0].name.givenName.split(" "),
                  initials = names[0].substring(0, 1).toUpperCase();
                if (names.length > 1) {
                  initials += names[names.length - 1]
                    .substring(0, 1)
                    .toUpperCase();
                }
              }

              arrayofgroup.push({
                firstName: getuser[0].name.givenName,
                lastName: getuser[0].name.familyName,
                initials: initials,
                name: getuser[0].name.fullName,
                email: getuser[0].primaryEmail,
                id: getuser[0].id,
                job: getuser[0].hasOwnProperty("organizations")
                  ? getuser[0].organizations[0].hasOwnProperty("title")
                    ? getuser[0].organizations[0].title
                    : ""
                  : "",
                //initials: initials,
                department: getuser[0].hasOwnProperty("organizations")
                  ? getuser[0].organizations[0].hasOwnProperty("department")
                    ? getuser[0].organizations[0].department
                    : ""
                  : "",
                image: getuser[0].hasOwnProperty("thumbnailPhotoUrl")
                  ? getuser[0].thumbnailPhotoUrl
                  : DefaultImage,
                workphone: getUserOrgWPItem(getuser[0]),
                mobile: getUserOrgMBItem(getuser[0]),
                manager: getUserOrgMGItem(getuser[0]),
                employeeid: getUserOrgEIDItem(getuser[0]),
                costcenter: getuser[0].hasOwnProperty("organizations")
                  ? getuser[0].organizations[0].hasOwnProperty("costCenter")
                    ? getuser[0].organizations[0].costCenter
                    : ""
                  : "",
                buildingid: getuser[0].hasOwnProperty("locations")
                  ? getuser[0].locations[0].hasOwnProperty("buildingId")
                    ? getuser[0].locations[0].buildingId
                    : ""
                  : "",
                floorname: getuser[0].hasOwnProperty("locations")
                  ? getuser[0].locations[0].hasOwnProperty("floorName")
                    ? getuser[0].locations[0].floorName
                    : ""
                  : "",
                floorsection: getuser[0].hasOwnProperty("locations")
                  ? getuser[0].locations[0].hasOwnProperty("floorSection")
                    ? getuser[0].locations[0].floorSection
                    : ""
                  : "",
                location: getUserOrgLOCItem(getuser[0]),
                address: getUserOrgADDItem(getuser[0]),
                mappedfields: mappedfields,
              });

              if (data1.length == grpcount) {
                changeUserArray(arrayofgroup);
                setUserArray(arrayofgroup);
                // setloader(false);
                setshowProgress(false);
              }
            }
          });
        });
      });
    } else {
      clearFilters();
    }
    /* */
  };
  // const filterByTaxonomySearchMultiGrp = (item) => {
  //   if (item.length > 1) {
  //     setselectedGrp(item.slice(1));
  //     console.log("if",item.slice(1))
  //   } else {
  //     setselectedGrp(item);
  //     console.log("else",item)
  //   }
  //   if (item.length > 0) {
  //     getAllUsersGrpMInOrg(item[0].key).then((data1) => {
  //       console.log(data1);
  //     });
  //   } else {
  //     clearFilters();
  //   }
  // };

  async function getAllUsersGrpMInOrg(userEmail) {
    let page = "";
    let pageToken = "";
    let staffList = [];
    do {
      page = await gapi.client.directory.members.list({
        groupKey: userEmail,
        maxResults: 100,
        pageToken: pageToken,
      });

      staffList = staffList.concat(page.result.members);

      pageToken = page.nextPageToken;
    } while (pageToken);

    return staffList;
  }
  function handleDownloadCSV() {
    let data = UserArray.map((item) => {
      Object.keys(item).map((val) => {
        return { [val]: item.val };
      });
      return {
        Name: item.name,
        DOB: item.DOB,
        DOJ: item.DOJ,
        About_Me: item.About_Me,
        email: item.email,
        job: item.job,
        department: item.department,
        workphone: item.workphone,
        address: item.address,
        manager: item.manager,
        cf1: item.CF1,
      };
    });
    downloadCSV(data);
    setDownloadCsvModal(false);
  }
  function showGroups() {
    let resultgrpCf1 = [];
    {
      _customgrps.map((item) => {
        resultgrpCf = _arraygrpcf1
          ? _arraygrpcf1.map((a) => ({
              key: a.email,
              label: a.name,
              value: a.name,
            }))
          : [];
        resultgrpCf = resultgrpCf.filter((items) => {
          return items.key != null;
        });

        resultgrpCf1 = [];
        const map = new Map();
        for (const item of resultgrpCf) {
          if (!map.has(item.key)) {
            map.set(item.key, true); // set any value to Map
            if (
              resultgrpCf1.filter(
                (x) =>
                  x.key.trim().toLowerCase() === item.key.trim().toLowerCase()
              ).length == 0
            ) {
              resultgrpCf1.push({
                key: item.key.trim(),
                label: item.label.trim(),
                value: item.value.trim(),
              });
            }
          }
        }

        resultgrpCf1.sort((a, b) => {
          var textA = a.value.toUpperCase();
          var textB = b.value.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
      });
    }
    setGroupsOptions(resultgrpCf1);
  }

  const filterOptions = (options, filter) => {
    if (!filter) {
      return options;
    }
    const re = new RegExp(filter, "i");
    return options.filter(
      ({ value }) =>
        value.toLowerCase() &&
        value.toLowerCase().indexOf(filter.toLowerCase()) > -1
    );
  };

  const { toPDF, targetRef } = usePDF({ filename: "GoolgeED.pdf" });

  const generatePDF = () => {
    const input = document.getElementById("pdf-container");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("GoogleED");
    });
  };

  // ------------------FUNCTIONS END----------------

  // ------------------Props for Pages Component----------------
  const homePagePops = {
    showProgress,
    UserArray,
    NonM365,
    isTile,
    isImportedUser,
    isGrid,
    isList,
    _gridWidth,
    parsedData,
    blobCall,
    allUsers,
    setUserArray,
  };

  const CommandBarProps = {
    setBirthAndAnivModalOpen,
    filterByLetter,
    setSettings,
    setshowDashboard,
    isUserAdmin: isCurrentUserAdmin,
    setShowOrgChart,
    setShowHomePage,
    parsedData,
    UserArray,
    setDownloadCsvModal,
    toPDF,
    generatePDF,
    showHomePage,
  };

  const settingsPageProps = {
    filterByLetter,
    changeVariable,
    changeGridWidth,
    setShowOrgChart,
    setShowHomePage,
    UserArray,
  };

  const orgChartPageProps = {
    setShowOrgChart,
    setShowHomePage,
    filterByLetter,
  };

  const SearchFiltersProps = {
    parsedData,
    optimization,
    groupsOptions,
    selectedGrp,
    filterByTaxonomySearchMultiGrp,
    setView,
    view,
    setisGrid,
    setisTile,
    setisList,
    setImpotedUser,
    UserArray,
  };

  // -----------------Props for Pages Component end---------------

  if (!isUserSignedIn && showLoginScreen) {
    return <SignInPage signInWithPopup={signInWithPopup} />;
  }

  return (
    <LanguageProvider>
      <Container>
        {isUserSignedIn && (
          <div className="edp" id="mainDiv">
            <div className="container">
              <div className="row" style={{ position: "relative" }}>
                <div className="filterDiv">
                  {parsedData && appSettings.TopBarFilterView !== "Hide" && (
                    <TopBarFilter optimization={optimization} />
                  )}
                  <CommandBar {...CommandBarProps} />
                </div>
                {/* -------------------PAGES CONTAINER START------------------- */}
                <div>
                  {isDownloadCsvModal && (
                    <ExportToCsv
                      handleDownloadCSV={handleDownloadCSV}
                      setDownloadCsvModal={setDownloadCsvModal}
                      UserArray={UserArray}
                    />
                  )}

                  <BirthdayAndAnniversary
                    isBirthAndAnivModalOpen={isBirthAndAnivModalOpen}
                    setBirthAndAnivModalOpen={setBirthAndAnivModalOpen}
                    Users={UserArray}
                  />

                  {showDashboard && (
                    <Dashboard
                      users={UserArray}
                      // settingData={parsedData}
                      settingData={appSettings}
                      setShowHomePage={setShowHomePage}
                      setSettings={setSettings}
                      setshowDashboard={setshowDashboard}
                      setShowOrgChart={setShowOrgChart}
                    />
                  )}

                  {Setting && (
                    <SettingsPage {...settingsPageProps} />
                  )}

                  {showHomePage && (
                    <div>
                      <SearchFilters {...SearchFiltersProps} />
                      <div ref={targetRef} id="pdf-container">
                        <Home {...homePagePops} />
                      </div>
                    </div>
                  )}

                  {showOrgChart && <OrgChartPage {...orgChartPageProps} />}
                </div>
                <div style={{ width: "100%", float: "right" }}></div>
                {/* -------------------PAGES CONTAINER END------------------- */}
              </div>
            </div>
          </div>
        )}
      </Container>
    </LanguageProvider>
  );
};

const TopBarFilter = ({ optimization }) => {
  const { departmentFields } = useFields();
  const [selectedTab, setSelectedTab] = useState("");

  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
      {departmentFields.map((x) => (
        <div
          key={x.value}
          style={{
            padding: "0px 10px 3px",
            backgroundColor: "rgb(0, 112, 220, .4)",
            fontSize: "14px",
            cursor: "pointer",
            color: "rgb(0, 112, 220)",
            height: "15px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            userSelect: "none",
            boxSizing: "border-box",
            height: "35px",
          }}
          className={`${styles.topbarfilter} topbarFilter ${
            selectedTab === x.value ? "topbarfilterBorderBottom" : ""
          } `}
          onClick={() => {
            setSelectedTab(x.value);
            optimization(x.value, "departments");
          }}
        >
          {x.label}
        </div>
      ))}
    </div>
  );
};

const SignInPage = ({ signInWithPopup }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          padding: "30px 40px",
          display: "flex",
          flexDirection: "column",
          gap: "15px 0px",
          backgroundColor: "#f5f5f5",
          boxShadow: "1px 1px 10px #ddd",
          border: "1px solid #d3d1ce",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={DirectoryImage} alt="directory logo" />
        </div>

        <div
          style={{
            textAlign: "center",
          }}
        >
          <h3>Welcome to Employee Directory</h3>
          <p>Employee Directory - Smart way to connect with your employees.</p>
        </div>

        <div
          style={{
            width: "100%",
            height: "50px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minWidth: "500px",
              height: "40px",
              gap: "10px",
              cursor: "pointer",
              background: "#fff",
              border: "1px solid #d3d1ce",
            }}
            onClick={signInWithPopup}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              loading="lazy"
              alt="google logo"
              style={{
                height: "1.5rem",
                width: "1.5rem",
              }}
            />
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleEmployeeDirectory;
