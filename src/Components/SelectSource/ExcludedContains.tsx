import { PrimaryButton } from "@fluentui/react";
import { Checkbox, Label, SearchBox } from "@fluentui/react";
import React, { useEffect, useRef, useState } from "react";
import useStore, { useSttings } from "./store";
import Alert from "../Utils/Alert";
import ReactSelect from "react-select";
import { Icon, TextField } from "office-ui-fabric-react";
import { useLanguage } from "../../Language/LanguageContext";
import { SETTING_LIST, updateSettingJson } from "../../api/storage";
var allItems = [];
let settingsData:any;
function ExcludedContains({appSettings,setAppSettings,SweetAlertContains}) {
    const {excludeByDomain,changeExcludeByDomain} = useStore();
    const{translation}=useLanguage();
   
    const [excludedValues, setExcludedValues] = useState<any>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [excludedByContains, setExcludedByContains] = React.useState(appSettings?.ExcludedByContains);
    const [showButton, setShowButton] = React.useState(appSettings?.ExcludedByContains?.length>0?true:false);
    const KEY_NAME3 = "ExcludedByContains"
    allItems=appSettings?.ExcludeByContains;
    const searchRef = useRef(null);
    const searchBoxRef = useRef(null);
    useEffect(()=>{
      setExcludedByContains(appSettings?.ExcludedByContains);
    },[])
  
    const handleClickSearch = () => {
      setIsExpanded(true);
      if (searchBoxRef.current) {
          searchBoxRef.current.focus();
      }
  };

  const handleBlur = () => {
      setTimeout(() => {
          if (!searchRef.current.contains(document.activeElement)) {
              setIsExpanded(false);
          }
      }, 100);
  };
    const ondeptchange = (checked, value: string) => {
        var filteredDept = [...excludedByContains];
        filteredDept.filter((x) => x.value == value)[0].checked =
          checked.target.checked;
        setExcludedByContains(filteredDept);
      };
      const searchItems = (text: string) => {
        if (text == "") {
          setExcludedByContains([...appSettings?.ExcludedByContains]);
          setShowButton(appSettings?.ExcludedByContains?.length > 0 ? true : false);
          return;
        }
        const newArray = [...excludedByContains].filter(
          (x) => x.value.toLowerCase().indexOf(text) > -1
        );
        setExcludedByContains(newArray);
        if (newArray?.length == 0) {
          setShowButton(false);
        } else {
          setShowButton(true);
        }
      };
    
      
    const include = ()=>{
        const updatedEmails = [...excludedByContains]
        .filter((x) => x.checked == true)
          .map((y) => {
            return y.value;
          });
          if(updatedEmails?.length==0)
          {
            SweetAlertContains("Please select User !");
          
            return false;
          }
          const updatedexcludeByContains =appSettings?.ExcludedByContains.filter(
            (item) =>  !updatedEmails.includes(item.value)  
          );
        //   changeExcludeByDomain(updatedexcludeByContains);
          setExcludedByContains(updatedexcludeByContains);
          
          const updatedParsedData = { ...appSettings, [KEY_NAME3]: updatedexcludeByContains };
          if(Object.keys(appSettings)?.length >0){
            updateSettingJson(SETTING_LIST,updatedParsedData);
            setAppSettings(updatedParsedData)
           
          setExcludedByContains(updatedParsedData?.ExcludedByContains)
          allItems=updatedParsedData?.ExcludedByContains;
          SweetAlertContains("success","Setting saved successfully")
          }
          console.log(updatedParsedData,'updated')
        // excludeByDomain.slice()
      }
      function handleExcludeContains() {
        let containsData = [];
        if (excludedValues.value?.length) {
          containsData = [excludedValues];
          if (appSettings?.ExcludedByContains) {
            containsData = [
              ...appSettings?.ExcludedByContains,
              excludedValues,
            ];
          } else {
            containsData = [excludedValues];
            console.log("containsData",containsData)
          }
           console.log("containsData",containsData)
          if (Object.keys(appSettings)?.length > 0) {
            let data = { ...appSettings, ExcludedByContains: containsData };
            updateSettingJson(SETTING_LIST,data);
            setAppSettings(data);
            setExcludedByContains(containsData);
            setShowButton(true);
            SweetAlertContains("success", translation.SettingSaved);
          }
        } else {
          console.log("containsData",containsData)
          SweetAlertContains("info", "Please specify user");
        }
        setExcludedValues([]);
      }
  return(

<>
<div className={"tabMainDiv"} id="excludedContains">

     <div style={{ padding: "0%" }}>
                <Label>{translation.EnterStringToExclude||"Enter string to exclude"}</Label>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "end", gap: "8px" }}>
                    <TextField
                value={excludedValues.value}
                onChange={(e: any) =>
                  setExcludedValues({ value: e.target.value })
                }
                placeholder={translation.ExcludeString||"Exclude string"}
              />

                        
                        {excludedValues?.value?.length > 0 ? (
                        
                            <PrimaryButton
                                style={{margin:"auto"}}
                                text={translation.Exclude||"Exclude"}
                                onClick={handleExcludeContains}

                            />
                           
                        ):""}
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                            style={{
                                paddingTop: "1%",
                                width: isExpanded ? "200px" : "0px",
                                transition: "width 0.45s ease-in-out",
                                overflow: "hidden",
                            }}
                            ref={searchRef}
                            onBlur={handleBlur}
                        >
                            <SearchBox
                                ref={searchBoxRef}
                                onSearch={searchItems}
                                onChange={(e, newValue) => searchItems(newValue)}
                                onClear={() => {
                                    setExcludedByContains([...allItems]);
                                    setShowButton(allItems?.length > 0);
                                }}
                                placeholder={translation.search||"Search"}
                                iconProps={{ iconName: "search" }}
                            />
                        </div>
                        {!isExpanded ? (
                            <Icon
                                style={{ fontSize: "16px", cursor: "pointer", padding: "2px" }}
                                iconName={translation.search||"Search"}
                                onClick={handleClickSearch}
                            />
                        ):""}
                    </div>
                </div>
            </div>

 
      <div>
        <table className={"excludeTable"}>
          <thead>
            <tr>
            <th>{translation.Action||"Action"}</th>
              <th>{translation.EmployeeName||"Employee Name"}</th>
              <th>{translation.Status||"Status"}</th>
             
            </tr>
          </thead>
          {showButton ? (
            <tbody>
              {excludedByContains?.map((x) => {
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
      {excludedByContains?.length?<div><PrimaryButton text={translation?.Include||"Include"} onClick={include} /></div>:""}
    </div>
</>
  )
  
 
}
export default ExcludedContains;
