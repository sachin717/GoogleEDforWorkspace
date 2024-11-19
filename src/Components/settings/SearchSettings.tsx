import { ActionButton, Icon, Label, SearchBox } from "@fluentui/react";
import { useEffect, useState } from "react";
import { useLanguage } from "../../Language/LanguageContext";

const SearchSettings = ({
  openBdayAnniTemplt,
  openPanelUpldLogo,
  setShowCollaborationPanel,
  setOpenEmailNotificationPanel,
  setShowFilterAttributeModal,
  openPanelHomeCustm,
  openPanel3,
  openPanel0,
  setLangModel,
  openPanelOrgChartType,
  openPanelOrgName,
  openPanelProfileCustomUrlIcon,
  openPanelRecordLoad,
  openPanelRolePermission,
  openPanelSearchFltr,
  OpenEmpInfoAlignModal,
  openPanelDashboardFeaturePanel,
  openPanelWidthCustm,
  openPanelImgPrfTag,
  setLabelModal,
  setViewsSHMPanel,
  openPanelShortBy,
  openModalViews,
  openPanel2,
  OpenAutoLoad,
  openPanelCustomField,
  setTopBarModalVisible,
  setOpenExecutiveAssistantRelationship,
  openPronouns,
  openImportUsers,
  isOpenShowGrp,
  OpenUpcomingBithAndAnivAdv,
  setShowOrgChart,
  setShowHomePage,
  OpenSyncUserFrom,
  openExcludeUserContainsListPanel,
  openPanel5,
  openExcludeUserLocListPanel,
  openExcludeUserEmailListPanel,
  setOpenCustomFunctionPanel,
  setOpenAdditionalManagerSetting,
  openExcludeUserListPanel,
  setRestrictedPanel,
  setHideManagerPanel,
  setHideMobile
}) => {
  const { translation } = useLanguage();
  const [search, setSearch] = useState("");

  const [filteredGeneralList, setFilteredGeneralList] = useState([]);
  const [filteredAdvanceList, setFilteredAdvanceList] = useState([]);
  const [filteredExcludeList, setFilteredExcludeList] = useState([]);
  const [filteredViewList, setFilteredViewList] = useState([]);

  const GeneralList = [
    {
      iconName: "BirthdayCake",
      translateKey: "Advance8",
      label: "Birthday and anniversary templates",
      onClick: openBdayAnniTemplt,
    },
    {
      iconName: "VerifiedBrand",
      translateKey: "brandlogo",
      label: "Brand logo",
      onClick: openPanelUpldLogo,
    },
    {
      iconName: "Commitments",
      translateKey: "Collaboration",
      label: "Collaboration",
      onClick: () => setShowCollaborationPanel(true),
    },
    {
      iconName: "VerifiedBrand",
      translateKey: "FilterAttributes",
      label: "Filter attributes",
      onClick: () => setShowFilterAttributeModal(true),
    },
    {
      iconName: "Home",
      translateKey: "CustomIconHome",
      label: "Home page custom icon",
      onClick: openPanelHomeCustm,
    },
    {
      iconName: "LocaleLanguage",
      translateKey: "LanguagesText",
      label: "Languages",
      onClick: () => setLangModel(true),
    },
    {
      iconName: "AreaChart",
      translateKey: "OrganizationChart",
      label: "Organization chart",
      onClick: openPanelOrgChartType,
    },
    // {
    //   iconName: "DateTime",
    //   translateKey: "Dateofjoining",
    //   label: "Date of Joining",
    //   onClick: null,
    // },
    {
      iconName: "Org",
      translateKey: "OrganizationNameLabel",
      label: "Organization name",
      onClick: openPanelOrgName,
    },
    {
      iconName: "ContactCard",
      translateKey: "profilecardcustomicon",
      label: "Profile card custom url icon",
      onClick: openPanelProfileCustomUrlIcon,
    },
    {
      iconName: "RecurringTask",
      translateKey: "Recordstoload",
      label: "Records to load",
      onClick: openPanelRecordLoad,
    },
    {
      iconName: "VerifiedBrand",
      translateKey: "Rolesandpermissions",
      label: "Role and permissions",
      onClick: openPanelRolePermission,
    },
    {
      iconName: "Search",
      translateKey: "Searchfilters",
      label: "Search filters",
      onClick: openPanelSearchFltr,
    },
 
  ];

  const ViewList = [
    {
      iconName: "AlignHorizontalLeft",
      translateKey: "PCAlignPosition",
      label: "Align employee basic information",
      onClick: OpenEmpInfoAlignModal,
    },
    // {
    //   iconName: "Balloons",
    //   translateKey: "BallonLabel",
    //   label: "Birthday and work anniversary images",
    //   onClick: OpenPanelBdayAnniImg,
    // },
    // {
    //   iconName: "Filter",
    //   translateKey: "Clearalphabet",
    //   label: "Clear alphabet selection with reset filter",
    //   onClick: OpenPanelClearAlphaFilter,
    // },
    {
      iconName: "BIDashboard",
      translateKey: "DBFeature",
      label: "Dashboard feature",
      onClick: openPanelDashboardFeaturePanel,
    },
  
    {
      iconName: "LargeGrid",
      translateKey: "Gridwidth",
      label: "Grid width",
      onClick: openPanelWidthCustm,
    },
    {
      iconName: "Hide3",
      translateKey: "hidemanager",
      label: "Hide manager of specific users",
      onClick: ()=>setHideManagerPanel(true),
    },
    {
      iconName: "Hide3",
      translateKey: "Hidemobile",
      label: "Hide mobile numbers of specific users",
      onClick: ()=>setHideMobile(true),
    },
    {
      iconName: "Contact",
      translateKey: "Imageprofiletag",
      label: "Image profile tag",
      onClick: openPanelImgPrfTag,
    },
    {
      iconName: "Tag",
      translateKey: "Labels",
      label: "Labels",
      onClick: () => setLabelModal(true),
    },
    // {
    //   iconName: "CellPhone",
    //   translateKey: "Mobiledefaultview",
    //   label: "Mobile default view",
    //   onClick: openPanelDefaultMobViews,
    // },
    {
      iconName: "View",
      translateKey: "HideShowText",
      label: "Show or hide modules",
      onClick: () => setViewsSHMPanel(true),
    },
    {
      iconName: "SortLines",
      translateKey: "Sortby",
      label: "Sort by",
      onClick: openPanelShortBy,
    },
    
    {
      iconName: "View",
      translateKey: "Views",
      label: "Views",
      onClick: openModalViews,
    },
  ];

  const ExcludeList = [
    {
      iconName: "InternetSharing",
      label: "Exclude domains",
      translateKey: "Excludedomains",
      onClick: openExcludeUserListPanel,
    },
    {
      iconName: "CustomList",
      label: "Exclude user by department",
      translateKey: "ExcludeUserByDept",
      onClick: openPanel2,
    },
    {
      iconName: "BusinessCenterLogo",
      label: "Exclude user by job title",
      translateKey: "ExcludeUserByJobTitle",
      onClick: openPanel3,
    },                               
    {
      iconName: "UserOptional",
      label: "Exclude user by name",
      translateKey: "ExcludeUserByName",
      onClick: openPanel0,
    },
    {
      iconName: "TimeSheet",
      label: "Exclude user by location",
      translateKey: "ExcludeUserByLocation",
      onClick: openExcludeUserLocListPanel,
    },
    {
      iconName: "ExcelDocument",
      label: "Exclude user by using csv file",
      translateKey: "sett",
      onClick: openPanel5,
    },
    {
      iconName: "StreamingOff",
      label: "Exclude user by email",
      translateKey: "ExcludeUserByEmail",
      onClick: openExcludeUserEmailListPanel,
    },
    {
      iconName: "FabricUserFolder",
      label: "Exclude user contains",
      translateKey: "ExcludeUserContains",
      onClick: openExcludeUserContainsListPanel,
    },
  ];

  const AdvanceList = [
    {
      iconName: "ManagerSelfService",
      label: "Additional manager",
      translateKey: "addNlMang",
      onClick: setOpenAdditionalManagerSetting,
    },
    {
      iconName: "ProgressRingDots",
      label: "Auto load instead load more button",
      translateKey: "autoload",
      onClick: OpenAutoLoad,
    },

    {
      iconName: "AddTo",
      label: "Custom fields",
      translateKey: "Customfields",
      onClick: openPanelCustomField,
    },
    {
      iconName: "Permissions",
      label: "Custom function",
      translateKey: "Customfunction",
      onClick: () => setOpenCustomFunctionPanel(true),
    },
    {
      iconName: "PageListFilter",
      label: "Default view of topbar filters",
      translateKey: "defaultviewTB",
      onClick: () => setTopBarModalVisible(true),
    },
    {
      iconName: "ConnectContacts",
      label: "Executive Assistant relationship",
      translateKey: "Executive",
      onClick: () => setOpenExecutiveAssistantRelationship(true),
    },
    // {
    //   iconName: "Group",
    //   label: "Filter upcoming birthdays & work anniversaries",
    //   translateKey: "FltUpcmingBdAnni",
    //   onClick: OpenFilterBirthAndAniv,
    // },
    {
      iconName: "FrontCamera",
      label: "Import users pronouns",
      translateKey: "importuserspronouns",
      onClick: openPronouns,
    },
    {
      iconName: "Lock",
      label: "Restricted access",
      translateKey: "RestrictedAccess",
      onClick: ()=>setRestrictedPanel(true),
    },
    {
      iconName: "Import",
      label: "Import users",
      translateKey: "importusers",
      onClick: openImportUsers,
    },
    {
      iconName: "UserSync",
      label: "Sync user information from",
      translateKey: "SyncUsersInfo",
      onClick: OpenSyncUserFrom,
    },
    // {
    //   iconName: "Group",
    //   label: "Show groups",
    //   translateKey: "showgroups",
    //   onClick: isOpenShowGrp,
    // },
    // {
    //   iconName: "View",
    //   label: "Show or hide modules",
    //   translateKey: "HideShowText",
    //   onClick: () => setIshowHideModuleOpenAdvance(true),
    // },
    {
      iconName: "Group",
      label: "Birthdays & work anniversaries",
      translateKey: "BirthdaysAndAnniv",
      onClick: OpenUpcomingBithAndAnivAdv,
    },
    {
      iconName: "MailAlert",
      label: "Birthday and anniversary notification",
      translateKey: "BirthdayAnniversaryNotification",
      onClick: ()=>setOpenEmailNotificationPanel(true),
    },
  ];

  const filterList = (list: any, searchTerm: string) => {
    return list.filter((item: any) =>
      item.label.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  };

  useEffect(() => {
    setFilteredAdvanceList(filterList(AdvanceList, search));
    setFilteredExcludeList(filterList(ExcludeList, search));
    setFilteredGeneralList(filterList(GeneralList, search));
    setFilteredViewList(filterList(ViewList, search));
  }, [search]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px 0px",
          position: "relative",
        }}
      >
        <SearchBox
          placeholder="Search settings..."
          iconProps={{ iconName: "Search" }}
          styles={{ root: { width: "45%" } }}
          value={search}
          onChange={(e: any) => setSearch(e?.target?.value || "")}
        />
        <div>
          <ActionButton
            title={translation.Close}
            iconProps={{ iconName: "ChromeClose" }}
            styles={{
              root: {
                position: "absolute",
                right: "0",
              },
              icon: {
                color: "#000 !important",
              },
            }}
            onClick={() => {
              setShowOrgChart(false);
              setShowHomePage(true);
              document.getElementById(`letter-ALL`).click();
              // filterByLetter('ALL');
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "5px",
        }}
      >
        {filteredGeneralList.length > 0 && (
          <GeneralSetting
            translation={translation}
            GeneralList={filteredGeneralList}
          />
        )}

        {filteredViewList.length > 0 && (
          <ViewSetting translation={translation} ViewList={filteredViewList} />
        )}

        {filteredExcludeList.length > 0 && (
          <ExcludeSetting
            translation={translation}
            ExcludeList={filteredExcludeList}
          />
        )}

        {filteredAdvanceList.length > 0 && (
          <AdvanceSetting
            translation={translation}
            AdvanceList={filteredAdvanceList}
          />
        )}
      </div>
    </div>
  );
};

