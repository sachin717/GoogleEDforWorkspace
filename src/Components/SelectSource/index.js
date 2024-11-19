import { useEffect, useState } from "react";
import styled from "styled-components";
import CommandBar from "./CommandBar";
import { gapi } from "gapi-script";
import DefaultImage from "../assets/images/DefaultImg1.png";
import DirectoryImage from "../assets/images/directory-logo.png";
import { style } from "./styles";
import useStore, { useSttings } from "./store";
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
  getRestrictedAccess,
  getCurrentUser,
  applyRestrictions,
  isUserAdminCheck,
  encryptData,
} from "../Helpers/HelperFunctions";

import { usePDF } from "react-to-pdf";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SearchFilters from "../SearchFilters/SearchFilters";
import { LanguageProvider, useLanguage } from "../../Language/LanguageContext";
import ExportToCsv from "../Pages/ExportToCsv";
import BirthdayAndAnniversary from "../BithdayAndAnniversary";
import Dashboard from "../Dashboard";
import { useFields, useLists } from "../../context/store";
import {
  getSettingJson,
  IMAGES_LIST,
  SETTING_LIST,
  updateSettingJson,
  USER_LIST,
} from "../../api/storage";
import {
  defaultImagesList,
  defaultSettingList,
  defaultUserList,
} from "../../api/defaultSettings";
import { ContextProvider } from "../../context/Context";
import HelpPanel from "../HelpPage";
import HelpPage from "../HelpPage";

const Container = styled.div`
  ${style}
`;

let _customgrps = ["Groups"];
let resultgrpCf = [];
var _arraygrpcf1 = [];

// var CLIENT_ID =
//   "1029246985871-0t5lk1e8s1utemuuo57j3ic728mp1f1t.apps.googleusercontent.com";
// var API_KEY = "AIzaSyAoolZJ_iRVEAVKwZ9UBGbtvfI1g7bRMkU";
// var CLIENT_ID ="518694750619-m46aka6i89vr6r4ce5j2d8bvtruvi14b.apps.googleusercontent.com";
// var API_KEY = "AIzaSyBQmj8pP9gc3wSNY23lkQuFjD7oFaNgDRg";

const CLIENT_ID = '1029246985871-0t5lk1e8s1utemuuo57j3ic728mp1f1t.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAoolZJ_iRVEAVKwZ9UBGbtvfI1g7bRMkU';

const DISCOVERY_DOCS = [
  "https://admin.googleapis.com/$discovery/rest?version=directory_v1",
];
const scopes =
  "https://www.googleapis.com/auth/admin.directory.group.readonly https://www.googleapis.com/auth/admin.directory.user https://www.googleapis.com/auth/admin.directory.group.member.readonly https://www.googleapis.com/auth/admin.directory.user.readonly https://www.googleapis.com/auth/admin.directory.user.security https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/devstorage.full_control https://www.googleapis.com/auth/devstorage.read_write https://www.googleapis.com/auth/gmail.send";

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
let selectedView = "";
let NonMUsers = [];

