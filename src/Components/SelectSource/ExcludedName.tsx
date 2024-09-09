import { PrimaryButton } from "@fluentui/react";
import { Checkbox, Label, SearchBox } from "@fluentui/react";
import React, { useEffect, useRef } from "react";
import useStore, { useSttings } from "./store";
import { updateSettingData } from "../Helpers/HelperFunctions";
import { useLanguage } from "../../Language/LanguageContext";
import ReactSelect from "react-select";
import { Icon } from "office-ui-fabric-react";
var allItems = [];
let settingsData:any;
function ExcludedName({excludeByNameOptions,appSettings,setAppSettings,SweetAlertExcludeName}) {
    const {excludeByDomain,changeExcludeByDomain} = useStore();
    const {translation}=useLanguage();
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [excludedValues, setExcludedValues] = React.useState([]);
    const [excludedName, setExcludedName] = React.useState(appSettings?.ExcludeByName);
    const [showButton, setShowButton] = React.useState(appSettings?.ExcludeByName?.length>0?true:false);
    const KEY_NAME3 = "ExcludeByName"
    allItems=appSettings?.ExcludeByName;
  
  useEffect(()=>{
  setExcludedName(appSettings?.ExcludeByName)
  },[])
    const ondeptchange = (e, value: string) => {
        var filteredDept = [...excludedName];
        filteredDept.filter((x) => x.value == value)[0].checked =e.target.checked;
        setExcludedName(filteredDept);
      };
      // const searchItems = (text: string) => {
      //   if (text == "") {
      //     setExcludedName([...appSettings?.ExcludeByName]);
      //     setShowButton(appSettings?.ExcludeByName.length > 0 ? true : false);
      //     return;
      //   }
      //   const newArray = [...excludedName].filter(
      //     (x) => x.value.toLowerCase().indexOf(text) > -1
      //   );
      //   setExcludedName(newArray);
      //   if (newArray.length == 0) {
      //     setShowButton(false);
      //   } else {
      //     setShowButton(true);
      //   }
      // };
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
    
      const searchItems = (text: string) => {
        if (!text.trim()) {
          setExcludedName([...appSettings?.ExcludeByName || []]);
          setShowButton(appSettings?.ExcludeByName.length > 0);
          return;
        }
      
        const filteredItems = (appSettings?.ExcludeByName || []).filter(item =>
          item.value.toLowerCase().includes(text.toLowerCase())
        );
      
        setExcludedName(filteredItems);
        setShowButton(filteredItems.length > 0);
      };
      
      
    const include = ()=>{
        const updatedName = [...excludedName]
        .filter((x) => x.checked == true)
          .map((y) => {
            return y.value;
          });
          if(updatedName.length==0)
          {
            SweetAlertExcludeName("info","Please select user name !");
           
            return false;
          }
          const updatedexcludeByName =appSettings?.ExcludeByName.filter(
            (item) =>  !updatedName.includes(item.value)  
          );
        //   changeExcludeByDomain(updatedexcludeByName);
          setExcludedName(updatedexcludeByName);
          
          const updatedParsedData = { ...appSettings, [KEY_NAME3]: updatedexcludeByName };
          if(Object.keys(appSettings).length >0){
            updateSettingData(updatedParsedData);
            setAppSettings(updatedParsedData)
           
          setExcludedName(updatedParsedData?.ExcludeByName)
          allItems=updatedParsedData?.ExcludeByName;
          SweetAlertExcludeName("success",translation.SettingSaved);
          }
          console.log(updatedParsedData,'updated')
        // excludeByDomain.slice()
      }

      function handleExcludeUserName() {
        if (excludedValues?.length) {
          const currentNames = appSettings?.ExcludeByName || [];
          const isDataPresent = excludedValues.every(name => currentNames.includes(name));
          
          if (isDataPresent) {
            SweetAlertExcludeName("info", "Selected name(s) are already excluded.");
          } else {
            const updatedNames = [...currentNames, ...excludedValues];
            const data = { ...appSettings, ExcludeByName: updatedNames };
            setExcludedName(updatedNames);
          setShowButton(true);
            if (Object.keys(data).length > 0) {
              updateSettingData(data);
              setAppSettings(data);

              SweetAlertExcludeName("success", translation.SettingSaved);
            }
          }
        } else {
          SweetAlertExcludeName("info", "Please select name(s)");
        }
        setExcludedValues([]);
      }
      

  return(
<>
<div className={"tabMainDiv"} id="excludeName">
     
 <div style={{ padding: "0%" }}>
                <Label>Select name(s) to exclude</Label>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "end", gap: "8px" }}>
                        <ReactSelect
                            options={excludeByNameOptions}
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
                                onClick={handleExcludeUserName}
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
                                  setExcludedName([...allItems]);
                                    setShowButton(allItems.length > 0);
                                }}
                                placeholder="Search"
                                iconProps={{ iconName: "search" }}
                            />
                        </div>
                        {!isExpanded && (
                            <Icon
                                style={{ fontSize: "16px", cursor: "pointer", padding: "2px" }}
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
              <th>{"Action"}</th>
              <th>{"Name"}</th>
              <th>{"Status"}</th>
            </tr>
          </thead>
          {showButton ? (
            <tbody>
              {excludedName?.map((x) => {
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
      {excludedName ? <div><PrimaryButton text={"Include"} onClick={include} /></div>:""}
    </div>
</>
  )
  
 
}
export default ExcludedName;
