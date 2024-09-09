import {
  Checkbox,
  DefaultButton,
  Dropdown,
  IDropdownOption,
  MessageBar,
  MessageBarType,
  Panel,
  PanelType,
  PrimaryButton,
  Stack,
  TextField,
  Toggle,
} from "@fluentui/react";
import * as React from "react";
import "./Styles.scss";

import { useBoolean } from "@fluentui/react-hooks";
import useStore from "./store";
import { gapi } from "gapi-script";
import { Buffer } from "buffer";
import { BlobServiceClient } from "@azure/storage-blob";
import { useLanguage } from "../../Language/LanguageContext";

var containerClient: any;
var parsedData: any = "";
var KEY_NAME = "GridViewPrope";
var sortedPeople;
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

function CustomDelete(props) {
  const { translation } = useLanguage();
  const { deleteCustomData } = useStore();
  const [titles, settitles] = React.useState([]);
  const { userGridView } = useStore();

  const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>();
  const [selectedPropertyName, setselectedPropertyName] =
    React.useState<string>();

  //
  let arr123 = [];

  const oncontainsChange = (event): void => {
    setselectedPropertyName(event.target.value as string);
  };
  const onChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    setSelectedItem(item);
  };
  /* const ontitlechange = (checked, value:any) => {

    var filteredtitle = [...titles];

     filteredtitle.filter((x) => x.customField == value)[0].displayProperty =
      checked.target.checked;
      console.log(filteredtitle,'filter')
    //settitles(filteredtitle);
 // settitles(updatedTitles);
    
  }; */
  const ontitlechange = (checked, value) => {
    //console.log(checked,'checked')
    var filteredTitles = [...titles];
    const filteredItem = filteredTitles.find((x) => x.field === value);
    if (filteredItem) {
      filteredItem.displayProperty = checked.target.checked;
      settitles(filteredTitles);
    } else {
      console.error(`No item found with customField "${value}"`);
    }
  };

  const stackTokens = { childrenGap: 15 };
  const [isOpenAdd, { setTrue: openPanelAdd, setFalse: dismissPanelAdd }] =
    useBoolean(false);
  const [isOpenEdit, { setTrue: openPanelEdit, setFalse: dismissPanelEdit }] =
    useBoolean(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
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
      onDismiss={messageDismiss}
      styles={messageBarSuccessStyles}
      dismissButtonAriaLabel={"Close"}
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
      dismissButtonAriaLabel={"Close"}
    >
      {"Something went wrong!"}
    </MessageBar>
  );
  const AlertMsg = () => (
    <MessageBar
      messageBarType={MessageBarType.warning}
      isMultiline={false}
      onDismiss={messageDismiss}
      styles={messageBarWarningStyles}
      dismissButtonAriaLabel={"Close"}
    >
      {alertMsg}
    </MessageBar>
  );

  // get settings
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
      if (parsedData?.GridViewPrope) {
        const updatedPeople = parsedData?.GridViewPrope?.map((person) => {
          const updatedPerson = parsedData[KEY_NAME].find(
            (data) => data.id === person.id
          );
          if (updatedPerson) {
            return {
              ...person,
              checkbox: updatedPerson.checkbox,
            };
          }
          return person;
        });
        sortedPeople = updatedPeople.sort((a, b) => a.id - b.id);
        // settitles(sortedPeople)

        const generateData = (sortedPeople) => {
          const newTitles = sortedPeople
            .filter((object) => object.isCustomField === true)
            .map((object) => ({
              field: object.nameAPI,
              customField: object?.name,
              filterable: true,
              hide: false,
              displayProperty: true,
              displayOnlyProfileCard: false,
              text: false,
              dropdown: false,
              date: false,
            }));
          settitles(newTitles);
          console.log(newTitles, "newtitles");
        };
        generateData(sortedPeople);

        console.log(sortedPeople, "sortedPeopleadd");
        // setPeople(sortedPeople);
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
  // update data
  async function updateSetting(uparsedData) {
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
        // setSaved(true);
        // SuccessMsg();
        // props.SweetAlertCustomfunc("success",translation.SettingSaved)
        GetSettingData();
        // props.dismiss();
        SuccessMsg();
        setTimeout(() => {
          messageDismiss();
        }, 5000);
      });
  }
  //

  const includedelete = () => {
    const updatedCustomList = [...titles]
      .filter((x) => x.displayProperty == true)
      .map((y) => {
        return y.field;
      });
    console.log(updatedCustomList, "updatelist");
    if (updatedCustomList.length == 0) {
      props.SweetAlertCustomfunc("info", "Please select field!");
      // setAlert(true);
      setTimeout(() => {
        messageDismiss();
      }, 5000);
      return false;
    }
    // console.log(titles,'tit')
    const updatedExcludeByCustomList = userGridView.filter(
      (item) => !updatedCustomList.includes(item.nameAPI)
    );
    const updatedParsedData = {
      ...parsedData,
      [KEY_NAME]: updatedExcludeByCustomList,
    };

    console.log(updatedParsedData, "par");
    if (Object.keys(parsedData).length > 0) {
      updateSetting(updatedParsedData);
      props.SweetPromptCustomFunc(
        "question",
        "Are you sure you want to delete selected custom field(s)?"
      );
    }
  };
  React.useEffect(() => {
    GetSettingData();
  }, []);
  return (
    <div>
      <Stack>
        <div>
          <table className={"customTable"}>
            <thead>
              <tr>
                <th>{"Action"}</th>
                <th>{"Type"}</th>
                <th>{"Property Name"}</th>
                <th>{"Display Name"}</th>
              </tr>
            </thead>
            <tbody>
              {titles.map((x) => {
                {
                  console.log(x, "xx");
                }
                return (
                  <tr>
                    <td>
                      <Checkbox
                        checked={x.displayProperty}
                        title={x.field}
                        onChange={(checked) => ontitlechange(checked, x.field)}
                      />
                    </td>
                    <td>{x.field}</td>
                    <td>{x.field}</td>
                    <td>{x.customField}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Stack style={{ width: "10%" }}>
            <PrimaryButton onClick={includedelete}>{"Delete"}</PrimaryButton>
          </Stack>
        </div>
      </Stack>
    </div>
  );
}

export default CustomDelete;