const container: React.CSSProperties = {
  backgroundColor: "#f8f8f8",
  height: "fit-content",
  display: "inline-block",
  margin: "5px",
  padding: "0px",
  listStyleType: "none",
  width: "100%",
  maxWidth: "100%",
};

const header: React.CSSProperties = {
  padding: "0px 0px 5px 10px",
  borderBottom: "1px solid #cacaca",
  margin: "10px 0px 0px 0px",
  color:"rgb(0,120,212)",
};

const list: React.CSSProperties = {
  display: "flex",
  alignItems:"center",
  fontSize: "14px",
  margin: "0px 15px 15px 0px",
  cursor: "pointer",
};

const GeneralSetting = ({ GeneralList, translation }) => {
  return (
    <div style={container}>
      <span>
        <Label style={header}>{translation.General || "General"}</Label>
      </span>
      <div style={{ padding: "10px 10px" }}>
        {GeneralList.map((x: any, i: number) => (
          <li key={i} style={list} onClick={x.onClick}>
            <Icon style={{color:"rgb(0,120,212)"}} iconName={x.iconName} />
            <span style={{ marginLeft: "5px" }}>
              {translation[x.translateKey]}
            </span>
          </li>
        ))}
      </div>
    </div>
  );
};

const ViewSetting = ({ ViewList, translation }) => {
  return (
    <div style={container}>
      <span>
        <Label style={header}>{translation.Views || "Views"}</Label>
      </span>
      <div style={{ padding: "10px 10px" }}>
        {ViewList.map((x: any, i: number) => (
          <li key={i} style={list} onClick={x.onClick}>
            <Icon style={{color:"rgb(0,120,212)"}} iconName={x.iconName} />
            <span style={{ marginLeft: "5px" }}>
              {translation[x.translateKey]}
            </span>
          </li>
        ))}
      </div>
    </div>
  );
};

const ExcludeSetting = ({ ExcludeList, translation }) => {
  return (
    <div style={container}>
      <span>
        <Label style={header}>{translation.Exclude || "Exclude"}</Label>
      </span>
      <div style={{ padding: "10px 10px" }}>
        {ExcludeList.map((x: any, i: number) => (
          <li key={i} style={list} onClick={x.onClick}>
            <Icon style={{color:"rgb(0,120,212)"}} iconName={x.iconName} />
            <span style={{ marginLeft: "5px" }}>
              {translation[x.translateKey]}
            </span>
          </li>
        ))}
      </div>
    </div>
  );
};

const AdvanceSetting = ({ AdvanceList, translation }) => {
  return (
    <div style={container}>
      <span>
        <Label style={header}>{translation.Advanced || "Advanced"}</Label>
      </span>
      <div style={{ padding: "10px 10px" }}>
        {AdvanceList.map((x: any, i: number) => (
          <li key={i} style={list} onClick={x.onClick}>
            <Icon style={{color:"rgb(0,120,212)"}} iconName={x.iconName} />
            <span style={{ marginLeft: "5px" }}>
              {translation[x.translateKey]}
            </span>
          </li>
        ))}
      </div>
    </div>
  );
};

export default SearchSettings;
