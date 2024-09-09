import { create } from "zustand";

export const useFields = create((set) => ({
  departments: [],
  locations: [],
  jobTitles: [],
  emails:[],
  setDepartments: (value) => set({ departments: value }),
  setLocations: (value) => set({ locations: value }),
  setJobTitles: (value) => set({ jobTitles: value }),
  setEmails :(value) =>set({emails:value}),

  additionalManagers :[],
  assistant :[],
  unFormatedUserData :[],
  FormatedUserData :[],
  departmentFields: [],
  jobTitleFields: [],
  locationFields: [],
  excludeOptionsForDomain: [],
  setAdditionalManagers:(value)=>set({additionalManagers:value}),
  setUnFormatedUserData:(value)=>set({unFormatedUserData:value}),
  setFormatedUserData:(value)=>set({FormatedUserData:value}),
  setAssistant:(value)=>set({assistant:value}),
  setDepDropDown: (value) => set({ departmentFields: value }),
  setJobDropDown: (value) => set({ jobTitleFields: value }),
  setLocationDropDown: (value) => set({ locationFields: value }),
  setExcludeOptionsForDomain: (value) =>
    set({ excludeOptionsForDomain: value }),
}));