import * as React from "react";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Panel, PanelType } from "@fluentui/react/lib/Panel";
import { IStackTokens, Stack } from "@fluentui/react/lib/Stack";
import { Toggle, Checkbox } from "@fluentui/react";
import { gapi } from "gapi-script";
import { style } from "./styles";
import styled from "styled-components";
import { Buffer } from "buffer/";
import {
  PrimaryButton,
  createTheme,
  ThemeProvider,
  TextField,
  DatePicker,
  Text,
  MessageBar,
  MessageBarType,
} from "@fluentui/react";
import { Icon } from "@fluentui/react/lib/Icon";
import { Label } from "@fluentui/react/lib/Label";

import { useBoolean } from "@fluentui/react-hooks";
import { BlobServiceClient } from "@azure/storage-blob";
const NewDocumentWrapper = styled.div`
  ${style}
`;
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
var empisadmin: any;
var parsedData: any = "";
var containerClient: any;
function Delete(props: any) {
  let allItems: any = [];
  React.useEffect(() => {
    GetSettingData();
  }, [allItems.length]);

  const [addroles, setaddroles] = React.useState([]);
  const [users, setusers] = React.useState<any>([]);
  const onrolechange = (checked: any, empname: string) => {
    var filteredroles: any = [...addroles];

    filteredroles.filter((x: any) => x.empname == empname)[0].checked =
      checked.target.checked;
    setaddroles(filteredroles);
  };
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
      console.log("Downloaded blob content", downloaded);
      // const jsonData = downloadBlockBlobResponse.toString();
      // Parse the JSON data
      //const buf = new ArrayBuffer(downloaded.maxByteLength);
      const decoder = new TextDecoder();
      const str = decoder.decode(downloaded);
      //_parsedData=str;
      parsedData = JSON.parse(str);
      empisadmin = parsedData.IsAdmin;
      //console.log(parsedData);
      if(empisadmin!="" && empisadmin != undefined){
      if (empisadmin.indexOf(";") > -1) {
        var _anthsplit = empisadmin.split(";");
        for (var y = 0; y < _anthsplit.length; y++) {
          var _frst = _anthsplit[y]
            .split("-")[0]
            .replace("#%#", ",")
            .replace("#%%#", "-");
          var _second = _anthsplit[y].split("-")[1];
          allItems.push({
            checked: false,
            empname: _frst,
            empemail: _second,
            emprole: "Admin",
          });
        }
      } else {
        if (empisadmin.indexOf(",") > -1) {
          empisadmin = empisadmin.replace(/,/g, ";");
          if (empisadmin.indexOf(";") > -1) {
            var _anthsplit = empisadmin.split(";");
            for (var y = 0; y < _anthsplit.length; y++) {
              var _frst = _anthsplit[y]
                .split("-")[0]
                .replace("#%#", ",")
                .replace("#%%#", "-");
              var _second = _anthsplit[y].split("-")[1];
              allItems.push({
                checked: false,
                empname: _frst,
                empemail: _second,
                emprole: "Admin",
              });
            }
          }
        } else {
          var _frst = empisadmin
            .split("-")[0]
            .replace("#%#", ",")
            .replace("#%%#", "-");
          var _second = empisadmin.split("-")[1];
          allItems.push({
            checked: false,
            empname: _frst,
            empemail: _second,
            emprole: "Admin",
          });
        }
      }
    }
      setaddroles(allItems);
    }
  }
  async function includedelete() {
    var displayname = gapi.auth2.getAuthInstance().currentUser.le.wt.Ad;
    let roledelarray = [];
    let roledelarr = [];
    console.log(displayname);
    var excluderoles: any = [...addroles]
      .filter((x: any) => x.checked == true)
      .map((y) => {
        return y;
      });
    if (excluderoles.length == 0) {
      setAlertMsg("Please select users to remove!");
      setAlert(true);
      setTimeout(() => {
        messageDismiss();
      }, 5000);
      return false;
    } else {
      for (var y = 0; y < excluderoles.length; y++) {
        if (displayname != excluderoles[y].empname) {
          roledelarray.push(
            excluderoles[y].empname.replace(/,/g, "#%#").replace(/-/g, "#%%#") +
              "-" +
              excluderoles[y].empemail
          );
        } else {
          setAlertMsg(
            "You can not remove yourself from the role"
          );
          setAlert(true);
          setTimeout(() => {
            messageDismiss();
          }, 5000);
          return;
        }
      }

      if (empisadmin != null) {
        // if (empisadmin.indexOf(',') > -1) {
        //  var _anthsplit=empisadmin.split(',');
        // var index;
        // for (var i=0; i<roledelarray.length; i++) {
        //   index = _anthsplit.indexOf(roledelarray[i]);
        //    if (index > -1) {
        //     _anthsplit.splice(index, 1);
        //    }
        // }

        // }
        if (empisadmin.indexOf(";") > -1) {
          var _anthsplit = empisadmin.split(";");
          var index;
          for (var i = 0; i < roledelarray.length; i++) {
            index = _anthsplit.indexOf(roledelarray[i]);
            if (index > -1) {
              _anthsplit.splice(index, 1);
            }
          }
        } else {
          var _anthsplit = empisadmin;
          var index;
          for (var i = 0; i < roledelarray.length; i++) {
            index = _anthsplit.indexOf(roledelarray[i]);
            if (index > -1) {
              _anthsplit.splice(index, 1);
            }
          }
        }
      }
      // console.log(_anthsplit);

      parsedData["IsAdmin"] = _anthsplit.join(";");
      console.log(parsedData,'called');
      var _parsedData = JSON.stringify(parsedData);
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
          setusers([]);

          setTimeout(() => {
            messageDismiss();
          }, 5000);
        });
    }
  }

  //GetSettingData();

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
      {"User deleted successfully!"}
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
      styles={messageBarWarningStyles}
      onDismiss={messageDismiss}
      dismissButtonAriaLabel={"Close"}
    >
      {alertMsg}
    </MessageBar>
  );

  return (
    <NewDocumentWrapper>
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
      <div className="settingBlock">
        {/* <Label>Add Role</Label> */}
        <div style={{ marginBottom: "2%", paddingTop: "1%" }}>
          <PrimaryButton text={"Delete Role"} onClick={includedelete} />
        </div>
      </div>

      <div>
        <table className="usersTable">
          <thead>
            <tr>
              <th>{"Action"}</th>
              <th>{"Employee Name"}</th>
              <th>{"Email"}</th>
              <th>{"Role"}</th>
            </tr>
          </thead>
          <tbody>
            {addroles.map((x: any) => {
              return (
                <tr>
                  <td>
                    <Checkbox
                      checked={x.checked}
                      title={x.empname}
                      onChange={(checked) => onrolechange(checked, x.empname)}
                    />
                  </td>
                  <td>{x.empname}</td>
                  <td>{x.empemail}</td>
                  <td>{x.emprole}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    </NewDocumentWrapper>
  );
}
export default Delete;
