import * as React from "react";
import { Dropdown, Icon, SearchBox } from "@fluentui/react";
import { removeDuplicatesFromObject } from "../Helpers/HelperFunctions";
import { useSttings } from "../SelectSource/store";
import useStore from "../SelectSource/store";
import MultiSelect from "react-select";
import { useFields } from "../../context/store";
import ImportUsers from "../SelectSource/ImportUsers";

const searchBoxStyles = {
  root: {
    border: "0px",
    float: "left",
    borderBottom: "1px solid #ddd",
    selectors: {
      "&:after": {
        border: "none",
      },
      ".ms-SearchBox-field::placeholder": {
        color: "#aaa",
      },
    },
  },
};

const stylesForDropDown: any = {
  control: (provided, state) => ({
    ...provided,
    width: 150,
    height: 29,
    border: "none",
    borderBottom: "1px solid #DDD",
    borderRadius: "0px",
    minHeight: "32px",
    boxShadow: state.isFocused ? `0 0 0 .5px black` : provided.boxShadow,
    borderColor: state.isFocused ? `black` : provided.borderColor,
    "&:hover": {
      borderColor: state.isFocused ? `black` : provided.borderColor,
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#AAA",
    fontSize: "15px",
  }),
};

const SearchFilters = ({
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
}) => {
  // console.log("gpop", groupsOptions);
  const { appSettings } = useSttings();
  const { departmentFields, jobTitleFields,setDepDropDown } = useFields();
  const ShowAsDropdown = appSettings?.ShowHideViewModules?.ShowAsDropdown;

  const [showMobileFreeSearch, setShowMobileFreeSearch] = React.useState(false);
  const [showMobileViewSearch, setShowMobileViewSearch] = React.useState(false);
  const [whichViewIsEnabled, setWhichViewIsEnabled] = React.useState("Grid");
  const dropsDowns = ["Departments", "Title"];
  const [searchValues, setSearchValues] = React.useState({
    name: "",
    departments: "",
    title: "",
    "free search": "",
  });
  const [dropdownValues, setDropdownValues] = React.useState({});

  const [timeoutId, setTimeoutId] = React.useState(null);
  const freeSearchRef = React.useRef(null);

  const getDeprtmentPivots = ()=>{
    const dep = UserArray.map((x)=>({value:x.department, label:x.department}));
    const x = removeDuplicatesFromObject(dep,"value");
    const sd = appSettings?.FilterAttribute.departments;
    const ll = sd.map((x)=>({value:x.Department,label:x.Department}));
    const y = [...x, ...ll];
    const xx = removeDuplicatesFromObject(y,"value");
    setDepDropDown(xx);
  }

  React.useEffect(()=>{
    getDeprtmentPivots();
  },[])

  React.useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  function handleFreeSearch(value, mode) {
    setSearchValues((prevValues) => ({
      ...prevValues,
      [mode]: value,
    }));

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const id = setTimeout(() => {
      optimization(value, mode);
    }, 300);

    setTimeoutId(id);
  }

  async function handleClearFilter() {
      // if (appSettings?.clearAlphaFilter) {
        document.getElementById("letter-All").click();
      // }
      setSearchValues({
        name: "",
        departments: "",
        title: "",
        "free search": "",
      });
      document.querySelectorAll(".topbarFilter").forEach(
        (x)=>{
          if( x.classList.contains("topbarfilterBorderBottom")){
            x.classList.remove("topbarfilterBorderBottom");
            x.classList.add("onInActiveTab")
          }
        }
      )
    setDropdownValues([]);
  }

  let allView = [
    
  
    {
      title: "Grid View",
      iconName: "ContactCard",
      name: "Grid",
      onclick: () => {
        setView("Grid");
        setWhichViewIsEnabled("Grid");
        setisGrid(true);
        setisList(false);
        setisTile(false);
        setImpotedUser(false);
        getDeprtmentPivots()
      },
    },
    {
      title: "List View",
      iconName: "BulletedList",
      name: "List",
      onclick: () => {
        setView("List");
        setWhichViewIsEnabled("List");
        setisGrid(false);
        setisList(true);
        setisTile(false);
        setImpotedUser(false);
        getDeprtmentPivots();
      },
    },
    {
      title: "Tile View",
      iconName: "Waffle",
      name: "Tile",
      onclick: () => {
        setView("Tile");
        setWhichViewIsEnabled("Tile");
        setisGrid(false);
        setisList(false);
        setisTile(true);
        setImpotedUser(false);
        getDeprtmentPivots();
      },
    },
  ];

  const filterViews = (views, settings) => {
    return views.filter((view) => {
      return settings[view.name.toLowerCase()] === true;
    });
  };
  function showNonM365(){
    setImpotedUser(true);
    setView("NonM365");
    setWhichViewIsEnabled("NonM365");
    setisGrid(false);
    setisList(false);
    setisTile(false);
    
    
  }

  allView = filterViews(allView, appSettings?.hideShowViews);
  return (
    <div>
      <div className="search-con">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10px",
            width: "100%",
          }}
        >
          <div>
            {parsedData && (
              <div
                className="desktopfilters"
                style={{ display: "flex", gap: "20px", alignItems: "center" }}
              >
                <SearchBox
                  onBlur={() => setShowMobileFreeSearch(false)}
                  componentRef={freeSearchRef}
                  className="searchBoxStyles"
                  styles={searchBoxStyles}
                  placeholder="Free Search"
                  onEscape={handleClearFilter}
                  onChange={(e) =>
                    handleFreeSearch(e?.target?.value || "", "free search")
                  }
                  value={searchValues["free search"]}
                />
                {appSettings.SearchFiltersPrope.map(
                  (filter: any, index: number) => {
                    if (filter.checkbox) {
                      return ShowAsDropdown ? (
                        dropsDowns.includes(filter.name) ? (
                          <MultiSelect
                            key={index}
                            styles={stylesForDropDown}
                            value={dropdownValues[filter.name] || []}
                            isClearable={true}
                            placeholder={filter.name}
                            options={
                              filter.name == "Departments"
                                ? departmentFields
                                : jobTitleFields
                            }
                            onChange={(e: any) => {
                              handleFreeSearch(
                                e?.value || "",
                                filter.name.toLowerCase()
                              );
                              setDropdownValues((prev) => ({
                                ...prev,
                                [filter.name]: e?.value
                                  ? { label: e?.value, value: e?.value }
                                  : [],
                              }));
                            }}
                          />
                        ) : (
                          // <SearchBox
                          //   key={index}
                          //   autoComplete="off"
                          //   className="searchBoxStyles"
                          //   styles={searchBoxStyles}
                          //   placeholder={filter.name}
                          //   value={searchValues[filter.name.toLowerCase()]}
                          //   onEscape={handleClearFilter}
                          //   onClear={handleClearFilter}
                          //   onChange={(e: any) =>
                          //     if(filter.name=="Custom Fields"){

                          //     }else{
                          //     handleFreeSearch(
                          //       e?.target?.value || "",
                          //       filter.name.toLowerCase()
                          //     )
                          //   }
                          // }
                          // />
                          <SearchBox
                            key={index}
                            autoComplete="off"
                            className="searchBoxStyles"
                            styles={searchBoxStyles}
                            placeholder={filter.name}
                            value={searchValues[filter.name.toLowerCase()]}
                            onEscape={handleClearFilter}
                            onClear={handleClearFilter}
                            onChange={(e: any) => {
                              if (filter.name === "Custom Fields") {
                                handleFreeSearch(
                                  e?.target?.value || "",
                                  "custom"
                                );
                              } else {
                                handleFreeSearch(
                                  e?.target?.value || "",
                                  filter.name.toLowerCase()
                                );
                              }
                            }}
                          />
                        )
                      ) : (
                        <SearchBox
                          key={index}
                          autoComplete="off"
                          className="searchBoxStyles"
                          styles={searchBoxStyles}
                          placeholder={filter.name}
                          value={searchValues[filter.name.toLowerCase()] || ""}
                          onEscape={handleClearFilter}
                          onClear={handleClearFilter}
                          onChange={(e: any) =>
                            handleFreeSearch(
                              e?.target?.value || "",
                              filter.name.toLowerCase()
                            )
                          }
                        />
                      );
                    }
                  }
                )}
                {appSettings?.GroupsOn ? (
                  <MultiSelect
                    // options={filterOptions}
                    // isMulti
                    isClearable
                    placeholder="Groups"
                    styles={stylesForDropDown}
                    options={groupsOptions}
                    value={selectedGrp}
                    onChange={(value) => filterByTaxonomySearchMultiGrp(value)}
                  />
                ) : (
                  ""
                )}

                {parsedData?.SearchFiltersPrope && (
                  <div
                    style={{
                      fontSize: "20px",
                      color: "rgb(0, 120, 212)",
                      cursor: "pointer",
                    }}
                  >
                    <Icon
                      iconName="ClearFilter"
                      title="Clear Filters"
                      onClick={handleClearFilter}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="mbviewSearch">
              {!showMobileViewSearch && (
                <Icon
                  iconName="search"
                  onClick={() => {
                    setShowMobileViewSearch(true);
                    freeSearchRef.current?.focus();
                  }}
                />
              )}

              {showMobileViewSearch && (
                <SearchBox
                  onBlur={() => setShowMobileFreeSearch(false)}
                  componentRef={freeSearchRef}
                  className="searchBoxStyles"
                  styles={searchBoxStyles}
                  placeholder="Free Search"
                  onEscape={handleClearFilter}
                  onChange={(e) =>
                    handleFreeSearch(e?.target?.value || "", "free search")
                  }
                  value={searchValues["free search"]}
                />
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
          {appSettings?.SyncUserInfoFrom?.toLowerCase() != "importeduser"? parsedData?.SearchFiltersPrope && <Icon title="Non google User" iconName="AddGroup"  style={
                      view === "NonM365"
                        ? {
                            fontSize: "20px",
                            color: "rgb(0, 112, 220)",
                            borderBottom: "2px solid rgb(0, 112, 220)",
                            cursor: "pointer",
                          }
                        : {
                            fontSize: "20px",
                            color: "rgb(0, 112, 220)",
                            cursor: "pointer",
                          }
                    } onClick={showNonM365} />:""}
            {parsedData?.SearchFiltersPrope &&
              allView
                .filter(({ name }) => {
                  if (name == "Grid" && !appSettings?.hideShowViews?.grid)
                    return false;
                  if (name == "List" && !appSettings?.hideShowViews?.list)
                    return false;
                  if (name == "Tile" && !appSettings?.hideShowViews?.tile)
                    return false;
              
                  return true;
                })
                .map(({ title, iconName, name, onclick }) => (
                  <span
                    key={name}
                    style={
                      view === name
                        ? {
                            fontSize: "20px",
                            color: "rgb(0, 112, 220)",
                            borderBottom: "2px solid rgb(0, 112, 220)",
                            cursor: "pointer",
                          }
                        : {
                            fontSize: "20px",
                            color: "rgb(0, 112, 220)",
                            cursor: "pointer",
                          }
                    }
                  >
                    <Icon title={title} onClick={onclick} iconName={iconName} />
                  </span>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
