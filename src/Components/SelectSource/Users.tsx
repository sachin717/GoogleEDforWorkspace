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
import { BlobServiceClient } from "@azure/storage-blob";
import { themeRulesStandardCreator } from "@fluentui/react";
import   "./Styles.scss";
import { SearchBox } from "@fluentui/react/lib/SearchBox";
import { IIconProps } from "@fluentui/react/lib/Icon";
import { gapi } from "gapi-script";
import { Buffer } from "buffer";
import { useLanguage } from "../../Language/LanguageContext";
import { updateSettingData } from "../Helpers/HelperFunctions";
import { Icon } from "office-ui-fabric-react";
const filterIcon: IIconProps = { iconName: "Filter" };



interface IUsers {
  checked: boolean;
  value: string;
}
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
var containerClient: any;
var parsedData: any = "";
const KEY_NAME4 = "ExcludeUsersBulk";
function Users(props) {
 const {translation}=useLanguage()
 const [isExpanded, setIsExpanded] = React.useState(false);
  const [users, setusers] = React.useState([]);
  const [showButton, setShowButton] = React.useState(false);
  const searchRef = React.useRef(null);
  const searchBoxRef = React.useRef(null);
  
   const onuserschange = (checked, value: any) => {
    var filteredTitles = [...users];
    const filteredItem = filteredTitles?.find(x => {
        return x.name.fullName === value; 
    });
    if (filteredItem) {
        filteredItem.checked = checked.target.checked;
        setusers(filteredTitles);
    } else {
        console.error(`No item found with customField "${value}"`);
    }
  }; 
  React.useEffect(()=>{
     setusers(props.appSettings?.ExcludeUsersBulk??[]);
     allItems=props.appSettings?.ExcludeUsersBulk??[];
     setShowButton(true);
  },[])



  const searchItems = (text: string) => {
    console.log(text,"tex")
    if (text == "") {
      setusers([...allItems]);
      setShowButton(allItems?.length > 0 ? true : false);
      return;
    }
    console.log("ueser",users)
    const newArray = [...users]?.filter(item => item?.name?.fullName?.includes(text))
    setusers(newArray);
    if (newArray?.length == 0) {
      setShowButton(false);
    } else {
      setShowButton(true);
    }
  };




  // const include = ()=>{
  //   console.log(users,'users')
  //   const updatedCustomList:any = [...users]
  //     .filter((x) => x.checked == true)
  //       .map((y) => {
  //         return y.name;
  //       });
  //       // console.log(updatedCustomList,'updatelist')
  //       if(updatedCustomList.length==0)
  //       {
  //         props.SweetAlertExcludeCsv("Please select field!");
     
  //         return false;
  //       }
  //       //console.log(updatedCustomList,'dd')
  //       const updatedExcludeByCustomList = props.appSettings?.ExcludeUsersBulk?.filter(
  //           (item) => 
  //           !updatedCustomList?.fullName?.includes(item?.name?.fullName)
  //         );
  //         const updatedParsedData = { ...props.appSettings, [KEY_NAME4]: updatedExcludeByCustomList };
  //         if(Object.keys(props.appSettings)?.length >0){
  //         // updateSettingData(updatedParsedData);
  //         // props.setAppSettings(props?.appSettings?.ExcludeUsersBulk);
  //         console.log("[]",updatedExcludeByCustomList)
  //         setusers(props?.appSettings?.ExcludeUsersBulk);
  //         props.SweetAlertExcludeCsv("success",translation.SettingSaved)
          
          
  //         }
  //         console.log(updatedParsedData);

  // }
  const include = () => {
    console.log(users, 'users');
  
    // Create a list of selected user full names from updatedCustomList
    const updatedCustomList: string[] = users
      .filter((x) => x.checked)
      .map((y) => y.fullName); // Extract fullName from each user object
  
    // Check if any names were selected
    if (updatedCustomList.length === 0) {
      props.SweetAlertExcludeCsv("info","Please select field!");
      return false;
    }
  
   
    const updatedExcludeByCustomList = props.appSettings?.ExcludeUsersBulk?.filter(
      (item) => !updatedCustomList.includes(item?.fullName) 
    );
    console.log("===",updatedExcludeByCustomList)
    const updatedParsedData = {
      ...props.appSettings,
      [KEY_NAME4]: updatedExcludeByCustomList
    };
  
    if (Object.keys(props.appSettings).length > 0) {
      updateSettingData(updatedParsedData);
      props.setAppSettings(updatedParsedData);
      setusers(updatedExcludeByCustomList);
      allItems=updatedExcludeByCustomList;
      props.SweetAlertExcludeCsv("success", translation.SettingSaved);
    }
  
    console.log(updatedParsedData);
  };
  
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

const handleBlur = () => {
    setTimeout(() => {
      
        if (!searchRef.current.contains(document.activeElement)) {
            setIsExpanded(false);
        }
    }, 100);
};
//

  return (
    <div className={"tabMainDiv"}>
      <div style={{display:"flex",justifyContent:"space-between"}}>

      <PrimaryButton text="Add" style={{margin:"10px 0"}} onClick={props.openPanelCustomA} />
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
                                    setusers([...allItems]);
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
     
     {/* <Stack style={{ padding: "0%" }}>
        <Label>{"Search for User"}</Label>
        <Stack style={{ paddingTop: "1%", width: 200 }}>
          <SearchBox
            onSearch={(newValue) => searchItems(newValue)}
            onChange={(e, newValue) => searchItems(newValue)}
            onClear={() => {
              setShowButton(allItems.length > 0 ? true : false);
              setusers([...allItems]);
            }}
            placeholder={"Filter"}
            iconProps={filterIcon}
          />
        </Stack>
      </Stack> */}
         <div style={{ display: "flex", justifyContent: "space-between" }}>
                 
                 
                </div>
      <div>
        <table className={"excludeTable"}>
          <thead>
            <tr>
              <th>{"Action"}</th>
              <th>{"Employee Name"}</th>
              <th>{"Status"}</th>
            </tr>
          </thead>
          {showButton ? (
            <tbody>
              {users.map((x) => {
                return (
                  <tr>
                    <td>
                      <Checkbox
                        checked={x.checked}
                        title={x.value}
                        onChange={(checked) => onuserschange(checked, x.name.fullName)}
                      />
                    </td>
                    <td>{x?.name?.fullName}{' '}</td>
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
      {users?.length ? <div><PrimaryButton text={"Include"} onClick={include} /></div>:""}
    </div>
  );
}
export default Users;
