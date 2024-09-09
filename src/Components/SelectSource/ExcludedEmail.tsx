import { PrimaryButton } from "@fluentui/react";
import { Checkbox, Label, SearchBox } from "@fluentui/react";
import React, { useEffect, useRef, useState } from "react";
import useStore, { useSttings } from "./store";
import { updateSettingData } from "../Helpers/HelperFunctions";
import { useLanguage } from "../../Language/LanguageContext";
import { Icon } from "office-ui-fabric-react";
import ReactSelect from "react-select";
var allItems = [];
let settingsData:any;
function ExcludedEmail({appSettings,EmailOptions,setAppSettings,SweetAlertEmail}) {
    const {excludeByDomain,changeExcludeByDomain} = useStore();
     const {translation}=useLanguage();
     const [excludedValues, setExcludedValues] = useState([]);
     const [isExpanded, setIsExpanded] = useState(false);
    const [excludedByEmail, setExcludedByEmail] = React.useState(appSettings?.ExcludedByEmail);
    const [showButton, setShowButton] = React.useState(appSettings?.ExcludedByEmail?.length>0?true:false);
    const KEY_NAME3 = "ExcludedByEmail"
    allItems=appSettings?.ExcludedByEmail;
    const searchRef = useRef(null);
    const searchBoxRef = useRef(null);
  
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
        var filteredDept = [...excludedByEmail];
        filteredDept.filter((x) => x.value == value)[0].checked =
          checked.target.checked;
        setExcludedByEmail(filteredDept);
      };
      const searchItems = (text: string) => {
        if (text == "") {
          setExcludedByEmail([...allItems]);
          setShowButton(allItems.length > 0 ? true : false);
          return;
        }
        const newArray = [...excludedByEmail].filter(
          (x) => x.value.toLowerCase().indexOf(text) > -1
        );
        setExcludedByEmail(newArray);
        if (newArray.length == 0) {
          setShowButton(false);
        } else {
          setShowButton(true);
        }
      };
    
      
    const include = ()=>{
        const updatedEmails = [...excludedByEmail]
        .filter((x) => x.checked == true)
          .map((y) => {
            return y.value;
          });
          if(updatedEmails.length==0)
          {
            SweetAlertEmail("Please select Email!");
           
            return false;
          }
          const updatedexcludeByEmails =appSettings?.ExcludedByEmail.filter(
            (item) =>  !updatedEmails.includes(item.value)  
          );
        //   changeExcludeByDomain(updatedexcludeByEmails);
          setExcludedByEmail(updatedexcludeByEmails);
          
          const updatedParsedData = { ...appSettings, [KEY_NAME3]: updatedexcludeByEmails };
          if(Object.keys(appSettings).length >0){
            updateSettingData(updatedParsedData);
            setAppSettings(updatedParsedData)
           
          setExcludedByEmail(updatedParsedData?.ExcludedByEmail)
          allItems=updatedParsedData?.ExcludedByEmail;
          SweetAlertEmail("success",translation.SettingSaved);
            
          }
          console.log(updatedParsedData,'updated')
        // excludeByDomain.slice()
      }

      function handleExcludeEmail() {
        if (excludedValues?.length) {
          const currentExcludedEmails = appSettings.ExcludedByEmail || [];
          const isDataPresent = excludedValues.every(email => currentExcludedEmails.includes(email));
          
          if (isDataPresent) {
            SweetAlertEmail("info", "Selected email(s) are already excluded.");
          } else {
            const updatedExcludedEmails = [...currentExcludedEmails, ...excludedValues];
            const data = { ...appSettings, ExcludedByEmail: updatedExcludedEmails };
             setExcludedByEmail(updatedExcludedEmails);
             setShowButton(true);
            if (Object.keys(data).length > 0) {
              updateSettingData(data);
              setAppSettings(data);
              SweetAlertEmail("success", translation.SettingSaved);
            }
          }
        } else {
          SweetAlertEmail("info", "Please select email(s)");
        }
        setExcludedValues([]);
      }
      
  return(
<>
<div className={"tabMainDiv"} id="excludedEmail">
     
      <div style={{ padding: "0%" }}>
                <Label>Select emails(s) to exclude</Label>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "end", gap: "8px" }}>
                        <ReactSelect
                            options={EmailOptions}
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
                                onClick={handleExcludeEmail}
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
                                    setExcludedByEmail([...allItems]);
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
          <thead>
            <tr>
              <th>{"Action"}</th>
              <th>{"Email"}</th>
              <th>{"Status"}</th>
            </tr>
          </thead>
          {showButton ? (
            <tbody>
              {excludedByEmail?.map((x) => {
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
                 
                   {"No Records Found"}
                 
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      {excludedByEmail?.length ? <div><PrimaryButton text={"Include"} onClick={include} /></div>:""}
    </div>
</>
  )
  
 
}
export default ExcludedEmail;
