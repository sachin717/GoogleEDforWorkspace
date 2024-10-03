import "../SelectSource/Edp.scss";
import "./Styles.scss";
import styles from "../SCSS/Ed.module.scss";
import "sweetalert2/dist/sweetalert2.css";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import BulkUpload from "./BulkUpload";
import { useConst } from "@fluentui/react-hooks";
import EDStyles from "../SCSS/Ed.module.scss";
import { gapi } from "gapi-script";
import { TooltipHost, ITooltipHostStyles } from "@fluentui/react/lib/Tooltip";
import DefaultImage from "../assets/images/DefaultImg1.png";
import ReactSelect from "react-select";
import MiniModals from "./MiniModals";
import { UserPropsGridView } from "./UserPropsGridView";
import useStore, { useSttings } from "./store";
import { SearchFilter } from "./SearchFilter";
import { useBoolean } from "@fluentui/react-hooks";
import {
  Checkbox,
  DatePicker,
  DefaultButton,
  DetailsList,
  Dropdown,
  IContextualMenuItem,
  IContextualMenuProps,
  IDatePickerStrings,
  IDropdownOption,
  Icon,
  IconButton,
  Label,
  Link,
  Panel,
  PanelType,
  Persona,
  PersonaSize,
  PrimaryButton,
  SelectionMode,
  Shimmer,
  Stack,
  TextField,
  Toggle,
  mergeStyles,
} from "office-ui-fabric-react";
import { IPivotStyles, Pivot, PivotItem } from "@fluentui/react";
import CustomAdd from "./CustomAdd";
import Department from "./Department";
import JTitle from "./JTitle";
import CustomDelete from "./CustomDelete";
import ExcludeCSV from "./ExcludeCSV";
import Users from "./Users";
import ImageTag from "./ImageTag";
import ImageCropper from "./Utils/ImageCropper";
import {
  convertToBase64,
  convertToISO,
  decryptData,
  encryptData,
  generateUniqueId,
  isUserAdminCheck,
  removeDuplicatesFromObject,
  removeFavicon,
} from "../Helpers/HelperFunctions";
import { LangOptions } from "../../Language/LanguageOptions";
import { Language } from "../../Language/Languages";
import { useLanguage } from "../../Language/LanguageContext";
import ExcludedDomain from "./ExcludedDomain";
import ExcludedName from "./ExcludedName";
import ExcludedLocation from "./ExcludedLocation";
import ExcludedEmail from "./ExcludedEmail";
import ExcludedContains from "./ExcludedContains";

import { SweetAlerts } from "./Utils/SweetAlert";
import BirthdayTemplate from "./Utils/BirthdayTemplate";
import AnniversaryTemplate from "./Utils/AnniversayTemplate";
import ImportPronouns from "./ImportPronouns";
import ImportUsers from "./ImportUsers";
import FilterAttributes from "../settings/FilterAttributes";
import { useFields, useLists } from "../../context/store";
import RolesAndPermisstions from "../settings/RolesAndPermisstions";
import ExecutiveAssistantRelationship from "../settings/ExecutiveAssistantRelationship";
import SearchSettings from "../settings/SearchSettings";
import UserSearchBox from "./UserSearchBox";
import CustomFunction from "../settings/CustomFunction";
import AdditionalManager from "../settings/AdditionalManager";
import Collaboration from "../settings/Collaboration";
import ViewsShowHideModule from "../settings/ViewsShowHideModule";
import GeneralShowHideModule from "../settings/GeneralShowHideModule";
import { useCustomStyles } from "./Utils/useCustomstyle";
import OrgChart from "../settings/OrgChart";
import RestrictedAccess from "../settings/RestrictedAccess";
import {
  getSettingJson,
  IMAGES_LIST,
  SETTING_LIST,
  updateSettingJson,
  USER_LIST,
} from "../../api/storage";
import HideManager from "../settings/HideManager";
import HideMobileNumber from "../settings/HideMobileNumber";


let departmentList: { label: any; value: any }[] = [];
let jobTitleList: { label: any; value: any }[] = [];
var parsedData: any = "";
var dynamicwidth: any;
let finalDataNonM365: any = [];
let optionList: any = [];
var managerEmail = "";

// const BirthAndAnivfilterOptions = [
//   { key: "currentDay", text: "Current Day", checked: true },
//   { key: "currentWeek", text: "Current Week" },
//   { key: "currentMonth", text: "Current Month" },
//   { key: "upcomingMonth", text: "Upcoming Month" },
// ];
const BirthAndAnivfilterOptions = [
  { key: "currentDay", text: "Current Day" },
  { key: "currentWeek", text: "Current Week" },
  { key: "currentWeekAndNextWeek", text: "Current & Next week " },
  { key: "currentMonth", text: "Current Month" },
  { key: "currentMonthAndNextMonth", text: "Current & Next Month" },
];

const PivotStyles: IPivotStyles = {
  text: {
    fontSize: "16px",
  },
  root: {},
  link: {
    fontSize: "16px",
  },
  count: {},
  linkContent: "",
  linkIsSelected: "",
  icon: "",
  linkInMenu: "",
  overflowMenuButton: "",
};

const profileCardProperties = [
  { key: "Title", label: "Title", title: "Title" },
  { key: "Email", label: "Email", title: "Email" },
  { key: "WorkPhone", label: "Work Phone", title: "Work Phone" },
  { key: "Mobile", label: "Mobile", title: "Mobile" },
  { key: "EmployeeID", label: "Employee ID", title: "Employee ID" },
  { key: "CostCenter", label: "Cost center", title: "Cost center" },
  { key: "MemberOf", label: "Member of", title: "Member of" },
  { key: "OwnerOf", label: "Owner of", title: "Owner of" },
  { key: "ManagerOf", label: "Manager of", title: "Manager of" },
  { key: "Address", label: "Address", title: "Address" },
  { key: "FloorSection", label: "Floor Section", title: "Floor Section" },
  { key: "FloorName", label: "Floor name", title: "Floor name" },
  { key: "BuildingID", label: "Building ID", title: "Building ID" },
];

let previewBrandLogoImage: any = "";

