export const defaultUserList = {
  Users: [],
  DashboardSpecificUsers: [],
  IsAdmin: "",
  IsSpecificUser: [],
};

export const defaultImagesList = {
  BrandLogo: "",
  BirthdayAndAnniversaryImage: "",
  BirthTempImage: "",
  AnnivTempImage: "",
};

export const defaultSettingList = {
  DefaultView: "Grid",
  sortby: "givenName",
  gridWidth: 150,
  ReportEmails:"",
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
    },
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
      checkbox: false,
    },
  ],
  BirthAndAnivDaysBefore:0,
  GroupsOn: false,
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
    currentWeekAndNextWeek: false,
    currentMonth: true,
    currentMonthAndNextMonth:false,
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
  Pronouns: "",
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
  UsersWithHiddenManager: [],
  ExcludeByJobTitle: [],
  UserWithHiddenMobileNumber: [],
  RolesAndPermisstions:[],
};
