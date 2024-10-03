//import create from 'zustand';
import { render } from "react-dom";
import { create } from "zustand";

const useStore = create((set) => ({
  variable: "givenName",

  changeVariable: (newValue) => set({ variable: newValue }),

  variableGridWidth: "150px",

  changeGridWidth: (newValue) => set({ variableGrid: newValue }),

  checkboxesChecked: {
    Title: true,
    WorkPhone: true,
    Email: true,
    Mobile: true,
    EmployeeID: true,
    CostCenter: true,
    MemberOf: true,
    OwnerOf: true,
    ManagerOf: true,
    Address: true,
    FloorSection: true,
    FloorName: true,
    BuildingID: true,
  },

  changeCheckboxesChecked: (newCheckboxesChecked) =>
    set({ checkboxesChecked: newCheckboxesChecked }),

  checkboxesCheckedListView: {
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
  },

  changeCheckboxesCheckedListView: (newCheckboxesChecked) =>
    set({ checkboxesCheckedListView: newCheckboxesChecked }),

  userGridView: [
    {
      id: 1,
      name: "name",
      checkbox: true,
      isCustomField: false,
      nameAPI: "name",
    },
    {
      id: 2,
      name: "email",
      checkbox: true,
      isCustomField: false,
      nameAPI: "email",
    },
    {
      id: 3,
      name: "job",
      checkbox: true,
      isCustomField: false,
      nameAPI: "job",
    },
    {
      id: 4,
      name: "department",
      checkbox: true,
      isCustomField: false,
      nameAPI: "department",
    },
    {
      id: 5,
      name: "location",
      checkbox: true,
      isCustomField: false,
      nameAPI: "location",
    },
    {
      id: 6,
      name: "workphone",
      checkbox: true,
      isCustomField: false,
      nameAPI: "workphone",
    },
    {
      id: 7,
      name: "mobile",
      checkbox: true,
      isCustomField: false,
      nameAPI: "mobile",
    },
    {
      id: 8,
      name: "manager",
      checkbox: true,
      isCustomField: false,
      nameAPI: "manager",
    },
  ],

  changeUserGridView: (newUserGridView) =>
    set({ userGridView: newUserGridView }),

  searchFilters: [
    {
      id: 1,
      name: "Name",
      checkbox: true,
    },
    {
      id: 2,
      name: "Title",
      checkbox: true,
    },
    {
      id: 3,
      name: "Departments",
      checkbox: true,
    },
    {
      id: 4,
      name: "Custom Fields",
      checkbox: true,
    },
  ],

  changeSearchFilters: (newUserGridView) =>
    set({ searchFilters: newUserGridView }),

  topManager: [],

  changeTopManager: (newManager) => set({ topManager: newManager }),
  userArray: [],
  changeUserArray: (newArray) => set({ userArray: newArray }),

  orgChartHead: "",
  changeOrgChartHead: (newValue) => set({ orgChartHead: newValue }),

  variableDefaultView: "Grid",

  changeVariableDefaultView: (newValue) =>
    set({ variableDefaultView: newValue }),

  recordtoLoadValue: "givenName",

  changerecordtoLoadValue: (newValue) => set({ recordtoLoadValue: newValue }),

  customFields: [
    {
      customField: "",
      date: false,
      displayOnlyProfileCard: false,
      displayProperty: false,
      dropdown: false,
      filed: { key: "", text: "" },
      filterable: true,
      hide: false,
      text: true,
    },
  ],

  changeCustomFields: (newValue) => set({ customFields: newValue }),

  userData: [],
  changeUserData: (newValue) => set({ userData: newValue }),

  excludeByDepartment: [],
  changeExcludeByDepartment: (newValue) =>
    set({ excludeByDepartment: newValue }),
  excludeByDomain: [],
  changeExcludeByDomain: (newValue) => set({ excludeByDomain: newValue }),

  excludeByJobTitle: [],
  changeExcludeByJobTitle: (newValue) => set({ excludeByJobTitle: newValue }),

  deleteCustomData: [{}],
  changeDeleteCustomData: (newValue) => set({ deleteCustomData: newValue }),
  excludeUsersBulk: [{}],
  changeExcludeUsersBulk: (newValue) => set({ excludeUsersBulk: newValue }),

  typeOrg: "",
  changeTypeOrg: (newValue) => set({ typeOrg: newValue }),
  render: false,
  reRenderState: () => set({ render: !render }),

  view: "",
  setView: (newView) => set({ view: newView }),
}));

