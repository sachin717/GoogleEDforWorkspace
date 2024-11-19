import { create } from "zustand";

export const useFields = create((set) => ({
  departments: [],
  locations: [],
  jobTitles: [],
  emails: [],
  setDepartments: (value) => set({ departments: value }),
  setLocations: (value) => set({ locations: value }),
  setJobTitles: (value) => set({ jobTitles: value }),
  setEmails: (value) => set({ emails: value }),

  additionalManagers: [],
  assistant: [],
  unFormatedUserData: [],
  FormatedUserData: [],
  departmentFields: [],
  jobTitleFields: [],
  locationFields: [],
  excludeOptionsForDomain: [],
  setAdditionalManagers: (value) => set({ additionalManagers: value }),
  setUnFormatedUserData: (value) => set({ unFormatedUserData: value }),
  setFormatedUserData: (value) => set({ FormatedUserData: value }),
  setAssistant: (value) => set({ assistant: value }),
  setDepDropDown: (value) => set({ departmentFields: value }),
  setJobDropDown: (value) => set({ jobTitleFields: value }),
  setLocationDropDown: (value) => set({ locationFields: value }),
  setExcludeOptionsForDomain: (value) =>
    set({ excludeOptionsForDomain: value }),

  allUsers: [],
  CommandBarItems: {
    ShowOrgChart: false,
    IsExportToCsv: false,
    showBirthAniv: false,
    showDashboard:false,
  },
  showHideSettings:{GroupsOn:false},

  admins:[],
  setAdmins:(value)=>set({admins:value}),
  // setCommandBarItems:(value) => set({ CommandBarItems: value }),
  setCommandBarItems: (value) => set((state) => ({ CommandBarItems: { ...state.CommandBarItems, ...value } })),
  setShowHideSettings: (value) => set((state) => ({ showHideSettings: { ...state.showHideSettings, ...value } })),
  setAllUsers: (value) => set({ allUsers: value }),

  usersWithHiddenManager :[],
  usersWithHiddenPhoneNo : [],
  setUsersWithHiddenManager:(value) =>set({usersWithHiddenManager:value}),
  setUsersWithHiddenPhoneNo:(value)=>set({usersWithHiddenPhoneNo:value}),
}));

export const useLists = create((set) => ({
  imagesList : {},
  usersList:{},
  settingList:{},
  setImagesList:(value)=>set({imagesList:value}),
  setUsersList : (value)=>set({usersList:value}),
  setSettingList:(value)=>set({settingList:value})
}))
