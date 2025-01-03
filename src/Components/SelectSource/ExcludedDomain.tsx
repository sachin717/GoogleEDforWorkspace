import { PrimaryButton } from "@fluentui/react";
import { Checkbox, Label, SearchBox } from "@fluentui/react";
import React, { useEffect, useRef } from "react";
import useStore, { useSttings } from "./store";
import Alert from "../Utils/Alert";
import { SweetAlerts } from "./Utils/SweetAlert";
import "sweetalert2/dist/sweetalert2.css";
import Styles  from "../SCSS/Ed.module.scss"
import ReactSelect from "react-select";
import { Icon } from "office-ui-fabric-react";
import { useLanguage } from "../../Language/LanguageContext";
import { SETTING_LIST, updateSettingJson } from "../../api/storage";
import { useLists } from "../../context/store";
var allItems = [];
let settingsData:any;
function ExcludedDomain({excludeOptionsForDomain,setSelectedExcludedDomian,selectedExcludedDomian,appSettings,setAppSettings,SweetAlertDomain}) {
    const {excludeByDomain,changeExcludeByDomain} = useStore();
   const {translation}=useLanguage();
   const { usersList} = useLists();
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [excludeDomain, setExcludeDomain] = React.useState(appSettings?.ExcludeByDomain);
    const [excludedValues, setExcludedValues] = React.useState<any>([])
    const [showButton, setShowButton] = React.useState(appSettings?.ExcludeByDomain?.length>0?true:false);
    const [refresh, setRefresh] = React.useState(false);
    const [saved, setSaved] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [alert, setAlert] = React.useState(false);
    const [saveMsg, setSaveMsg] = React.useState(null);
    const [alertMsg, setAlertMsg] = React.useState("");
 
    const [alertH, setAlertH] = React.useState(false);
    // const [alertMsg, setAlertMsg] = React.useState("");
    const KEY_NAME3 = "ExcludeByDomain"
    allItems=appSettings?.ExcludeByDomain;
  
 
    const ondeptchange = (checked, value: string) => {
        var filteredDept = [...excludeDomain];
        filteredDept.filter((x) => x.value == value)[0].checked =
          checked.target.checked;
        setExcludeDomain(filteredDept);
      };
      const searchItems = (text: string) => {
        if (text == "") {
          setExcludeDomain([...allItems]);
          setShowButton(allItems?.length > 0 ? true : false);
          return;
        }
        const newArray = [...excludeDomain].filter(
          (x) => x?.value?.toLowerCase()?.indexOf(text) > -1
        );
        setExcludeDomain(newArray);

        if (newArray?.length == 0) {
          setShowButton(false);
        } else {
          setShowButton(true);
        }
      };
    
      
    const include = ()=>{
        const updatedDepartments = [...excludeDomain]
        .filter((x) => x.checked == true)
          .map((y) => {
            return y.value;
          });
          if(updatedDepartments?.length==0)
          {
            setAlertMsg("Please select department!");
            // setAlert(true);
            setTimeout(() =>{
          
            }, 5000);
            return false;
          }
          const updatedexcludeByDomain =appSettings?.ExcludeByDomain?.filter(
            (item) =>  !updatedDepartments?.includes(item?.value)  
          );
        //   changeExcludeByDomain(updatedexcludeByDomain);
          setExcludeDomain(updatedexcludeByDomain);
          
          const updatedParsedData = { ...appSettings, [KEY_NAME3]: updatedexcludeByDomain };
          if(Object.keys(appSettings)?.length >0){
            updateSettingJson(SETTING_LIST,updatedParsedData);
            setAppSettings(updatedParsedData)
           
          setExcludeDomain(updatedParsedData?.ExcludeByDomain)
          allItems=updatedParsedData?.ExcludeByDomain;
        //   setSaved(true);
        //   setTimeout(()=>{
        //     setSaved(false);
        //   },3000)
        SweetAlertDomain("success","Setting Saved Successfully....");
          }
          console.log(updatedParsedData,'updated')
        // excludeByDomain.slice()
      }
      let searchRef=useRef(null);
      let searchBoxRef=useRef(null);
      const handleClickSearch = () => {
        setIsExpanded(true);
        if (searchBoxRef.current) {
          const searchBoxInput = searchBoxRef.current;
          console.log("searchBoxInput",searchBoxInput)
          if (searchBoxInput) {
            searchBoxInput.focus();
          }
        }
      };
      function handleBlur (e) {
        
        setTimeout(() => {
          
         
          if (!searchRef.current.contains(document.activeElement)) {
            setIsExpanded(false);

          }
        }, 100);
      };
   
      function handleExcludeDomain() {
        if (excludedValues?.length) {
          const currentExcluded = appSettings?.ExcludeByDomain || [];
          const isDataPresent = excludedValues.every(value => currentExcluded?.includes(value));
          
          if (isDataPresent) {
            SweetAlertDomain("info", "Data already exists.");
          } else {
            const updatedExcluded = [...currentExcluded, ...excludedValues];
            const data = { ...appSettings, ExcludeByDomain: updatedExcluded };
            setExcludeDomain(updatedExcluded);
            updateSettingJson(SETTING_LIST,data);
            console.log("data", data);
            setAppSettings(data);
            SweetAlertDomain("success", translation?.SettingSaved);
          }
          setExcludedValues([]);
        } else {
          SweetAlertDomain("info", "Please Select domain(s)");
        }
        setShowButton(true);
      }
      
    
  return(
<>
<div className={"tabMainDiv"} >

      <div style={{ padding: "0%"}}>
        
            <Label>{translation.SelectDomainsToExclude||"Select domain(s) to exclude"}</Label>
           <div style={{ display: "flex", justifyContent: "space-between" }}>
  <div style={{display:"flex",alignItems:"end",gap:"8px"}}>
    <ReactSelect
      // options={excludeOptionsForDomain}
      options={appSettings?.SyncUserInfoFrom === "importedUser"
        ? usersList?.Users.map(item => ({
            value: item?.email.split("@")[1],
            label:  item?.email.split("@")[1]
          })) ?? []
        : excludeOptionsForDomain}
      onChange={(excluded) => setExcludedValues(excluded)}
      value={excludedValues}
      isMulti
      menuShouldScrollIntoView
      menuPosition="fixed"
      maxMenuHeight={150}
    />
  {excludedValues?.length ? <div>
      <PrimaryButton
           text={translation.Exclude||"Exclude"}
        onClick={() => handleExcludeDomain()}
      />
    </div>:""
}
  </div>
<div style={{display:"flex",alignItems:"center"}}>


  <div
    style={{
      paddingTop: "1%",
      width: isExpanded ? "200px" : "0px",
      transition: "width 0.45s ease-in-out",
      // position: "absolute",
      // right: "10px",
      overflow: "hidden",
    }}
    ref={searchRef}
    onBlur={handleBlur}
  >
    <SearchBox
      componentRef={searchBoxRef}
      onSearch={(newValue) => searchItems(newValue)}
      onChange={(e, newValue) => searchItems(newValue)}
      onClear={() => {
        setShowButton(allItems?.length > 0);
        setExcludeDomain([...allItems]);
      }}
      placeholder={translation.search||"Search"}
      iconProps={{ iconName: "search" }}
    />
  </div>

  {!isExpanded && (
    <Icon
      style={{ fontSize: "16px" ,cursor:"pointer",padding:"2px"}}

      iconName="Search"
      onClick={handleClickSearch}
    />
  )}
    </div>
</div>

       
      
      </div>
      <div>
        <table className={"excludeTable"}>
          <thead>
            <tr>
              <th>{translation.Action||"Action"}</th>
              <th>{translation.Domain||"Domain"}</th>
              <th>{translation.Status||"Status"}</th>
            </tr>
          </thead>
          {showButton ? (
            <tbody>
              {excludeDomain?.map((x) => {
                return (
                  <tr>
                    <td>
                      <Checkbox
                        checked={x.checked}
                        title={x.value}
                        onChange={(checked) => ondeptchange(checked, x.value)}
                      />
                    </td>
                    <td>{x.value}</td>
                    <td>{"Excluded"}</td>
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={3}>
                 
                {translation.NoRecordsFound||"No Records Found"}
                 
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      
      {excludeDomain?.length ? <div><PrimaryButton text={translation?.Include||"Include"} onClick={include} /></div>:""}
    </div>
</>
  )
  
 
}
export default ExcludedDomain;
