// import * as jquery from "jquery";
import { TeachingBubble } from "@fluentui/react/lib/TeachingBubble";
import { useBoolean } from "@fluentui/react-hooks";
import { BlobServiceClient } from "@azure/storage-blob";
import { Buffer } from "buffer";
import {
  Checkbox,
  DefaultButton,
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
  MessageBar,
  IconButton,
  MessageBarType,
  Panel,
  PanelType,
  PrimaryButton,
  Stack,
  TextField,
  Toggle,
} from "@fluentui/react";
import { DirectionalHint } from "@fluentui/react/lib/Callout";
import * as React from "react";
// import ContextService from "../../Services/ContextService";
// import SettingService from "../../Services/SettingService";
// import styles from "../Edp.module.scss";
import CustomAdd from "./CustomAdd";
import { gapi } from "gapi-script";
// import SharePointProps from "./SharePointProps";
// import MultiSelect from "react-multi-select-component";
const messageBarWarningStyles = {
  root: {
    backgroundColor: "rgb(255, 244, 206)",
  },
};
const messageBarInfoStyles = {
  root: {
    backgroundColor: "rgb(243, 242, 241)",
  },
};
const messageBarErrorStyles = {
  root: {
    backgroundColor: "rgb(253, 231, 233)",
  },
};
const messageBarSuccessStyles = {
  root: {
    backgroundColor: "rgb(223, 246, 221)",
  },
};
const dropdownstyles: Partial<IDropdownStyles> = {
  callout: {
    minWidth: '270px !important',
    width: '290px !important',
    maxWidth: '300px !important',
  },


};
let allItems = [];
var containerClient: any;
var parsedData: any = "";
var KEY_NAME = 'GridViewPrope'

