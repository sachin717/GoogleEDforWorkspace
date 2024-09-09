import "../SelectSource/Edp.scss";
import "./Styles.scss";
import styles from "../SCSS/Ed.module.scss";
import "sweetalert2/dist/sweetalert2.css";
import React, { ChangeEvent, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import BulkUpload from "./BulkUpload";
import EDStyles from "../SCSS/Ed.module.scss";
import { gapi } from "gapi-script";
import { TooltipHost, ITooltipHostStyles } from "@fluentui/react/lib/Tooltip";
import DefaultImage from "../assets/images/DefaultImg1.png";
import ReactSelect from "react-select";
import MiniModals from "./MiniModals";
import { UserPropsGridView } from "./UserPropsGridView";
import useStore, { useSttings } from "./store";
import { SearchFilter } from "./SearchFilter";
import { BlobServiceClient } from "@azure/storage-blob";
import { Buffer } from "buffer";
import { useBoolean } from "@fluentui/react-hooks";
import {
  ActionButton,
  Checkbox,
  Dropdown,
  FontIcon,
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
  Separator,
  Shimmer,
  Spinner,
  SpinnerSize,
  Stack,
  TextField,
  Toggle,
  mergeStyleSets,
  mergeStyles,
} from "office-ui-fabric-react";
import { IPivotStyles, Pivot, PivotItem } from "@fluentui/react";
import Mobile1 from "./Mobile";
import MobileDelete from "./MobileDelete";
import HideManager from "./HideManager";
import HideManagerDelete from "./HideManagerDelete";
import CustomAdd from "./CustomAdd";
import Department from "./Department";
import JTitle from "./JTitle";
import CustomDelete from "./CustomDelete";
import ExcludeCSV from "./ExcludeCSV";
import Users from "./Users";
import ImageTag from "./ImageTag";
import ImageCropper from "./Utils/ImageCropper";
import {
  changeFavicon,
  convertToBase64,
  decryptData,
  encryptData,
  removeDuplicatesFromObject,
  removeFavicon,
  updateSettingData,
} from "../Helpers/HelperFunctions";
import { LangOptions } from "../../Language/LanguageOptions";
import { Language } from "../../Language/Languages";
import { useLanguage } from "../../Language/LanguageContext";
import CustomPeoplePicker from "../Utils/CustomPeoplePicker";
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
import { useFields } from "../../context/store";
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

let departmentList: { label: any; value: any }[] = [];
let jobTitleList: { label: any; value: any }[] = [];
let lightdarkmode: any;
var parsedData: any = "";
var containerClient: any;
var dynamicwidth: any;
let finalDataNonM365: any = [];
let optionList: any = [];
var managerEmail = "";

const BirthAndAnivfilterOptions = [
  { key: "currentDay", text: "Current Day", checked: true },
  { key: "currentWeek", text: "Current Week" },
  { key: "currentMonth", text: "Current Month" },
  { key: "upcomingMonth", text: "Upcoming Month" },
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
  const { departmentFields, jobTitleFields, excludeOptionsForDomain } =useFields();
  const {
    languagePartUpdate,
    setLanguagePartUpdate,
    translation,
    setLanguage,
  } = useLanguage();

  const { SweetAlert: SweetAlertGridView } = SweetAlerts("#UserPrtiesGV", true);
  const { SweetAlert: SweetAlertDashboardPanel } = SweetAlerts(
    "#dashboardpanel",
    true
  );
  const { SweetAlert: SweetAlertDomain } = SweetAlerts("#domain",true);
  const { SweetAlert: SweetAlertJobTitle } = SweetAlerts("#jobTitle",true);
  const { SweetAlert: SweetAlertCsvPanel } = SweetAlerts("#csvpanel",true);

  const { SweetAlert: SweetAlertIncludeduserlist } =
    SweetAlerts("#Includeduserlist");
  const {
    SweetAlert: SweetAlertCustomfunc,
    SweetPrompt: SweetPromptCustomFunc,
  } = SweetAlerts("#customfunc", true);
  const { SweetAlert: SweetAlertPrononus } = SweetAlerts("#pronouns", true);
  const { SweetAlert: SweetAlertImportUser } = SweetAlerts("#importuser", true);
  const { SweetAlert: SweetAlertShowHideForView } = SweetAlerts(
    "#ShowHideForView",
    true
  );
  const { SweetAlert: SweetAlertEmailTemp } = SweetAlerts("#emailTemplate",true);
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
  const { SweetAlert: SweetAlertContains } = SweetAlerts("#excludedContains",true);
  const { SweetAlert: SweetAlertLocation } = SweetAlerts("#excludedLocation",true);
  const { SweetAlert: SweetAlertEmail } = SweetAlerts("#excludedEmail",true);
  const { SweetAlert: SweetAlertExcludeCsv } = SweetAlerts("#excludedCsv",true);
  const { SweetAlert: SweetAlertExcludeName } = SweetAlerts("#excludeName",true);
  const { SweetAlert: SweetAlertExcludeDept } = SweetAlerts("#excludeDept",true);
  const { SweetAlert: SweetAlertExecutiveAssistant } = SweetAlerts(
    "#ExecutiveAssistant",
    true
  );
  // const { SweetAlert: SweetAlertExcludeJob } = SweetAlerts("#excludeJob");
  const { appSettings, setAppSettings } = useSttings();

  const [hideShowViews, setHideShowViews] = useState({
    grid: false,
    list: false,
    tile: false,
  });

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

  const [upcomingBirthAndAnivAdv, setUpcomingBirthAndAnivAdv] =
    React.useState("Google & Imported User");
  const [syncUserInfo, setSyncUserInfo] = React.useState("Google & Imported User");
  const [dashboardUsers, setDashboardUsers] = React.useState([]);
  const [GroupsChecked, setGroupsChecked] = React.useState(false);
  const [bLogo, setBlogo] = React.useState<any>("");
  const [selectedBithFilter, setSelectedBithFilter] = useState("");
  const [HideShowPronouns, setHideShowPronouns] = useState<any>(false);
  const [autoLoad, setAutoLoad] = React.useState(false);
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
  const [executive, setExecutive] = useState("");
  const [aboutMe, setAboutMe] = useState("");

  const [topBarModalVisible, setTopBarModalVisible] = useState(false);
  const [topBarView, setTopBarView] = useState("");
  const [isShowHideModuleOpenAdvance, setIshowHideModuleOpenAdvance] =
    useState(false);

  const [isShowHideModuleOpen, setIshowHideModuleOpen] = useState(false);

  // Collaboration Setting States
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);

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

  useEffect(() => {
    window.addEventListener("resize", changeView);
    function changeView() {
      if (window.innerWidth < 768) {
        let temp = { ...parsedData, defaultMobileView: selectedMobileView };

        setView(selectedMobileView);

        if (Object.keys(parsedData).length > 0) {
          updateSettingData(temp);
        }
      } else {
        setView(appSettings.DefaultView);
        console.log("Not in mobile view. Function not called.");
      }
    }

    return () => {
      window.removeEventListener("resize", changeView);
    };
  }, [window.innerWidth]);
  const mystyle =useCustomStyles();
  function onChangeDashboard(e: any, checked: any) {
    setShowDashboard(checked);
    updateSetting({ ...parsedData, showDashboard: checked });
    setAppSettings({ ...parsedData, showDashboard: checked });
    SweetAlertGeneralHideShow("success", translation.SettingSaved);
  }

  async function onLanguageChange(event: any, item: any) {
    setSelectedLang(item);
    console.log("language ", item);
    console.log(Language);
    let lang = item?.key as string;
    console.log("pp", lang);

    await setLanguage(lang);
    setLanguagePartUpdate(!languagePartUpdate);
    let temp = await {
      ...parsedData,
      SelectedLanguage: item,
      LaguageData: translation,
      BrowserLanguageActive: browserLangDetectToggle,
    };
    await updateSetting(temp);
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }

  const { SweetAlert: SweetAlertClearAlphaFilter } =
    SweetAlerts("#clearAlphabet");
  function onChangeClearAlphaFilter(e: any, checked: any) {
    setClearAlphaFilter(checked);
    const setting = { ...appSettings, clearAlphaFilter: checked };
    updateSetting(setting);
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
    setLanguagePartUpdate(!languagePartUpdate);
    let temp = await {
      ...parsedData,
      SelectedLanguage: selectLang,
      LaguageData: translation,
      BrowserLanguageActive: checked,
      BrowserLanguage: window.navigator.language,
    };
    updateSetting(temp);
    SweetAlertOutSidePanel("success", translation.SettingSaved);
    console.log(window.navigator.language, "lang");
  }

  const onChangeInfoAlign = (alignment) => {
    setSelectedEmpInfoAlignment(alignment);
  };

  function handleChangeAlignMent() {
    updateSetting({
      ...parsedData,
      EmpInfoAlignment: selectedEmpInfoAlignment,
    });
    setAppSettings({
      ...parsedData,
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
    updateSetting(temp);
  }

  function handleChangeMemeberOf(e: any, checked: any) {
    setShowMemeberOf(checked);
    let temp = { ...parsedData, ShowMemeberOf: checked };
    updateSetting(temp);
    setAppSettings(temp);
    SweetAlertShowHideAdvanced("success", translation.SettingSaved);
  }

  function handleChangeOrgChart(e: any, checked: any) {
    setShowOrgChart(checked);
    let temp = { ...parsedData, ShowOrgChart: checked };
    updateSetting(temp);
    setAppSettings(temp);
    SweetAlertShowHideAdvanced("success", translation.SettingSaved);
  }

  const _onGRPChange = React.useCallback((e, checked?: boolean): void => {
    setGroupsChecked(checked);
    updateSettingData({ ...parsedData, GroupsOn: checked });
    setAppSettings({ ...parsedData, GroupsOn: checked });
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }, []);

  function handleChangeWFH(e: any, checked: any) {
    setShowWFH(checked);
    let temp = { ...parsedData, ShowWFH: checked };
    updateSetting(temp);
    setAppSettings(temp);
    SweetAlertShowHideAdvanced("success", translation.SettingSaved);
  }

  function handleWeeklyWorkStatus(e: any, checked: any) {
    setWeekWorkStatus(checked);
    let temp = { ...parsedData, ShowWeekWorkStatus: checked };
    updateSetting(temp);
    setAppSettings(temp);
    SweetAlertShowHideAdvanced("success", translation.SettingSaved);
  }

  async function handleUploadBithImg() {
    try {
      const response = await fetch(imageToCrop);
      const imgBlob = await response.blob();

      const base64Image = await convertToBase64(imgBlob);
      const setting = {
        ...appSettings,
        BirthdayAndAnniversaryImage: base64Image,
      };

      updateSetting(setting);
      setAppSettings(setting);
      SweetAlertOutSidePanel("success", translation.SettingSaved);
    } catch (error) {
      console.error("Error processing image:", error);
      SweetAlertOutSidePanel("success", "Something went wrong");
    }
  }
  function handleRemoveBithImg() {
    updateSetting({ ...parsedData, BirthdayAndAnniversaryImage: "" });
    setImageToCrop("");
    setShowBirthAnivImg("");
    SweetAlertOutSidePanel("success", translation.SettingSaved);
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
    updateSetting(temp);
    setAppSettings(temp);
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }

  function handleOrgName() {
    let temp = { ...parsedData, OrgName: OrgName };
    updateSetting(temp);
    setAppSettings(temp);
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }

  function handleChnageHideShowPronouns(e: any, checked: any) {
    setHideShowPronouns(checked);
    let temp = { ...appSettings, HideShowPronouns: checked };
    updateSetting(temp);
    setAppSettings(temp);
    SweetAlertShowHideAdvanced("success", translation.SettingSaved);
  }

  async function handleSaveBrandLogo() {
    if (bLogo) {
      try {
        // previewBrandLogoImage = await convertToBase64(bLogo);
        const response = await fetch(bLogo);
        const imgBlob = await response.blob();

        const base64Image = await convertToBase64(imgBlob);
        let temp = { ...appSettings, BrandLogo: base64Image };
        console.log(temp, "temp");
        updateSetting(temp);
        setAppSettings(temp);
        // GetSettingData();
        SweetAlertOutSidePanel("success", translation.SettingSaved);
      } catch (error) {
        console.error("Error converting image to Base64:", error);
      }
    }
  }

  function handleRemoveBrandLogo() {
    let temp = { ...appSettings, BrandLogo: null };
    console.log(temp, "temp");
    updateSetting(temp);
    setAppSettings(temp);
    setCroppedImage("");
    setBlogo("");
    // GetSettingData();
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
    updateSetting(temp);
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }

  const handleClick = (option: React.SetStateAction<string>) => {
    setSelectedOption(option);
    props.changeVariable(option);
  };

  const handleSaveSortBy = (selectedOption: any) => {
    // parsedData["sortby"] = selectedOption.toString();
    const setting = { ...appSettings, sortby: selectedOption };
    // setSaved(true);
    if (Object.keys(setting).length > 0) {
      updateSetting(setting);
      SweetAlertOutSidePanel("success", translation.SettingSaved);
    }
  };

  async function GetSettingData() {
    var domain = gapi.auth2
      .getAuthInstance()
      .currentUser.le.wt.cu.split("@")[1];
    //console.log(domain);
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
      parsedData = JSON.parse(str);
      setAppSettings(JSON.parse(str));
      previewBrandLogoImage = parsedData.BrandLogo;

      setSelectedExcludedDomian(parsedData?.ExcludeByDomain);

      setExecutive(parsedData?.Labels?.executive);
      setAboutMe(parsedData?.Labels?.aboutMe);
      let grpon = parsedData?.GroupsOn;
      //console.log(parsedData);
      if (grpon) {
        setGroupsChecked(grpon);
      } else {
        setGroupsChecked(false);
      }

      setTopBarView(parsedData?.TopBarFilterView);

      if (parsedData?.EmpInfoAlignment) {
        setSelectedEmpInfoAlignment(parsedData?.EmpInfoAlignment);
      }
      if (parsedData?.BrandLogo) {
        setBlogo(parsedData?.BrandLogo);
      }
      if (parsedData?.SyncUserInfoFrom) {
        setSyncUserInfo(parsedData?.SyncUserInfoFrom);
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
      if (parsedData?.AutoLoad) {
        setAutoLoad(parsedData?.AutoLoad);
      }
      if (parsedData?.dashboardFeature) {
        setDashboardFeature(parsedData?.dashboardFeature);
      }
      // if (parsedData?.dashboardAccessUsers?.length) {
      //   setDashboardIncludedUserTable(parsedData?.dashboardAccessUsers);
      //   setDashboardIncludedUser(parsedData?.dashboardAccessUsers);
      //   setDashboardIncludedUserTableShowData(parsedData?.dashboardAccessUsers);
      // }
      if (parsedData?.DashboardSpecificUsers) {
        setDashboardUsers(
          JSON.parse(decryptData(parsedData?.DashboardSpecificUsers))
        );
        setDashboardIncludedUserTableShowData(
          JSON.parse(decryptData(parsedData?.DashboardSpecificUsers))
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
        parsedData?.CustomHomePageUrl?.homeCustomUrlIconName !== undefined &&
        parsedData?.CustomHomePageUrl?.homeCustomUrlIconName?.trim() !== ""
      ) {
        setHomeCustomUrlIconName(
          parsedData?.CustomHomePageUrl?.homeCustomUrlIconName
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
        console.log(
          "ListViewPrope property not found in the downloaded object"
        );
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
        // console.log(parsedData);
        // console.log(parsedData.records_to_load.toString());
        setCheckedValueRecord(parsedData.records_to_load.toString());
      }
      if (parsedData.orgChartHead) {
        let userHead = userData?.find(
          (element) => element?.primaryEmail === parsedData.orgChartHead
        );
        setuserinput(userHead?.name?.fullName);
      }

      dynamicwidth = parsedData.gridWidth;
      //console.log(parsedData);
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
    updateSettingData({
      ...appSettings,
      SelectedUpcomingBirthAndAniv: upcomingBirthAndAnivAdv,
    });
    setAppSettings({
      ...appSettings,
      SelectedUpcomingBirthAndAniv: upcomingBirthAndAnivAdv,
    });
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }
  function handleSyncUserInfo() {
    updateSettingData({
      ...parsedData,
      SyncUserInfoFrom: syncUserInfo,
    });
    setAppSettings({
      ...parsedData,
      SyncUserInfoFrom: syncUserInfo,
    });
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }

  const handleViewsCheckboxChange = (view) => {
    setHideShowViews((prevState) => ({
      ...prevState,
      [view]: !prevState[view],
    }));
  };

  const handleBithAndAnivChange = (event: any, val: any) => {
    setSelectedBithFilter(event.target.name);

    let data = {};
    if (event.target.name == "currentDay") {
      data = {
        currentDay: val,
        currentWeek: false,
        currentMonth: false,
        upcomingMonth: false,
      };
    } else if (event.target.name == "currentWeek") {
      data = {
        currentDay: false,
        currentWeek: val,
        currentMonth: false,
        upcomingMonth: false,
      };
    } else if (event.target.name == "currentMonth") {
      data = {
        currentDay: false,
        currentWeek: false,
        currentMonth: val,
        upcomingMonth: false,
      };
    } else if (event.target.name == "upcomingMonth") {
      data = {
        currentDay: false,
        currentWeek: false,
        currentMonth: false,
        upcomingMonth: val,
      };
    } else {
      data = {
        currentDay: true,
        currentWeek: false,
        currentMonth: false,
        upcomingMonth: false,
      };
    }
    if (Object.keys(parsedData)?.length) {
      updateSettingData({ ...parsedData, BirthAndAnivFilter: data });
      SweetAlertOutSidePanel("success", translation.SettingSaved);
      setAppSettings({ ...parsedData, BirthAndAnivFilter: data });
    }
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

  function handleShowHideViews() {
    let updateData = updateDefaultViewIfNeeded(appSettings, hideShowViews);
    setView(updateData.DefaultView);
    updateSetting(updateData);
    setAppSettings(updateData);
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }


  function handleExcludeContains() {
    if (selectedExcludedContains?.length) {
      let containsData = [];
      containsData = [selectedExcludedContains];
      if (appSettings?.ExcludedByContains) {
        containsData = [
          ...appSettings?.ExcludedByContains,
          selectedExcludedContains,
        ];
      } else {
        containsData = [selectedExcludedContains];
      }

      if (Object.keys(parsedData)?.length > 0) {
        let data = { ...parsedData, ExcludedByContains: containsData };
        updateSetting(data);
        setAppSettings(data);
        SweetAlertOutSidePanel("success", translation.SettingSaved);
      }
    } else {
      SweetAlertOutSidePanel("info", "Please specify user");
    }
  }

  // function handleExcludeLoc() {
  //   if (selectedExcludedLoc?.length) {
  //     if (Object.keys(parsedData)?.length > 0) {
  //       let data = { ...parsedData, ExcludeByLocation: selectedExcludedLoc };
  //       updateSetting(data);
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
        let data = { ...parsedData, ExcludedByEmail: selectedExcludedEmail };
        updateSetting(data);
        setAppSettings(data);
        SweetAlertOutSidePanel("success", translation.SettingSaved);
      }
    } else {
      SweetAlertOutSidePanel("info", "Please select email(s)");
    }
  }

  function handleExcludeUserName() {
    if (selectedKeysForExcludeName?.length) {
      if (Object.keys(parsedData)?.length > 0) {
        let data = { ...parsedData, ExcludeByName: selectedKeysForExcludeName };
        updateSetting(data);
        setAppSettings(data);
        SweetAlertOutSidePanel("success", translation.SettingSaved);
      }
    } else {
      SweetAlertOutSidePanel("info", "Please selet name(s)");
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
    console.log(uparsedData, "on update settings");
    var _parsedData = JSON.stringify(uparsedData);
    var domain = gapi.auth2
      .getAuthInstance()
      .currentUser.le.wt.cu.split("@")[1];
    //console.log(domain);
    var _domain = domain.replace(/\./g, "_");
    var storagedetails =
      '[{"storageaccount":"mystorageaccountparj","containername":"parjinder1","blobfilename":"' +
      _domain +
      '.json"}]';
    var mappedcustomcol = JSON.parse(storagedetails);
    console.log(mappedcustomcol, "mapped");
    await containerClient
      .getBlockBlobClient(mappedcustomcol[0].blobfilename)
      .upload(_parsedData, Buffer.byteLength(_parsedData))
      .then(() => {
        setTimeout(() => {
          dismissPanelUserPrtiesLV();
          dismissPanelUserPrtiesPCV();
          dismissPanelDfltViews();
          dismissPanelWidthCustm();

          dismissPanelExcldDept();
          dismissPanelExcldJtitle();

          dismissPanelOrgChartType();
          dismissPanelRecordLoad();
        }, 3000);
      });
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

      console.log("json", jsonData);
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
        return { email: item.email };
      });
      if (Object.keys(parsedData)?.length > 0) {
        updateSettingData({
          ...parsedData,
          DashboardSpecificUsers: encryptData(JSON.stringify(res)),
        });
        setAppSettings({
          ...parsedData,
          DashboardSpecificUsers: encryptData(JSON.stringify(res)),
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
    updateSetting(setting);
    setAppSettings(setting);
    setGridWidth("150");
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }

  const saveGridWidth = () => {
    const setting = { ...appSettings, gridWidth: gridWidth };
    updateSetting(setting);
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
    const updatedParsedData = { ...parsedData, [KEY_NAME]: checkboxesListView };
    console.log(updatedParsedData, "listview settings");
    if (Object.keys(parsedData).length > 0) {
      updateSetting(updatedParsedData);
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
        ...parsedData,
        [KEY_NAME2]: propertiesObj,
      };
      console.log(updatedParsedDataProfile);
      updateSetting(updatedParsedDataProfile);
      SweetAlertProfileView("success", translation.SettingSaved);
    } else {
      SweetAlertProfileView("error", "Something went wrong");
      console.log("Error , parsed data not found.", parsedData);
    }
  };

  const onDragEnd = (result) => {
    console.log(result, "dragresult");
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
    let temp = { ...parsedData, defaultMobileView: selectedMobileView };
    if (window.innerWidth < 768) {
      setView(selectedMobileView);
    }
    if (Object.keys(parsedData).length > 0) {
      updateSetting(temp);
    }
    setAppSettings(temp);
    SweetAlertDefaultMobileView("success", translation.SettingSaved);
  };

  const saveDefaultView = () => {
    let temp = { ...parsedData, DefaultView: selectedView };
    setView(selectedView);
    if (Object.keys(temp).length > 0) {
      updateSettingData(temp);
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
    let setting = { ...parsedData, dashboardFeature: dashboardFeature };
    updateSetting(setting);
    setAppSettings(setting);
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  }

  const handleCheckboxChangeRecords = (event, fieldName) => {
    setCheckedValueRecord(fieldName);
  };

  const saveCountSettings = () => {
    changerecordtoLoadValue(parseInt(checkedValueRecord));
    const updatedParsedDataRecords = {
      ...parsedData,
      ["records_to_load"]: checkedValueRecord,
    };
    if (Object.keys(parsedData).length > 0) {
      updateSetting(updatedParsedDataRecords);
      SweetAlertOutSidePanel("success", translation.SettingSaved);
      setAppSettings(updatedParsedDataRecords);
    }
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
    updateSettingData({
      ...appSettings,
      DashboardSpecificUsers: encryptData(JSON.stringify(data)),
    });
    setAppSettings({
      ...appSettings,
      DashboardSpecificUsers: encryptData(JSON.stringify(data)),
    });
    SweetAlertIncludeduserlist("success", translation.SettingSaved);
  }

  function deleteIncludedUserInDashboard(email) {
    // let data = dashboardIncludedUserTable.filter(
    //   (item) => item.email !== email
    // );
    let data = dashboardUsers.filter((item) => item.email !== email);
    console.log(dashboardUsers);
    setDashboardUsers(data);
    // setDashboardIncludedUserTable(data);
    // setDashboardIncludedUser(data);
    setDashboardIncludedUserTableShowData(data);
    updateSettingData({
      ...appSettings,
      DashboardSpecificUsers: encryptData(JSON.stringify(data)),
    });
    setAppSettings({
      ...appSettings,
      DashboardSpecificUsers: encryptData(JSON.stringify(data)),
    });
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

  const excdept = () => {
    if (selectedKeydept?.length) {
      changeExcludeByDepartment(selectedKeydept);
      const updatedParsedData = { ...parsedData, [KEY_NAME3]: selectedKeydept };
      if (Object.keys(parsedData).length > 0) {
        updateSetting(updatedParsedData);
        SweetAlertOutSidePanel("success", translation.SettingSaved);
      }

      console.log("sucesss", selectedKeydept);
    } else {
      SweetAlertExcludeDept("info", "Please Select domain(s)");
    }
  };

  const excjtitle = () => {
    if (selectedKeysjtitle?.length) {
      const updatedParsedData = {
        ...parsedData,
        [KEY_NAME4]: selectedKeysjtitle,
      };
      if (Object.keys(parsedData).length > 0) {
        console.log(updatedParsedData);
        updateSetting(updatedParsedData);
      }
      changeExcludeByJobTitle(selectedKeysjtitle);
    } else {
      SweetAlertOutSidePanel("info", "Please select job title");
    }
  };

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
        updateSetting(updatedData);
      }
    } else if (selectedOrgchart === "StanderdOrgCharts") {
      const updatedParsedData = {
        ...parsedData,
        [KEY_NAME5]: selectedOrgchart,
      };
      if (Object.keys(parsedData).length > 0) {
        updateSetting(updatedParsedData);
      }
      SweetAlertOutSidePanel("success", translation.SettingSaved);
    } else {
      SweetAlertOutSidePanel("error", "Something went wrong");
    }
  };

  function handleAutoLoad(e: any, checked: any) {
    setAutoLoad(checked);
    if (Object.keys(parsedData)?.length > 0) {
      updateSetting({ ...parsedData, AutoLoad: checked });
      setAppSettings({ ...parsedData, AutoLoad: checked });
      SweetAlertOutSidePanel("success", translation.SettingSaved);
    }
  }

  async function handleSelect(item) {
    setDashboardUsers((prev) => [...prev, item]);
    console.log(item);
  }

  const handleLabelSave = () => {
    updateSetting({ ...appSettings, Labels: { aboutMe, executive } });
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  };

  const handleChangeTopBarView = (e, val) => {
    const { title } = e.target;
    setTopBarView(title);
  };

  const handleSaveTopBarView = () => {
    const updatedTopBarSetting = {
      ...appSettings,
      TopBarFilterView: topBarView,
    };
    updateSetting(updatedTopBarSetting);
    setAppSettings(updatedTopBarSetting);
    SweetAlertOutSidePanel("success", translation.SettingSaved);
  };

  const [openAdditionalManagerSetting, setOpenAdditionalManagerSetting] =
    useState(false);

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

      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={
          translation.hidemanager
            ? translation.hidemanager
            : "Hide manager of specific users"
        }
        isOpen={isOpenHideMngr}
        onDismiss={dismissPanelHideMngr}
        closeButtonAriaLabel={"Close"}
      >
        <div>
          <div id="HideManager">
            <Pivot
              className="viewsPanelPivot"
              style={{ paddingTop: "15px" }}
              //styles={PivotStyles}
              aria-label="Large Link Size Pivot Example"
              linkSize="large"
            >
              <PivotItem headerText={translation.add ? translation.add : "Add"}>
                <HideManager SweetAlertHideManager={SweetAlertHideManager} />
              </PivotItem>
              <PivotItem
                headerText={translation.delete ? translation.delete : "Delete"}
              >
                <HideManagerDelete
                  SweetAlertHideManager={SweetAlertHideManager}
                />
              </PivotItem>
            </Pivot>
          </div>
        </div>
      </Panel>

      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={
          translation.Hidemobile
            ? translation.Hidemobile
            : "Hide mobile numbers of specific users"
        }
        isOpen={isOpenHideMobNo}
        onDismiss={dismissPanelHideMobNo}
        closeButtonAriaLabel={"Close"}
      >
        <div style={{ padding: "5px" }}>
          <Pivot
            className="viewsPanelPivot"
            style={{ paddingTop: "15px" }}
            aria-label="Large Link Size Pivot Example"
            linkSize="large"
          >
            <PivotItem headerText={translation.add ? translation.add : "Add"}>
              <Mobile1 />
            </PivotItem>
            <PivotItem
              headerText={translation.delete ? translation.delete : "Delete"}
            >
              <MobileDelete />
            </PivotItem>
          </Pivot>
        </div>
      </Panel>

      <Panel
        type={PanelType.custom}
        customWidth="880px"
        headerText={
          translation.Customfields ? translation.Customfields : "Custom fields"
        }
        isOpen={isOpenCustomField}
        onDismiss={dismissPanelCustomField}
        closeButtonAriaLabel={"Close"}
      >
        <Stack
          id="customfunc"
          style={{ padding: "5px", display: "flex", flexDirection: "row" }}
        >
          <Pivot
            style={{ paddingTop: "15px", width: "100%" }}
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
                    SweetAlertCustomfunc={SweetAlertCustomfunc}
                    dismiss={dismissPanelCustomField}
                  />
                </PivotItem>
                <PivotItem
                  headerText={
                    translation.delete ? translation.delete : "Delete"
                  }
                >
                  <CustomDelete
                    SweetPromptCustomFunc={SweetPromptCustomFunc}
                    SweetAlertCustomfunc={SweetAlertCustomfunc}
                    dismiss={dismissPanelCustomField}
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
                onChange={onCheckboxChangeSyncUserInfo("Google & Imported User")}
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
      )}

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
                headerText={
                  "Exclude user contains"
                }
                isOpen={isOpenExcludeUserContainsListPanel}
                onDismiss={dismissExcludeContainsUserListPanel}
                closeButtonAriaLabel={"Close"}
              >
                <div >
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
                    : "Excluded user list"
                }
                isOpen={isOpenExcludeUserEmailListPanel}
                onDismiss={dismissExcludeEmilUserListPanel}
                closeButtonAriaLabel={"Close"}
              >
                <div >
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
                // if(appSettings?.DashboardSpecificUsers){
                // setDashboardIncludedUserTableShowData(JSON.parse(decryptData(appSettings?.DashboardSpecificUsers)));

                // }
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

      {isOpenPanelBdayAnniImg && (
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
      )}

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
          heading={
            translation.OrganizationNameLabel
              ? translation.OrganizationNameLabel
              : "Organization name"
          }
          closeAction={dismissPanelOrgName}
        >
          <div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Label>
                {translation.OrganizationNameLabel
                  ? translation.OrganizationNameLabel
                  : "Organization name"}
              </Label>
              <TextField
                placeholder={
                  translation.OrganizationNameLabel
                    ? translation.OrganizationNameLabel
                    : "Organization name"
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
          heading={translation.brandlogo ? translation.brandlogo : "Brand Logo"}
          closeAction={dismissPanelUpldLogo}
        >
          {!isDataLoaded ? (
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
              {bLogo?.length > 0 && (
                <img
                  src={bLogo}
                  style={{
                    objectFit: "contain",
                    // border: "0.5px solid black",
                    height: "120px",
                    width: "200px",
                  }}
                />
              )}

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
            translation.profilecardcustomicon
              ? translation.profilecardcustomicon
              : "Profile card custom url icon"
          }
          closeAction={dismissPanelProfileCustomUrlIcon}
        >
          <div>
            <div>
              <Label>
                {translation.profilecardcustomicon
                  ? translation.profilecardcustomicon
                  : "Profile card custom url icon"}
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

  

      {isOpenOrgChartType && (
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
                        headerText={
                          translation.Exclude2||"Exclude user(s) by department"
                        }
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
                         onOuterClick={()=>{}}
                        headerText={
                         "Exclude user using csv file"
                        }
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
          <Stack>
            <UserPropsGridView
              SweetAlertGridView={SweetAlertGridView}
              Dismisspanel={dismissPanelUserPrtiesGV}
            />
          </Stack>
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
        headerText={
          translation.Searchfilters
            ? translation.Searchfilters
            : "Search filters"
        }
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
          heading={
            translation.Recordstoload
              ? translation.Recordstoload
              : "Records to load"
          }
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
                    {translation.Recordstoload
                      ? translation.Recordstoload
                      : "Records to load"}
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

      {isOpenBdayAnniTemplt && (
        <Panel
          type={PanelType.custom}
          customWidth="750px"
          headerText={
            translation.Advance8
              ? translation.Advance8
              : "Birthday and anniversary templates"
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
                      translation.Birthdaytemplate
                        ? translation.Birthdaytemplate
                        : "Birthday template"
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
                      translation.Anniversarytemplate
                        ? translation.Anniversarytemplate
                        : "Anniversary template"
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
      )}

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
        headerText={translation.importusers || "Import users"}
        isOpen={isOpenImportUsers}
        onDismiss={dismissImportUsers}
        closeButtonAriaLabel={"Close"}
      >
        <ImportUsers
          SweetAlertImportUser={SweetAlertImportUser}
          appSettings={appSettings}
          setAppSettings={setAppSettings}
          langcode={props.langcode}
          dismiss={dismissPanelCustomA}
          dismissModel={dismissPanelExcldCSV}
          sampleFileData={props.UserArray[0]}
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
          <div className={styles.showHideModulePanelItems}>
            <Label>
              {translation.externaluser
                ? translation.externaluser
                : "Show external users"}
            </Label>
            <Toggle
              checked={dashboard}
              onText={translation.show}
              offText={translation.hide}
              onChange={(e: any, checked: any) => onChangeDashboard(e, checked)}
            />
          </div>

          <div className={styles.seprator}></div>

          <div className={styles.showHideModulePanelItems}>
            <Label>
              {translation.FreeBusyInformation
                ? translation.FreeBusyInformation
                : "Free/busy information"}
              <a className={styles.helpTag} href="#">
                {translation.configurehelp
                  ? translation.configurehelp
                  : "Configure help"}
              </a>{" "}
            </Label>
            <Toggle
              checked={false} //add variable
              onText={translation.show}
              offText={translation.hide}
              onChange={(e: any, checked: any) => {}}
            />
          </div>

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
              {translation.OrganizationalChart
                ? translation.OrganizationalChart
                : "Organizational Chart"}
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

          <div className={styles.showHideModulePanelItems}>
            <Label>
              {translation.Userpresence
                ? translation.Userpresence
                : "User presence"}
            </Label>
            <Toggle
              checked={showFav}
              onText={translation.show}
              offText={translation.hide}
              onChange={() => {}}
            />
          </div>
          <div className={styles.seprator}></div>
          <div className={styles.showHideModulePanelItems}>
            <Label>
              {translation.EnableWFHText
                ? translation.EnableWFHText
                : "Enable WFH"}
            </Label>
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
              {translation.displayweeklyworkstatus
                ? translation.displayweeklyworkstatus
                : "Display weekly work status on profile card"}
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
              {translation.allowusertoupdatetheirpronouns
                ? translation.allowusertoupdatetheirpronouns
                : "Allow user to update their pronouns"}
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
    </div>
  );
};

export default AdvanceSetting;