const GoogleEmployeeDirectory = () => {
  // ---------------STATES----------------
  const [isBirthAndAnivModalOpen, setBirthAndAnivModalOpen] = useState(false);
  const [NonM365, setNonM365] = useState([]);
  const [pToken, setPToken] = useState("");
  const [settingData, setSettingData] = useState({});
  const [isClickClearFilter, setClickClearFilter] = useState(false);
  const [isGrid, setisGrid] = useState(false);
  const [isTile, setisTile] = useState(false);
  const [isImportedUser, setImpotedUser] = useState(false);
  const [selectedGrp, setselectedGrp] = useState([]);
  const [isList, setisList] = useState(false);
  const [showHelpPage, setShowHelpPage] = useState(false);
  const [recordsToload, setRecordsToload] = useState(25);
  const [UserArray, setUserArray] = useState([]);
  const [currentUserAdmin, setCurrentUserAdmin] = useState(false);
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
    changeVariable,
    changeUserData,
    changeUserArray,
    changeCheckboxesCheckedListView,
    checkboxesCheckedListView,
    changeGridWidth,
    checkboxesChecked,
    changeCheckboxesChecked,
    changeUserGridView,
    userGridView,
    changeExcludeByDepartment,
    view,
    setView,
  } = useStore();
  const {
    setDepartments,
    setLocations,
    setJobTitles,
    setDepDropDown,
    setJobDropDown,
    setExcludeOptionsForDomain,
    setEmails,
    setCommandBarItems,
    setShowHideSettings,
  } = useFields();
  const { appSettings, setAppSettings } = useSttings();
  const { usersList, setUsersList, setImagesList, setSettingList } = useLists();

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
      } else {
        setView(appSettings.DefaultView);
        selectedView = appSettings?.DefaultView;
        // console.log("Not in mobile view. Function not called.");
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
      setImpotedUser(false);
    } else if (view == "List") {
      setisGrid(false);
      setisList(true);
      setisTile(false);
      setImpotedUser(false);
    } else if (view == "Tile") {
      setisGrid(false);
      setisList(false);
      setisTile(true);
      setImpotedUser(false);
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
        setShowLoginScreen(false);
        setIsUserSignedIn(true);
        blobCall();
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
        .then(async() => {
          await gapi.client.load("admin", "directory_v1");
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
  async function getAllUsersInOrg() {
    let pageToken = "";
    let staffList = [];
  
    do {
      const page = await gapi.client.directory.users.list({
        customer: "my_customer",
        projection: "full",
        orderBy: sortby,
        query:
          allletter === "ALL"
            ? `${sortby}:*`
            : `${sortby}:"${allletter}*"`,
        maxResults: 499,
        pageToken: pageToken,
      });
  
      // Append the fetched users to staffList
      if (page.result.users) {
        staffList = [...staffList, ...page.result.users]; // Accumulate users
      }
  
      // Update the pageToken for the next iteration
      pageToken = page.result.nextPageToken;
    } while (pageToken); // Continue until there are no more pages
  
    console.log("getAllUsersInOrg users", staffList);
  
    // Assuming ExcludeUsers is a defined function that filters the users
    let res = ExcludeUsers(staffList, parsedData);
    return res; // Return the filtered list
  }
  
  // async function getAllUsersInOrg() {
  //   let page = "";
  //   let pageToken = "";
  //   let staffList = [];
  //   do {
  //     page = await gapi.client.directory.users.list({
  //       customer: "my_customer",
  //       projection: "full",
  //       orderBy: sortby,
  //       query:
  //         allletter == "ALL"
  //           ? "" + sortby + ":*"
  //           : "" + sortby + ':"' + allletter + '"*',
  //       maxResults: 1,
  //       pageToken: pageToken,
  //     });

  //     staffList = page?.result?.users;

  //     pageToken = page?.result?.nextPageToken;
  //     console.log(page.result.nextPageToken,"ptoken")
      
  //   } while (pageToken);

  //   console.log("getAllUsersInOrg users", staffList);

  //   let res = ExcludeUsers(staffList, parsedData);
  //   return res;
  // }
  function executeOncePerDay(callback) {
    const today = new Date().toDateString();

    const lastExecutionDate = localStorage.getItem("lastExecutionDate");

    if (lastExecutionDate !== today) {
      callback();

      localStorage.setItem("lastExecutionDate", today);
    }
  }

  async function blobCall() {
    // updateSettingJson(SETTING_LIST, {});
    // updateSettingJson(IMAGES_LIST, {});
    // updateSettingJson(USER_LIST, {});
    // return;
    setshowProgress(true);
    const settingJson = await getSettingJson(SETTING_LIST);
    const imagesJson = await getSettingJson(IMAGES_LIST);
    const usersJson = await getSettingJson(USER_LIST);

    console.log("usersJson.........", usersJson);

    if (Object.keys(imagesJson).length) {
      setImagesList(imagesJson);
    } else {
      updateSettingJson(IMAGES_LIST, defaultImagesList);
      setImagesList(defaultImagesList);
    }

    if (Object?.keys(usersJson)?.length) {
      setUsersList(usersJson);
    } else {
      updateSettingJson(
        USER_LIST,
        encryptData(JSON.stringify(defaultUserList))
      );
      setUsersList(defaultUserList);
    }

    if (Object.keys(settingJson).length) {
      setAppSettings(settingJson);
      setSettingList(settingJson);
      setShowHideSettings({GroupsOn:settingJson?.GroupsOn??false})
    } else {
      updateSettingJson(SETTING_LIST, defaultSettingList);
      setAppSettings(defaultSettingList);
    }

    if (Object.keys(settingJson)?.length) {
      parsedData = settingJson;
      setSettingData(settingJson);
      let data = {
        ShowOrgChart: parsedData?.ShowOrgChart,
        IsExportToCsv: parsedData?.IsExportToCsv,
        showBirthAniv: parsedData?.showBirthAniv,
        showDashboard: parsedData?.showDashboard,
        AllowUserToPrintPDF: parsedData?.AllowUserToPrintPDF,
      };
      setCommandBarItems(data);
      setAdditionalManagers(settingJson?.AdditionalManagerData);
      setAssistant(settingJson.AssistantData);

      const admins = settingJson?.RolesAndPermisstions?.map((x) => x?.email);
      setAdmins(admins ?? []);

      const hideManagerEmail = settingJson?.UsersWithHiddenManager?.map(
        (x) => x.email
      );
      const hidePhoneEmail = settingJson?.UserWithHiddenMobileNumber?.map(
        (x) => x?.email
      );

      setUsersWithHiddenManager(hideManagerEmail);
      setUsersWithHiddenPhoneNo(hidePhoneEmail);

      setRecordsToload(parsedData?.records_to_load);
      if (parsedData?.Favicon) {
        changeFavicon(imagesJson?.FavIconUrl);
      } else {
        removeFavicon();
      }

      if (parsedData.ListViewPrope) {
        const updatedCheckboxes = { ...checkboxesCheckedListView };
        for (const key in parsedData.ListViewPrope) {
          if (key in updatedCheckboxes) {
            updatedCheckboxes[key] = parsedData?.ListViewPrope[key];
          }
        }
        changeCheckboxesCheckedListView(updatedCheckboxes);
      } else {
        changeCheckboxesCheckedListView(checkboxesCheckedListView);
      }
      if (parsedData.ProfileViewPrope) {
        const updatedCheckboxesProfile = { ...checkboxesChecked };
        for (const key in parsedData?.ProfileViewPrope) {
          if (key in updatedCheckboxesProfile) {
            updatedCheckboxesProfile[key] = parsedData.ProfileViewPrope[key];
          }
        }
        changeCheckboxesChecked(updatedCheckboxesProfile);
      } else {
        changeCheckboxesChecked(checkboxesCheckedListView);
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
              checkbox: updatedPerson?.checkbox,
            };
          }
          return person;
        });

        changeUserGridView(updatedPeople);
      } else {
        changeUserGridView(userGridView);
      }

      _gridWidth = parsedData?.gridWidth;

      if (parsedData?.ExcludeByDepartment) {
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
      let availableViews = filterTrueValues(parsedData?.hideShowViews ?? {});
      let selectingVisibleView = getFirstAvailableView(availableViews);
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
    }
    _grpsOn = parsedData.GroupsOn;
    if (_grpsOn) {
      getAllUsersGrpInOrg().then((groups) => {
        groups?.map((group) => {
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
      const primaryOrg = user?.phones?.filter((x) => x.type === "work")[0].value;

      return primaryOrg;
    } else {
      return "";
    }
  }

  function getUserOrgMBItem(user) {
    if (user.hasOwnProperty("phones")) {
      const obj = user?.phones?.find((x) => x.type === "mobile");
      if (obj === undefined) {
        return "";
      } else {
        return obj.value;
      }
    } else {
      return "";
    }
  }

  function getUserOrgMGItem(user) {
    if (user.hasOwnProperty("relations")) {
      const primaryOrg = user?.relations?.filter((x) => x.type === "manager")[0]
        .value;

      return primaryOrg;
    } else {
      return "";
    }
  }

  function getUserOrgEIDItem(user) {
    if (user.hasOwnProperty("externalIds")) {
      if (user?.externalIds?.length < 1) {
        return "";
      }
      const primaryOrg = user?.externalIds?.filter(
        (x) => x.type === "organization"
      )[0].value;

      return primaryOrg;
    } else {
      return "";
    }
  }

  function getUserOrgADDItem(user) {
    if (user.hasOwnProperty("addresses")) {
      if (user?.addresses?.length < 1) {
        return "";
      }
      const primaryOrg = user?.addresses?.filter((x) => x.type === "work")[0]
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
      var floorname = user?.locations[0]?.hasOwnProperty("floorName")
        ? user?.locations[0]?.floorName
        : "";
      var floorsection = user?.locations[0]?.hasOwnProperty("floorSection")
        ? user?.locations[0]?.floorSection
        : "";
      return bid + " " + floorname + " " + floorsection;
    } else {
      return "";
    }
  }

  const listFiles = async () => {
    let additionManagerData = [];
    let allData = [];
    let AssistantData = [];
    const usersJson = await getSettingJson(USER_LIST);
    setUsersList(usersJson);
    let customFunctionUser = [];

    getAllUsersInOrg().then((data) => {
      setUnFormatedUserData(data);
      changeUserData(data);
      
      if (data === undefined) {
        setUserArray([]);
      } else {
        let staffMember = data?.map((user) => {
          // console.log("custom fileds->",user.customSchemas)
          var arr123 = {};
          var man = {};
          if (user.hasOwnProperty("customSchemas")) {
            const cfield = user?.customSchemas;

            Object.keys(cfield)?.map((key) => {
              var exchangefld = cfield[key];

              for (var i in exchangefld) {
                arr123[i] =
                  exchangefld[i] instanceof Array
                    ? exchangefld[i].reduce((a, b) => {
                        return (
                          (a?.value?.toString() || a?.toString()) +
                          " !! " +
                          b?.value
                        );
                      })
                    : exchangefld[i];
              }

              return [key];
            });
          }

          if (user?.name?.givenName != null) {
            var names = user?.name?.givenName.split(" "),
              initials = names[0]?.substring(0, 1)?.toUpperCase();
            if (names.length > 1) {
              initials += names[names.length - 1]?.substring(0, 1)?.toUpperCase();
            }
          }

          var _allex, _allexu;
          if (_excspecuser != null && _excspecuser != undefined) {
            _allexu =
              _excspecuser.filter(
                (x) =>
                  user?.name?.fullName?.toLowerCase()?.indexOf(x.toLowerCase()) >
                  -1
              )?.length > 0;
          } else {
            _allexu = null;
          }
          _allex = _allexu;
          var _allexuHide =
            arrmanager?.filter(
              (x) =>
                user?.primaryEmail?.toLowerCase()?.indexOf(x?.toLowerCase()) > -1
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
            id: user?.id,
            job: user.hasOwnProperty("organizations")
              ? user?.organizations[0].hasOwnProperty("title")
                ? user?.organizations[0].title
                : ""
              : "",
            initials: initials,
            department: user?.hasOwnProperty("organizations")
              ? user?.organizations[0]?.hasOwnProperty("department")
                ? user?.organizations[0]?.department
                : ""
              : "",

            workphone: getUserOrgWPItem(user),
            mobile: _allex ? "" : getUserOrgMBItem(user),
            manager: _allexuHide ? "" : getUserOrgMGItem(user),
            employeeid: getUserOrgEIDItem(user),
            costcenter: user.hasOwnProperty("organizations")
              ? user.organizations[0].hasOwnProperty("costCenter")
                ? user?.organizations[0]?.costCenter
                : ""
              : "",
            buildingid: user.hasOwnProperty("locations")
              ? user.locations[0].hasOwnProperty("buildingId")
                ? user?.locations[0]?.buildingId
                : ""
              : "",
            floorname: user.hasOwnProperty("locations")
              ? user?.locations[0].hasOwnProperty("floorName")
                ? user?.locations[0]?.floorName
                : ""
              : "",
            floorsection: user.hasOwnProperty("locations")
              ? user?.locations[0].hasOwnProperty("floorSection")
                ? user?.locations[0]?.floorSection
                : ""
              : "",
            location: getUserOrgLOCItem(user),
            address: getUserOrgADDItem(user),
            image: user.hasOwnProperty("thumbnailPhotoUrl")
              ? user?.thumbnailPhotoUrl
              : DefaultImage,
            AdditionalManager: additionManagerData,
            AssistantData: AssistantData,
            isAdmin: user?.isAdmin,
          };
          additionManagerData = [];
          AssistantData = [];

          return xx;
        });
        let currentUser = getCurrentUser()?.cu;
        let admin = isUserAdminCheck(staffMember, currentUser);
        console.log("staffMember =>", staffMember);
        setCurrentUserAdmin(admin);
        setAppSettings({ ...parsedData, isCurrentUserAdmin: admin });

        changeUserArray(staffMember);
        setAllUsers(staffMember);

        const domainOptions = staffMember?.map((user) => ({
          value: user?.email.split("@")[1],
          label: user?.email.split("@")[1],
        }));

        const userEmails = staffMember?.map((user) => ({
          key: user?.email,
          text: user?.email,
        }));

        const userDeps = staffMember?.map((x) => ({
          value: x?.department,
          label: x?.department,
        }));
        let settingListDeps = parsedData?.FilterAttribute?.departments
          ?.filter((x) => {
            if (x?.Active) {
              return x;
            }
          })
          .map((x) => ({ label: x?.Department, value: x?.Department }));

        const userJobTitles = staffMember?.map((x) => ({
          value: x.job,
          label: x.job,
        }));
        const settingListJobs = parsedData?.FilterAttribute?.jobTitles
          ?.filter((x) => x.Active == true)?.map((x) => ({ value: x.JobTitle, label: x.JobTitle }));

        const SLJ = settingListJobs ?? [];
        const SLD = settingListDeps ?? [];

        const uniqueJobs = removeDuplicatesFromObject(
          [...userJobTitles, ...SLJ],
          "value"
        );
        const uniqueDep = removeDuplicatesFromObject(
          [...userDeps, ...SLD],
          "value"
        );

        setJobDropDown(uniqueJobs);
        if (view == "NonM365") {
        } else {
          setDepDropDown(uniqueDep);
        }

        const filterAttribute = parsedData?.FilterAttribute;
        const allFADepartments = filterAttribute?.departments;
        const allFAJobTitles = filterAttribute?.jobTitles;
        const allFALocations = filterAttribute?.locations;

        setDepartments(allFADepartments);
        setJobTitles(allFAJobTitles);
        setLocations(allFALocations);
        setEmails(userEmails);

        setExcludeOptionsForDomain(
          removeDuplicatesFromObject(domainOptions, "value")
        );
        if (
          usersJson?.Users &&
          parsedData?.SyncUserInfoFrom == "Google & Imported User"
        ) {
          customFunctionUser = customFunctionFilter(staffMember, parsedData);
          let usersData = ExcludeExternalUsers(customFunctionUser, parsedData);
          allData = [...usersData];
          //     setUserArray(usersData);
          setUserArray(usersData);
          let decryptedData = usersJson?.Users;
          NonMUsers = [...decryptedData];
          setNonM365(decryptedData);

          executeOncePerDay(() => {
            // updateSettingJson(USER_LIST,{
            //   ...usersList,
            //   AllUsersData: {
            //     GoogleUsers: usersData,
            //     NonGoogleUser: JSON.parse(decryptedData),
            //   },
            // });
            // setUsersList({
            //   ...usersList,
            //   AllUsersData: {
            //     GoogleUsers: usersData,
            //     NonGoogleUser: JSON.parse(decryptedData),
            //   },
            // });
            let dataForCharts = usersJson?.AllUsersData?.GoogleUsers?.length
              ? usersJson?.AllUsersData?.GoogleUsers
              : usersData;
            // this code is for when we update some fileds from dashboard settings of any user, so spreading that dashboard fields into data
            let GoogleUsers = dataForCharts.map((item) => {
              return usersData?.map((user) => {
                if (user?.email == item?.email) {
                  return {
                    ...user,
                    ...item,
                  };
                }
              });
            });
            GoogleUsers = GoogleUsers?.flat()?.filter((item) => {
              return item != null;
            });

            let data = {
              GoogleUsers: GoogleUsers ?? [],
              NonGoogleUser: decryptedData ?? [],
            };
            updateSettingJson(
              USER_LIST,
              encryptData(JSON.stringify({ ...usersJson, AllUsersData: data }))
            );
            setUsersList({ ...usersJson, AllUsersData: data });
          });

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
          usersJson?.Users &&
          parsedData?.SyncUserInfoFrom?.toLowerCase() == "importeduser"
        ) {
          // setImpotedUser(true);
          let decryptedData = usersJson?.Users;
          setImpotedUser(true);
          customFunctionUser = customFunctionFilter(decryptedData, parsedData);

          decryptedData = customFunctionUser;

          if (Array.isArray(customFunctionUser)) {
            let usersData = [...customFunctionUser];
            usersData = ExcludeExternalUsers(usersData, parsedData);
            setUserArray(usersData);
            allData = [...usersData];
            executeOncePerDay(() => {
              let data = {
                ...usersJson,
                AllUsersData: {
                  GoogleUsers: staffMember ?? [],
                  NonGoogleUser: decryptedData ?? [],
                },
              };

              updateSettingJson(
                USER_LIST,
                encryptData(
                  JSON.stringify({
                    ...usersJson,
                    AllUsersData: {
                      GoogleUsers: staffMember ?? [],
                      NonGoogleUser: decryptedData ?? [],
                    },
                  })
                )
              );
              setUsersList(data);
            });
          }
        } else {
          setUserArray(staffMember);
          allData = [...staffMember];
          let data = {
            ...usersJson,
            AllUsersData: {
              GoogleUsers: staffMember,
              NonGoogleUser: usersJson?.NonGoogleUser || [],
            },
          };

          // let data = { ...usersList, GoogleUsers: staffMember };
          updateSettingJson(
            USER_LIST,
            encryptData(
              JSON.stringify({
                ...usersJson,
                AllUsersData: {
                  GoogleUsers: staffMember,
                  NonGoogleUser: usersJson?.NonGoogleUser || [],
                },
              })
            )
          );
          setUsersList(data);
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

        // setUserArray(customFunctionUser);
      }
      if (parsedData?.RestrictedAccess?.length) {
        const cu = getCurrentUser().cu;
        const user = allData?.filter((x) => x.email === cu);

        const currentUserData = {
          department: user.department ?? "",
          location: user.localStorage ?? "",
          job: user?.job ?? "",
          email: user?.email ?? "",
        };
        const restrictedData = getRestrictedAccess(
          parsedData?.RestrictedAccess || [],
          currentUserData
        );

        const restrictedPropUsers = applyRestrictions(
          customFunctionUser,
          restrictedData
        );

        setUserArray(restrictedPropUsers);
      }
      // setUserArray(customFunctionUser);

      if (parsedData?.GroupsOn) {
        showGroups();
      }
      // setloader(false);
      setshowProgress(false);
    });
  };

  const {
    setAdditionalManagers,
    setAssistant,
    setUnFormatedUserData,
    setFormatedUserData,
    setAllUsers,
    setRestrictedFields,
    setUsersWithHiddenManager,
    setUsersWithHiddenPhoneNo,
    setAdmins,
  } = useFields();

  const clearFilters = () => {
    listFiles();
  };

  const optimization = async (value, mode) => {
    if (parsedData?.SyncUserInfoFrom?.toLowerCase() == "importeduser") {
      setshowProgress(true);
      let d = await getSettingJson(USER_LIST);
      let nongoogleUsers = d?.Users;

      if (value == "") {
        setUserArray(nongoogleUsers);
      } else {
        if (mode == "free search") {
          if (value == "") {
            setUserArray(nongoogleUsers);
          } else {
            let data = nongoogleUsers;
            let results = [];

            results = data?.filter((user) =>
              [
                "name",
                "firstName",
                "lastName",
                "workphone",
                "job",
                "location",
                "department",
                "email",
                "CF1",
              ].some((key) => {
                let res =
                  typeof user[key] === "string" &&
                  user[key]?.toLowerCase()?.includes(value?.toLowerCase());
                return res;
              })
            );

            setUserArray(results);
          }
        } else if (mode == "departments") {
          // alert("dept")
          let result = nongoogleUsers?.filter((item) => {
            return item?.department
              ?.toLowerCase()
              .includes(value?.toLowerCase());
          });

          setUserArray(result);
        } else if (mode == "title" || mode == "titles") {
          // alert("titles")
          let res = nongoogleUsers?.filter((item) => {
            return item?.job?.toLowerCase()?.includes(value?.toLowerCase());
          });
          setUserArray(res);
        } else if (mode == "name") {
          let res = nongoogleUsers?.filter((item) => {
            console.log("ittem", item);
            return item?.name?.toLowerCase()?.includes(value?.toLowerCase());
          });

          setUserArray(res);
        }
      }

      setshowProgress(false);
    } else if (
      parsedData?.SyncUserInfoFrom == "Google & Imported User" &&
      isImportedUser
    ) {
      setshowProgress(true);
      let d = await getSettingJson(USER_LIST);
      let nongoogleUsers = d?.Users;

      if (value == "") {
        setNonM365(nongoogleUsers);
      } else {
        if (mode == "free search") {
          if (value == "") {
            setNonM365(nongoogleUsers);
          } else {
            let data = nongoogleUsers;
            let results = [];

            results = data?.filter((user) =>
              [
                "name",
                "firstName",
                "lastName",
                "workphone",
                "job",
                "location",
                "department",
                "email",
                "CF1",
              ]?.some((key) => {
                let res =
                  typeof user[key] === "string" &&
                  user[key]?.toLowerCase()?.includes(value?.toLowerCase());
                return res;
              })
            );

            setNonM365(results);
          }
        } else if (mode == "departments") {
          // alert("dept")
          let result = nongoogleUsers?.filter((item) => {
            return item?.department
              ?.toLowerCase()
              .includes(value?.toLowerCase());
          });

          setNonM365(result);
        } else if (mode == "title" || mode == "titles") {
          // alert("titles")
          let res = nongoogleUsers.filter((item) => {
            return item?.job?.toLowerCase()?.includes(value?.toLowerCase());
          });
          setNonM365(res);
        } else if (mode == "name") {
          let res = nongoogleUsers.filter((item) => {
            return item?.name?.toLowerCase()?.includes(value?.toLowerCase());
          });

          setNonM365(res);
        }
      }

      setshowProgress(false);
    } else {
      setshowProgress(true);
      gapi.client.load("admin", "directory_v1", () => {});

      getAllUsersInOrg1(value, mode).then((data) => {
        if (typeof data[0] === "undefined") {
          setUserArray([]);
        } else {
          let staffMember = data?.map((user) => {
            var arr123 = {};
            var man = {};
            var mgremail = getUserOrgMGItem(user);
            var dataofmang = data?.filter(
              (person) => person.primaryEmail == mgremail
            );
            if (dataofmang.length > 0) {
              man = {
                firstName: dataofmang[0].name?.givenName,
                lastName: dataofmang[0].name?.familyName,
                name: dataofmang[0].name?.fullName,
                email: dataofmang[0].primaryEmail,
                id: dataofmang[0]?.id,
                job: dataofmang[0]?.hasOwnProperty("organizations")
                  ? dataofmang[0]?.organizations[0]?.hasOwnProperty("title")
                    ? dataofmang[0]?.organizations[0]?.title
                    : ""
                  : "",
                //initials: initials,
                department: dataofmang[0].hasOwnProperty("organizations")
                  ? dataofmang[0]?.organizations[0].hasOwnProperty("department")
                    ? dataofmang[0]?.organizations[0]?.department
                    : ""
                  : "",
                image: dataofmang[0].hasOwnProperty("thumbnailPhotoUrl")
                  ? dataofmang[0]?.thumbnailPhotoUrl
                  : DefaultImage,
              };
            }
            if (user.hasOwnProperty("customSchemas")) {
              const cfield = user?.customSchemas;

              Object.keys(cfield)?.map((key) => {
                var exchangefld = cfield[key];

                for (var i in exchangefld) {
                  arr123[i] =
                    exchangefld[i] instanceof Array
                      ? exchangefld[i]?.reduce((a, b) => {
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
              var names = user?.name?.givenName.split(" "),
                initials = names[0]?.substring(0, 1)?.toUpperCase();
              if (names.length > 1) {
                initials += names[names.length - 1]
                  ?.substring(0, 1)
                  ?.toUpperCase();
              }
            }
            var _allex, _allexu;
            if (_excspecuser != null && _excspecuser != undefined) {
              _allexu =
                _excspecuser.filter(
                  (x) =>
                    user?.name?.fullName
                      ?.toLowerCase()
                      .indexOf(x.toLowerCase()) > -1
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
              email: user?.primaryEmail,
              id: user?.id,
              job: user.hasOwnProperty("organizations")
                ? user.organizations[0].hasOwnProperty("title")
                  ? user.organizations[0]?.title
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
              managerprofilecard: man,
            };
          });

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
                  ? getuser[0]?.organizations[0].hasOwnProperty("costCenter")
                    ? getuser[0]?.organizations[0]?.costCenter
                    : ""
                  : "",
                buildingid: getuser[0].hasOwnProperty("locations")
                  ? getuser[0]?.locations[0].hasOwnProperty("buildingId")
                    ? getuser[0]?.locations[0]?.buildingId
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
        Name: item?.name||"",
        DOB: item?.DOB||"",
        DOJ: item?.DOJ||"",
        About_Me: item?.About_Me||"",
        email: item?.email||"",
        job: item?.job||"",
        department: item?.department||"",
        workphone: item?.workphone||"",
        address: item?.address||"",
        manager: item?.manager||"",
        cf1: item?.CF1||"",
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
              key: a?.email,
              label: a?.name,
              value: a?.name,
            }))
          : [];
        resultgrpCf = resultgrpCf.filter((items) => {
          return items?.key != null;
        });

        resultgrpCf1 = [];
        const map = new Map();
        for (const item of resultgrpCf) {
          if (!map.has(item.key)) {
            map.set(item.key, true); // set any value to Map
            if (
              resultgrpCf1.filter(
                (x) =>
                  x.key?.trim()?.toLowerCase() === item?.key?.trim().toLowerCase()
              ).length == 0
            ) {
              resultgrpCf1.push({
                key: item?.key?.trim(),
                label: item?.label?.trim(),
                value: item?.value?.trim(),
              });
            }
          }
        }

        resultgrpCf1.sort((a, b) => {
          var textA = a?.value?.toUpperCase();
          var textB = b?.value?.toUpperCase();
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
        value?.toLowerCase() &&
        value?.toLowerCase()?.indexOf(filter.toLowerCase()) > -1
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
    listFiles,
    parsedData,
    allUsers,
    setUserArray,
  };

  const CommandBarProps = {
    setBirthAndAnivModalOpen,
    filterByLetter,
    setSettings,
    setShowHelpPage,
    appSettings: parsedData,

    setshowDashboard,
    isUserAdmin: currentUserAdmin,
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
    setSettings,
    setShowHomePage,
    setShowOrgChart,
    setshowDashboard,
  };

  const SearchFiltersProps = {
    settingData,
    optimization,
    setselectedGrp,
    setClickClearFilter,
    isClickClearFilter,
    filterByLetter,
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
    <Container>
      {isUserSignedIn && (
        <LanguageProvider>
          <ContextProvider>
            <div className="edp" id="mainDiv">
              <div className="container">
                <div className="row" style={{ position: "relative" }}>
                  <div className="filterDiv">
                    {parsedData && parsedData?.TopBarFilterView !== "Hide" && (
                      <TopBarFilter
                        optimization={optimization}
                        SyncUserInfoFrom={parsedData?.SyncUserInfoFrom}
                        isImportedUser={isImportedUser}
                        UserArray={UserArray}
                        isClickClearFilter={isClickClearFilter}
                      />
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
                      showHomePage={showHomePage}
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

                    {Setting && <SettingsPage {...settingsPageProps} />}

                    {showHomePage && (
                      <div>
                        <SearchFilters {...SearchFiltersProps} />
                        <div ref={targetRef} id="pdf-container">
                          <Home {...homePagePops} />
                        </div>
                      </div>
                    )}

                    <HelpPage
                      onDismiss={() => setShowHelpPage(false)}
                      isOpen={showHelpPage}
                    />

                    {showOrgChart && <OrgChartPage {...orgChartPageProps} />}
                  </div>
                  <div style={{ width: "100%", float: "right" }}></div>
                  {/* -------------------PAGES CONTAINER END------------------- */}
                </div>
              </div>
            </div>
          </ContextProvider>
        </LanguageProvider>
      )}
    </Container>
  );
};

// const TopBarFilter = ({ optimization,isClickClearFilter,UserArray,isImportedUser ,SyncUserInfoFrom}) => {
//   const {

//     view,

//   } = useStore();
//   // console.log(UserArray)
//   const { departmentFields, FormatedUserData } = useFields();
//   const [selectedTab, setSelectedTab] = useState("");
//   const [data,setData]=useState(FormatedUserData);
// //   console.log(view,"views selected")
// // //   useEffect(()=>{
// // // setData(FormatedUserData)
// // //   },[])
// // console.log(isClickClearFilter,departmentFields,view)
// useEffect(()=>{

//     if(view=="NonM365"){
//       setData(NonMUsers)
//      }else{
//       setData(FormatedUserData)
//      }

// },[view,FormatedUserData?.length,isClickClearFilter])

//   return (
//     <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>

//       {departmentFields.map((x) => {
//         let count = 0;
//         for (let i = 0; i < data?.length; i++) {
//           if (data[i]?.department === x.value) {
//             count++;
//           }
//         }

//         return (
//           <div
//             key={x.value}
//             style={{
//               padding: "0px 10px 3px",
//               backgroundColor: "rgb(0, 112, 220, .4)",
//               fontSize: "13px",
//               cursor: "pointer",
//               color: "rgb(0, 112, 220)",
//               height: "15px",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               userSelect: "none",
//               boxSizing: "border-box",
//               height: "35px",
//               columnGap: "5px",
//               minWidth: "100px",
//               fontWeight: "400",
//             }}
//             className={`${styles.topbarfilter} topbarFilter ${
//               selectedTab === x.value ? "topbarfilterBorderBottom" : ""
//             } `}
//             onClick={() => {
//               setSelectedTab(x.value);
//               optimization(x.value, "departments");
//             }}
//           >
//             <p>{x.label}</p>
//             <p style={{ fontWeight: "600", fontSize: "18px" }}>{count}</p>
//           </div>
//         );
//       })}
//     </div>
//   );
// };
// import React, { useState, useEffect } from 'react';

// import React, { useState, useEffect } from 'react';

const TopBarFilter = ({
  optimization,
  isClickClearFilter,
  UserArray,
  isImportedUser,
  SyncUserInfoFrom,
}) => {
  const { view } = useStore();
  const { departmentFields, FormatedUserData } = useFields();
  const [selectedTab, setSelectedTab] = useState("");
  const [data, setData] = useState(FormatedUserData);
  const [showMore, setShowMore] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const MAX_VISIBLE_TABS = 10;
  const visibleTabs = showMore
    ? departmentFields
    : departmentFields.slice(0, MAX_VISIBLE_TABS);

  useEffect(() => {
    if (view === "NonM365") {
      setData(NonMUsers);
    } else {
      setData(FormatedUserData);
    }
  }, [view, FormatedUserData?.length, isClickClearFilter]);

  const handleTabClick = (x) => {
    setSelectedTab(x.value);
    optimization(x.value, "departments");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "10px",
        flexWrap: "wrap",
      }}
    >
      {visibleTabs.map((x) => {
        let count = data?.filter((user) => user?.department === x.value)?.length;

        return (
          <div
            key={x?.value}
            style={{
              padding: "0px 10px 3px",
              backgroundColor: "rgba(0, 112, 220, 0.4)",
              fontSize: "13px",
              cursor: "pointer",
              color: "rgb(0, 112, 220)",
              height: "35px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              userSelect: "none",
              boxSizing: "border-box",
              columnGap: "5px",
              minWidth: "100px",
              fontWeight: "400",
            }}
            className={`topbarFilter ${
              selectedTab === x.value ? "topbarfilterBorderBottom" : ""
            }`}
            onClick={() => handleTabClick(x)}
          >
            <p>{x.label}</p>
            <p style={{ fontWeight: "600", fontSize: "18px" }}>{count}</p>
          </div>
        );
      })}

      {departmentFields.length > MAX_VISIBLE_TABS && (
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setDropdownVisible(!dropdownVisible)}
            style={{
              padding: "5px 10px",
              backgroundColor: "rgb(0, 112, 220)",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "13px",
              minWidth: "35px", // Set a minimum width
              height: "35px",
            }}
          >
            ...
          </button>
          {dropdownVisible && (
            <div
              style={{
                position: "fixed",
                backgroundColor: "white",

                boxShadow: "0 0 1px rgba(0,0,0,0.5)",

                zIndex: 6001,
                padding: "5px 0",
                width: "200px", // Increased width for the dropdown
              }}
            >
              {departmentFields.slice(MAX_VISIBLE_TABS).map((x) => {
                let count = data?.filter(
                  (user) => user?.department === x.value
                ).length;

                return (
                  <div
                    key={x.value}
                    style={{
                      padding: "5px",
                      display: "flex",
                      gap: "8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #ddd",
                      color: "rgb(0, 112, 220)",
                      borderRadius: "none",
                      zIndex: "1000",
                    }}
                    className="tabspivot"
                    onBlur={() => setDropdownVisible(false)}
                    onClick={() => handleTabClick(x)}
                  >
                    <p style={{ margin: 0 }}>{x.label}</p>
                    <p
                      style={{ fontWeight: "600", fontSize: "18px", margin: 0 }}
                    >
                      {count}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
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