function CustomEdit(checkedValue) {
  console.log(checkedValue);
  var sortedPeople ;
  const [titles, settitles] = React.useState([]);
  const [optioncustomfields, setoptioncustomfields] = React.useState([]);
  const [sendEData, setsendEData] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [alert, setAlert] = React.useState(false);

  const [TextCustom, setTextCustom] = React.useState(false);
  const [DateCustom, setDateCustom] = React.useState(false);
  const [DropdownCustom, setDropdownCustom] = React.useState(true);
  const [changedValue,setChangedValue] = React.useState('');

  const [people, setPeople] = React.useState([
    {
        id: 1,
        name: "name",
        checkbox:true,
        nameAPI: '',
        isCustomField: true,
      },
      {
        id: 2,
        name: "email",
        checkbox:true,
        nameAPI: '',
        isCustomField: true,
      },
      {
        id: 3,
        name: "job",
        checkbox:true,
        nameAPI: '',
        isCustomField: true,
      },
      {
        id: 4,
        name: "department",
        checkbox:true,
        nameAPI: '',
        isCustomField: true,
      },
      {
          id: 5,
          name: "location",
          checkbox:true,
          nameAPI: '',
          isCustomField: true,
      },
      {
          id: 6,
          name: "phone",
          checkbox:true,
          nameAPI: '',
          isCustomField: true,
      },
      {
        id:7,
        name: "mobile",
        checkbox: true,
        nameAPI: '',
        isCustomField: true,
      },
      {
        id:8,
        name: 'manager',
        checkbox: true,
        nameAPI: '',
        isCustomField: true,
      },
  ]);

/*   const [CheckChecked, setCheckChecked] = React.useState(
    Boolean(checkedValue.editeddata.split(";")[2])
  ); */
  const [ShowLabelChecked, setShowLabelChecked] = React.useState(
    Boolean(checkedValue.editeddata.split(";")[3])
  );
  const [HideChecked, setHideChecked] = React.useState(
    Boolean(checkedValue.editeddata.split(";")[4])
  );
 /*  const [StringValues, setStringValues] = React.useState<String>(
    (checkedValue.editeddata.split(";")[5])
  ); */
  const [ShowProfileCard, setShowProfileCard] = React.useState(
    Boolean(checkedValue.editeddata.split(";")[6])
  );
  const [teachingBubbleVisible3, { toggle: toggleTeachingBubbleVisible3 }] =
    useBoolean(false);
  const [selectedPropertyName, setselectedPropertyName] =
    React.useState<string>();
  const [alertMsg, setAlertMsg] = React.useState("");
  const messageDismiss = () => {
    setSaved(false);
    setError(false);
    setAlert(false);
  };
  const SuccessMsg = () => (
    <MessageBar
      messageBarType={MessageBarType.success}
      isMultiline={false}
      styles={messageBarSuccessStyles}
      onDismiss={messageDismiss}
      dismissButtonAriaLabel={
         "Close"
      }
    >
      {"Settings saved successfully!"}
    </MessageBar>
  );
  const ErrorMsg = () => (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
      styles={messageBarErrorStyles}
      onDismiss={messageDismiss}
      dismissButtonAriaLabel={
         "Close"
      }
    >
      {"Something went wrong!"}
    </MessageBar>
  );
  const AlertMsg = () => (
    <MessageBar
      messageBarType={MessageBarType.warning}
      isMultiline={false}
      styles={messageBarWarningStyles}
      onDismiss={messageDismiss}
      dismissButtonAriaLabel={
         "Close"
      }
    >
      {alertMsg}
    </MessageBar>
  );

// get Settings 
async function GetSettingData() {
  var domain = gapi.auth2
    .getAuthInstance()
    .currentUser.le.wt.cu.split("@")[1];
  //console.log(domain);
  var _domain = domain.replace(/\./g, "_");
  var storagedetails =
    '[{"storageaccount":"mystorageaccountparj","containername":"parjinder1","blobfilename":"' +
    _domain +
    '.json"}]';
  var mappedcustomcol = JSON.parse(storagedetails);
  const sasToken =
    "sv=2022-11-02&ss=b&srt=sco&sp=rwdlaciytfx&se=2028-02-28T12:24:45Z&st=2024-02-29T04:24:45Z&spr=https&sig=FrbdvHpW929m3xVikmm5HiBL6Q00lHjk0a5CPuw1H2U%3D";
  const blobStorageClient = new BlobServiceClient(
    // this is the blob endpoint of your storage acccount. Available from the portal
    // they follow this format: <accountname>.blob.core.windows.net for Azure global
    // the endpoints may be slightly different from national clouds like US Gov or Azure China
    "https://" +
      mappedcustomcol[0].storageaccount +
      ".blob.core.windows.net?" +
      sasToken
    //   ,
    // null
    //new InteractiveBrowserCredential(signInOptions)
  );
  containerClient = blobStorageClient.getContainerClient(
    mappedcustomcol[0].containername
  );
  const blobClient = containerClient.getBlobClient(
    mappedcustomcol[0].blobfilename
  );
  const exists = await blobClient.exists();

  if (exists) {
    const downloadBlockBlobResponse = await blobClient.download();
    const downloaded: any = await blobToString(
      await downloadBlockBlobResponse.blobBody
    );
    
    const decoder = new TextDecoder();
    const str = decoder.decode(downloaded);
   
    parsedData = JSON.parse(str);
    // logic for profileview checkboxes
    if(parsedData?.GridViewPrope){
      const updatedPeople = parsedData?.GridViewPrope?.map(person => {
        const updatedPerson = parsedData[KEY_NAME].find(data => data.id === person.id);
        if (updatedPerson) {
          return {
            ...person,
            checkbox: updatedPerson.checkbox
          };
        }
        return person;
      });
      sortedPeople = updatedPeople.sort((a, b) => a.id - b.id);
      // settitles(sortedPeople)
      
      const generateData = (sortedPeople) => {
        const newTitles = sortedPeople
          .filter(object => object.isCustomField === true)
          .map((object) => ({ 
            field: object.nameAPI,
            customField: object.name,
            filterable: true,
            hide: false,
            displayProperty: true,
            displayOnlyProfileCard: false,
            text: false,
            dropdown: false,
            date: false, 
           }));
           settitles(newTitles);
        // console.log( newTitles,'newtitles');
    };
    generateData(sortedPeople)
    setPeople(sortedPeople);
    }
  }
}
async function blobToString(blob: any) {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onloadend = (ev) => {
      resolve((ev.target as any).result);
    };
    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(blob);
  });
}
//

// update Settings
 