export const useSttings = create((set) => ({
  appSettings: {
    DefaultView: "Grid",
    sortby: "givenName",
    gridWidth: 150,
    IsAdmin: "",
    HideManager: "",
    GridViewPrope: [
      {
        id: 1,
        name: "name",
        checkbox: true,
        isCustomField: false,
        nameAPI: "name",
      },
      {
        id: 2,
        name: "email",
        checkbox: true,
        isCustomField: false,
        nameAPI: "email",
      },
      {
        id: 3,
        name: "job",
        checkbox: true,
        isCustomField: false,
        nameAPI: "job",
      },
      {
        id: 4,
        name: "department",
        checkbox: true,
        isCustomField: false,
        nameAPI: "department",
      },
      {
        id: 5,
        name: "location",
        checkbox: true,
        isCustomField: false,
        nameAPI: "location",
      },
      {
        id: 6,
        name: "workphone",
        checkbox: true,
        isCustomField: false,
        nameAPI: "workphone",
      },
      {
        id: 7,
        name: "mobile",
        checkbox: true,
        isCustomField: false,
        nameAPI: "mobile",
      },
      {
        id: 8,
        name: "manager",
        checkbox: true,
        isCustomField: false,
        nameAPI: "manager",
      }
    ],
    ProfileViewPrope: {
      Title: true,
      Email: true,
      WorkPhone: true,
      Mobile: true,
      EmployeeID: true,
      CostCenter: false,
      MemberOf: true,
      OwnerOf: true,
      ManagerOf: true,
      Address: true,
      FloorSection: false,
      FloorName: false,
      BuildingID: false,
    },
    SearchFiltersPrope: [
      {
        id: 1,
        name: "Name",
        checkbox: true,
      },
      {
        id: 2,
        name: "Title",
        checkbox: true,
      },
      {
        id: 3,
        name: "Departments",
        checkbox: true,
      },
      {
        id: 4,
        name: "Custom Fields",
        checkbox: true,
      },
    ],
    GroupsOn: true,
    profileIconName: "FavoriteStar",
    records_to_load: "50",
    CustomHomePageUrl: {
      homeCustomUrl: "",
      homeCustomUrlIconName: "message",
      CustomHomePageLinkActive: false,
    },
    Favicon: {
      isFavIconShow: false,
      url: "",
    },
    IsExportToCsv: true,
    OrgName: "",
    ListViewPrope: {
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
    },
    SelectedLanguage: {
      key: "en",
      text: "English",
    },
    AllowUserToPrintPDF: true,
    BrowserLanguageActive: true,
    BrowserLanguage: "en-US",
    EmpInfoAlignment: "Left",
    CollaborationSettings: {
      WorkPhone: "SIP",
      Mobile: "SIP",
      Chat: "SIP",
      ActionIcon: {
        value: "None",
        fields: {
          Classic: {
            phone: true,
            mail: true,
            chat: true,
          },
          Modern: {
            outlook: false,
            teams: false,
          },
          MSTeams: {
            call: false,
            message: false,
            video: false,
          },
        },
      },
    },
    hideShowViews: {
      grid: true,
      list: true,
      tile: true,
    },
    BirthAndAnivFilter: {
      currentDay: false,
      currentWeek: false,
      currentMonth: false,
      upcomingMonth: true,
    },
    ShowHideViewModules: {
      visibleReportIncorrectIcon: true,
      ShowJoyfulAnimation: true,
      ShowExtFields: false,
      ShowAsDropdown: true,
    },
    showDashboard: true,
    dashboardFeature: {
      AvailableForAll: true,
      AvaliableForSpecificUser: false,
    },
    HideShowPronouns: false,
    TopBarFilterView: "Department",
    ExcludeByName: [],
    ExcludedByContains: [],
    FilterAttribute: {
      departments: [],
      jobTitles: [],
      locations: [],
    },
    dashboardSettings: {
      newEmpByMonth: true,
      totalEmpBYDept: true,
      empType: true,
      avgAgeByDept: true,
      avgAgeByLoc: true,
      avgTenByDept: true,
      avgTenByLoc: true,
      genDivByDept: true,
      genDivByLoc: true,
    },
    BirthdayEmailTemplate:
      '<p class="ql-align-center"><strong><em>Happy Birthday [FirstName]!</em></strong></p><p>Dear [FirstName],</p><p>We value your special day just as much as we value you. On your birthday, we send you our warmest and most heartfelt wishes. Our entire corporate family wishes you a very happy birthday and wishes you the best on your special day!</p><p>From,</p><p>Team HR m</p>',
    AnniversaryEmailTemplate:
      '<p class="ql-align-center"><strong><em>Happy Work Anniversary [FirstName]!</em></strong></p><p>Dear [FirstName],</p><p>I hope you know that you are a role model of a perfect employee. You listen to everything with patience and deliver to the company’s needs. Congrats on your work anniversary.</p><p>From,</p>',
    SyncUserInfoFrom: "Google & Imported User",
    showBirthAniv: true,
    AutoLoad: false,
    ShowWeekWorkStatus: false,
    Labels: {
      aboutMe: "About me",
    },
    defaultMobileView: "List",
    Pronouns:"",
    SelectedUpcomingBirthAndAniv: "google",
    ShowWFH: false,
    dashboardAccessUsers: [],
    WorkWeekData: [],
    ShowOrgChart: true,
    AdditionalManagerData: [],
    AssistantData: [],
    CustomFunctionData: [],
    AllUsersData: {
      GoogleUsers: [],
      NonGoogleUser: [],
    },
    OrgChart: {
      chartType: "FullOrgChart",
      chartHead: {
        value: "",
        label: "",
      },
    },
    OrgChartStyles: {
      position: "left",
      headFontSize: "25",
      jobFontSize: "20",
      depFontSize: "20",
      headerText: {
        italic: false,
        underline: false,
        bold: false,
      },
      jobTitle: {
        bold: false,
        italic: false,
        underline: false,
      },
      department: {
        bold: false,
        italic: false,
        underline: false,
      },
    },
    UsersWithHiddenManager:[],
    ExcludeByJobTitle:[],
    UserWithHiddenMobileNumber:[],
    RolesAndPermisstions:[],
  },
  setAppSettings: (value) => set({ appSettings: value }),
  // setAppSettings: (value) => set((state) => ({ appSettings: { ...state.appSettings, ...value } })),
}));

export default useStore;
