import { PrimaryButton } from "@fluentui/react";
import { Checkbox, Label, SearchBox } from "@fluentui/react";
import React, { useEffect, useRef, useState } from "react";

import { updateSettingData } from "../Helpers/HelperFunctions";
import { useLanguage } from "../../Language/LanguageContext";
import { Icon } from "office-ui-fabric-react";
import ReactSelect from "react-select";
var allItems = [];
let settingsData:any;
function ExcludedLocation({locationOptions,appSettings,setAppSettings,SweetAlertLocation}) {
    const {translation,languages,} = useLanguage();
    const [excludedValues, setExcludedValues] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [excludeByLocation, setExcludeByLocation] = React.useState(appSettings?.ExcludeByLocation);
    const [showButton, setShowButton] = React.useState(appSettings?.ExcludeByLocation?.length>0?true:false);
    const [refresh, setRefresh] = React.useState(false);
    const [saved, setSaved] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [alert, setAlert] = React.useState(false);
    const [alertMsg, setAlertMsg] = React.useState("");
    const KEY_NAME3 = "ExcludeByLocation"
    allItems=appSettings?.ExcludeByLocation;
    const searchRef = useRef(null);
    const searchBoxRef = useRef(null);
    useEffect(()=>{
     setExcludeByLocation(appSettings?.ExcludeByLocation);
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
  
 
    const ondeptchange = (e, value: string) => {
        var filteredDept = [...excludeByLocation];
        filteredDept.filter((x) => x.value == value)[0].checked =e.target.checked;
        setExcludeByLocation(filteredDept);
      };
      const searchItems = (text: string) => {
        if (text == "") {
          setExcludeByLocation([...allItems]);
          setShowButton(allItems?.length > 0 ? true : false);
          return;
        }
        const newArray = [...excludeByLocation]?.filter(
          (x) => x?.value?.toLowerCase().indexOf(text) > -1
        );
        setExcludeByLocation(newArray);
        if (newArray?.length == 0) {
          setShowButton(false);
        } else {
          setShowButton(true);
        }
      };
    
      
    const include = ()=>{
        const updatedLocation = [...excludeByLocation]?.filter((x) => x.checked == true)?.map((y) => {
            return y.value;
          });
          if(updatedLocation?.length==0)
          {
            SweetAlertLocation("Please select Location!");
        
            return false;
          }
          const updatedexcludeByLocation =appSettings?.ExcludeByLocation.filter(
            (item) =>  !updatedLocation?.includes(item.value)  
          );
        //   changeExcludeByDomain(updatedexcludeByLocation);
          setExcludeByLocation(updatedexcludeByLocation);
          
          const updatedParsedData = { ...appSettings, [KEY_NAME3]: updatedexcludeByLocation };
          if(Object.keys(appSettings)?.length >0){
            updateSettingData(updatedParsedData);
            setAppSettings(updatedParsedData)
           
          setExcludeByLocation(updatedParsedData?.ExcludeByLocation)
          allItems=updatedParsedData?.ExcludeByLocation;
          SweetAlertLocation("success",translation.SettingSaved);
          }
          console.log(updatedParsedData,'updated')
        // excludeByDomain.slice()
      }

      function handleExcludeLoc() {
        if (excludedValues?.length) {
          const currentLocations = appSettings.ExcludeByLocation || [];
          const isDataPresent = excludedValues?.every(loc => currentLocations?.includes(loc));
          
          if (isDataPresent) {
            SweetAlertLocation("info", "Selected location(s) are already excluded.");
          } else {
            const updatedLocations = [...currentLocations, ...excludedValues];
            const data = { ...appSettings, ExcludeByLocation: updatedLocations };
            setExcludeByLocation(updatedLocations);
            setShowButton(true);
            if (Object.keys(data)?.length > 0) {
              updateSettingData(data);
              setAppSettings(data);
            
              setExcludedValues([]);
              SweetAlertLocation("success", translation.SettingSaved);
            }
          }
        } else {
          SweetAlertLocation("info", "Please select location(s)");
        }
      }
      
  return(
<>
<div className={"tabMainDiv"} id="excludedLocation">
<div style={{ padding: "0%" }}>
                <Label>Select location(s) to exclude</Label>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "end", gap: "8px" }}>
                        <ReactSelect
                            options={locationOptions}
                            onChange={(value:any)=>setExcludedValues(value)}
                            value={excludedValues}
                            isMulti
                            menuShouldScrollIntoView
                            menuPosition="fixed"
                            maxMenuHeight={150}
                        />
                        {excludedValues.length > 0 ? (
                            <PrimaryButton
                                text="Exclude"
                                onClick={handleExcludeLoc}
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
                                    setExcludeByLocation([...allItems]);
                                    setShowButton(allItems.length > 0);
                                }}
                                placeholder="Search"
                                iconProps={{ iconName: "search" }}
                            />
                        </div>
                        {!isExpanded ? (
                            <Icon
                                style={{ fontSize: "16px", cursor: "pointer", padding: "2px" }}
                                iconName="Search"
                                onClick={handleClickSearch}
                            />
                        ):""}
                    </div>
                </div>
            </div>

     
      <div>
        <table className={"excludeTable"}>
          <thead >
            <tr>
              <th>{"Action"}</th>
              <th>{"Name"}</th>
              <th>{"Status"}</th>
            </tr>
          </thead>
          {showButton ? (
            <tbody>
              {excludeByLocation?.map((x) => {
                return (
                  <tr>
                    <td>
                      <Checkbox
                        checked={x?.checked}
                        title={x?.value}
                        onChange={(checked) => ondeptchange(checked, x?.value)}
                      />
                    </td>
                    <td>{x?.value}</td>
                    <td>{"Excluded"}</td>
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={3}>
                 
                   {"No Records Found"}
                 
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      {excludeByLocation?.length ?<div> <PrimaryButton text={"Include"} onClick={include} /></div>:""}
    </div>
</>
  )
  
 
}
export default ExcludedLocation;
