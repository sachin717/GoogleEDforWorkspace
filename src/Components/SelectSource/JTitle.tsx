import * as React from "react";
import { Panel, PanelType } from "@fluentui/react/lib/Panel";
import { useBoolean } from "@fluentui/react-hooks";
import {
  Checkbox,
  DefaultButton,
  MessageBar,
  MessageBarType,
  PrimaryButton,
} from "@fluentui/react";
import { Stack } from "@fluentui/react/lib/Stack";
import { TextField } from "@fluentui/react";
import { Label } from "@fluentui/react/lib/Label";
import   "./Styles.scss";
import { BlobServiceClient } from "@azure/storage-blob";
import { Buffer } from "buffer";

//import styles from "../Edp.module.scss";
import { SearchBox } from "@fluentui/react/lib/SearchBox";
import { IIconProps } from "@fluentui/react/lib/Icon";
import useStore from "./store";
import { gapi } from "gapi-script";
import ReactSelect from "react-select";
import { updateSettingData } from "../Helpers/HelperFunctions";
import { Icon } from "office-ui-fabric-react";
import { useLanguage } from "../../Language/LanguageContext";
const filterIcon: IIconProps = { iconName: "Filter" };


interface IJTitle {
  checked: boolean;
  value: string;
}
var parsedData: any = "";
var containerClient: any;
const messageBarWarningStyles = {
  root:{
    backgroundColor: 'rgb(255, 244, 206)',
  }
};
const messageBarInfoStyles = {
  root:{
    ".ms-MessageBar-icon":{
      color:'#333',
          },
    backgroundColor: 'rgb(243, 242, 241)',
  }
};
const messageBarErrorStyles = {
  root:{
    backgroundColor: 'rgb(253, 231, 233)',
  }
};
const messageBarSuccessStyles = {
  root:{
    backgroundColor: 'rgb(223, 246, 221)',
  }
};
var allItems = [];
function JTitle(props) {
 
  const KEY_NAME4 = "ExcludeByJobTitle";
  const {translation}=useLanguage();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [titles, settitles] = React.useState([]);
  const [excludedValues, setExcludedValues] = React.useState([]);
  const [showButton, setShowButton] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState("");
  const {excludeByJobTitle,changeExcludeByJobTitle} = useStore();
  const searchRef = React.useRef(null);
  const searchBoxRef = React.useRef(null);
  allItems=props?.appSettings?.ExcludeByJobTitle;
  React.useEffect(()=>{
   
    settitles(props?.appSettings?.ExcludeByJobTitle)
    console.log("j",props?.appSettings?.ExcludeByJobTitle)
    },[])


  const ontitlechange = (checked, value: string) => {
    var filteredtitle = [...titles];
    filteredtitle.filter((x) => x.value == value)[0].checked =
      checked.target.checked;
    settitles(filteredtitle);
  };
  const searchItems = (text: string) => {
    if (text == "") {
      settitles([...allItems]);
      setShowButton(allItems?.length > 0 ? true : false);
      return;
    }
    const newArray = [...titles].filter(
      (x) => x?.value?.toLowerCase()?.indexOf(text) > -1
    );
    settitles(newArray);
    if (newArray?.length == 0) {
      setShowButton(false);
    } else {
      setShowButton(true);
    }
  };

  


  const include = ()=>{
    const updatedJlist = [...titles]
    .filter((x) => x.checked == true)
    .map((y) => {
      return y.value;
    });
      if(updatedJlist.length==0)
      {
        props.SweetAlertJobTitle("info","Please select department!");
        setAlert(true);
        setTimeout(() =>{
          // messageDismiss();
        }, 5000);
        return false;
      }
      
      const updatedExcludeByJlist = props.appSettings?.ExcludeByJobTitle?.filter(
        (item) =>  !updatedJlist.includes(item.value)  
      );
      // changeExcludeByJobTitle(updatedExcludeByJlist);
      settitles(excludeByJobTitle);

      const updatedParsedData = { ...props.appSettings, [KEY_NAME4]: updatedExcludeByJlist };
      if(Object.keys(props?.appSettings)?.length){
        console.log(updatedParsedData,'updated')
        updateSettingData(updatedParsedData);
        props.setAppSettings(updatedParsedData);
      }
   

      console.log(updatedParsedData,'updated')
    // excludeByDepartment.slice()
  }
 

  const excjtitle = () => {
    if (excludedValues?.length) {
      const currentTitles = props?.appSettings?.ExcludeByJobTitle || [];
      const isDataPresent = excludedValues.every(title => currentTitles?.includes(title));
      
      if (isDataPresent) {
        props.SweetAlertJobTitle("info", "Selected job title(s) are already excluded.");
      } else {
        const updatedTitles = [...currentTitles, ...excludedValues];
        const updatedParsedData = {
          ...props?.appSettings,
          [KEY_NAME4]: updatedTitles,
        };
          settitles(updatedTitles);
         
        if (Object.keys(updatedParsedData).length > 0) {
          console.log(updatedParsedData);
          updateSettingData(updatedParsedData);
          props.setAppSettings(updatedParsedData);
          props.SweetAlertJobTitle("success", translation.SettingSaved);
        }
        
        // changeExcludeByJobTitle(selectedKeysjtitle);
      }
    } else {
      props.SweetAlertJobTitle("info", "Please select job title");
    }
    setShowButton(true);
    
  };
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
  
  return (
    <div className={"tabMainDiv*"} id="jobTitle">
  
      <div style={{ padding: "0%" }}>
                <Label>Select job title(s) to exclude</Label>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "end", gap: "8px" }}>
                        <ReactSelect
                            options={props.jobTitleFields}
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
                                onClick={excjtitle}
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
                                    settitles([...allItems]);
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
              <th>{"JobTitle"}</th>
              <th>{"Status"}</th>
            </tr>
          </thead>
          {showButton ? (
            <tbody>
              {titles.map((x) => {
                return (
                  <tr>
                    <td>
                      <Checkbox
                        checked={x.checked}
                        title={x.value}
                        onChange={(checked) => ontitlechange(checked, x.value)}
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
                  <MessageBar
                    messageBarType={MessageBarType.info}
                    isMultiline={false}
                    styles={messageBarInfoStyles}
                    dismissButtonAriaLabel={"Close"}
                  >
                    {"No Records Found"}
                  </MessageBar>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      {showButton && <PrimaryButton text={"Include"} onClick={include} />}
    </div>
  );
}
export default JTitle;