const AdvanceSetting = (props: any) => {

  
  // const { setShowOrgChart, setShowHomePage, filterByLetter } = props;
  const { departmentFields, jobTitleFields, excludeOptionsForDomain ,setCommandBarItems ,CommandBarItems,} =
    useFields();
  const {
    languagePartUpdate,
    setLanguagePartUpdate,
    translation,
    setLanguage,
  } = useLanguage();
  const { appSettings, setAppSettings } = useSttings();
  const {usersList, setUsersList, imagesList, setImagesList} = useLists();

  const { SweetAlert: SweetAlertGridView } = SweetAlerts("#UserPrtiesGV", true);
  const { SweetAlert: SweetAlertDashboardPanel } = SweetAlerts(
    "#dashboardpanel",
    true
  );
  const { SweetAlert : ExportSweetAlert ,SweetPrompt: SweetAlertImportUserDelete } =
    SweetAlerts("#ImportUserDelete");
  const { SweetAlert: SweetAlertDomain } = SweetAlerts("#domain", true);
  const {
    SweetAlert: SweetAlertCustomFields,
    SweetPrompt: SweetPromptCustomFieldsDelete,
  } = SweetAlerts("#customFields", true);
  const { SweetAlert: SweetAlertJobTitle } = SweetAlerts("#jobTitle", true);
  const { SweetAlert: SweetAlertCsvPanel } = SweetAlerts("#csvpanel", true);

  const { SweetAlert: SweetAlertIncludeduserlist } =
    SweetAlerts("#Includeduserlist",true);
  const {
    SweetAlert: SweetAlertCustomfunc,
    SweetPrompt: SweetPromptCustomFunc,
  } = SweetAlerts("#customfunc", true);
  const { SweetAlert: SweetAlertBirthAndAnnivSetting } = SweetAlerts(
    "#birthAndAnnivSetting",
    true
  );
  const { SweetAlert: SweetAlertPrononus } = SweetAlerts("#pronouns", true);
  const { SweetAlert: SweetAlertImportUser } = SweetAlerts("#importuser", true);
  const { SweetAlert: SweetAlertShowHideForView } = SweetAlerts(
    "#ShowHideForView",
    true
  );
  const { SweetAlert: SweetAlertEmailTemp } = SweetAlerts(
    "#emailTemplate",
    true
  );
  const { SweetAlert: SweetAlertShowHideAdvanced } = SweetAlerts(
    "#AdvanceShowHide",
    true
  );
  const { SweetAlert: SweetAlertSearchFilter } = SweetAlerts(
    "#searchfilters",
    true
  );
  const { SweetAlert: SweetAlertHideManager } = SweetAlerts(
    "#HideManager",
    true
  );
  const { SweetAlert: SweetAlertSingleUserUpload } = SweetAlerts(
    "#singleUserUpload",
    true
  );
  const { SweetAlert: SweetAlertGeneralHideShow } = SweetAlerts(
    "#generalHideShow",
    true
  );
  const { SweetAlert: SweetAlertInsidePanel } = SweetAlerts("#insidePanel");
  const { SweetAlert: SweetAlertListView } = SweetAlerts("#ListView", true);
  const { SweetAlert: SweetAlertProfileView } = SweetAlerts(
    "#ProfileView",
    true
  );
  const { SweetAlert: SweetAlertImgProfilePanel } =
    SweetAlerts("#ImgProfilePanel");
  const { SweetAlert: SweetAlertOutSidePanel } = SweetAlerts(
    "#excludeoutsidepanel"
  );
  const { SweetAlert: SweetAlertContains } = SweetAlerts(
    "#excludedContains",
    true
  );
  const { SweetAlert: SweetAlertLocation } = SweetAlerts(
    "#excludedLocation",
    true
  );
  const { SweetAlert: SweetAlertEmail } = SweetAlerts("#excludedEmail", true);
  const { SweetAlert: SweetAlertExcludeCsv } = SweetAlerts(
    "#excludedCsv",
    true
  );
  const { SweetAlert: SweetAlertExcludeName } = SweetAlerts(
    "#excludeName",
    true
  );
  const { SweetAlert: SweetAlertExcludeDept } = SweetAlerts(
    "#excludeDept",
    true
  );
  const { SweetAlert: SweetAlertExecutiveAssistant } = SweetAlerts(
    "#ExecutiveAssistant",
    true
  );

  const handleMenuItemClick = (item: IContextualMenuItem) => {
    switch (item.key) {
      case "Add":
        // console.log("Add clicked");
        setEditImportUserPanel(false);
        setOpenImportUsersPanel(true);

        break;
      case "AddBulk":
      
        setOpenBulkUploadPanel(true);

        break;
      case "Export":
     
        const date = new Date();
     
        if(usersList?.Users === undefined || usersList?.Users === null){
          ExportSweetAlert("error", "No Users found to export");
        }else{
          downloadTemplate(usersList?.Users || [], `NonGoogleUsers ${date.toDateString()}`, "A");
        }
        break;
      default:
        break;
    }
  };

  const menuProps: IContextualMenuProps = useConst({
    shouldFocusOnMount: true,
    items: [
      {
        key: "Add",
        iconProps: { iconName: "Add" },
        text: "Add",
        onClick: (ev, item) => handleMenuItemClick(item),
      },
      {
        key: "AddBulk",
        iconProps: { iconName: "BulkUpload" },
        text: "Add Bulk",
        onClick: (ev, item) => handleMenuItemClick(item),
      },
      {
        key: "Export",
        iconProps: { iconName: "download" },
        text: "Export",
        onClick: (ev, item) => handleMenuItemClick(item),
      },
    ],
  });
  // const { SweetAlert: SweetAlertExcludeJob } = SweetAlerts("#excludeJob");

  const [hideShowViews, setHideShowViews] = useState({
    grid: false,
    list: false,
    tile: false,
  });
  const ListStyles = {
    headerWrapper: {
      flex: "0 0 auto",
      selectors: {
        "& [role=presentation]": {
          selectors: {
            "& [role=row]": {
              background: "rgb(0, 120, 212, .4)",
              padding: "4px 0px",
              color: "inherit",

              selectors: {
                ".ms-DetailsHeader-cellTitle": {
                  color: "rgb(0, 120, 212)",
                },
                ".ms-DetailsHeader-cell:hover": {
                  color: "#fff",
                  background: "rgb(0, 120, 212,0)",
                },
              },
            },
          },
        },
      },
    },

    contentWrapper: {
      flex: "1 1 auto",
      ".ms-DetailsRow-fields": {
        alignItems: "center",
        borderBottom: ".5px solid black",
      },

      "& .ms-DetailsRow-cell": {
        fontSize: "13px !important",
      },
    },
  };

  let usersnameOptions = props.UserArray?.map((item) => {
    return { value: item.name, label: item.name };
  });
  let locationOptions: any = props.UserArray?.map((item) => {
    return { value: item.location, label: item.location };
  });
  let EmailOptions: any = props.UserArray?.map((item) => {
    return { value: item.email, label: item.email };
  });

  const [
    openExecutiveAssistantRelationship,
    setOpenExecutiveAssistantRelationship,
  ] = useState(false);

  const [upcomingBirthAndAnivAdv, setUpcomingBirthAndAnivAdv] = React.useState(
    "Google & Imported User"
  );
  const [syncUserInfo, setSyncUserInfo] = React.useState(
    "Google & Imported User"
  );
  const [dashboardUsers, setDashboardUsers] = React.useState([]);
  const [GroupsChecked, setGroupsChecked] = React.useState(false);
  const [isEditImportUserPanel, setEditImportUserPanel] = React.useState(false);
  const [bLogo, setBlogo] = React.useState<any>("");
  const [selectedBithFilter, setSelectedBithFilter] = useState("");
  const [HideShowPronouns, setHideShowPronouns] = useState<any>(false);
  const [filterBirthdayData, setfilterBirthdayData] = useState<any>([]);
  const [autoLoad, setAutoLoad] = React.useState(false);
  const [NonGoogleUsersData, setNonGoogleUsersData] = React.useState([]);
  const [isUserImportedByCsv, setUserImportedByCsv] = React.useState(false);
  const [isOpenBulkUploadPanel, setOpenBulkUploadPanel] = React.useState(false);
  const [excludeByNameOptions, setExcludeByNameOptions] =
    React.useState(usersnameOptions);

  const [selectedKeysForExcludeName, setSelectedKeysForExcludeName] =
    React.useState<string[]>([]);
  const [selectedExcludedDomian, setSelectedExcludedDomian] = React.useState(
    []
  );
  const [selectedExcludedContains, setSelectedExcludedContains] =
    React.useState<any>([{ value: "", checked: false }]);
  const [selectedExcludedLoc, setSelectedExcludedLoc] = React.useState([]);
  const [selectedExcludedEmail, setSelectedExcludedEmail] = React.useState([]);
  const [isOpenDashboardUserCsv, setOpenDashboardUserCsv] =
    React.useState(false);
  const [excelDataDashboardUser, setExcelDataDashboardUser] = React.useState(
    []
  );
  const [dashboardFeatureAddBtnClick, setDashboardFeatureAddBtnClick] =
    React.useState(0);
  const [searchUserForDashboardFeature, setSearchUserForDashboardFeature] =
    React.useState<any>("");
  const [dashboardFeature, setDashboardFeature] = useState<any>({
    AvailableForAll: true,
    AvaliableForSpecificUser: false,
  });
  const [dashboard, setShowDashboard] = React.useState(false);
  const [showBirthAnivImg, setShowBirthAnivImg] = React.useState("");
  const [selectedKeydept, setSelectedKeys1] = React.useState([]);
  const [selectedEmpInfoAlignment, setSelectedEmpInfoAlignment] =
    useState(null);
  const [browserLangDetectToggle, setBrowserLangDetectToggle] =
    React.useState(false);
  const [browserLangDetectedLang, setBrowserLangDetectedLang] =
    React.useState("");
  const [selectLang, setSelectedLang] = React.useState<any>([]);
  const [showFav, setShowFav] = useState<any>("");
  const [showMemeberOf, setShowMemeberOf] = useState(false);
  const [showOrgChart, setShowOrgChart] = useState(false);
  const [showWFH, setShowWFH] = useState(false);
  const [WeekWorkStatus, setWeekWorkStatus] = useState(false);
  const [favIcon, setFavIcon] = React.useState<any>("");
  const [profileIconName, setProfileIconName] = React.useState("FavoriteStar");
  const [croppedImage, setCroppedImage] = React.useState(undefined);
  const [imageToCrop, setImageToCrop] = React.useState(undefined);
  const [customHomeUrlActive, setCustomHomeUrlActive] =
    React.useState<any>(false);

  const [OrgName, setOrgName] = React.useState("");
  const [dashboardIncludedUser, setDashboardIncludedUser] = React.useState([]);
  const [dashboardIncludedUserTable, setDashboardIncludedUserTable] =
    React.useState([]);
  const [dashboardIncludedUserShowData, setDashboardIncludedUserTableShowData] =
    React.useState([]);
  const [isLangModel, setLangModel] = React.useState(false);
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [imageCropper, setimageCropper] = React.useState(false);
  const [CropButton, setCropButton] = React.useState(false);
  const [selectedKeysjtitle, setSelectedKeys2] = React.useState([]);
  const [selectedOrgchart, setSelectedOrgchart] = React.useState("");
  const [loadingG8, setLoadingG8] = React.useState(false);
  const [clearAlphaFilter, setClearAlphaFilter] = React.useState(false);
  const [homeCustomUrl, setHomeCustomUrl] = React.useState("");
  const [homeCustomUrlIconName, setHomeCustomUrlIconName] = React.useState("");
  const [profileCardPropertiesData, setProfileCardPropertiesData] = useState(
    profileCardProperties
  );

  const [openCustomFunctionPanel, setOpenCustomFunctionPanel] = useState(false);

  const [showFilterAttributeModal, setShowFilterAttributeModal] =
    useState(false);

  const [LabelModal, setLabelModal] = useState(false);
  const [isOpenImportUsersPanel, setOpenImportUsersPanel] = useState(false);
  const [executive, setExecutive] = useState("");
  const [aboutMe, setAboutMe] = useState("");

  const [topBarModalVisible, setTopBarModalVisible] = useState(false);
  const [topBarView, setTopBarView] = useState("");
  const [isShowHideModuleOpenAdvance, setIshowHideModuleOpenAdvance] =
    useState(false);

  const [isShowHideModuleOpen, setIshowHideModuleOpen] = useState(false);

  // Collaboration Setting States
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    firstName: "",
    lastName: "",
    manager: "",
    department: "",
    job: "",
    workphone: "",
    mobile: "",
    skills: "",
    projects: "",
    hobbies: "",
    school: "",
    About_Me: "",
    DOB: null,
    DOJ: null,
    id: null,
  });
  let NonGoogleColumns = [
    {
      key: "Name",
      name: "Name",
      fieldName: "name",
      minWidth: 120,
      maxWidth: 180,
    },
    {
      key: "firstName",
      name: "First Name",
      fieldName: "firstName",
      minWidth: 120,
      maxWidth: 180,
    },
    {
      key: "mail",
      name: "Email",
      fieldName: "email",
      minWidth: 120,
      maxWidth: 180,
    },

    {
      key: "manager",
      name: "Manager",
      fieldName: "manager",
      minWidth: 120,
      maxWidth: 180,
    },
    {
      key: "DOB",
      name: "DOB",
      fieldName: "DOB",
      minWidth: 120,
      maxWidth: 180,
    },
    {
      key: "DOJ",
      name: "DOJ",
      fieldName: "DOJ",
      minWidth: 120,
      maxWidth: 180,
    },
    {
      key: "Action",
      name: "Action",
      fieldName: "Action",
      minWidth: 120,
      maxWidth: 180,
      onRender: (item: any) => {
        return (
          <div style={{ display: "flex", gap: "10px" }}>
            <Icon
              style={{ color: "rgb(0, 120, 212)", cursor: "pointer" }}
              iconName="Edit"
              onClick={() => handleEditImportUser(item)}
            />
            <Icon
              style={{ color: "rgb(0, 120, 212)", cursor: "pointer" }}
              iconName="delete"
              onClick={() => handleDeleteImportUser(item)}
            />
          </div>
        );
      },
    },
  ];
  function handleEditImportUser(item) {

    setEditImportUserPanel(true);
    setOpenImportUsersPanel(true);
    let existingDOB=new Date(item.DOB)=="Invalid Date" as any?null:new Date(item.DOB);
    let existingDOJ=new Date(item.DOJ)=="Invalid Date" as any?null:new Date(item.DOJ);
    setFormState({ ...item, DOB: existingDOB, DOJ:existingDOJ });
  }
  function handleDeleteImportUser(item) {
    SweetAlertImportUserDelete(
      "warning",
      "Are you sure you want to delete this?"
    ).then((res) => {
   
      if (res.isConfirmed) {
        let result = NonGoogleUsersData?.filter((data) => {
          return data.id != item.id;
        });
        setNonGoogleUsersData(result);
        setUsersList({
          ...usersList,
          Users: result,
        });
        updateSettingJson(USER_LIST,encryptData(JSON.stringify({
          ...usersList,
          Users: result,
        })));
      }
    });
  }

  // Handle text field changes
  const handleChange = (event, newValue) => {
    const id = event.target.id;
    setFormState((prevState) => ({
      ...prevState,
      [id]: newValue,
    }));
  };

  // Handle date picker changes
  const handleDateChange = (date, id) => {
    setFormState((prevState) => ({
      ...prevState,
      [id]: date ? date : null,
    }));
  };

  // Handle text area changes
  const handleTextAreaChange = (event, newValue) => {
    const id = event.target.id;
    setFormState((prevState) => ({
      ...prevState,
      [id]: newValue,
    }));
  };
  // console.log(formState, "formstate");
  // DatePicker strings
  const datePickerStrings: IDatePickerStrings = {
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    shortMonths: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    days: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    goToToday: "Go to today",
    prevMonthAriaLabel: "Previous month",
    nextMonthAriaLabel: "Next month",
    prevYearAriaLabel: "Previous year",
    nextYearAriaLabel: "Next year",
    closeButtonAriaLabel: "Close",
    monthPickerHeaderAriaLabel: "Select month",
    yearPickerHeaderAriaLabel: "Select year",
    isRequiredErrorMessage: "Date is required.",
    invalidInputErrorMessage: "Invalid date format.",
  };

  const DropDownoptions: IDropdownOption[] = [
    { key: "FullOrgCharts", text: "Full Org Chart" },
    { key: "StanderdOrgCharts", text: "Org Chart - Two levels" },
  ];
  const [
    teachingBubbleVisibleOrgChartTT,
    { toggle: toggleTeachingBubbleVisibleOrgChartTT },
  ] = useBoolean(false);
  const [
    isOpenEmpInfoAlignModal,
    { setTrue: OpenEmpInfoAlignModal, setFalse: dismissEmpInfoAlignModal },
  ] = useBoolean(false);
  const [
    isOpenUpcomingBithAndAnivAdv,
    {
      setTrue: OpenUpcomingBithAndAnivAdv,
      setFalse: dismissUpcomingBithAndAnivAdv,
    },
  ] = useBoolean(false);
  const [
    isOpenModalShowGrp,
    { setTrue: isOpenShowGrp, setFalse: onDismissShowGrp },
  ] = useBoolean(false);
  const [isOpenAutoLoad, { setTrue: OpenAutoLoad, setFalse: dismissAutoLoad }] =
    useBoolean(false);
  const [
    isOpenBdayAnniTemplt,
    { setTrue: openBdayAnniTemplt, setFalse: dismissBdayAnniTemplt },
  ] = useBoolean(false);

  const [
    isOpenImportUsers,
    { setTrue: openImportUsers, setFalse: dismissImportUsers },
  ] = useBoolean(false);

  const [
    isOpenExcludeDomain,
    { setTrue: OpenExcludeDomain, setFalse: dismissExcludeDomain },
  ] = useBoolean(false);
  const [
    isOpenFilterBirthAndAniv,
    { setTrue: OpenFilterBirthAndAniv, setFalse: dismissFilterBirthAndAniv },
  ] = useBoolean(false);
  const [
    isOpenExcludeEmail,
    { setTrue: OpenExcludeEmail, setFalse: dismissExcludeEmail },
  ] = useBoolean(false);
  const [
    isOpenExcludeLoc,
    { setTrue: OpenExcludeLoc, setFalse: dismissExcludeLoc },
  ] = useBoolean(false);
  const [
    isOpenExcludeContains,
    { setTrue: OpenExcludeContains, setFalse: dismissExcludeContains },
  ] = useBoolean(false);
  const [
    isOpenPanelDashboardFeaturePanel,
    {
      setTrue: openPanelDashboardFeaturePanel,
      setFalse: dismissDashboardFeaturePanel,
    },
  ] = useBoolean(false);
  const [
    isOpenPanelClearAlphaFilter,
    {
      setTrue: OpenPanelClearAlphaFilter,
      setFalse: dismissOpenPanelClearAlphaFilter,
    },
  ] = useBoolean(false);
  const [
    isOpenPanelDefaultMobViews,
    {
      setTrue: openPanelDefaultMobViews,
      setFalse: dismissPanelDefaultMobViews,
    },
  ] = useBoolean(false);
  const [
    isOpenModalViews,
    { setTrue: openModalViews, setFalse: dismissModalViews },
  ] = useBoolean(false);
  const [
    isOpenExcludeUserListPanel,
    {
      setTrue: openExcludeUserListPanel,
      setFalse: dismissExcludeUserListPanel,
    },
  ] = useBoolean(false);
  const [
    isOpenExcludeUserLocListPanel,
    {
      setTrue: openExcludeUserLocListPanel,
      setFalse: dismissExcludeLocUserListPanel,
    },
  ] = useBoolean(false);
  const [
    isOpenExcludeUserContainsListPanel,
    {
      setTrue: openExcludeUserContainsListPanel,
      setFalse: dismissExcludeContainsUserListPanel,
    },
  ] = useBoolean(false);
  const [
    isOpenExcludeUserEmailListPanel,
    {
      setTrue: openExcludeUserEmailListPanel,
      setFalse: dismissExcludeEmilUserListPanel,
    },
  ] = useBoolean(false);
  const [
    isOpenIncludeDashboardUserPanel,
    {
      setTrue: OpenIncludeDashboardUserPanel,
      setFalse: dismissIncludeDashboardUserPanel,
    },
  ] = useBoolean(false);
  const [
    isOpenImgPrfTag,
    { setTrue: openPanelImgPrfTag, setFalse: dismissPanelImgPrfTag },
  ] = useBoolean(false);
  const [
    isopenPanelOrgName,
    { setTrue: openPanelOrgName, setFalse: dismissPanelOrgName },
  ] = useBoolean(false);
  const [
    isOpenPanelBdayAnniImg,
    { setTrue: OpenPanelBdayAnniImg, setFalse: dismissPaneBdayAnniImg },
  ] = useBoolean(false);
  const [
    isOpenPanelProfileCustomUrlIcon,
    {
      setTrue: openPanelProfileCustomUrlIcon,
      setFalse: dismissPanelProfileCustomUrlIcon,
    },
  ] = useBoolean(false);
  const [
    isbrandLogo,
    { setTrue: openPanelUpldLogo, setFalse: dismissPanelUpldLogo },
  ] = useBoolean(false);

  const [isOpen0, { setTrue: openPanel0, setFalse: dismissPanel0 }] =
    useBoolean(false);
  const [showProgress, setshowProgress] = React.useState(true);
  const [
    isOpenExcldName,
    { setTrue: openPanelExcldName, setFalse: dismissPanelExcldName },
  ] = useBoolean(false);

  const [
    isopenPanelHomeCustm,
    { setTrue: openPanelHomeCustm, setFalse: dismissPanelHomeCustm },
  ] = useBoolean(false);
  const [
    isOpenCustomField,
    { setTrue: openPanelCustomField, setFalse: dismissPanelCustomField },
  ] = useBoolean(false);
  const [
    isOpenExcldJtitle,
    { setTrue: openPanelExcldJtitle, setFalse: dismissPanelExcldJtitle },
  ] = useBoolean(false);
  const [
    isOpenRolePermission,
    { setTrue: openPanelRolePermission, setFalse: dismissPanelRolePermission },
  ] = useBoolean(false);
  const [
    isOpenCustomA,
    { setTrue: openPanelCustomA, setFalse: dismissPanelCustomA },
  ] = useBoolean(false);
  const [isOpenPronouns, { setTrue: openPronouns, setFalse: dismissPronouns }] =
    useBoolean(false);
  const [
    isOpenSyncUserFrom,
    { setTrue: OpenSyncUserFrom, setFalse: dismissSyncUserFrom },
  ] = useBoolean(false);
  const [
    isOpenExcldDept,
    { setTrue: openPanelExcldDept, setFalse: dismissPanelExcldDept },
  ] = useBoolean(false);
  const [isOpen3, { setTrue: openPanel3, setFalse: dismissPanel3 }] =
    useBoolean(false);
  const [
    isOpenNonM365Users,
    { setTrue: openPanelNonM365Users, setFalse: dismissPanelNonM365Users },
  ] = useBoolean(false);
  const [isModalOpen, { setTrue: openPanelShortBy, setFalse: closeModal }] =
    useBoolean(false);
  const [
    isOpenWidthCustm,
    { setTrue: openPanelWidthCustm, setFalse: dismissPanelWidthCustm },
  ] = useBoolean(false);
  const [
    isOpenUserPrtiesPCV,
    { setTrue: openPanelUserPrtiesPCV, setFalse: dismissPanelUserPrtiesPCV },
  ] = useBoolean(false);
  const [
    isOpenUserPrtiesGV,
    { setTrue: openPanelUserPrtiesGV, setFalse: dismissPanelUserPrtiesGV },
  ] = useBoolean(false);
  const [
    isOpenUserPrtiesLV,
    { setTrue: openPanelUserPrtiesLV, setFalse: dismissPanelUserPrtiesLV },
  ] = useBoolean(false);
  const [
    isOpenDfltViews,
    { setTrue: openPanelDfltViews, setFalse: dismissPanelDfltViews },
  ] = useBoolean(false);
  const [
    isOpenSearchFltr,
    { setTrue: openPanelSearchFltr, setFalse: dismissPanelSearchFltr },
  ] = useBoolean(false);
  const [isOpen2, { setTrue: openPanel2, setFalse: dismissPanel2 }] =
    useBoolean(false);
  const [isOpen5, { setTrue: openPanel5, setFalse: dismissPanel5 }] =
    useBoolean(false);
  const [
    isOpenExcldCSV,
    { setTrue: openPanelExcldCSV, setFalse: dismissPanelExcldCSV },
  ] = useBoolean(false);
  const [
    isOpenOrgChartType,
    { setTrue: openPanelOrgChartType, setFalse: dismissPanelOrgChartType },
  ] = useBoolean(false);
  const [
    isOpenRecordLoad,
    { setTrue: openPanelRecordLoad, setFalse: dismissPanelRecordLoad },
  ] = useBoolean(false);
  const [checkedValueRecord, setCheckedValueRecord] = useState("25");
  const [selectedOption, setSelectedOption] = useState("givenName");
  const [divwidth, setdivwidth] = React.useState<string>();
  const [loadingCusGwidth, setLoadingCusGwidth] = React.useState(false);
  const [userinput, setuserinput] = React.useState(String);
  const [usermanager, setusermanager] = React.useState(String);
  const [users, setusers] = React.useState<any>([]);

  const [ViewsSHMPanel, setViewsSHMPanel] = useState(false);

  const [selectedView, setSelectedView] = useState("Grid");
  const [selectedMobileView, setSelectedMobileView] = useState("List");
  const [show365user, setshow365] = React.useState(false);
  const {
    userData,
    changeExcludeByDepartment,
    changeExcludeByJobTitle,
    changeTypeOrg,
    changeOrgChartHead,
    orgChartHead,
    setView,
  } = useStore();

  const [
    isOpenHideMobNo,
    { setTrue: openPanelHideMobNo, setFalse: dismissPanelHideMobNo },
  ] = useBoolean(false);
  const [
    isOpenHideMngr,
    { setTrue: openPanelHideMngr, setFalse: dismissPanelHideMngr },
  ] = useBoolean(false);

  const KEY_NAME = "ListViewPrope";
  const KEY_NAME2 = "ProfileViewPrope";
  const KEY_NAME3 = "ExcludeByDepartment";
  const KEY_NAME4 = "ExcludeByJobTitle";
  const KEY_NAME5 = "orgChartType";

  // const tooltipIdclearfilter = useId("tooltip4");

  const wrapperClass = mergeStyles({
    padding: 2,
    selectors: {
      "& > .ms-Shimmer-container": {
        margin: "10px 0",
      },
    },
  });
  const calloutProps = { gapSpace: 0 };

  const hostStyles: Partial<ITooltipHostStyles> = {
    root: { display: "inline-block", cursor: "pointer" },
  };
  function transformUserDataToFomat(users) {
    return users.map((user) => ({
      id: user.id,
      image: user.image,
      initials: user.initials,
      name: user.name,
      job: user.job,
      email: user.email,
      department: user.department,
      dob: user.DOB,
      doj: user.DOJ,
      location: user.location,
    }));
  }

  const filterOptions = (options, filter) => {
    if (!filter) {
      return options;
    }
    return departmentList.filter(
      ({ value }) =>
        value.toLowerCase() && value.toLowerCase().indexOf(filter) > -1
    );
  };

  React.useEffect(() => {
    GetSettingData();
  }, []);
  React.useEffect(() => {
    if (isOpenImportUsers) {
     
       setNonGoogleUsersData(usersList?.Users);
    }
  }, [isOpenImportUsers,isUserImportedByCsv]);

  useEffect(() => {
    window.addEventListener("resize", changeView);
    function changeView() {
      if (window.innerWidth < 768) {
        let temp = { ...appSettings, defaultMobileView: selectedMobileView };

        setView(selectedMobileView);

        if (Object.keys(appSettings).length > 0) {
          updateSettingJson(SETTING_LIST, temp);
        }
      } else {
        setView(appSettings.DefaultView);
        
      }
    }

    return () => {
      window.removeEventListener("resize", changeView);
    };
  }, [window.innerWidth]);
  const mystyle = useCustomStyles();
  function onChangeDashboard(e: any, checked: any) {
    setShowDashboard(checked);
    updateSettingJson(SETTING_LIST, { ...parsedData, showDashboard: checked });
    setAppSettings({ ...parsedData, showDashboard: checked });
    SweetAlertShowHideAdvanced("success", translation.SettingSaved);
  }

  async function onLanguageChange(event: any, item: any) {
    setSelectedLang(item);

  
    let lang = item?.key as string;
   

    setLanguage(lang);
    let temp = {
      ...parsedData,
      SelectedLanguage: item,
      LanguageData: translation,
      BrowserLanguageActive: browserLangDetectToggle,
    };
    
    await updateSettingJson(SETTING_LIST, temp);
    setAppSettings(temp)
    setLanguagePartUpdate((prev)=>!prev);
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }

  const { SweetAlert: SweetAlertClearAlphaFilter } =
    SweetAlerts("#clearAlphabet");
  function onChangeClearAlphaFilter(e: any, checked: any) {
    setClearAlphaFilter(checked);
    const setting = { ...appSettings, clearAlphaFilter: checked };
    updateSettingJson(SETTING_LIST,setting);
    setAppSettings(setting);
    SweetAlertClearAlphaFilter("success", translation.SettingSaved);
  }

  async function onChangeAutoLangDetect(event: any, checked: any) {
    setBrowserLangDetectToggle(checked);
    setBrowserLangDetectedLang(window.navigator.language);
    let lang: any;
    if (checked) {
      setLanguage(window.navigator.language.slice(0, 2));
      lang = window.navigator.language.slice(0, 2);
      setLanguage(lang);
    } else {
      lang = selectLang;
      setLanguage(lang);
    }
    let temp = {
      ...parsedData,
      SelectedLanguage: selectLang,
      LanguageData: translation,
      BrowserLanguageActive: checked,
      BrowserLanguage: window.navigator.language,
    };
    
    await updateSettingJson(SETTING_LIST, temp);
    setAppSettings(temp);
    setLanguagePartUpdate(!languagePartUpdate);
    SweetAlertOutSidePanel("success", translation.SettingSaved);
   
  }

  const onChangeInfoAlign = (alignment) => {
    setSelectedEmpInfoAlignment(alignment);
  };

  function handleChangeAlignMent() {
    updateSettingJson(SETTING_LIST, {
      ...appSettings,
      EmpInfoAlignment: selectedEmpInfoAlignment,
    });

    setAppSettings({
      ...appSettings,
      EmpInfoAlignment: selectedEmpInfoAlignment,
    });
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }

  function onChangeCustomLinkActive(e: any, checked: any) {
    setCustomHomeUrlActive(checked);
    let temp = {
      ...parsedData,
      CustomHomePageUrl: {
        homeCustomUrl: homeCustomUrl,
        homeCustomUrlIconName: homeCustomUrlIconName,
        CustomHomePageLinkActive: checked,
      },
    };
 
    updateSettingJson(SETTING_LIST, temp);
  }

  function handleChangeMemeberOf(e: any, checked: any) {
    setShowMemeberOf(checked);
    let temp = { ...parsedData, ShowMemeberOf: checked };
    updateSettingJson(SETTING_LIST, temp);
    setAppSettings(temp);
    SweetAlertShowHideAdvanced("success", translation.SettingSaved);
  }

  function handleChangeOrgChart(e: any, checked: any) {
    setShowOrgChart(checked);
    let temp = { ...parsedData, ShowOrgChart: checked };
    updateSettingJson(SETTING_LIST, temp);
    setAppSettings(temp);
    setCommandBarItems({ShowOrgChart: checked})
    SweetAlertShowHideAdvanced("success", translation.SettingSaved);
  }

  const _onGRPChange = React.useCallback((e, checked?: boolean): void => {
    setGroupsChecked(checked);
    updateSettingJson(SETTING_LIST, { ...parsedData, GroupsOn: checked });
    setAppSettings({ ...parsedData, GroupsOn: checked });
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }, []);

  function handleChangeWFH(e: any, checked: any) {
    setShowWFH(checked);
    let temp = { ...parsedData, ShowWFH: checked };
    updateSettingJson(SETTING_LIST, temp);
    setAppSettings(temp);
    SweetAlertShowHideAdvanced("success", translation.SettingSaved);
  }

  function handleWeeklyWorkStatus(e: any, checked: any) {
    setWeekWorkStatus(checked);
    let temp = { ...parsedData, ShowWeekWorkStatus: checked };
    updateSettingJson(SETTING_LIST, temp);
    setAppSettings(temp);
    SweetAlertShowHideAdvanced("success", translation.SettingSaved);
  }

  async function handleUploadBithImg() {
    try {
      const response = await fetch(imageToCrop);
      const imgBlob = await response.blob();

      const base64Image = await convertToBase64(imgBlob);
      const setting = {...imagesList,BirthdayAndAnniversaryImage: base64Image};

      updateSettingJson(IMAGES_LIST, setting);
      setImagesList(setting);
      SweetAlertBirthAndAnnivSetting("success", translation.SettingSaved);
    } catch (error) {

      SweetAlertBirthAndAnnivSetting("success", "Something went wrong");
    }
  }
  function handleRemoveBithImg() {
    updateSettingJson(SETTING_LIST,{ ...appSettings, BirthdayAndAnniversaryImage: "" });
    setImageToCrop("");
    setShowBirthAnivImg("");
    SweetAlertBirthAndAnnivSetting("success", translation.SettingSaved);
  }

  function handleCustomHomePageUrl() {
    let temp = {
      ...appSettings,
      CustomHomePageUrl: {
        CustomHomePageLinkActive: customHomeUrlActive,
        homeCustomUrl: homeCustomUrl,
        homeCustomUrlIconName: homeCustomUrlIconName,
      },
    };

    updateSettingJson(SETTING_LIST, temp);
    setAppSettings(temp);
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }

  function handleOrgName() {
    let temp = { ...parsedData, OrgName: OrgName };
    updateSettingJson(SETTING_LIST, temp);
    setAppSettings(temp);
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }

  function handleChnageHideShowPronouns(e: any, checked: any) {
    setHideShowPronouns(checked);
    let temp = { ...appSettings, HideShowPronouns: checked };
    updateSettingJson(SETTING_LIST, temp);
    setAppSettings(temp);
    SweetAlertShowHideAdvanced("success", translation.SettingSaved);
  }

  async function handleSaveBrandLogo() {
    if (bLogo) {
      try {
        const response = await fetch(bLogo);
        const imgBlob = await response.blob();

        const base64Image = await convertToBase64(imgBlob);
        let temp = { ...imagesList, BrandLogo: base64Image };
        updateSettingJson(IMAGES_LIST, temp);
        setImagesList(temp);
        SweetAlertOutSidePanel("success", translation.SettingSaved);
      } catch (error) {
     
      }
    }
  }

  function handleRemoveBrandLogo() {
    let temp = { ...imagesList, BrandLogo: "" };
    updateSettingJson(IMAGES_LIST, temp);
    setImagesList(temp);
    setCroppedImage("");
    setBlogo("");
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }

  const [checkboxesChecked, setCheckboxesChecked] = useState({
    Title: true,
    WorkPhone: true,
    Mobile: true,
    EmployeeID: true,
    CostCenter: true,
    MemberOf: true,
    OwnerOf: true,
    ManagerOf: true,
    Email: true,
    Address: true,
    FloorSection: true,
    FloorName: true,
    BuildingID: true,
  });
  const [checkboxesListView, setCheckboxesListView] = useState({
    Department: true,
    WorkPhone: true,
    Mobile: true,
    Email: true,
    Manager: true,
    Address: true,
    FloorSection: true,
    FloorName: true,
    BuildingId: true,
    DateOfBirth: true,
    DateOfJoin: true,
    Projects: true,
    Skills: true,
    Hobbies: true,
  });

  const { changerecordtoLoadValue, checkboxesCheckedListView } = useStore();

  function handleSaveProfileIcon() {
    let temp = { ...parsedData, profileIconName: profileIconName };
    updateSettingJson(SETTING_LIST, temp);
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }

  const handleClick = (option: React.SetStateAction<string>) => {
    setSelectedOption(option);
    props.changeVariable(option);
  };

  const handleSaveSortBy = (selectedOption: any) => {
    const setting = { ...appSettings, sortby: selectedOption };
    if (Object.keys(setting).length > 0) {
      updateSettingJson(SETTING_LIST, setting);
      setAppSettings(setting);
      SweetAlertOutSidePanel("success", translation.SettingSaved);
    }
  };

  async function GetSettingData() {
    const settingJson = await getSettingJson(SETTING_LIST);
    const usersJson = await getSettingJson(USER_LIST);
    console.log("settingData",settingJson)
   

    if (Object.keys(usersJson)?.length) {
      setUsersList(usersJson);
    }

    if (Object.keys(settingJson)?.length) {
      parsedData = settingJson;
      setAppSettings(settingJson);
      previewBrandLogoImage = parsedData.BrandLogo;

      setSelectedExcludedDomian(parsedData?.ExcludeByDomain);

      setExecutive(parsedData?.Labels?.executive);
      setAboutMe(parsedData?.Labels?.aboutMe);
      let grpon = parsedData?.GroupsOn;
      if (grpon) {
        setGroupsChecked(grpon);
      } else {
        setGroupsChecked(false);
      }

      setfilterBirthdayData(appSettings.BirthAndAnivFilter);

      setProfileIconName(appSettings.profileIconName);

      setTopBarView(parsedData?.TopBarFilterView);

      if (parsedData?.EmpInfoAlignment) {
        setSelectedEmpInfoAlignment(parsedData?.EmpInfoAlignment);
      }
      // if (parsedData?.BrandLogo) {
        setBlogo(imagesList.BrandLogo);
      // }
      if (parsedData?.SyncUserInfoFrom) {
        setSyncUserInfo(parsedData?.SyncUserInfoFrom);
      }
      if (parsedData?.sortby) {
        setSelectedOption(parsedData?.sortby);
      }
      if (parsedData?.SelectedUpcomingBirthAndAniv) {
        setUpcomingBirthAndAnivAdv(parsedData?.SelectedUpcomingBirthAndAniv);
      }
      if (appSettings?.gridWidth) {
        setGridWidth(appSettings?.gridWidth);
      }
      if (parsedData?.ShowWeekWorkStatus) {
        setWeekWorkStatus(parsedData?.ShowWeekWorkStatus);
      }
      if (parsedData?.HideShowPronouns) {
        setHideShowPronouns(parsedData?.HideShowPronouns);
      }
      if (parsedData?.ShowWFH) {
        setShowWFH(parsedData?.ShowWFH);
      }

      if (parsedData?.showOrgChart) {
        setShowOrgChart(parsedData?.showOrgChart);
      }
      if (parsedData?.BirthAndAnivFilter) {
        setSelectedBithFilter(
          Object.keys(parsedData?.BirthAndAnivFilter).find(
            (key) => parsedData?.BirthAndAnivFilter[key] === true
          )
        );
      }
      if (settingJson?.AutoLoad) {
        setAutoLoad(settingJson?.AutoLoad);
      }
      if (parsedData?.dashboardFeature) {
        setDashboardFeature(parsedData?.dashboardFeature);
      }
      // if (parsedData?.dashboardAccessUsers?.length) {
      //   setDashboardIncludedUserTable(parsedData?.dashboardAccessUsers);
      //   setDashboardIncludedUser(parsedData?.dashboardAccessUsers);
      //   setDashboardIncludedUserTableShowData(parsedData?.dashboardAccessUsers);
      // }
      if (usersJson?.DashboardSpecificUsers) {
        setDashboardUsers(
          usersJson.DashboardSpecificUsers
        );
        setDashboardIncludedUserTableShowData(
          usersJson?.DashboardSpecificUsers
        );
      }
      if (parsedData?.showDashboard) {
        setShowDashboard(parsedData?.showDashboard);
      }
      if (parsedData?.BirthdayAndAnniversaryImage) {
        setShowBirthAnivImg(parsedData?.BirthdayAndAnniversaryImage);
      }
      if (parsedData?.hideShowViews) {
        setHideShowViews(parsedData?.hideShowViews);
      }
      if (parsedData?.clearAlphaFilter) {
        setClearAlphaFilter(parsedData?.clearAlphaFilter);
      }

      if (parsedData?.SelectedLanguage) {
        setSelectedLang(parsedData?.SelectedLanguage);
      }
      if (appSettings?.DefaultView) {
        setSelectedView(appSettings?.DefaultView);
        // setView()
      }
      if (parsedData?.defaultMobileView) {
        setSelectedMobileView(parsedData.defaultMobileView);
      }
      setBrowserLangDetectedLang(window.navigator.language);

      if (parsedData?.BrowserLanguageActive) {
        setBrowserLangDetectToggle(parsedData?.BrowserLanguageActive);
      }

      parsedData?.OrgName ? setOrgName(parsedData?.OrgName) : setOrgName("");

      if (
        parsedData?.Favicon?.url?.length &&
        parsedData?.Favicon?.isFavIconShow
      ) {
        setFavIcon(parsedData?.Favicon?.url);
        setShowFav(true);
      } else {
        setFavIcon("");
        setShowFav(false);
        removeFavicon();
      }

      if (
        parsedData?.CustomHomePageUrl?.CustomHomePageLinkActive !== undefined
      ) {
        setCustomHomeUrlActive(
          parsedData?.CustomHomePageUrl?.CustomHomePageLinkActive
        );
      }

      if (
        parsedData?.CustomHomePageUrl?.homeCustomUrl !== undefined &&
        parsedData?.CustomHomePageUrl?.homeCustomUrl?.trim() !== ""
      ) {
        setHomeCustomUrl(parsedData?.CustomHomePageUrl?.homeCustomUrl);
      }

      if (
        settingJson?.CustomHomePageUrl?.homeCustomUrlIconName !== undefined &&
        settingJson?.CustomHomePageUrl?.homeCustomUrlIconName?.trim() !== ""
      ) {
        setHomeCustomUrlIconName(
          settingJson?.CustomHomePageUrl?.homeCustomUrlIconName
        );
      }
      setDataLoaded(true);

      // parsedData?.BrandLogo ? setCroppedImage( parsedData?.BrandLogo) :setCroppedImage("");
      // logic for profileview checkboxes
      if (parsedData.ProfileViewPrope) {
        const updatedCheckboxesProfile = { ...checkboxesChecked };
        for (const key in parsedData.ProfileViewPrope) {
          if (key in updatedCheckboxesProfile) {
            updatedCheckboxesProfile[key] = parsedData.ProfileViewPrope[key];
          }
        }
        setCheckboxesChecked(updatedCheckboxesProfile);
        // changeCheckboxesChecked(updatedCheckboxesProfile);
      } else {
        setCheckboxesChecked(checkboxesChecked);
      
      }
      if (parsedData.ListViewPrope) {
        const updatedCheckboxes = { ...checkboxesCheckedListView };
        for (const key in parsedData.ListViewPrope) {
          if (key in updatedCheckboxes) {
            updatedCheckboxes[key] = parsedData.ListViewPrope[key];
          }
        }
        setCheckboxesListView(updatedCheckboxes);
      } else {
        setCheckboxesListView(checkboxesCheckedListView);
      }
      if (parsedData.orgChartType) {
        setSelectedOrgchart(parsedData.orgChartType);
      }
      if (parsedData.records_to_load) {
      
        setCheckedValueRecord(parsedData.records_to_load.toString());
      }
      if (parsedData.orgChartHead) {
        let userHead = userData?.find(
          (element) => element?.primaryEmail === parsedData.orgChartHead
        );
        setuserinput(userHead?.name?.fullName);
      }

      dynamicwidth = parsedData.gridWidth;
   
      setdivwidth(dynamicwidth);
      if (parsedData.sortby) {
        setSelectedOption(parsedData.sortby);
      } else {
        setSelectedOption(selectedOption);
      }
    } else {
      setCheckboxesChecked(checkboxesChecked);
      setCheckboxesListView(checkboxesListView);
      // setSelectedView(selectedView);
    }
  }

  const onCheckboxChangeUpcomingBirthAndAniv = (key) => (ev, checked) => {
    if (checked) {
      setUpcomingBirthAndAnivAdv(key);
    }
  };
  const onCheckboxChangeSyncUserInfo = (key) => (ev, checked) => {
    if (checked) {
      setSyncUserInfo(key);
    }
  };

  function handleUpcomingBirthAndAnivAdv() {
    const setting = {
      ...appSettings,
      SelectedUpcomingBirthAndAniv: upcomingBirthAndAnivAdv,
    };
    updateSettingJson(SETTING_LIST, setting);
    setAppSettings(setting);
    SweetAlertBirthAndAnnivSetting("success", translation.SettingSaved);
  }
  function handleSyncUserInfo() {
    const setting = { ...parsedData, SyncUserInfoFrom: syncUserInfo };
    updateSettingJson(SETTING_LIST, setting);
    setAppSettings(setting);
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }

  const handleViewsCheckboxChange = (view) => {
    setHideShowViews((prevState) => ({
      ...prevState,
      [view]: !prevState[view],
    }));
  };
  function handleSaveFiltersBirthAndAnniv() {
    const setting = { ...appSettings, BirthAndAnivFilter: filterBirthdayData };
    updateSettingJson(SETTING_LIST, setting);
    setAppSettings(setting);
    SweetAlertBirthAndAnnivSetting("success", translation.SettingSaved);
  }

  const handleBithAndAnivChange = (event: any, val: any) => {
    setSelectedBithFilter(event.target.name);

    let data = {};
    if (event.target.name == "currentDay") {
      data = {
        currentDay: val,
        currentWeekAndNextWeek: false,
        currentWeek: false,
        currentMonth: false,
        currentMonthAndNextMonth: false,
      };
    } else if (event.target.name == "currentWeek") {
      data = {
        currentDay: false,
        currentWeekAndNextWeek: false,
        currentWeek: val,
        currentMonth: false,
        currentMonthAndNextMonth: false,
      };
    } else if (event.target.name == "currentWeekAndNextWeek") {
      data = {
        currentDay: false,
        currentWeekAndNextWeek: val,
        currentWeek: false,
        currentMonth: false,
        currentMonthAndNextMonth: false,
      };
    } else if (event.target.name == "currentMonth") {
      data = {
        currentDay: false,
        currentWeekAndNextWeek: false,
        currentWeek: false,
        currentMonth: val,
        currentMonthAndNextMonth: false,
      };
    } else if (event.target.name == "currentMonthAndNextMonth") {
      data = {
        currentDay: false,
        currentWeekAndNextWeek: false,
        currentWeek: false,
        currentMonth: false,
        currentMonthAndNextMonth: val,
      };
    } else {
      data = {
        currentDay: true,
        currentWeekAndNextWeek: false,
        currentWeek: false,
        currentMonth: false,
        currentMonthAndNextMonth: false,
      };
    }
    setfilterBirthdayData(data);
  };

  function getFirstAvailableView(views) {
    if (views.grid) return "Grid";
    if (views.list) return "List";
    if (views.tile) return "Tile";
    return null;
  }

  function filterTrueValues(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => value === true)
    );
  }

  function updateDefaultViewIfNeeded(appSettings, hideShowViews) {
    const currentDefaultView = appSettings.DefaultView;
    const filteredHideShowViews = filterTrueValues(hideShowViews);
    const availableView = getFirstAvailableView(filteredHideShowViews);
    const isDefaultViewAvailable =
      filteredHideShowViews[currentDefaultView.toLowerCase()] === true;
    if (availableView && isDefaultViewAvailable) {
      return {
       ...appSettings,
        DefaultView: availableView,
        hideShowViews: hideShowViews,
      };
    } else {
      return {
      
        ...appSettings,
        DefaultView: getFirstAvailableView(filteredHideShowViews),
        hideShowViews: hideShowViews,
      };
    }
  }

  function isValidEmail(email) {
    // Simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // async function handleSaveImportSingleUser() {
  //   const newUserData = [formState];
  //   if(isEditImportUserPanel){

  //   }else{

  //   let existingUserData;
  //   try {
  //       existingUserData = JSON.parse(decryptData(appSettings?.Users));
  //   } catch (error) {
  //       console.error('Error parsing existing user data:', error);
  //       existingUserData = [];
  //   }

  //   if (!Array.isArray(existingUserData)) {
  //       existingUserData = [];
  //   }

  //   const existingUsers = [];
  //   const newUsersToImport = [];

  //   for (const newUser of newUserData) {

  //       if (!newUser.email || !isValidEmail(newUser.email)) {
  //         SweetAlertSingleUserUpload("info", 'Please enter a valid email');
  //         return;
  //       }

  //       if (!newUser.DOB || !newUser.DOJ) {
  //         SweetAlertSingleUserUpload("info", 'Please fill all user details');
  //         return;
  //       }

  //       const userExists = existingUserData.some(existingUser => existingUser.email === newUser.email);

  //       if (userExists) {
  //           existingUsers.push(newUser);
  //       } else {
  //           try {
  //               const id = await generateUniqueId(newUser.email);
  //               const userWithId = {
  //                   ...newUser,
  //                   id,
  //                   DOB: newUser.DOB ? convertToISO(newUser.DOB.toLocaleDateString()) : undefined,
  //                   DOJ: newUser.DOJ ? convertToISO(newUser.DOJ.toLocaleDateString()) : undefined
  //               };
  //               newUsersToImport.push(userWithId);
  //           } catch (error) {
  //               console.log('Error generating unique ID:', error);
  //           }
  //       }

  //   }

  //   if (existingUsers.length > 0) {
  //       SweetAlertSingleUserUpload("info", 'User already exists');
  //       return
  //   }

  //   if (newUsersToImport.length > 0) {
  //       const updatedUserData = existingUserData.concat(newUsersToImport);

  //       try {
  //           saveUpdatedUsers(updatedUserData);
  //           SweetAlertSingleUserUpload('success', 'Users added successfully');
  //       } catch (error) {
  //           console.log('Error saving updated user data:', error);
  //       }
  //   } else if (existingUsers.length === 0 && newUserData.length === 0) {
  //       SweetAlertSingleUserUpload('info', 'No user details provided');
  //   }
  // }
  // }

  async function handleSaveImportSingleUser() {
    let newUserData :any= formState;
    

    if (isEditImportUserPanel) {
       if(newUserData.DOB=="Invalid Date"){
        newUserData.DOB=null;
       }
       if(newUserData.DOJ=="Invalid Date"){
        newUserData.DOJ=null;
       }
      let updatedUsers=[];

      // let existingData=usersList?.Users??[];
      let existingData=usersList?.Users==""||usersList?.Users===undefined||usersList?.Users==null?[]:usersList?.Users;
      const userIndex = existingData.findIndex(
            (existingUser) => existingUser.id === newUserData.id
          );
         
          if (userIndex > -1) {
              
                let existingDOB=existingData[userIndex].DOB==""?null:existingData[userIndex].DOB
                let existingDOJ=existingData[userIndex].DOJ==""?null:existingData[userIndex].DOJ
                  const updatedUser = {
                    ...existingData[userIndex],
                    ...newUserData,
                    
      
                    DOB: newUserData.DOB
                      ? convertToISO(newUserData.DOB.toLocaleDateString())
                      : existingDOB,
                    DOJ: newUserData.DOJ
                      ? convertToISO(newUserData.DOJ.toLocaleDateString())
                      : existingDOJ,
                  };
                  updatedUsers.push(updatedUser);
                  let updatedUserData = existingData.map(
                        (user) =>
                          updatedUsers.find(
                            (updatedUser) => updatedUser.id === user.id
                          ) || user
                      );
                  
                   SweetAlertSingleUserUpload("success", "User updated successfully");
                   setTimeout(()=>{

                     setOpenImportUsersPanel(false)
                   },2000)
                   saveUpdatedUsers(updatedUserData)
                }


      // // Editing functionality
      // let existingUserData;
      // try {
      //   existingUserData = JSON.parse(decryptData(usersList?.Users));
      // } catch (error) {
      //   console.error("Error parsing existing user data:", error);
      //   existingUserData = [];
      // }

      // if (!Array.isArray(existingUserData)) {
      //   existingUserData = [];
      // }

      // const updatedUsers = [];
      // let userFound = false;

      // for (const newUser of newUserData) {
      //   if (!newUser.email || !isValidEmail(newUser.email)) {
      //     SweetAlertSingleUserUpload("info", "Please enter a valid email");
      //     return;
      //   }

      //   // if (!newUser.DOB || !newUser.DOJ) {
      //   //   SweetAlertSingleUserUpload("info", "Please fill all user details");
      //   //   return;
      //   // }

      //   const userIndex = existingUserData.findIndex(
      //     (existingUser) => existingUser.id === newUser.id
      //   );

      //   if (userIndex > -1) {
      //     userFound = true;
      //     try {
      //       const updatedUser = {
      //         ...existingUserData[userIndex],
      //         ...newUser,
              

      //         DOB: newUser.DOB
      //           ? convertToISO(newUser.DOB.toLocaleDateString())
      //           : existingUserData[userIndex].DOB,
      //         DOJ: newUser.DOJ
      //           ? convertToISO(newUser.DOJ.toLocaleDateString())
      //           : existingUserData[userIndex].DOJ,
      //       };
      //       updatedUsers.push(updatedUser);
      //     } catch (error) {
      //       console.log("Error updating user data:", error);
      //     }
      //   } else {
      //     SweetAlertSingleUserUpload("info", "User not found for editing");
      //     return;
      //   }
      // }

      // if (updatedUsers.length > 0) {
      //   const updatedUserData = existingUserData.map(
      //     (user) =>
      //       updatedUsers.find(
      //         (updatedUser) => updatedUser.email === user.email
      //       ) || user
      //   );

      //   try {
      //     saveUpdatedUsers(updatedUserData);
      //     SweetAlertSingleUserUpload("success", "User updated successfully");
      //   } catch (error) {
      //     console.log("Error saving updated user data:", error);
      //   }
      // }
    } else {

      let existingData=usersList?.Users==""||usersList?.Users===undefined||usersList?.Users==null?[]:usersList?.Users;
          if (!newUserData.email || !isValidEmail(newUserData.email)) {
                SweetAlertSingleUserUpload("info", "Please enter a valid email");
                return;
              }
              const id = await generateUniqueId(newUserData.email);
                    const userWithId = {
                      ...newUserData,
                      id,
                      DOB: newUserData.DOB
                        ? convertToISO(newUserData.DOB.toLocaleDateString())
                        : "",
                      DOJ: newUserData.DOJ
                        ? convertToISO(newUserData.DOJ.toLocaleDateString())
                        : "",
                        IsExternalUser:true,
                    };
                    existingData.push(userWithId)
                    if(existingData?.length){
                      saveUpdatedUsers(existingData)
                      
                      SweetAlertSingleUserUpload("success", "Users added successfully");
                    }

              
            
      // Adding new users functionality
      // let existingUserData;
      // try {
      //   existingUserData = usersList?.Users;
      // } catch (error) {
      //   console.log("Error parsing existing user data:", error);
      //   existingUserData = [];
      // }

      // if (!Array.isArray(existingUserData)) {
      //   existingUserData = [];
      // }

      // const existingUsers = [];
      // const newUsersToImport = [];

      // for (const newUser of newUserData) {
      //   if (!newUser.email || !isValidEmail(newUser.email)) {
      //     SweetAlertSingleUserUpload("info", "Please enter a valid email");
      //     return;
      //   }

      //   // if (!newUser.DOB || !newUser.DOJ) {
      //   //   SweetAlertSingleUserUpload("info", "Please fill all user details");
      //   //   return;
      //   // }

      //   const userExists = existingUserData.some(
      //     (existingUser) => existingUser.email === newUser.email
      //   );

      //   if (userExists) {
      //     existingUsers.push(newUser);
      //   } else {
      //     try {
      //       const id = await generateUniqueId(newUser.email);
      //       const userWithId = {
      //         ...newUser,
      //         id,
      //         DOB: newUser.DOB
      //           ? convertToISO(newUser.DOB.toLocaleDateString())
      //           : "",
      //         DOJ: newUser.DOJ
      //           ? convertToISO(newUser.DOJ.toLocaleDateString())
      //           : "",
      //       };
      //       newUsersToImport.push(userWithId);
      //     } catch (error) {
      //       console.log("Error generating unique ID:", error);
      //     }
      //   }
      // }

      // if (existingUsers.length > 0) {
      //   SweetAlertSingleUserUpload("info", "User already exists");
      //   return;
      // }

      // if (newUsersToImport.length > 0) {
      //   const updatedUserData = existingUserData.concat(newUsersToImport);

      //   try {
      //     saveUpdatedUsers(updatedUserData);
      //     SweetAlertSingleUserUpload("success", "Users added successfully");
      //   } catch (error) {
      //     console.log("Error saving updated user data:", error);
      //   }
      // } else if (existingUsers.length === 0 && newUserData.length === 0) {
      //   SweetAlertSingleUserUpload("info", "No user details provided");
      // }
    }
  }

  function saveUpdatedUsers(users) {
    users = removeDuplicatesFromObject(users, "email");
    
    setNonGoogleUsersData(users);
  
  

    updateSettingJson(USER_LIST,encryptData(JSON.stringify({
      ...usersList,
      Users:users,
    })));
    setUsersList({
      ...usersList,
      Users: users,
    });
    setFormState({
      name: "",
      email: "",
      firstName: "",
      lastName: "",
      manager: "",
      department: "",
      job: "",
      workphone: "",
      mobile: "",
      skills: "",
      projects: "",
      hobbies: "",
      school: "",
      About_Me: "",
      DOB: null,
      DOJ: null,
      id: null,
    })
  
  }

 async function handleShowHideViews() {
    let updateData = updateDefaultViewIfNeeded(appSettings, hideShowViews);
    setView(updateData.DefaultView);
   await updateSettingJson(SETTING_LIST, updateData);
    setAppSettings(updateData);
  
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }

 
  // function handleExcludeLoc() {
  //   if (selectedExcludedLoc?.length) {
  //     if (Object.keys(parsedData)?.length > 0) {
  //       let data = { ...parsedData, ExcludeByLocation: selectedExcludedLoc };
  //     
  //       setAppSettings(data);
  //       SweetAlertOutSidePanel("success", translation.SettingSaved);
  //     }
  //   } else {
  //     SweetAlertOutSidePanel("info", "Please select location(s)");
  //   }
  // }

  function handleExcludeEmail() {
    if (selectedExcludedEmail?.length) {
      if (Object.keys(parsedData)?.length > 0) {
        let data = { ...appSettings, ExcludedByEmail: selectedExcludedEmail };
        updateSettingJson(SETTING_LIST,data);
        setAppSettings(data);
        SweetAlertOutSidePanel("success", translation.SettingSaved);
      }
    } else {
      SweetAlertOutSidePanel("info", "Please select email(s)");
    }
  }

 
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

  async function updateSetting(uparsedData) {
    // console.log(uparsedData, "on update settings");
    // var _parsedData = JSON.stringify(uparsedData);
    // var domain = gapi.auth2
    //   .getAuthInstance()
    //   .currentUser.le.wt.cu.split("@")[1];
    // //console.log(domain);
    // var _domain = domain.replace(/\./g, "_");
    // var storagedetails =
    //   '[{"storageaccount":"mystorageaccountparj","containername":"parjinder1","blobfilename":"' +
    //   _domain +
    //   '.json"}]';
    // var mappedcustomcol = JSON.parse(storagedetails);
    // console.log(mappedcustomcol, "mapped");
    // await containerClient
    //   .getBlockBlobClient(mappedcustomcol[0].blobfilename)
    //   .upload(_parsedData, Buffer.byteLength(_parsedData))
    //   .then(() => {
    //     setTimeout(() => {
    //       dismissPanelUserPrtiesLV();
    //       dismissPanelUserPrtiesPCV();
    //       dismissPanelDfltViews();
    //       dismissPanelWidthCustm();
    //       dismissPanelExcldDept();
    //       dismissPanelExcldJtitle();
    //       dismissPanelOrgChartType();
    //       dismissPanelRecordLoad();
    //     }, 3000);
    //   });
  }

  const handleFileUploadDashboardUser = (e: any) => {
    const file = e.target.files[0];

    // Using FileReader to read file
    const reader: any = new FileReader();
    reader.onload = (event) => {
      const data: any = new Uint8Array(event.target.result as any);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setExcelDataDashboardUser(jsonData);


    };

    reader.readAsArrayBuffer(file);
  };

  function handleSaveCsvImportData() {
    if (excelDataDashboardUser?.length) {
      setDashboardUsers(excelDataDashboardUser);
      setDashboardIncludedUserTableShowData(excelDataDashboardUser);
      // setDashboardIncludedUserTable(excelDataDashboardUser);
      // setDashboardIncludedUser(excelDataDashboardUser);
      const res = excelDataDashboardUser.map((item) => {
        return { email: item.email, name: item?.name };
      });
      if (Object.keys(usersList)?.length > 0) {
        updateSettingJson(USER_LIST, encryptData(JSON.stringify({
          ...usersList,
          DashboardSpecificUsers: res,
        })));

        setUsersList({
          ...usersList,
          DashboardSpecificUsers: res,
        });
        SweetAlertDashboardPanel("success", translation.SettingSaved);
      }
    } else {
      SweetAlertDashboardPanel("info", "Please select file");
    }
  }

  const downloadTemplate = (csvData, fileName, sheetName) => {
    var workbook = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(csvData);
    XLSX.utils.book_append_sheet(workbook, ws, sheetName);
    XLSX.writeFile(workbook, `${fileName}` + ".xlsx", { type: "file" });
  };

  const [gridWidth, setGridWidth] = useState("150");

  function resetDefault() {
    const setting = { ...appSettings, gridWidth: 150 };
    updateSettingJson(SETTING_LIST, setting);
    setAppSettings(setting);
    setGridWidth("150");
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }

  const saveGridWidth = () => {
    const setting = { ...appSettings, gridWidth: gridWidth };
    updateSettingJson(SETTING_LIST, setting);
    setAppSettings(setting);
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  };

  const onfiltersChangePC = (checkboxName) => {
    setCheckboxesChecked((prevState) => ({
      ...prevState,
      [checkboxName]: !prevState[checkboxName],
    }));
  };

  const onfiltersChangeListView = (checkboxName) => {
    setCheckboxesListView((prevState) => ({
      ...prevState,
      [checkboxName]: !prevState[checkboxName],
    }));
  };

  const handleSaveListView = () => {
    const updatedParsedData = {
      ...appSettings,
      [KEY_NAME]: checkboxesListView,
    };
 
    if (Object.keys(appSettings).length > 0) {
      updateSettingJson(SETTING_LIST, updatedParsedData);
      SweetAlertListView("success", translation.SettingSaved);
    }
  };

  const handleSave = () => {
    let propertiesObj = {};
    profileCardPropertiesData?.map((item) => {
      propertiesObj[item?.key] = checkboxesChecked[item.key];
    });
    if (Object.keys(parsedData).length > 0) {
      const updatedParsedDataProfile = {
        ...appSettings,
        [KEY_NAME2]: propertiesObj,
      };
    
      updateSettingJson(SETTING_LIST, updatedParsedDataProfile);
      setAppSettings(updatedParsedDataProfile);
      SweetAlertProfileView("success", translation.SettingSaved);
    } else {
      SweetAlertProfileView("error", "Something went wrong");
  
    }
  };

  const onDragEnd = (result) => {
 
    if (!result.destination) return;

    const newOrder = Array.from(profileCardPropertiesData);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);

    setProfileCardPropertiesData(newOrder);
  };

  const handleCheckboxChange = (view) => {
    setSelectedView(view);
  };

  const handleCheckboxChangeMobileView = (view) => {
    setSelectedMobileView(view);
  };

  const { SweetAlert: SweetAlertDefaultMobileView } =
    SweetAlerts("#mobiledefaultview");
  const saveDefaultMobileView = () => {
    let temp = { ...appSettings, defaultMobileView: selectedMobileView };
    if (window.innerWidth < 768) {
      setView(selectedMobileView);
    }
    if (Object.keys(appSettings).length > 0) {
      updateSettingJson(SETTING_LIST, temp);
    }
    setAppSettings(temp);
    SweetAlertDefaultMobileView("success", translation.SettingSaved);
  };

  const saveDefaultView = () => {
    let temp = { ...appSettings, DefaultView: selectedView };
    setView(selectedView);
    if (Object.keys(temp).length > 0) {
      updateSettingJson(SETTING_LIST, temp);
      setAppSettings(temp);
      SweetAlertOutSidePanel("success", translation.SettingSaved);
    }
  };

  function onChangeDashboardFeature(
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) {
    const { title } = e.target;

    let tempdata = {
      ...dashboardFeature,
      AvailableForAll: title == "all" ? checked : false,
      AvaliableForSpecificUser: title == "selective" ? checked : false,
    };

    setDashboardFeature(tempdata);
  }

  function handleDashboardFeatureSave() {
    let setting = { ...appSettings, dashboardFeature: dashboardFeature };
    updateSettingJson(SETTING_LIST, setting);

    setAppSettings(setting);
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }

  const handleCheckboxChangeRecords = (event, fieldName) => {
    setCheckedValueRecord(fieldName);
  };

  const saveCountSettings = () => {
    changerecordtoLoadValue(parseInt(checkedValueRecord));
    const setting = {
      ...parsedData,
      ["records_to_load"]: checkedValueRecord,
    };
   
    updateSettingJson(SETTING_LIST, setting);
    setAppSettings(setting);
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  };

  async function getAllUsersInOrg(value: any) {
    let page: any = "";
    let pageToken = "";
    let staffList: any = [];

    do {
      page = await gapi.client.directory.users.list({
        customer: "my_customer",
        projection: "full",
        orderBy: "givenName",

        query: 'givenName="' + value + '"',
        //sortOrder: "descending",
        maxResults: 100,
        pageToken: pageToken,
      });

      staffList = staffList.concat(page.result.users);

      pageToken = page.nextPageToken;
    } while (pageToken);

    return staffList;
  }

  function filterByTaxonomySearchMulti(items: any) {
    var tempid = items.Id;
    var arr = [];
    if (items.name != null || items.name != "" || items.name != undefined) {
      setuserinput(items.name);
      managerEmail = items.email;
      setusermanager(managerEmail);
      // nonm365id=tempid;

      arr.push({ text: items.name, secondaryText: managerEmail });
      setusers(arr);
      // {items.Email};

      setshow365(false);
      // setsendData("true");
    }
  }

  const orgCharttype = (event: any, option: any) => {
    if (option) {
      setSelectedOrgchart(option.key);
      changeTypeOrg(option.key);
    }
  };

  function handleDashboardFeatureUserAdd() {
    // let data = dashboardIncludedUser;
    // data = removeDuplicatesFromObject(data, "email");
    // setDashboardIncludedUser(data);
    // setDashboardIncludedUserTable(data);
    // setDashboardIncludedUserTableShowData(data);
    // setDashboardFeatureAddBtnClick((prev) => prev + 1);
    let data = [...dashboardUsers];
    data = removeDuplicatesFromObject(data, "email");
    setDashboardIncludedUserTableShowData(data);
    updateSettingJson(USER_LIST, encryptData(JSON.stringify({
      ...usersList,
      DashboardSpecificUsers: data,
    })));

    setUsersList({
      ...usersList,
      DashboardSpecificUsers: data,
    });
    SweetAlertIncludeduserlist("success", translation.SettingSaved);
  }

  function deleteIncludedUserInDashboard(email) {
    if(isUserAdminCheck(dashboardUsers,email)){
      SweetAlertIncludeduserlist("info", 'Admin cannot remove itself');
    }else{
    // let data = dashboardIncludedUserTable.filter(
    //   (item) => item.email !== email
    // );
    let data = dashboardUsers.filter((item) => item.email !== email);

    setDashboardUsers(data);
    // setDashboardIncludedUserTable(data);
    // setDashboardIncludedUser(data);
    setDashboardIncludedUserTableShowData(data);
    updateSettingJson(USER_LIST, encryptData(JSON.stringify({
      ...usersList,
      DashboardSpecificUsers: data,

    })));

    setUsersList({
      ...usersList,
      DashboardSpecificUsers: data,
    });
    SweetAlertIncludeduserlist("success",translation.SettingSaved)
  }
  }

  function handleDashboardUserSearch(e) {
    const searchQuery = e.target.value.toLowerCase();
    setSearchUserForDashboardFeature(searchQuery);
    if (searchQuery == "") {
      setDashboardIncludedUserTableShowData(dashboardUsers);
    } else {
      const filteredUsers = dashboardUsers.filter((user) =>
        user?.name?.toLowerCase().includes(searchQuery)
      );
      setDashboardIncludedUserTableShowData(filteredUsers);
    }
  }


  const onUploadFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const image = reader.result;
        setimageCropper(true);
        setImageToCrop(image);
        setBlogo(image);
        setCropButton(true);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  useEffect(() => {
    const seenDepartments = new Set();
    userData.forEach((user) => {
      const userInfo = {
        label: user?.organizations[0]?.department,
        value: user?.organizations[0]?.department,
      };
      departmentList.push(userInfo);
    });
    departmentList = Object.values(
      departmentList.reduce((acc, cur) => {
        acc[cur.value] = cur;
        return acc;
      }, {})
    );
    userData?.forEach((user) => {
      const userInfo2 = {
        label: user?.organizations[0]?.title,
        value: user?.organizations[0]?.title,
      };

      jobTitleList?.push(userInfo2);
    });
    jobTitleList = Object.values(
      jobTitleList.reduce((acc, cur) => {
        acc[cur.value] = cur;
        return acc;
      }, {})
    );
  }, []);

  function getUserOrgWPItem(user: any) {
    if (user.hasOwnProperty("phones")) {
      const primaryOrg = user.phones.filter((x: any) => x.type === "work")[0]
        .value;

      return primaryOrg;
    } else {
      return "";
    }
  }

  function getUserOrgMBItem(user: any) {
    if (user.hasOwnProperty("phones")) {
      const primaryOrg = user.phones.filter((x: any) => x.type === "mobile")[0]
        .value;

      return primaryOrg;
    } else {
      return "";
    }
  }

  function getUserOrgMGItem(user: any) {
    if (user.hasOwnProperty("relations")) {
      const primaryOrg = user.relations.filter(
        (x: any) => x.type === "manager"
      )[0].value;

      return primaryOrg;
    } else {
      return "";
    }
  }

  function getUserOrgEIDItem(user: any) {
    if (user.hasOwnProperty("externalIds")) {
      const primaryOrg = user.externalIds.filter(
        (x: any) => x.type === "organization"
      )[0].value;

      return primaryOrg;
    } else {
      return "";
    }
  }

  function getUserOrgADDItem(user: any) {
    if (user.hasOwnProperty("addresses")) {
      const primaryOrg = user.addresses.filter((x: any) => x.type === "work")[0]
        .formatted;

      return primaryOrg;
    } else {
      return "";
    }
  }

  function getUserOrgLOCItem(user: any) {
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

  function getUserlist(text: any) {
    setuserinput(text.target.value);
    if (text.target.value.length > 3) {
      getAllUsersInOrg(text.target.value).then((item: any) => {
        if (typeof item[0] === "undefined") {
          optionList = [];
        } else {
          let staffMember = item.map((user: any) => {
            if (
              user.name.givenName != null &&
              user.name.givenName != undefined
            ) {
              var names = user.name.givenName.split(" "),
                initials = names[0].substring(0, 1).toUpperCase();
              if (names.length > 1) {
                initials += names[names.length - 1]
                  .substring(0, 1)
                  .toUpperCase();
              }
            }
            return {
              firstName: user.name.givenName,
              lastName: user.name.familyName,
              name: user.name.fullName,
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
              mobile: getUserOrgMBItem(user),
              manager: getUserOrgMGItem(user),
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
            };
          });
          finalDataNonM365 = staffMember.filter((obj: any, index: any) => {
            return (
              index === staffMember.findIndex((o: any) => obj.email === o.email)
            );
          });

          optionList = finalDataNonM365
            ? finalDataNonM365.map((items: any) => ({
                name: items.name,
                initials: items.initials,
                job: items.job,
                id: items.id,
                email: items.email?.toLowerCase(),
                location: items.location,
                department: items.department,
                image: "url(" + items.image + ")",
              }))
            : [];
          changeOrgChartHead(optionList[0].email);
          setTimeout(() => {
            setshow365(true);
          }, 1000);
        }
      });
    } else {
      optionList = [];
      setshow365(false);
    }
  }

  const saveOrgChart = () => {
    if (selectedOrgchart === "FullOrgCharts" && orgChartHead) {
      const updatedData = {
        ...parsedData,
        ["orgChartHead"]: orgChartHead,
        [KEY_NAME5]: selectedOrgchart,
      };

      if (Object.keys(parsedData).length > 0) {
        updateSettingJson(SETTING_LIST,updatedData);
      }
    } else if (selectedOrgchart === "StanderdOrgCharts") {
      const updatedParsedData = {
        ...parsedData,
        [KEY_NAME5]: selectedOrgchart,
      };
      if (Object.keys(parsedData).length > 0) {
        updateSettingJson(SETTING_LIST,updatedParsedData);
      }
      SweetAlertOutSidePanel("success", translation.SettingSaved);
    } else {
      SweetAlertOutSidePanel("error", "Something went wrong");
    }
  };

  function handleAutoLoad(e: any, checked: any) {
    setAutoLoad(checked);
    // if (Object.keys(parsedData)?.length > 0) {
   
    updateSettingJson(SETTING_LIST, { ...parsedData, AutoLoad: checked });
    setAppSettings({ ...parsedData, AutoLoad: checked });
    SweetAlertOutSidePanel("success", translation.SettingSaved);
    // }
  }

  async function handleSelect(item) {
    setDashboardUsers([...dashboardUsers, item]);

  }

  const handleLabelSave = () => {
    updateSettingJson(SETTING_LIST, {
      ...appSettings,
      Labels: { aboutMe, executive },
    });
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  };

  const handleChangeTopBarView = (e, val) => {
    const { title } = e.target;
    setTopBarView(title);
  };

  const handleSaveTopBarView = () => {
    const setting = {
      ...appSettings,
      TopBarFilterView: topBarView,
    };
   
    updateSettingJson(SETTING_LIST, setting);
    setAppSettings(setting);
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  };

  const [openAdditionalManagerSetting, setOpenAdditionalManagerSetting] =
    useState(false);

  const [restrictedPanel, setRestrictedPanel] = useState(false);
  const [hideManagerPanel, setHideManagerPanel] = useState(false);
  const [hideMobile, setHideMobile] = useState(false);

  useEffect(() => {
    GetSettingData();
  }, []);
  
  useEffect(() => {
    if (isOpenImportUsers) {
 
      setNonGoogleUsersData(usersList?.Users);
    }
  }, [isOpenImportUsers]);

  useEffect(() => {
    window.addEventListener("resize", changeView);
    function changeView() {
      if (window.innerWidth < 768) {
        let temp = { ...appSettings, defaultMobileView: selectedMobileView };

        setView(selectedMobileView);

        if (Object.keys(appSettings).length > 0) {
          updateSettingJson(SETTING_LIST, temp);
        }
      } else {
        setView(appSettings.DefaultView);
      
      }
    }

    return () => {
      window.removeEventListener("resize", changeView);
    };
  }, [window.innerWidth]);

  const generalSettingProps = {
    openBdayAnniTemplt,
    openPanelUpldLogo,
    setShowCollaborationPanel,
    setShowFilterAttributeModal,
    openPanelHomeCustm,
    setLangModel,
    openPanelOrgChartType,
    openPanelOrgName,
    openPanelProfileCustomUrlIcon,
    openPanelRecordLoad,
    openPanelRolePermission,
    openPanelSearchFltr,
    setIshowHideModuleOpen,
  };

  const viewSettingsProps = {
    OpenEmpInfoAlignModal,
    OpenPanelBdayAnniImg,
    OpenPanelClearAlphaFilter,
    openPanelDashboardFeaturePanel,
    openPanelDfltViews,
    openPanelWidthCustm,
    openPanelHideMngr,
    openPanelHideMobNo,
    openPanelImgPrfTag,
    setLabelModal,
    openPanelDefaultMobViews,
    setViewsSHMPanel,
    openPanelShortBy,
    openPanelUserPrtiesGV,
    openPanelUserPrtiesLV,
    openPanelUserPrtiesPCV,
    openModalViews,
    setHideManagerPanel,
    setHideMobile
  };

  const excludeOptionsSettingProps = {
    OpenExcludeDomain,
    openPanel3,
    openPanel5,
    openExcludeUserEmailListPanel,
    openPanel0,
    openExcludeUserLocListPanel,
    openExcludeUserContainsListPanel,
    openPanelExcldDept,
    openPanelExcldJtitle,
    openPanelExcldName,
    OpenExcludeLoc,
    openPanelExcldCSV,
    OpenExcludeEmail,
    OpenExcludeContains,
    openExcludeUserListPanel,
    openPanel2,
  };

  const advanceSettingProps = {
    OpenAutoLoad,
    openPanelCustomField,
    setTopBarModalVisible,
    setOpenExecutiveAssistantRelationship,
    OpenFilterBirthAndAniv,
    openPronouns,
    openImportUsers,
    isOpenShowGrp,
    setIshowHideModuleOpenAdvance,
    OpenUpcomingBithAndAnivAdv,
    OpenSyncUserFrom,
    openCustomFunctionPanel,
    setOpenCustomFunctionPanel,
    setOpenAdditionalManagerSetting,
    setRestrictedPanel,
  };

  const pagesProps = {
    setShowOrgChart: props.setShowOrgChart,
    setShowHomePage: props.setShowHomePage,
    filterByLetter: props.filterByLetter,
  };

  const SettingsComponent = {
    ...generalSettingProps,
    ...viewSettingsProps,
    ...excludeOptionsSettingProps,
    ...advanceSettingProps,
    ...pagesProps,
  };


  return (
    <div>
      <OrgChart
        isOpenOrgChartType={isOpenOrgChartType}
        dismissPanelOrgChartType={dismissPanelOrgChartType}
      />
      <SearchSettings {...SettingsComponent} />

      <ExecutiveAssistantRelationship
        isOpen={openExecutiveAssistantRelationship}
        onDismiss={setOpenExecutiveAssistantRelationship}
      />

      <CustomFunction
        isOpen={openCustomFunctionPanel}
        onDismiss={setOpenCustomFunctionPanel}
      />

      <FilterAttributes
        isOpen={showFilterAttributeModal}
        onDismiss={setShowFilterAttributeModal}
      />

      <AdditionalManager
        isOpen={openAdditionalManagerSetting}
        onDismiss={setOpenAdditionalManagerSetting}
      />

      <Collaboration
        isOpen={showCollaborationPanel}
        onDismiss={setShowCollaborationPanel}
      />

      <ViewsShowHideModule
        isOpen={ViewsSHMPanel}
        onDismiss={setViewsSHMPanel}
      />

   <GeneralShowHideModule
        isOpen={isShowHideModuleOpen}
        onDismiss={setIshowHideModuleOpen}
      />
     

      <RolesAndPermisstions
        isOpen={isOpenRolePermission}
        onDismiss={dismissPanelRolePermission}
      />

      <RestrictedAccess
        isOpen={restrictedPanel}
        onDismiss={setRestrictedPanel}
      />

      <HideManager isOpen={hideManagerPanel} onDismiss={setHideManagerPanel}/>
      <HideMobileNumber isOpen={hideMobile} onDismiss={setHideMobile}/>

      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={
          translation?.BirthdaysAndAnniv ?? "Birthdays and Work anniversaries"
        }
        isOpen={isOpenUpcomingBithAndAnivAdv}
        onDismiss={dismissUpcomingBithAndAnivAdv}
        closeButtonAriaLabel={"Close"}
      >
        <div id="birthAndAnnivSetting">
          <div style={{ borderBottom: "1px solid #ddd" }}>
            <Label>
              {translation?.UpcomingBirthdays ?? "Upcoming Birthdays and Work Anniversaries"}
            </Label>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                padding: "10px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2  , 1fr)",
                  gap: "10px",
                }}
              >
                <Checkbox
                  label="Google & Non-GUser"
                  style={{ whiteSpace: "nowrap" }}
                  checked={upcomingBirthAndAnivAdv === "Google & Imported User"}
                  onChange={onCheckboxChangeUpcomingBirthAndAniv(
                    "Google & Imported User"
                  )}
                />
                <Checkbox
                  label="Imported User"
                  style={{ whiteSpace: "nowrap" }}
                  checked={upcomingBirthAndAnivAdv === "importedUser"}
                  onChange={onCheckboxChangeUpcomingBirthAndAniv(
                    "importedUser"
                  )}
                />
              </div>

              <PrimaryButton
                onClick={handleUpcomingBirthAndAnivAdv}
                text={translation.save}
              />
            </div>
          </div>

          <div style={{ borderBottom: "1px solid #ddd" }}>
            <Label>Display birthdays and work anniversaries by</Label>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "10px",
                  padding: "10px",
                }}
              >
                {BirthAndAnivfilterOptions?.map((option, index) => (
                  <Checkbox
                    key={option.key}
                    label={option.text}
                    name={option.key}
                    value={option.key}
                    checked={selectedBithFilter === option.key}
                    onChange={(e, val) => handleBithAndAnivChange(e, val)}
                    className={`filter-checkbox ${
                      index == 1 ? "checkboxItem" : ""
                    }`}
                    style={{ whiteSpace: "nowrap", marginLeft: "34px" }}
                  />
                ))}
              </div>
              <div style={{ textAlign: "right", padding: "10px" }}>
                <PrimaryButton
                  onClick={handleSaveFiltersBirthAndAnniv}
                  text={translation.save}
                />
              </div>
            </div>
          </div>

          <div>
            <Label>
              {translation?.BdayAnniTempText ??
                "Birthdays and Work anniversaries image"}
            </Label>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <p>
                {translation?.BithandAnnivUploadNote ??
                  "Note: Please upload the logo if it is 338 x 120 px in size, maintaining the same aspect ratio. Use a transparent background or a background color for a better viewing experience."}
              </p>

              <input
                id="fileUploadforBith"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onUploadFile}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <PrimaryButton
                  text={translation.save}
                  // style={{ margin: "auto" }}
                  onClick={handleUploadBithImg}
                />
                <PrimaryButton
                  text={translation.Upload}
                  // style={{ margin: "auto" }}
                  onClick={() =>
                    document.getElementById("fileUploadforBith").click()
                  }
                />
                <PrimaryButton
                  text={translation.Remove}
                  // style={{ margin: "auto" }}
                  onClick={handleRemoveBithImg}
                />
              </div>
              {imageToCrop?.length || showBirthAnivImg?.length ? (
                <img
                  width={338}
                  height={120}
                  style={{ objectFit: "contain" }}
                  src={imageToCrop ?? showBirthAnivImg}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </Panel>


      <Panel
        type={PanelType.custom}
        customWidth="880px"
        headerText={translation.Customfields ?? "Custom fields"}
        isOpen={isOpenCustomField}
        onDismiss={dismissPanelCustomField}
        closeButtonAriaLabel={"Close"}
      >
        <Stack
          id="customFields"
          style={{ padding: "5px", display: "flex", flexDirection: "row" }}
        >
          <Pivot
            style={{ width: "100%" }}
            aria-label="Large Link Size Pivot Example"
          >
            <PivotItem
              headerText={
                translation.customproperties
                  ? translation.customproperties
                  : "Custom Properties"
              }
            >
              <Pivot
                style={{ paddingTop: "10px" }}
                styles={PivotStyles}
                aria-label="Large Link Size Pivot Example"
                linkSize="large"
              >
                <PivotItem
                  headerText={translation.add ? translation.add : "Add"}
                >
                  <CustomAdd
                    SweetAlertCustomFields={SweetAlertCustomFields}
                    dismiss={dismissPanelCustomField}
                  />
                </PivotItem>
                <PivotItem
                  headerText={
                    translation.delete ? translation.delete : "Delete"
                  }
                >
                  <CustomDelete
                    SweetAlertCustomFields={SweetAlertCustomFields}
                    SweetPromptCustomFieldsDelete={
                      SweetPromptCustomFieldsDelete
                    }
                    // dismiss={dismissPanelCustomField}
                  />
                </PivotItem>
              </Pivot>
            </PivotItem>
          </Pivot>
        </Stack>
      </Panel>

      {isOpenSyncUserFrom && (
        <MiniModals
          isPanel={false}
          crossButton={true}
          heading={"Sync user information from"}
          closeAction={dismissSyncUserFrom}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              gap: "20px",
              padding: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Checkbox
                label="Google & Imported User"
                checked={syncUserInfo === "Google & Imported User"}
                onChange={onCheckboxChangeSyncUserInfo(
                  "Google & Imported User"
                )}
              />
              <Checkbox
                label="Imported User"
                checked={syncUserInfo === "importedUser"}
                onChange={onCheckboxChangeSyncUserInfo("importedUser")}
              />
              {/* <Checkbox
                label="Both"
                checked={syncUserInfo === "Both"}
                onChange={onCheckboxChangeSyncUserInfo("Both")}
              /> */}
            </div>
            <PrimaryButton
              onClick={handleSyncUserInfo}
              style={{ margin: "auto" }}
              text={translation.save}
            />
          </div>
        </MiniModals>
      )}
      {/* 
      {isOpenUpcomingBithAndAnivAdv && (
        <MiniModals
          isPanel={false}
          crossButton={true}
          heading={"Upcoming bithday and anniversaries"}
          closeAction={dismissUpcomingBithAndAnivAdv}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              gap: "20px",
              padding: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Checkbox
                label="Google & Imported User"
                checked={upcomingBirthAndAnivAdv === "Google & Imported User"}
                onChange={onCheckboxChangeUpcomingBirthAndAniv("Google & Imported User")}
              />
              <Checkbox
                label="Imported User"
                checked={upcomingBirthAndAnivAdv === "importedUser"}
                onChange={onCheckboxChangeUpcomingBirthAndAniv("importedUser")}
              />
            </div>
            <PrimaryButton
              onClick={handleUpcomingBirthAndAnivAdv}
              style={{ margin: "auto" }}
              text={translation.save}
            />
          </div>
        </MiniModals>
      )} */}

      {isOpenModalShowGrp && (
        <MiniModals
          isPanel={false}
          crossButton={true}
          heading={"Groups"}
          closeAction={onDismissShowGrp}
        >
          <div>
            <div style={{ padding: "5px" }}>
              <div
                className="settingBlock"
                // style={{ marginTop: "2%" }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Label className="settingViewLabel">{"Show groups"}</Label>
                  <Toggle
                    title={"groups"}
                    onText={"On"}
                    offText={"Off"}
                    checked={GroupsChecked}
                    onChange={_onGRPChange}
                    role="checkbox"
                  />
                </div>
              </div>
            </div>
          </div>
        </MiniModals>
      )}

      {isOpenFilterBirthAndAniv && (
        <MiniModals
          heading={
            translation?.FltUpcmingBdAnni
              ? translation.FltUpcmingBdAnni
              : "Filter upcoming birthdays & work anniversaries"
          }
          isPanel={false}
          crossButton={true}
          closeAction={() => dismissFilterBirthAndAniv()}
        >
          <div>
            <div
              className="checkbox-group"
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "20px",
                padding: "10px",
              }}
            >
              {BirthAndAnivfilterOptions?.map((option) => (
                <Checkbox
                  label={option.text}
                  name={option.key}
                  value={option.key}
                  checked={selectedBithFilter === option.key}
                  onChange={(e: any, val: any) =>
                    handleBithAndAnivChange(e, val)
                  }
                  className="filter-checkbox"
                />
              ))}
            </div>
          </div>
        </MiniModals>
      )}

      {isOpenAutoLoad && (
        <MiniModals
          heading={
            translation?.autoload
              ? translation.autoload
              : "Auto load instead load more button"
          }
          isPanel={false}
          crossButton={true}
          closeAction={() => dismissAutoLoad()}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            <Label>
              {translation?.autoload
                ? translation.autoload
                : "Auto load instead load more button"}
            </Label>
            <Toggle
              checked={autoLoad}
              onChange={(e: any, checked: any) => handleAutoLoad(e, checked)}
              onText={translation.On}
              offText={translation.Off}
            />
          </div>
        </MiniModals>
      )}
      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={
          translation.ExcludeUserByLocation
            ? translation.ExcludeUserByLocation
            : "Exclude user by location"
        }
        isOpen={isOpenExcludeUserLocListPanel}
        onDismiss={dismissExcludeLocUserListPanel}
        closeButtonAriaLabel={"Close"}
      >
        <div id="excludedLocation">
          <ExcludedLocation
            locationOptions={locationOptions}
            appSettings={appSettings}
            setAppSettings={setAppSettings}
            SweetAlertLocation={SweetAlertLocation}
          />
        </div>
      </Panel>

      {/* {isOpenExcludeLoc && (
        <MiniModals
          heading={
            translation?.Exclude5
              ? translation.Exclude5
              : "Exclude user by location"
          }
          isPanel={false}
          crossButton={true}
          closeAction={() => dismissExcludeLoc()}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div style={{ width: "70%" }}>
              <Label
                className={EDStyles.underLineOnHover}
                onClick={openExcludeUserLocListPanel}
              >
                {" "}
                {translation.Excludeduserlist
                  ? translation.Excludeduserlist
                  : "Excluded user list"}
              </Label>
          
              <ReactSelect
                isMulti
                options={locationOptions}
                onChange={(excluded: any) => setSelectedExcludedLoc(excluded)}
                value={selectedExcludedLoc}
                 menuShouldScrollIntoView
                menuPosition="fixed"
                maxMenuHeight={150}
                // styles={mystyle}
              />
            </div>

            <PrimaryButton text="Exclude" onClick={handleExcludeLoc} />
          </div>
        </MiniModals>
      )} */}

      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={"Exclude user contains"}
        isOpen={isOpenExcludeUserContainsListPanel}
        onDismiss={dismissExcludeContainsUserListPanel}
        closeButtonAriaLabel={"Close"}
      >
        <div>
          <ExcludedContains
            appSettings={appSettings}
            setAppSettings={setAppSettings}
            SweetAlertContains={SweetAlertContains}
          />
        </div>
      </Panel>

      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={
          translation.Excludeduserlist
            ? translation.Excludeduserlist
            : "Excluded user list"
        }
        isOpen={isOpenExcludeUserEmailListPanel}
        onDismiss={dismissExcludeEmilUserListPanel}
        closeButtonAriaLabel={"Close"}
      >
        <div id="excludedEmail">
          <ExcludedEmail
            EmailOptions={EmailOptions}
            appSettings={appSettings}
            setAppSettings={setAppSettings}
            SweetAlertEmail={SweetAlertEmail}
          />
        </div>
      </Panel>

      {isOpenExcludeEmail && (
        <MiniModals
          heading={"Exclude user by email"}
          isPanel={false}
          crossButton={true}
          closeAction={() => dismissExcludeEmail()}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div style={{ width: "70%" }}>
              <Label
                className={EDStyles.underLineOnHover}
                onClick={openExcludeUserEmailListPanel}
              >
                {" "}
                {translation.Excludeduserlist
                  ? translation.Excludeduserlist
                  : "Excluded user list"}
              </Label>
              <Panel
                type={PanelType.custom}
                customWidth="650px"
                headerText={
                  translation.Excludeduserlist
                    ? translation.Excludeduserlist
                    : "Excluded user by email"
                }
                isOpen={isOpenExcludeUserEmailListPanel}
                onDismiss={dismissExcludeEmilUserListPanel}
                closeButtonAriaLabel={"Close"}
              >
                <div>
                  <ExcludedEmail
                    EmailOptions={EmailOptions}
                    appSettings={appSettings}
                    setAppSettings={setAppSettings}
                    SweetAlertEmail={SweetAlertEmail}
                  />
                </div>
              </Panel>
              <ReactSelect
                isMulti
                options={EmailOptions}
                onChange={(excluded: any) => setSelectedExcludedEmail(excluded)}
                value={selectedExcludedEmail}
                menuShouldScrollIntoView
                menuPosition="fixed"
                maxMenuHeight={150}
              />
            </div>

            <PrimaryButton text="Exclude" onClick={handleExcludeEmail} />
          </div>
        </MiniModals>
      )}

      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={
          translation.Excludedomains
            ? translation.Excludedomains
            : "Exclude domains"
        }
        isOpen={isOpenExcludeUserListPanel}
        onDismiss={dismissExcludeUserListPanel}
        closeButtonAriaLabel={"Close"}
      >
        <div id="domain">
          <div>
            <ExcludedDomain
              appSettings={appSettings}
              setAppSettings={setAppSettings}
              SweetAlertDomain={SweetAlertDomain}
              setSelectedExcludedDomian={setSelectedExcludedDomian}
              selectedExcludedDomian={selectedExcludedDomian}
              excludeOptionsForDomain={excludeOptionsForDomain}
            />
          </div>
        </div>
      </Panel>

      {topBarModalVisible && (
        <MiniModals
          isPanel={false}
          heading={
            translation.defaultviewTB
              ? translation.defaultviewTB
              : "Default view of topbar filters"
          }
          crossButton={true}
          closeAction={() => setTopBarModalVisible(false)}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "10px",
              }}
            >
              <Checkbox
                title="Department"
                onChange={(e, val) => handleChangeTopBarView(e, val)}
                checked={topBarView == "Department"}
                label="Department"
              />

              <Checkbox
                title="Hide"
                onChange={(e, val) => handleChangeTopBarView(e, val)}
                checked={topBarView == "Hide"}
                label="Hide"
              />
            </div>

            <div
              style={{
                marginTop: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PrimaryButton onClick={() => handleSaveTopBarView()}>
                Save
              </PrimaryButton>
            </div>
          </div>
        </MiniModals>
      )}

      {isOpenPanelDashboardFeaturePanel && (
        <MiniModals
          isPanel={false}
          heading={
            translation?.DBFeature ? translation.DBFeature : "Dashboard feature"
          }
          crossButton={true}
          closeAction={() => dismissDashboardFeaturePanel()}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center",
              gap: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Checkbox
                label={
                  translation.AvailableAllUsers
                    ? translation.AvailableAllUsers
                    : "Available for all user(s)"
                }
                title="all"
                checked={dashboardFeature?.AvailableForAll}
                onChange={(e: any, checked: any) =>
                  onChangeDashboardFeature(e, checked)
                }
              />
              <Checkbox
                label={
                  translation.AvailableSelectiveUsers
                    ? translation.AvailableSelectiveUsers
                    : "Available for selective user(s)"
                }
                checked={dashboardFeature?.AvaliableForSpecificUser}
                title="selective"
                onChange={(e: any, checked: any) =>
                  onChangeDashboardFeature(e, checked)
                }
              />
            </div>
            <div
              onClick={() => {
                OpenIncludeDashboardUserPanel();
              }}
            >
              <Label className={EDStyles.underLineOnHover}>Include User</Label>
            </div>
            <PrimaryButton
              text={translation.save}
              onClick={handleDashboardFeatureSave}
              style={{ margin: "auto" }}
            />
          </div>
        </MiniModals>
      )}

      {/* {isOpenPanelBdayAnniImg && (
        <MiniModals
          isPanel={false}
          width={"600px"}
          heading={
            translation?.BallonLabel
              ? translation.BallonLabel
              : "Birthdays and work anniversaries image"
          }
          crossButton={true}
          closeAction={() => dismissPaneBdayAnniImg()}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {imageToCrop?.length || showBirthAnivImg?.length ? (
              <img
                width={200}
                height={120}
                style={{ objectFit: "contain" }}
                src={imageToCrop ?? showBirthAnivImg}
              />
            ) : (
              "No Image uploaded"
            )}
            <input
              id="fileUploadforBith"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={onUploadFile}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <PrimaryButton
                text={translation.save}
                style={{ margin: "auto" }}
                onClick={handleUploadBithImg}
              />
              <PrimaryButton
                text={translation.Upload}
                style={{ margin: "auto" }}
                onClick={() =>
                  document.getElementById("fileUploadforBith").click()
                }
              />
              <PrimaryButton
                text={translation.Remove}
                style={{ margin: "auto" }}
                onClick={handleRemoveBithImg}
              />
            </div>
            <div style={{ fontSize: "12px", textAlign: "center" }}>
              <span style={{ color: "red" }}>
                {translation.note ? translation.note : "* Note"}
              </span>{" "}
              <span>
                {translation.maxDimensionsNote
                  ? translation.maxDimensionsNote
                  : " for best view, have max width 200px & max height 120px."}
              </span>
            </div>
          </div>
        </MiniModals>
      )} */}

      {isOpenModalViews && (
        <MiniModals
          isPanel={false}
          heading={translation.Views}
          crossButton={true}
          closeAction={() => dismissModalViews()}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                padding: "20px",
              }}
              className="p-10"
            >
              <Checkbox
                label={translation.Grid}
                checked={hideShowViews.grid}
                onChange={() => handleViewsCheckboxChange("grid")}
              />
              <Checkbox
                label={translation.List}
                checked={hideShowViews.list}
                onChange={() => handleViewsCheckboxChange("list")}
              />
              <Checkbox
                label={translation.Tile}
                checked={hideShowViews.tile}
                onChange={() => handleViewsCheckboxChange("tile")}
              />
            </div>
            <PrimaryButton
              text={translation.save}
              style={{ margin: "auto" }}
              onClick={handleShowHideViews}
            />
          </div>
        </MiniModals>
      )}

      {isOpenPanelClearAlphaFilter && (
        <MiniModals
          isPanel={false}
          heading={translation.Clearalphabet}
          crossButton={true}
          closeAction={() => dismissOpenPanelClearAlphaFilter()}
        >
          <div
            className={`${EDStyles.p10} flex`}
            style={{ justifyContent: "space-between" }}
            id="clearAlphabet"
          >
            <div className="flex" style={{ display: "flex", gap: "5px" }}>
              <Label>{translation.Clearalphabet}</Label>
              <TooltipHost
                content={
                  translation.Clearalphabet2
                    ? translation.Clearalphabet2
                    : "This setting will clear any alphabet selection to 'All' while clicking on the reset filter icon on the home page."
                }
                // id={tooltipIdclearfilter}
                calloutProps={calloutProps}
                styles={hostStyles}
              >
                <Icon iconName="info" />
              </TooltipHost>
            </div>
            <Toggle
              checked={clearAlphaFilter}
              onChange={(e: any, checked: any) =>
                onChangeClearAlphaFilter(e, checked)
              }
            />
          </div>
        </MiniModals>
      )}

      {LabelModal && (
        <MiniModals
          isPanel={false}
          heading={translation.Labels}
          crossButton={true}
          closeAction={() => setLabelModal(false)}
        >
          <div
            style={{ display: "flex", justifyContent: "center", gap: "20px" }}
          >
            <TextField
              label={translation.ExecutiveL}
              value={executive}
              onChange={(e: any) => setExecutive(e.target.value)}
            />
            <TextField
              label={translation.Aboutme}
              value={aboutMe}
              onChange={(e: any) => setAboutMe(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <PrimaryButton onClick={handleLabelSave}>Save</PrimaryButton>
          </div>
        </MiniModals>
      )}

      {isOpenEmpInfoAlignModal && (
        <MiniModals
          isPanel={false}
          heading={translation.PCAlignPosition}
          closeAction={() => dismissEmpInfoAlignModal()}
          crossButton={true}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              padding: "10px",
            }}
          >
            <div className="flex" style={{ justifyContent: "space-between" }}>
              <Checkbox
                label={translation.Left}
                checked={selectedEmpInfoAlignment === "Left"}
                onChange={() => onChangeInfoAlign("Left")}
              />
              <Checkbox
                label={translation.Center}
                checked={selectedEmpInfoAlignment === "Center"}
                onChange={() => onChangeInfoAlign("Center")}
              />
              <Checkbox
                label={translation.Right}
                checked={selectedEmpInfoAlignment === "Right"}
                onChange={() => onChangeInfoAlign("Right")}
              />
            </div>
            <div style={{ margin: "auto" }}>
              <PrimaryButton
                text={translation.save}
                onClick={handleChangeAlignMent}
              />
            </div>
          </div>
        </MiniModals>
      )}

      {isLangModel && (
        <MiniModals
          isPanel={false}
          width="570px"
          heading={
            translation.LanguagesText ? translation.LanguagesText : "Languages"
          }
          crossButton={true}
          closeAction={() => setLangModel(false)}
        >
          <div
            className={EDStyles.langContentStyle}
            style={{ flexDirection: "column", gap: "10px" }}
          >
            <div className={EDStyles.langContentStyle}>
              <Label>{translation.LanguageSelection}</Label>
              <Toggle
                checked={browserLangDetectToggle}
                offText={translation.show}
                onText={translation.hide}
                onChange={(e: any, checked: any) =>
                  onChangeAutoLangDetect(e, checked)
                }
              />
            </div>
            <div className={EDStyles.langContentStyle}>
              <Label>{translation.l6}</Label>
              <Dropdown
                placeholder={
                  translation.Selectanoption
                    ? translation.Selectanoption
                    : "Select an option"
                }
                options={LangOptions}
                selectedKey={selectLang.key}
                onChange={onLanguageChange}
              />
            </div>
            {/* <div style={{ margin: "auto" }}>
              <PrimaryButton
                text={translation.save ? translation.save : "save"}
                onClick={handleLanguageSave}
              />
            </div> */}
          </div>
        </MiniModals>
      )}

      {isopenPanelHomeCustm && (
        <MiniModals
          isPanel={false}
          crossButton={true}
          maxHeight={200}
          heading={
            translation.Customlink
              ? translation.Customlink
              : "Home page custom url"
          }
          closeAction={dismissPanelHomeCustm}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              padding: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Label>
                {translation.Customlink
                  ? translation.Customlink
                  : "Home page custom url"}
              </Label>
              <Toggle
                checked={customHomeUrlActive}
                onText={translation.show}
                offText={translation.hide}
                onChange={onChangeCustomLinkActive}
              />
            </div>
            {customHomeUrlActive && (
              <>
                <TextField
                  placeholder="https://contoso.com"
                  onChange={(e: any) => setHomeCustomUrl(e.target.value)}
                  value={homeCustomUrl}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Label>
                    {translation.CustomIcon
                      ? translation.CustomIcon
                      : "Home page custom url icon"}
                  </Label>
                </div>

                <TextField
                  onChange={(e: any) =>
                    setHomeCustomUrlIconName(e.target.value)
                  }
                  value={homeCustomUrlIconName}
                />
                <div style={{ margin: "10px auto" }}>
                  <PrimaryButton
                    text={translation.Save ? translation.Save : "Save"}
                    onClick={handleCustomHomePageUrl}
                  />
                </div>
              </>
            )}
          </div>
        </MiniModals>
      )}

      {isopenPanelOrgName && (
        <MiniModals
          isPanel={false}
          crossButton={true}
          maxHeight={200}
          heading={translation.OrganizationNameLabel ?? "Organization name"}
          closeAction={dismissPanelOrgName}
        >
          <div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Label>
                {translation.OrganizationNameLabel ?? "Organization name"}
              </Label>
              <TextField
                placeholder={
                  translation.OrganizationNameLabel ?? "Organization name"
                }
                onChange={(e: any) => setOrgName(e.target.value)}
                value={OrgName}
              />
              <div style={{ margin: "10px auto" }}>
                <PrimaryButton onClick={handleOrgName}>
                  {translation.Save ? translation.Save : "save"}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </MiniModals>
      )}

      {isbrandLogo && (
        <MiniModals
          isPanel={false}
          crossButton={true}
          maxHeight={200}
          heading={translation.brandlogo ?? "Brand Logo"}
          closeAction={dismissPanelUpldLogo}
        >
          {!isDataLoaded && false ? (
            <div className={wrapperClass}>
              <Shimmer />
              <Shimmer width="75%" />
              <Shimmer width="50%" />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {/* {bLogo?.length > 0 && ( */}
                <img
                  src={bLogo}
                  style={{
                    objectFit: "contain",
                    // border: "0.5px solid black",
                    height: "120px",
                    width: "200px",
                  }}
                />
              {/* )} */}

              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onUploadFile}
              />

              {/* {imageCropper && (
                  <div>
                    <ImageCropper
                      height={120}
                      width={200}
                      imageToCrop={imageToCrop}
                      onImageCropped={(croppedImage) =>
                        setCroppedImage(croppedImage)
                      }
                    />
                  </div>
                )} */}

              <div style={{ fontSize: "12px" }}>
                <span style={{ color: "red" }}>
                  {translation.note ? translation.note : "* Note"}
                </span>{" "}
                <span>
                  {translation.maxDimensionsNote
                    ? translation.maxDimensionsNote
                    : " for best view, have max width 200px & max height 120px."}
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <PrimaryButton text="Save" onClick={handleSaveBrandLogo} />
                <PrimaryButton
                  text={
                    translation.Uploadlogo
                      ? translation.Uploadlogo
                      : "Upload logo"
                  }
                  onClick={() => {
                    document.getElementById("fileUpload").click();
                  }}
                />

                <PrimaryButton
                  text={translation.Remove ? translation.Remove : "Remove"}
                  onClick={handleRemoveBrandLogo}
                />
              </div>

              {/* {!CropButton ? (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <PrimaryButton text="Save" onClick={handleSaveBrandLogo} />
                    <PrimaryButton
                      text={
                        translation.Uploadlogo
                          ? translation.Uploadlogo
                          : "Upload logo"
                      }
                      onClick={() => {
                        document.getElementById("fileUpload").click();
                      }}
                    />

                    <PrimaryButton
                      text={translation.Remove ? translation.Remove : "Remove"}
                      onClick={handleRemoveBrandLogo}
                    />
                  </div>
                ) : (
                  <PrimaryButton
                    className="fui-primaryButton"
                    onClick={async () => {
                      if (croppedImage != null) {
                        console.log(croppedImage, "crop");
                        previewBrandLogoImage = await convertToBase64(
                          croppedImage
                        );
                        setImageToCrop(undefined);
                        setimageCropper(false);
                        setCropButton(false);
                      }
                    }}
                  >
                    Crop
                  </PrimaryButton>
                )} */}
            </div>
          )}
        </MiniModals>
      )}

      {isOpenPanelProfileCustomUrlIcon && (
        <MiniModals
          isPanel={false}
          crossButton={true}
          maxHeight={500}
          heading={
            translation.profilecardcustomicon ?? "Profile card custom url icon"
          }
          closeAction={dismissPanelProfileCustomUrlIcon}
        >
          <div>
            <div>
              <Label>
                {translation.profilecardcustomicon ??
                  "Profile card custom url icon"}
              </Label>

              <TextField
                placeholder={
                  translation.iconName ? translation.iconName : "Icon Name"
                }
                value={profileIconName}
                onChange={(e: any) => setProfileIconName(e.target.value)}
              />
            </div>

            <div
              className="flex"
              style={{ width: "100%", margin: "10px auto" }}
            >
              <PrimaryButton
                className="m-auto"
                text={translation.Save ? translation.Save : "Save"}
                onClick={handleSaveProfileIcon}
              />
            </div>
          </div>
        </MiniModals>
      )}

      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={
          translation.Excludeduserlist
            ? translation.Excludeduserlist
            : "Excluded user list"
        }
        isOpen={isOpen0}
        onDismiss={dismissPanel0}
        closeButtonAriaLabel={"Close"}
      >
        <ExcludedName
          excludeByNameOptions={excludeByNameOptions}
          appSettings={appSettings}
          setAppSettings={setAppSettings}
          SweetAlertExcludeName={SweetAlertExcludeName}
        />
      </Panel>

      {isOpenOrgChartType && false && (
        <MiniModals
          isPanel={false}
          crossButton={true}
          heading={
            translation.OrganizationChartType
              ? translation.OrganizationChartType
              : "Organization chart type"
          }
          closeAction={dismissPanelOrgChartType}
        >
          <div>
            <Stack
              horizontal
              style={{
                display: "flex",
                flexDirection: "row",
                padding: "5px",
                marginTop: "12px",
              }}
            ></Stack>
            <Stack style={{ padding: "5px", marginTop: "10px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Label style={{ padding: "0px", fontWeight: 500 }}>
                    {translation.OrganizationChartType
                      ? translation.OrganizationChartType
                      : "Organization chart type"}
                  </Label>
                  {
                    <IconButton
                      id="orgchartclick"
                      style={{ height: "22px", marginLeft: "0px" }}
                      title={translation.orgChartNote}
                      //title={props.langcode.custom1?props.langcode.custom1:"Open you favourte tools / web apps from employee directory by placing hyperlink here."}{props.langcode.custom2?props.langcode.custom2:"You should see custom link icon on the action bar on top right side of the page."}
                      //onClick={toggleTeachingBubbleVisibleOrgChart}
                      iconProps={{ iconName: "Info" }}
                    />
                  }
                </div>
                <div style={{ width: "220px" }}>
                  <Dropdown
                    placeholder={translation.Selectanoption}
                    options={DropDownoptions}
                    onChange={(_ev, newVal) => orgCharttype(_ev, newVal)}
                    selectedKey={selectedOrgchart}
                  />
                </div>
              </div>

              {selectedOrgchart == "FullOrgCharts" && (
                <>
                  <div style={{ display: "flex", marginTop: "5px" }}>
                    <Label style={{ padding: "0px", fontWeight: 500 }}>
                      {translation.SelectHeadOrgChart
                        ? translation.SelectHeadOrgChart
                        : "Select the head of org chart"}
                    </Label>
                    <IconButton
                      id="headorgclick"
                      style={{ height: "22px", marginLeft: "0px" }}
                      title={translation.orgChartUpdateNote}
                      //title={props.langcode.custom1?props.langcode.custom1:"Open you favourte tools / web apps from employee directory by placing hyperlink here."}{props.langcode.custom2?props.langcode.custom2:"You should see custom link icon on the action bar on top right side of the page."}
                      onClick={toggleTeachingBubbleVisibleOrgChartTT}
                      iconProps={{ iconName: "Info" }}
                    ></IconButton>
                    <div style={{ width: 220 }}>
                      <TextField
                        type="text"
                        onChange={getUserlist}
                        value={userinput}
                      />
                      <div>
                        <React.Fragment>
                          <div
                            style={{
                              backgroundColor: "#fff",
                              borderRadius: "0px 0px 2px 2px",
                              maxHeight: "196px",
                              overflow: "auto",
                              boxShadow: "0px 0px 1px 0px",
                            }}
                          >
                            <div>
                              {show365user ? (
                                optionList?.length > 0 ? (
                                  optionList?.map((item2: any, key: any) => {
                                    return (
                                      <>
                                        <ul className="DBPPStyleUL">
                                          <li className="DBPPStyle">
                                            <div
                                              onClick={() =>
                                                filterByTaxonomySearchMulti(
                                                  item2
                                                )
                                              }
                                              style={{
                                                position: "relative",
                                                display: "flex",
                                              }}
                                            >
                                              <div
                                                style={{
                                                  backgroundImage: item2.image,
                                                  backgroundRepeat: "no-repeat",
                                                  width: "32px",
                                                  height: "32px",
                                                  position: "absolute",
                                                  borderRadius: "50%",
                                                  zIndex: 1,
                                                  backgroundPosition: "center",
                                                  backgroundSize: "cover",
                                                }}
                                              ></div>
                                              <Persona
                                                // imageUrl={user.manager.img}
                                                imageInitials={item2.initials}
                                                imageAlt={item2.initials}
                                                // presence={item1.presence}
                                                size={PersonaSize.size32}
                                              />
                                              <div>
                                                <div
                                                  style={{
                                                    color: "#333",
                                                    fontSize: "13px",
                                                  }}
                                                >
                                                  {item2.name}
                                                </div>
                                                <div
                                                  style={{
                                                    color: "#333",
                                                    fontSize: "12px",
                                                  }}
                                                >
                                                  {item2.job}
                                                </div>
                                              </div>
                                            </div>
                                          </li>
                                        </ul>
                                      </>
                                    );
                                  })
                                ) : (
                                  <div></div>
                                )
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </React.Fragment>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Stack>

            <div className={"orgchartenterusername"}>
              <Stack className={"usernamediv"}>
                <Stack
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: "5px",
                  }}
                >
                  <PrimaryButton onClick={saveOrgChart}>
                    {translation.save}
                    {loadingG8 && (
                      <div className={"elementToFadeInAndOut"}>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    )}
                  </PrimaryButton>
                </Stack>
              </Stack>
            </div>
          </div>
        </MiniModals>
      )}

      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={translation.Exclude2 || "Exclude user(s) by department"}
        isOpen={isOpen2}
        onDismiss={dismissPanel2}
        closeButtonAriaLabel={"Close"}
      >
        <div id="excludeDept">
          <Department
            appSettings={appSettings}
            setAppSettings={setAppSettings}
            departmentFields={departmentFields}
            SweetAlertExcludeDept={SweetAlertExcludeDept}
          />
        </div>
      </Panel>

      {/* {isOpenExcldDept && (
        <MiniModals
          isPanel={false}
          crossButton={true}
          heading={
            translation.Exclude2
              ? translation.Exclude2
              : "Exclude user by department"
          }
          closeAction={dismissPanelExcldDept}
        >
          <div style={{ position: "relative" }}>
            <Stack
              className="exclude-container"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "5px",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Stack className={"settingBlockSubDiv"}>
                <Stack>
                  <Stack>
                    <Label>
                      <Link onClick={openPanel2}>
                        {translation.Exclude2
                          ? translation.Exclude2
                          : "Exclude user by department"}
                      </Link>

                      <Panel
                        type={PanelType.custom}
                        customWidth="650px"
                        headerText={
                          translation.Excludeddepartmentslist
                            ? translation.Excludeddepartmentslist
                            : "Excluded departments list"
                        }
                        isOpen={isOpen2}
                        onDismiss={dismissPanel2}
                        closeButtonAriaLabel={"Close"}
                      >
                        <div id="excludeDept">
                          <Department
                            appSettings={appSettings}
                            setAppSettings={setAppSettings}
                            SweetAlertExcludeDept={SweetAlertExcludeDept}
                          />
                        </div>
                      </Panel>
                    </Label>
                  </Stack>
                </Stack>

                <Stack
                  horizontal
                  style={{ marginBottom: "2%", paddingTop: "1%" }}
                >
                  <Stack className={"eoDropdown"}>
                    <div className="excludeOptionsMultiSelect">
                      <ReactSelect
                        isMulti={true}
                        options={departmentFields}
                        value={selectedKeydept}
                        isClearable={true}
                       
                        maxMenuHeight={150}
                      
                      menuShouldScrollIntoView
                      menuPosition="fixed"
                      // menuShouldBlockScroll
                        // styles={mystyle}
                        onChange={(excluded: any) => setSelectedKeys1(excluded)}
                      />
                    </div>
                  </Stack>
                </Stack>
              </Stack>

              <PrimaryButton
                className={"settingBlockBtnDiv"}
                text={translation.Exclude}
                onClick={excdept}
              />
            </Stack>
          </div>
        </MiniModals>
      )} */}
      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={
          translation.ExcludeUserByJobTitle
            ? translation.ExcludeUserByJobTitle
            : "Exclude user by job title"
        }
        isOpen={isOpen3}
        onDismiss={dismissPanel3}
        // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
        closeButtonAriaLabel={"Close"}
      >
        <JTitle
          setAppSettings={setAppSettings}
          appSettings={appSettings}
          jobTitleFields={jobTitleFields}
          dismiss={dismissPanelExcldJtitle}
          SweetAlertJobTitle={SweetAlertJobTitle}
          //refreshOptions={refreshOptions}
          //langcode={props.langcode}
        />
      </Panel>

      {isOpenDfltViews && (
        <MiniModals
          isPanel={false}
          crossButton={true}
          heading={
            translation.Desktopdefaultview
              ? translation.Desktopdefaultview
              : "Desktop default view"
          }
          closeAction={dismissPanelDfltViews}
        >
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "26px",
                padding: "5px",
              }}
            >
              <Stack
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  padding: "5px",
                }}
              >
                <Stack className={"collCheckView"}>
                  <Checkbox
                    disabled={!appSettings.hideShowViews.grid}
                    label={translation.Grid}
                    title={translation.Grid}
                    checked={selectedView === "Grid"}
                    onChange={() => handleCheckboxChange("Grid")}
                  />
                </Stack>
                {
                  <Stack className={"collCheckView"}>
                    <Checkbox
                      disabled={!appSettings.hideShowViews.list}
                      label={translation.List}
                      title={translation.List}
                      checked={selectedView === "List"}
                      onChange={() => handleCheckboxChange("List")}
                    />
                  </Stack>
                }
                <Stack className={"collCheckView"}>
                  <Checkbox
                    disabled={!appSettings.hideShowViews.tile}
                    label={translation.Tile}
                    title={translation.Tile}
                    checked={selectedView === "Tile"}
                    onChange={() => handleCheckboxChange("Tile")}
                  />
                </Stack>
              </Stack>
              <Stack
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "5px",
                }}
              >
                <PrimaryButton onClick={() => saveDefaultView()}>
                  {translation.Save ? translation.Save : "Save"}
                </PrimaryButton>
              </Stack>
            </div>
          </div>
        </MiniModals>
      )}

      {isOpenPanelDefaultMobViews && (
        <MiniModals
          isPanel={false}
          crossButton={true}
          heading={translation.Mobiledefaultview || "Mobile default view"}
          closeAction={dismissPanelDefaultMobViews}
        >
          <div id="mobiledefaultview">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "26px",
                padding: "5px",
              }}
            >
              <Stack
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  padding: "5px",
                }}
              >
                <Stack className={"collCheckView"}>
                  <Checkbox
                    disabled={!appSettings.hideShowViews.grid}
                    label={translation.Grid}
                    title={translation.Grid}
                    checked={selectedMobileView === "Grid"}
                    onChange={() => handleCheckboxChangeMobileView("Grid")}
                  />
                </Stack>
                {
                  <Stack className={"collCheckView"}>
                    <Checkbox
                      disabled={!appSettings.hideShowViews.list}
                      label={translation.List}
                      title={translation.List}
                      checked={selectedMobileView === "List"}
                      onChange={() => handleCheckboxChangeMobileView("List")}
                    />
                  </Stack>
                }
                <Stack className={"collCheckView"}>
                  <Checkbox
                    disabled={!appSettings.hideShowViews.tile}
                    label={translation.Tile}
                    title={translation.Tile}
                    checked={selectedMobileView === "Tile"}
                    onChange={() => handleCheckboxChangeMobileView("Tile")}
                  />
                </Stack>
              </Stack>
              <Stack
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "5px",
                }}
              >
                <PrimaryButton onClick={() => saveDefaultMobileView()}>
                  {translation.Save ? translation.Save : "Save"}
                </PrimaryButton>
              </Stack>
            </div>
          </div>
        </MiniModals>
      )}

      {isModalOpen && (
        <MiniModals
          isPanel={false}
          crossButton={true}
          heading={translation.Sortby ? translation.Sortby : "Sort by"}
          closeAction={closeModal}
        >
          <div>
            <Stack
              style={{ display: "grid", gridTemplateColumns: "200px 1fr" }}
            >
              <Stack style={{ flex: "0 1 25%" }}>
                <Checkbox
                  label={
                    translation.FirstName1
                      ? translation.FirstName1
                      : "FirstName"
                  }
                  title={
                    translation.FirstName1
                      ? translation.FirstName1
                      : "FirstName"
                  }
                  checked={selectedOption === "givenName"}
                  onChange={() => handleClick("givenName")}
                />
              </Stack>
              <Stack style={{ flex: "0 1 33%" }}>
                <Checkbox
                  label={
                    translation.Lastname ? translation.Lastname : "Last Name"
                  }
                  title={
                    translation.Lastname ? translation.Lastname : "Last Name"
                  }
                  checked={selectedOption === "familyName"}
                  onChange={() => handleClick("familyName")}
                />
              </Stack>
            </Stack>
            <Stack
              style={{
                marginTop: "15px",
                display: "block",
                textAlign: "center",
              }}
            >
              <PrimaryButton
                onClick={() => {
                  handleSaveSortBy(selectedOption);
                }}
              >
                {translation.Save ? translation.Save : "save"}
              </PrimaryButton>
            </Stack>
          </div>
        </MiniModals>
      )}

      <Panel
        type={PanelType.custom}
        customWidth="650px"
        onOuterClick={() => {}}
        headerText={"Exclude user using csv file"}
        isOpen={isOpen5}
        onDismiss={dismissPanel5}
        closeButtonAriaLabel={"Close"}
      >
        <div id="excludedCsv">
          <Users
            openPanelCustomA={openPanelCustomA}
            dismiss={dismissPanel5}
            appSettings={appSettings}
            setAppSettings={setAppSettings}
            dismissModel={dismissPanelExcldCSV}
            SweetAlertExcludeCsv={SweetAlertExcludeCsv}
            /* refreshOptions={refreshOptions}
                          langcode={props.langcode} */
          />
        </div>
      </Panel>
      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={
          translation.sett5 ? translation.sett5 : "Exclude users using csv"
        }
        isOpen={isOpenCustomA}
        onDismiss={dismissPanelCustomA}
        closeButtonAriaLabel={"Close"}
      >
        <ExcludeCSV
          appSettings={appSettings}
          setAppSettings={setAppSettings}
          langcode={props.langcode}
          dismiss={dismissPanelCustomA}
          dismissModel={dismissPanelExcldCSV}
          SweetAlertCsvPanel={SweetAlertCsvPanel}
        />
      </Panel>

      {isOpenExcldCSV && (
        <MiniModals
          width={"550px"}
          isPanel={false}
          crossButton={true}
          heading={
            translation.sett
              ? translation.sett
              : "Exclude user by using csv file "
          }
          closeAction={dismissPanelExcldCSV}
        >
          <div>
            <Stack
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "5px",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Stack className={"settingBlockSubDiv"}>
                <Stack className={"settingBlockLeftDiv"}>
                  <Stack className={"settingBlockLabel"}>
                    <Label>
                      {translation.sett
                        ? translation.sett
                        : "Exclude user by using csv file "}
                    </Label>
                  </Stack>
                  <Stack>
                    <Label className={"settingBlockLink"}>
                      <Link onClick={openPanel5}>
                        {translation.Excludedcsvlist
                          ? translation.Excludedcsvlist
                          : "Excluded csv list"}
                      </Link>
                      <Panel
                        type={PanelType.custom}
                        customWidth="650px"
                        headerText={
                          translation.Excludeduserlist
                            ? translation.Excludeduserlist
                            : "Excluded user list"
                        }
                        isOpen={isOpen5}
                        onDismiss={dismissPanel5}
                        closeButtonAriaLabel={"Close"}
                      >
                        <div id="excludedCsv">
                          <Users
                            dismiss={dismissPanel5}
                            appSettings={appSettings}
                            setAppSettings={setAppSettings}
                            dismissModel={dismissPanelExcldCSV}
                            SweetAlertExcludeCsv={SweetAlertExcludeCsv}
                            /* refreshOptions={refreshOptions}
                          langcode={props.langcode} */
                          />
                        </div>
                      </Panel>
                    </Label>
                  </Stack>
                </Stack>
              </Stack>

              <PrimaryButton
                className={"settingBlockBtnmtoDivED"}
                text={translation.Upload ? translation.Upload : "Upload"}
                onClick={openPanelCustomA}
              />
              <Panel
                type={PanelType.custom}
                customWidth="650px"
                headerText={
                  translation.sett5
                    ? translation.sett5
                    : "Exclude users using csv"
                }
                isOpen={isOpenCustomA}
                onDismiss={dismissPanelCustomA}
                closeButtonAriaLabel={"Close"}
              >
                <ExcludeCSV
                  appSettings={appSettings}
                  setAppSettings={setAppSettings}
                  langcode={props.langcode}
                  dismiss={dismissPanelCustomA}
                  dismissModel={dismissPanelExcldCSV}
                />
              </Panel>
            </Stack>
          </div>
        </MiniModals>
      )}

      {isOpenWidthCustm && (
        <MiniModals
          isPanel={false}
          crossButton={true}
          heading={translation.Gridwidth ? translation.Gridwidth : "Grid width"}
          closeAction={dismissPanelWidthCustm}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <input
                  style={{
                    maxWidth: "100px",
                    textAlign: "right",
                    padding: "5px 0",
                  }}
                  onChange={(e) => setGridWidth(e.target.value as string)}
                  type="Number"
                  value={gridWidth}
                  min={150}
                  max={400}
                />
                <span style={{ color: "black", marginLeft: "5px" }}>px</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <PrimaryButton onClick={resetDefault}>
                  {translation.Resetbtnwidth
                    ? translation.Resetbtnwidth
                    : "Reset to default"}
                </PrimaryButton>
                <PrimaryButton onClick={saveGridWidth}>
                  {translation.Save ? translation.Save : "save"}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </MiniModals>
      )}

      <Panel
        type={PanelType.custom}
        customWidth="540px"
        headerText={
          translation.Userprocard
            ? translation.Userprocard
            : "User properties in profile card"
        }
        isOpen={isOpenUserPrtiesPCV}
        onDismiss={dismissPanelUserPrtiesPCV}
        closeButtonAriaLabel={"Close"}
      >
        <div id="ProfileView">
          <Icon
            iconName="save"
            onClick={handleSave}
            style={{
              position: "fixed",
              right: "60px",
              top: "16px",
              color: "white",
              cursor: "pointer",
            }}
          />

          <div>
            <Stack style={{ display: "flex", gap: "10px", padding: "10px 0" }}>
              <div>
                {profileCardPropertiesData.map(
                  ({ key, label, title }, index) => (
                    <div
                      key={key}
                      style={{
                        padding: "10px 0",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <Checkbox
                        label={label}
                        title={title}
                        checked={checkboxesChecked[key]}
                        onChange={() => onfiltersChangePC(key)}
                      />
                      {/* <Separator className="separator" /> */}
                    </div>
                  )
                )}
              </div>
            </Stack>
          </div>
        </div>
      </Panel>

      <Panel
        type={PanelType.custom}
        customWidth="540px"
        headerText={
          translation.Userprogrid
            ? translation.Userprogrid
            : "User properties in grid view"
        }
        isOpen={isOpenUserPrtiesGV}
        onDismiss={dismissPanelUserPrtiesGV}
        closeButtonAriaLabel={"Close"}
      >
        <div>
          <div>
            <UserPropsGridView
              SweetAlertGridView={SweetAlertGridView}
              Dismisspanel={dismissPanelUserPrtiesGV}
            />
          </div>
        </div>
      </Panel>

      <Panel
        type={PanelType.custom}
        customWidth="540px"
        headerText={
          translation.Userprolist
            ? translation.Userprolist
            : "User properties in List view"
        }
        isOpen={isOpenUserPrtiesLV}
        onDismiss={dismissPanelUserPrtiesLV}
        closeButtonAriaLabel={"Close"}
      >
        <div id="ListView">
          <Icon
            iconName="save"
            onClick={handleSaveListView}
            style={{
              position: "fixed",
              right: "60px",
              top: "16px",
              color: "white",
              cursor: "pointer",
            }}
          />

          <div>
            <Stack style={{ display: "flex", width: "100%" }}>
              <Stack className="filterChecks">
                <Checkbox
                  label={translation.Department}
                  title={translation.Department}
                  checked={checkboxesListView["Department"]}
                  onChange={() => onfiltersChangeListView("Department")}
                />
              </Stack>
              <Stack className="filterChecks" style={{}}>
                <Checkbox
                  label={
                    translation.Workphone ? translation.Workphone : "Work Phone"
                  }
                  title={
                    translation.Workphone ? translation.Workphone : "Work Phone"
                  }
                  checked={checkboxesListView["WorkPhone"]}
                  onChange={() => onfiltersChangeListView("WorkPhone")}
                />
              </Stack>
              <Stack className="filterChecks">
                <Checkbox
                  label={translation.Mobile}
                  title={translation.Mobile}
                  checked={checkboxesListView["Mobile"]}
                  onChange={() => onfiltersChangeListView("Mobile")}
                />
              </Stack>
              <Stack className="filterChecks">
                <Checkbox
                  label={translation.Emails}
                  title={translation.Emails}
                  checked={checkboxesListView["Email"]}
                  onChange={() => onfiltersChangeListView("Email")}
                />
              </Stack>
              {
                <Stack className="filterChecks">
                  <Checkbox
                    label={translation.Manager}
                    title={translation.Manager}
                    checked={checkboxesListView["Manager"]}
                    onChange={() => onfiltersChangeListView("Manager")}
                  />
                </Stack>
              }
              {
                <Stack className="filterChecks" style={{}}>
                  <Checkbox
                    label={translation.address}
                    title={translation.address}
                    checked={checkboxesListView["Address"]}
                    onChange={() => onfiltersChangeListView("Address")}
                  />
                </Stack>
              }
              {
                <Stack className="filterChecks" style={{}}>
                  <Checkbox
                    label={translation.floorSection}
                    title={translation.floorSection}
                    checked={checkboxesListView["FloorSection"]}
                    onChange={() => onfiltersChangeListView("FloorSection")}
                  />
                </Stack>
              }
              {
                <Stack className="filterChecks" style={{}}>
                  <Checkbox
                    label={translation.floorName}
                    title={translation.floorName}
                    checked={checkboxesListView["FloorName"]}
                    onChange={() => onfiltersChangeListView("FloorName")}
                  />
                </Stack>
              }
              {
                <Stack className="filterChecks" style={{}}>
                  <Checkbox
                    label={translation.buildingId}
                    title={translation.buildingId}
                    checked={checkboxesListView["BuildingId"]}
                    onChange={() => onfiltersChangeListView("BuildingId")}
                  />
                </Stack>
              }
              <Stack className="filterChecks" style={{}}>
                <Checkbox
                  label={translation.Dateofbirth}
                  title={translation.Dateofbirth}
                  checked={checkboxesListView["DateOfBirth"]}
                  onChange={() => onfiltersChangeListView("DateOfBirth")}
                />
              </Stack>
              {
                <Stack
                  className="filterChecks"
                  style={{ whiteSpace: "nowrap", textOverflow: "clip" }}
                >
                  <Checkbox
                    label={translation.DateofJoining}
                    title={translation.DateofJoining}
                    checked={checkboxesListView["DateOfJoin"]}
                    onChange={() => onfiltersChangeListView("DateOfJoin")}
                  />
                </Stack>
              }
              {
                <Stack className="filterChecks" style={{}}>
                  <Checkbox
                    label={translation.Projects}
                    title={translation.Projects}
                    checked={checkboxesListView["Projects"]}
                    onChange={() => onfiltersChangeListView("Projects")}
                  />
                </Stack>
              }
              {
                <Stack className="filterChecks" style={{}}>
                  <Checkbox
                    label={translation.Skills}
                    title={translation.Skills}
                    checked={checkboxesListView["Skills"]}
                    onChange={() => onfiltersChangeListView("Skills")}
                  />
                </Stack>
              }
              {
                <Stack className="filterChecks" style={{}}>
                  <Checkbox
                    label={translation.Hobbies}
                    title={translation.Hobbies}
                    checked={checkboxesListView["Hobbies"]}
                    onChange={() => onfiltersChangeListView("Hobbies")}
                  />
                </Stack>
              }
            </Stack>
          </div>
        </div>
      </Panel>

      <Panel
        type={PanelType.custom}
        layerProps={{ eventBubblingEnabled: true }}
        customWidth="540px"
        headerText={translation.Searchfilters ?? "Search filters"}
        isOpen={isOpenSearchFltr}
        onDismiss={dismissPanelSearchFltr}
        closeButtonAriaLabel={"Close"}
      >
        <div id="SearchFltr">
          <Stack>
            <SearchFilter
              SweetAlertSearchFilter={SweetAlertSearchFilter}
              dismiss={dismissPanelSearchFltr}
            />
          </Stack>
        </div>
      </Panel>

      {isOpenRecordLoad && (
        <MiniModals
          isPanel={false}
          crossButton={true}
          heading={translation.Recordstoload ?? "Records to load"}
          closeAction={dismissPanelRecordLoad}
        >
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "26px",
                padding: "5px",
              }}
            >
              <div className={"recordsload"}>
                <div style={{ display: "flex" }}>
                  <Label
                    className={"settingViewLabel"}
                    style={{ paddingTop: "0px" }}
                  >
                    {translation.Recordstoload ?? "Records to load"}
                  </Label>
                  <IconButton
                    id="records"
                    style={{ height: "22px" }}
                    title={translation.Advance12}
                    //title={props.langcode.custom1?props.langcode.custom1:"Open you favourte tools / web apps from employee directory by placing hyperlink here."}{props.langcode.custom2?props.langcode.custom2:"You should see custom link icon on the action bar on top right side of the page."}
                    // onClick={toggleTeachingBubbleVisibleG8}
                    iconProps={{ iconName: "Info" }}
                  ></IconButton>
                </div>
                <div
                  style={{
                    display: "flex",

                    justifyContent: "space-between",
                  }}
                >
                  <Stack>
                    <Checkbox
                      label="25"
                      title={translation.Records3}
                      checked={checkedValueRecord === "25"}
                      onChange={(event) =>
                        handleCheckboxChangeRecords(event, "25")
                      }
                    />
                  </Stack>
                  {
                    <Stack>
                      <Checkbox
                        label="50"
                        title={translation.Records1}
                        checked={checkedValueRecord === "50"}
                        onChange={(event) =>
                          handleCheckboxChangeRecords(event, "50")
                        }
                      />
                    </Stack>
                  }
                  {
                    <Stack>
                      <Checkbox
                        label="100"
                        title={translation.Records2}
                        checked={checkedValueRecord === "100"}
                        onChange={(event) =>
                          handleCheckboxChangeRecords(event, "100")
                        }
                      />
                    </Stack>
                  }
                </div>
              </div>

              <Stack style={{ display: "block", textAlign: "center" }}>
                <PrimaryButton onClick={saveCountSettings}>save</PrimaryButton>
              </Stack>
            </div>
          </div>
        </MiniModals>
      )}

      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={"Edit users via excel sheet"}
        isOpen={isOpenNonM365Users}
        onDismiss={dismissPanelNonM365Users}
        closeButtonAriaLabel={"Close"}
      >
        <Stack style={{ padding: "5px" }}>
          <BulkUpload dismiss={dismissPanelNonM365Users} />
        </Stack>
      </Panel>

      <Panel
        type={PanelType.custom}
        customWidth="750px"
        headerText={
          translation.Advance8 ?? "Birthday and anniversary templates"
        }
        isOpen={isOpenBdayAnniTemplt}
        onDismiss={dismissBdayAnniTemplt}
        closeButtonAriaLabel={translation.Close ? translation.Close : "Close"}
      >
        <div>
          <Stack horizontal>
            <div style={{ padding: "5px", width: "100%" }}>
              <Pivot aria-label="Large Link Size Pivot Example">
                <PivotItem
                  headerText={
                    translation.Birthdaytemplate ?? "Birthday template"
                  }
                >
                  <BirthdayTemplate
                    SweetAlertEmailTemp={SweetAlertEmailTemp}
                    appSettings={appSettings}
                    setAppSettings={setAppSettings}
                  />
                </PivotItem>
                <PivotItem
                  headerText={
                    translation.Anniversarytemplate ?? "Anniversary template"
                  }
                >
                  <AnniversaryTemplate
                    SweetAlertEmailTemp={SweetAlertEmailTemp}
                    appSettings={appSettings}
                    setAppSettings={setAppSettings}
                  />
                </PivotItem>
              </Pivot>
            </div>
          </Stack>
        </div>
      </Panel>

      {isOpenImgPrfTag && (
        <Panel
          type={PanelType.custom}
          customWidth="650px"
          headerText={
            translation.Imageprofiletag
              ? translation.Imageprofiletag
              : "Image profile tag"
          }
          isOpen={isOpenImgPrfTag}
          onDismiss={dismissPanelImgPrfTag}
          closeButtonAriaLabel={"Close"}
        >
          <div id="ImgPrfTag">
            <ImageTag
              SweetAlertImgProfilePanel={SweetAlertImgProfilePanel}
              props={props}
            />
          </div>
        </Panel>
      )}

      <Panel
        isOpen={isOpenIncludeDashboardUserPanel}
        headerText="Included user list"
        onDismiss={() => dismissIncludeDashboardUserPanel()}
        onOuterClick={() => {}}
        type={PanelType.custom}
        customWidth="650px"
        closeButtonAriaLabel={"Close"}
      >
        <div id="Includeduserlist">
          <div>
            <Label>{translation.SearchforUser}</Label>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <TextField
                placeholder="Search User"
                onChange={(e: any) => handleDashboardUserSearch(e)}
                value={searchUserForDashboardFeature}
              />
              <Label
                className={EDStyles.underLineOnHover}
                onClick={() => setOpenDashboardUserCsv(true)}
              >
                {translation.ImportASAUsers}
              </Label>
            </div>
          </div>
          <div>
            <Label>
              {translation.IncludeUser
                ? translation.IncludeUser
                : "Include user"}
            </Label>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <div style={{ flex: "2" }}>
                {/* <CustomPeoplePicker
                    user={props.UserArray}
                    dashboardFeatureAddBtnClick={dashboardFeatureAddBtnClick}
                    onUserSelect={setDashboardIncludedUser}
                    dashboardIncludedUser={dashboardIncludedUser}
                    dashboardIncludedUserTable={dashboardIncludedUserTable}
                  /> */}
                <UserSearchBox
                  options={transformUserDataToFomat(props.UserArray)}
                  onSelect={handleSelect}
                  placeholder={
                    translation.SearchUser
                      ? translation.SearchUser
                      : "Search user"
                  }
                
                />
              </div>
              <PrimaryButton
                text="Add"
                onClick={handleDashboardFeatureUserAdd}
              />
            </div>
          </div>
          <div>
            <table className={EDStyles.excludeTable}>
              <thead>
                <tr>
                  <th>{translation.Email ? translation.Email : "Email"}</th>
                  <th>{translation ? translation.Status : "Status"}</th>
                  <th>{translation.Delete ? translation.Delete : "Delete"}</th>
                </tr>
              </thead>
              {true ? (
                <tbody>
                  {dashboardIncludedUserShowData?.map((x, index) => {
                    return (
                      <tr>
                        <td>{x.email}</td>
                        <td>{"Included"}</td>
                        <td>
                          <Icon
                            onClick={() =>
                              deleteIncludedUserInDashboard(x.email)
                            }
                            title={
                              translation.Delete ? translation.Delete : "Delete"
                            }
                            style={{ marginLeft: "12px", cursor: "pointer" }}
                            iconName="Delete"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan={3}>
                      {translation.NoRecordsFound
                        ? translation.NoRecordsFound
                        : "No Records Found"}
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>
      </Panel>

      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={"Import user(s)"}
        isOpen={isOpenDashboardUserCsv}
        onOuterClick={() => {}}
        onDismiss={() => setOpenDashboardUserCsv(false)}
        closeButtonAriaLabel={translation.Close ? translation.Close : "Close"}
      >
        <div style={{ margin: "20px 0" }} id="dashboardpanel">
          <PrimaryButton
            style={{
              color: "#333",
              background: "#fff",
              borderRadius: "25px",
              border: "!px solid #000",
            }}
            onClick={() => {
              downloadTemplate(
                props.UserArray,
                "user_detail-" + new Date().toLocaleDateString(),
                "A"
              );
            }}
            text={
              translation.sett10 ? translation.sett10 : "Download sample file"
            }
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              margin: "20px 0",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <input type="file" onChange={handleFileUploadDashboardUser} />
            </div>
            <div>
              <PrimaryButton
                text="Save"
                onClick={() => {
                  handleSaveCsvImportData();
                }}
              ></PrimaryButton>
            </div>
          </div>
          <div style={{ color: "#333" }}>
            <h3>
              <b>{"Instructions:-"}</b>
            </h3>
            <ul>
              <li>{"Add multiple records upto 100 records per file."} </li>
              <li>
                {
                  "Please fill the details with exact match to avoid conflicts of CSV file."
                }
              </li>
              <li>
                {
                  "Please don't add any commas or any other fields to avoid conflicts with commas of CSV file."
                }
              </li>
              <li>
                {
                  "Please don't change order of the columns or don't add new columns, this may lead into feeding values in incorrect columns."
                }
              </li>
            </ul>
          </div>
        </div>
      </Panel>

      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={translation.importuserspronouns || "Import users pronouns"}
        isOpen={isOpenPronouns}
        onDismiss={dismissPronouns}
        closeButtonAriaLabel={"Close"}
      >
        <ImportPronouns
          SweetAlertPrononus={SweetAlertPrononus}
          Users={props.UserArray}
          appSettings={appSettings}
          setAppSettings={setAppSettings}
          langcode={props.langcode}
          dismiss={dismissPanelCustomA}
          dismissModel={dismissPanelExcldCSV}
        />
      </Panel>
      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={translation.importusers || "Import bulk users"}
        isOpen={isOpenBulkUploadPanel}
        onDismiss={() => setOpenBulkUploadPanel(false)}
        closeButtonAriaLabel={"Close"}
      >
        <ImportUsers
          SweetAlertImportUser={SweetAlertImportUser}
          appSettings={appSettings}
          setUserImportedByCsv={setUserImportedByCsv}
          setAppSettings={setAppSettings}
          langcode={props.langcode}
          dismiss={dismissPanelCustomA}
          dismissModel={dismissPanelExcldCSV}
          // setNonGoogleUsersData={setNonGoogleUsersData}
          sampleFileData={[
            {
              name: "",
              email: "",
              firstName: "",
              lastName: "",
              manager: "",
              department: "",
              job: "",
              imgae: "",
              workphone: "",
              mobile: "",
              skills: "",
              projects: "",
              hobbies: "",
              school: "",
              About_Me: "",
              DOB: null,
              DOJ: null,
       
            },
          ]}
        />
      </Panel>

      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={
          translation.HideShowText
            ? translation.HideShowText
            : "Show or hide modules"
        }
        isOpen={isShowHideModuleOpenAdvance}
        onDismiss={() => setIshowHideModuleOpenAdvance(false)}
        closeButtonAriaLabel={"Close"}
      >
        <div id="AdvanceShowHide">
          {/* <div className={styles.showHideModulePanelItems}>
            <Label>{translation.externaluser ?? "Show external users"}</Label>
            <Toggle
              checked={dashboard}
              onText={translation.show}
              offText={translation.hide}
              onChange={(e: any, checked: any) => onChangeDashboard(e, checked)}
            />
          </div> */}

          {/* <div className={styles.seprator}></div>

          <div className={styles.showHideModulePanelItems}>
            <Label>
              {translation.FreeBusyInformation ?? "Free/busy information"}
              <a className={styles.helpTag} href="#">
                {translation.configurehelp ?? "Configure help"}
              </a>
            </Label>
            <Toggle
              checked={false} //add variable
              onText={translation.show}
              offText={translation.hide}
              onChange={(e: any, checked: any) => {}}
            />
          </div> */}

          <div className={styles.seprator}></div>

          <div className={styles.showHideModulePanelItems}>
            <Label>
              {translation.ShowMember
                ? translation.ShowMember
                : "Show memeber of"}
            </Label>
            <Toggle
              checked={showMemeberOf}
              onChange={(e: any, checked: any) => {
                handleChangeMemeberOf(e, checked);
              }}
              onText={translation.show}
              offText={translation.hide}
            />
          </div>

          <div className={styles.seprator}></div>

          <div className={styles.showHideModulePanelItems}>
            <Label>
              {translation.OrganizationalChart ?? "Organizational Chart"}
            </Label>
            <Toggle
              checked={showOrgChart}
              onChange={(e: any, checked: any) =>
                handleChangeOrgChart(e, checked)
              }
              onText={translation.show}
              offText={translation.hide}
            />
          </div>

          <div className={styles.seprator}></div>

          {/* <div className={styles.showHideModulePanelItems}>
            <Label>{translation.Userpresence ?? "User presence"}</Label>
            <Toggle
              checked={showFav}
              onText={translation.show}
              offText={translation.hide}
              onChange={() => {}}
            />
          </div>
          <div className={styles.seprator}></div> */}
          <div className={styles.showHideModulePanelItems}>
            <Label>{translation.EnableWFHText ?? "Enable WFH"}</Label>
            <Toggle
              checked={showWFH}
              onText={translation.show}
              offText={translation.hide}
              onChange={(e: any, checked: any) => handleChangeWFH(e, checked)}
            />
          </div>
          <div className={styles.seprator}></div>
          <div className={styles.showHideModulePanelItems}>
            <Label>
              {translation.displayweeklyworkstatus ??
                "Display weekly work status on profile card"}
            </Label>
            <Toggle
              checked={WeekWorkStatus}
              onText={translation.show}
              offText={translation.hide}
              onChange={(e: any, checked: any) =>
                handleWeeklyWorkStatus(e, checked)
              }
            />
          </div>
          <div className={styles.seprator}></div>
          <div className={styles.showHideModulePanelItems}>
            <Label>
              {translation.allowusertoupdatetheirpronouns ??
                "Allow user to update their pronouns"}
            </Label>
            <Toggle
              checked={HideShowPronouns}
              onText={translation.show}
              offText={translation.hide}
              onChange={(e: any, checked: any) =>
                handleChnageHideShowPronouns(e, checked)
              }
            />
          </div>
          <div className={styles.seprator}></div>
        </div>
      </Panel>

      <Panel
        type={PanelType.custom}
        customWidth="100%"
        onOuterClick={() => {}}
        headerText={translation.importusers || "Import users"}
        isOpen={isOpenImportUsers}
        onDismiss={dismissImportUsers}
        closeButtonAriaLabel={"Close"}
      >
        <div id="ImportUserDelete">
          <DefaultButton
            text="Add"
            menuProps={menuProps}
            style={{ margin: "10px 0px" }}
          />

          <DetailsList
            className={styles.detailsList}
            setKey="items"
            styles={ListStyles}
            items={NonGoogleUsersData || []}
            columns={NonGoogleColumns}
            isHeaderVisible={true}
            onShouldVirtualize={() => false}
            selectionMode={SelectionMode.none}
            ariaLabelForGrid="Item details"
          />
        </div>
      </Panel>

      <Panel
        type={PanelType.custom}
        customWidth="400px"
        headerText={translation.importusers || "Import users"}
        isOpen={isOpenImportUsersPanel}
        onDismiss={() => setOpenImportUsersPanel(false)}
        closeButtonAriaLabel={"Close"}
      >
        <div id="singleUserUpload">
          <Icon
            iconName="save"
            onClick={handleSaveImportSingleUser}
            style={{
              position: "fixed",
              right: "60px",
              top: "16px",
              color: "white",
              cursor: "pointer",
            }}
          />
          <TextField
            label="Name"
            id="name"
            value={formState.name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            id="email"
            value={formState.email}
            onChange={handleChange}
            type="email"
          />
          <TextField
            label="First Name"
            id="firstName"
            value={formState.firstName}
            onChange={handleChange}
          />
          <TextField
            label="Last Name"
            id="lastName"
            value={formState.lastName}
            onChange={handleChange}
          />
          <TextField
            label="Manager"
            id="manager"
            value={formState.manager}
            onChange={handleChange}
          />
          <TextField
            label="Department"
            id="department"
            value={formState.department}
            onChange={handleChange}
          />
          <TextField
            label="job"
            id="job"
            value={formState.job}
            onChange={handleChange}
          />
          <TextField
            label="Work Phone"
            id="workphone"
            value={formState.workphone}
            onChange={handleChange}
          />
          <TextField
            label="Mobile"
            id="mobile"
            value={formState.mobile}
            onChange={handleChange}
          />
          <DatePicker
            label="Date of Birth"
            id="DOB"
            value={formState.DOB}
            onSelectDate={(date) => handleDateChange(date, "DOB")}
            strings={datePickerStrings}
            placeholder="Select a date"
          />
          <DatePicker
            label="Date of Joining"
            id="DOJ"
            value={formState.DOJ}
            onSelectDate={(date) => handleDateChange(date, "DOJ")}
            strings={datePickerStrings}
            placeholder="Select a date"
          />
          <TextField
            label="Skills"
            id="skills"
            value={formState.skills}
            multiline
            onChange={handleTextAreaChange}
            placeholder="Enter your skills"
            styles={{ fieldGroup: { width: "100%" } }}
          />
          <TextField
            label="Projects"
            id="projects"
            value={formState.projects}
            onChange={handleTextAreaChange}
            multiline
            placeholder="Enter details about your projects"
          />
          <TextField
            label="Hobbies"
            id="hobbies"
            value={formState.hobbies}
            onChange={handleTextAreaChange}
            multiline
            placeholder="Enter your hobbies"
            styles={{ fieldGroup: { width: "100%" } }}
          />
          <TextField
            label="School"
            id="school"
            value={formState.school}
            onChange={handleTextAreaChange}
            multiline
            placeholder="Enter your school information"
          />
          <TextField
            label="About Me"
            id="About_Me"
            multiline
            onChange={handleTextAreaChange}
            placeholder="Tell us about yourself"
          />
        </div>
      </Panel>
    </div>
  );
};

export default AdvanceSetting;