async function  updateSetting(uparsedData)
{
  var _parsedData = JSON.stringify(uparsedData);
  var domain = gapi.auth2
  .getAuthInstance()
  .currentUser.le.wt.cu.split("@")[1];
//console.log(domain);
var _domain = domain.replace(/\./g, "_");
var storagedetails =
  '[{"storageaccount":"mystorageaccountparj","containername":"parjinder1","blobfilename":"' +
  _domain +
  '.json"}]';
var mappedcustomcol = JSON.parse(storagedetails);
await containerClient
  .getBlockBlobClient(mappedcustomcol[0].blobfilename)
  .upload(_parsedData, Buffer.byteLength(_parsedData))
  .then(() => {
 setSaved(true);
 SuccessMsg();

SuccessMsg();
    setTimeout(() => {
      messageDismiss();
    }, 5000);
  });
}

//
  React.useEffect(() => {
    GetSettingData();
  }, []);

  const onshowlabelChange = React.useCallback(
    (
      ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
      checked?: boolean
    ): void => {
      if (ev.currentTarget.title == "showfield") {
        if (checked) {
          setShowLabelChecked(true);
        } else {
          setShowLabelChecked(false);
        }
      }
    },
    []
  );
  /* const onfiltersChange = React.useCallback(
    (
      ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
      checked?: boolean
    ): void => {
      if (ev.currentTarget.title == "checkfield") {
        if (checked) {
          setCheckChecked(true);
        } else {
          setCheckChecked(false);
        }
      }
    },
    []
  ); */

  const oncontainsChange = (e:any)=>{
    setChangedValue(e.target.value);
  }

  const handleEditSave = ()=>{
    // console.log(changedValue,'changed value')
    const data = {
      filed: checkedValue.data.field,
      customField: checkedValue.data.customField,
      filterable: true,
      hide: HideChecked,
      displayProperty: ShowLabelChecked,
      displayOnlyProfileCard: ShowProfileCard,
      text: true,
      dropdown: DropdownCustom,
      date: DateCustom,
  };

  const updatedPeople = people.map(person => {
    
    if (person.nameAPI === data.filed) {
        return { ...person, name: changedValue,checkbox:ShowLabelChecked };
    }
    return person;
});
const updatedParsedData = { ...parsedData, [KEY_NAME]: updatedPeople };
console.log(updatedParsedData);

if(parsedData !== null){
  setSaved(true);
  checkedValue.dismiss();
 
 updateSetting(updatedParsedData)
}

  }

  return (
    <div>
      {saved ? (
        <SuccessMsg />
      ) : error ? (
        <ErrorMsg />
      ) : alert ? (
        <AlertMsg />
      ) : (
        ""
      )}
      {sendEData ? (
        checkedValue.cftype == "AD" ? (
          <CustomAdd langcode={checkedValue.langcode} LicenseType={checkedValue.LicenseType} />
        ) : (
            <>
          {/* <SharePointProps langcode={checkedValue.langcode} LicenseType={checkedValue.LicenseType} /> */}
          </>
        )
      ) : (
        <Stack>
          <div className={"addCustomBlock"} style={{ columnGap: '15px', width: '100%', justifyContent: "space-between" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div  style={{ width: '100%', display:"flex", flexDirection:"column", gap:"10px"}}>
                <label>
                  {"Custom Fields"}

                  <IconButton
                    id="Tooltip"
                    style={{ height: "22px", marginLeft: "0px" }}
                    title={
                       "You can view custom attributes of the employees on all the views and filter by adding filter. At present, customer attributes are not part of 'free search' attribute. "
                    }
                    onClick={toggleTeachingBubbleVisible3}
                    iconProps={{ iconName: "Info" }}
                  ></IconButton>
                  {teachingBubbleVisible3 && (
                    <TeachingBubble
                      calloutProps={{ directionalHint: DirectionalHint.bottomCenter }}
                      target="#Tooltip"
                      isWide={true}
                      hasCloseButton={true}
                      closeButtonAriaLabel={
                       "Close"
                      }
                      onDismiss={toggleTeachingBubbleVisible3}
                      headline=""
                    >
                      {"You can view custom attributes of the employees on all the views and filter by adding filter. At present, customer attributes are not part of 'free search' attribute. "}
                    </TeachingBubble>
                  )}
                </label>
                <Dropdown
                  styles={dropdownstyles}
                  placeholder={
                     "Select an option"
                  }
                  defaultSelectedKey={checkedValue.editeddata.split(";")[1]}
                  options={optioncustomfields}
                />
              </div>
              <div  style={{ marginRight: "0px", maxWidth: '100%',marginTop:"3px", display:"flex", flexDirection:"column", gap:"10px" }}>
                <label>
                  { "Property Name"}
                </label>
                <TextField
                  defaultValue={checkedValue.data.customField}
                  onChange={oncontainsChange}
                  value={selectedPropertyName}
                />
              </div>
            </div>
            <div>
            <div className={"newgridcustom"}>
                {/* <div className={"customfieldBlock"} style={{
                  width: '100%', maxWidth: "100%", display: "flex",
                  flexDirection: "column"
                }} title={
                 "This feature is available in Enterprise version!"
                }>
                  <label>
                    {"Filterable"}
                  </label>
                  {checkedValue.editeddata.split(";")[2] == "true" ? (
                    <Checkbox
                      defaultChecked={true}
                      title="checkfield"
                      onChange={onfiltersChange} disabled={checkedValue.LicenseType.toLowerCase() == "p4" ? false : true}
                    />
                  ) : (
                    <Checkbox title="checkfield" onChange={onfiltersChange} disabled={checkedValue.LicenseType.toLowerCase() == "p4" ? false : true} />
                  )}
                </div> */}

                {/* <div className={"customfieldBlock"} style={{
                  marginLeft: '12px', width: '100%', maxWidth: "100%", display: "flex",
                  flexDirection: "column"
                }}>
                  <label> { "Hide"}</label>
                  {checkedValue.editeddata.split(";")[4] == "true" ? (
                    <Checkbox
                      defaultChecked={true}
                      title="hidefield"
                      onChange={onhideChange}
                    />
                  ) : (
                    <Checkbox title="hidefield" onChange={onhideChange} />
                  )}
                </div> */}

                <div>
                  <label style={{whiteSpace: "nowrap"}}>{"Display Property"}</label>
                  <div style={{marginTop:"13px"}}>
                    {checkedValue.editeddata.split(";")[3] == "true" ? (
                      <Checkbox
                        defaultChecked={true}
                        title="showfield"
                        onChange={onshowlabelChange}
                      />
                    ) : (
                      <Checkbox title="showfield" onChange={onshowlabelChange}  defaultChecked={true}/>
                    )}
                  </div>
                </div>

                {/* <div className={"customfieldBlock"} style={{
                 width: '100%', maxWidth: "100%", display: "flex",
                  flexDirection: "column"
                }}>
                  <label>{ "Display in only profile card"}</label>
                  {checkedValue.editeddata.split(";")[6] == "true" ? (
                    <Checkbox
                      defaultChecked={true}
                      title="showProfileCard"
                      onChange={onshowProfileCard}
                    />
                  ) : (
                    <Checkbox title="showProfileCard" onChange={onshowProfileCard} />
                  )}
                </div> */}
            </div>
            { checkedValue.editeddata.split(";")[2] == "true" ? (
            <div style={{display:"grid", gridTemplateColumns:"102px 88px 75px"}}>
              <div className={"customfieldBlock"} style={{
                width: '100%', maxWidth: "100%", display: "flex",
                flexDirection: "column"
              }}>
               <label>
                  {"Text"}</label>
                <Checkbox 
                 checked={TextCustom}
                 title="Text"
                // onChange={onchangeCustom}
                  />

              </div>

              <div className={"customfieldBlock"} style={{
                width: '100%', maxWidth: "100%", display: "flex",
                flexDirection: "column"
              }}>
                  <label>
                  {"Dropdown"}</label>
                <Checkbox 
                checked={DropdownCustom}
                title="Dropdown"
                //onChange={onchangeCustom} 
                />

              </div>
              <div className={"customfieldBlock"} style={{
                width: '100%', maxWidth: "100%", display: "flex",
                flexDirection: "column"
              }}>
                  <label>
                  {"Date"}</label>
                <Checkbox 
                checked={DateCustom}
                title="Date"
                //onChange={onchangeCustom} 
                />

              </div>
            </div>
              ):""
}
            </div>
          </div>
          <div className={"fieldSubmitBtn"}>
            <PrimaryButton onClick={handleEditSave}>
              {"Update"}
            </PrimaryButton>
          </div>
        </Stack>
      )}
    </div>
  );
}

export default CustomEdit;
