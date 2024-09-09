import * as React from "react";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Panel, PanelType } from "@fluentui/react/lib/Panel";
import { IStackTokens, Stack } from "@fluentui/react/lib/Stack";
import { Toggle, Checkbox } from "@fluentui/react";
import DefaultImage from "../assets/images/DefaultImg1.png";
import { gapi } from "gapi-script";
import {
  PrimaryButton,
  createTheme,
  ThemeProvider,
  TextField,
  DatePicker,
  Text,
  MessageBar,
  MessageBarType,
  PersonaSize,
  Persona,
} from "@fluentui/react";
import { Icon } from "@fluentui/react/lib/Icon";
import { Label } from "@fluentui/react/lib/Label";

import { useBoolean } from "@fluentui/react-hooks";
import { BlobServiceClient } from "@azure/storage-blob";
import { style } from "./styles";
import styled from "styled-components";
// import Delete from "./Delete";
import { Buffer } from "buffer/";
const NewDocumentWrapper = styled.div`
  ${style}
`;
var empisadmin:any;
let allItems:any=[];
const messageBarWarningStyles = {
  root:{
    backgroundColor: 'rgb(255, 244, 206)',
  }
};
const messageBarInfoStyles = {
  root:{
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
var parsedData: any = "";
var containerClient: any;
var managerEmail = "";
let finalDataNonM365: any = [];
let optionList: any = [];
function Mobile(props:any) {
 
   React.useEffect(() => {
    GetSettingData();
     }, [allItems.length]);
     const [usermanager, setusermanager] = React.useState(String);
     const [userinput, setuserinput] = React.useState(String);
     const [show365user, setshow365] = React.useState(false);
  const [addroles, setaddroles] = React.useState([]);
  const [users, setusers] = React.useState<any>([]);
  allItems=[];
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
      empisadmin = parsedData.IsSpecificUser;
      if(empisadmin!="" && empisadmin != undefined){
        if (empisadmin.indexOf(';') > -1) { 
         var _anthsplit=empisadmin.split(';');
        for (var y = 0; y < _anthsplit.length; y++) {  
          var _frst=_anthsplit[y].split('!!')[0].replace('#%#', ',').replace('#%%#', '-'); 
          var _second=_anthsplit[y].split('!!')[1];   
          allItems.push({checked: false,empname:_frst,empemail:_second});
         }
        }
      else{    
       if (empisadmin.indexOf(',') > -1) {
         empisadmin=empisadmin.replace(/,/g, ';');
         if (empisadmin.indexOf(';') > -1) { 
           var _anthsplit=empisadmin.split(';');
          for (var y = 0; y < _anthsplit.length; y++) {  
            var _frst=_anthsplit[y].split('!!')[0].replace('#%#', ',').replace('#%%#', '-'); 
            var _second=_anthsplit[y].split('!!')[1];   
            allItems.push({checked: false,empname:_frst,empemail:_second});
           }
          }
       }   
       else{ 
         var _frst=empisadmin.split('!!')[0].replace('#%#', ',').replace('#%%#', '-'); 
         var _second=empisadmin.split('!!')[1];  
         allItems.push({checked: false,empname:_frst,empemail:_second});
       }
      }      
     }
        setaddroles(allItems);
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
  async function addrole()
  {
    var rolesUser="";
    if (users.length==0) {
      setAlertMsg("Please enter one user");
      setAlert(true);
      setTimeout(() => {
        messageDismiss();
      }, 5000);
      return;
    }
    let usrarr:any = [];
   
          for (var y = 0; y < users.length; y++) {

            usrarr.push(users[y].text.replace(/,/g, '#%#').replace(/-/g, '#%%#') + "!!" + users[y].secondaryText);
            
          }
          if (empisadmin != "" && empisadmin != undefined) {
            var _rolesUser = empisadmin + ";" + usrarr.join(";");
           
            var splitted = _rolesUser.split(';');
            var collector:any = {};
            for (var i = 0; i < splitted.length; i++) {
               key = splitted[i].replace(/^\s*/, "").replace(/\s*$/, "");
               collector[key] = true;
            }
            var out = [];
            for (var key in collector) {
               out.push(key);
            }
            rolesUser = out.join(';');
          } else {
            rolesUser = usrarr.join(";");
          }
          
      
        parsedData["IsSpecificUser"] = rolesUser;
    console.log(parsedData);
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
        optionList = [];
        setuserinput("");
        setusermanager("");
        setTimeout(() => {
          messageDismiss();
        }, 5000);
        GetSettingData();
      });


    

   
    //excuserview = usrarr.join(",");
    // var ListItemData = null;
  
    //ListItemData = [{ "DefaultView": defaultview, "__metadata": { "type": "SP.Data.SettingListItem" } }];
    
  }
  async function getAllUsersInOrg(value: any) {
    let page: any = "";
    let pageToken = "";
    let staffList: any = [];

    do {
      page = await gapi.client.directory.users.list({
        customer: "my_customer",
        projection: "full",
        orderBy: "givenName",

        query: 'givenName="' + value + '"',
        //sortOrder: "descending",
        maxResults: 100,
        pageToken: pageToken,
      });

      staffList = staffList.concat(page.result.users);

      pageToken = page.nextPageToken;
    } while (pageToken);

    return staffList;
  }
  function getUserOrgWPItem(user: any) {
    if (user?.hasOwnProperty("phones")) {
      const primaryOrg = user?.phones?.filter((x: any) => x.type === "work")[0]
        .value;

      return primaryOrg;
    } else {
      return "";
    }
  }
  function getUserOrgMBItem(user: any) {
    if (user?.hasOwnProperty("phones")) {
      const primaryOrg = user?.phones.filter((x: any) => x.type === "mobile")[0]
        .value;

      return primaryOrg;
    } else {
      return "";
    }
  }
  function getUserOrgMGItem(user: any) {
    if (user?.hasOwnProperty("relations")) {
      const primaryOrg = user?.relations.filter(
        (x: any) => x.type === "manager"
      )[0].value;

      return primaryOrg;
    } else {
      return "";
    }
  }
  function getUserOrgEIDItem(user: any) {
    if (user?.hasOwnProperty("externalIds")) {
      const primaryOrg = user?.externalIds.filter(
        (x: any) => x.type === "organization"
      )[0].value;

      return primaryOrg;
    } else {
      return "";
    }
  }
  function getUserOrgADDItem(user: any) {
    if (user?.hasOwnProperty("addresses")) {
      const primaryOrg = user?.addresses?.filter((x: any) => x.type === "work")[0]?.formatted;

      return primaryOrg;
    } else {
      return "";
    }
  }
  function getUserOrgLOCItem(user: any) {
    if (user?.hasOwnProperty("locations")) {
      var bid = user?.locations[0]?.hasOwnProperty("buildingId")
        ? user.locations[0]?.buildingId
        : "";
      var floorname = user?.locations[0].hasOwnProperty("floorName")
        ? user?.locations[0]?.floorName
        : "";
      var floorsection = user?.locations[0]?.hasOwnProperty("floorSection")
        ? user?.locations[0]?.floorSection
        : "";
      return bid + " " + floorname + " " + floorsection;
    } else {
      return "";
    }
  }
  function getUserlist(text: any) {
    //  optionList = [];

    setuserinput(text?.target?.value);

    if (text?.target?.value?.length > 3) {
      getAllUsersInOrg(text?.target?.value).then((item: any) => {
        let staffMember = item?.map((user: any) => {
          if (user?.name?.givenName != null) {
            var names = user?.name?.givenName?.split(" "),
              initials = names[0].substring(0, 1).toUpperCase();
            if (names?.length > 1) {
              initials += names[names?.length - 1].substring(0, 1).toUpperCase();
            }
          }
          return {
            firstName: user?.name?.givenName,
            lastName: user?.name?.familyName,
            name: user?.name?.fullName,
            email: user?.primaryEmail,
            id: user?.id,
            job: user?.hasOwnProperty("organizations")
              ? user?.organizations[0]?.hasOwnProperty("title")
                ? user?.organizations[0].title
                : ""
              : "",
            initials: initials,
            department: user?.hasOwnProperty("organizations")
              ? user?.organizations[0]?.hasOwnProperty("department")
                ? user?.organizations[0]?.department
                : ""
              : "",

            workphone: getUserOrgWPItem(user),
            mobile: getUserOrgMBItem(user),
            manager: getUserOrgMGItem(user),
            employeeid: getUserOrgEIDItem(user),

            costcenter: user?.hasOwnProperty("organizations")
              ? user?.organizations[0]?.hasOwnProperty("costCenter")
                ? user?.organizations[0]?.costCenter
                : ""
              : "",
            buildingid: user?.hasOwnProperty("locations")
              ? user?.locations[0]?.hasOwnProperty("buildingId")
                ? user?.locations[0]?.buildingId
                : ""
              : "",
            floorname: user?.hasOwnProperty("locations")
              ? user?.locations[0]?.hasOwnProperty("floorName")
                ? user?.locations[0]?.floorName
                : ""
              : "",
            floorsection: user?.hasOwnProperty("locations")
              ? user?.locations[0]?.hasOwnProperty("floorSection")
                ? user?.locations[0]?.floorSection
                : ""
              : "",
            location: getUserOrgLOCItem(user),
            address: getUserOrgADDItem(user),
            image: user?.hasOwnProperty("thumbnailPhotoUrl")
              ? user?.thumbnailPhotoUrl
              : DefaultImage,
          };
        });
        finalDataNonM365 = staffMember?.filter((obj: any, index: any) => {
          return (
            index === staffMember?.findIndex((o: any) => obj.email === o.email)
          );
        });

        optionList = finalDataNonM365
          ? finalDataNonM365.map((items: any) => ({
              name: items?.name,
              initials: items?.initials,
              job: items?.job,
              id: items?.id,
              email: items?.email?.toLowerCase(),
              location: items?.location,
              department: items?.department,
              image: "url(" + items?.image + ")",
            }))
          : [];
        setTimeout(() => {
          // optionList;
          setshow365(true);
        }, 1000);
      });
    } else {
      optionList = [];
      setshow365(false);
    }
  }
  function filterByTaxonomySearchMulti(items: any) {
    var tempid = items?.Id;
    var arr = [];
    if (items?.name != null || items?.name != "" || items?.name != undefined) {
      console.log(items);

      setuserinput(items?.name);
      managerEmail = items?.email;
      setusermanager(managerEmail);
      // nonm365id=tempid;

      arr.push({ text: items?.name, secondaryText: managerEmail });
      setusers(arr);
      console.log("mobile",users);
      // {items.Email};

      setshow365(false);
      // setsendData("true");
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
    {"User added successfully!"}
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
       <div style={{display:"flex", alignItems:"center"}}>
          <div style={{ width: 450 }}>
          <TextField
                type="text"
                onChange={getUserlist}
                value={userinput}
                //  defaultValue={Orgenteredusername}
                //onKeyDown={this.onKeyDown}
              />
              <div>
                <React.Fragment>
                  <div
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "0px 0px 2px 2px",
                      maxHeight: "196px",
                      overflow: "auto",
                      boxShadow: "0px 0px 1px 0px",
                    }}
                  >
                    <div>
                      {show365user ? (
                        optionList?.length > 0 ? (
                          optionList?.map((item2: any, key: any) => {
                            return (
                              <>
                                <ul className="DBPPStyleUL">
                                  <li className="DBPPStyle">
                                    <div
                                      onClick={() =>
                                        filterByTaxonomySearchMulti(item2)
                                      }
                                      style={{
                                        position: "relative",
                                        display: "flex",
                                      }}
                                    >
                                      <div
                                        style={{
                                          backgroundImage: item2.image,
                                          backgroundRepeat: "no-repeat",
                                          width: "32px",
                                          height: "32px",
                                          position: "absolute",
                                          borderRadius: "50%",
                                          zIndex: 1,
                                          backgroundPosition: "center",
                                          backgroundSize: "cover",
                                        }}
                                      ></div>
                                      <Persona
                                        // imageUrl={user.manager.img}
                                        imageInitials={item2.initials}
                                        imageAlt={item2.initials}
                                        // presence={item1.presence}
                                        size={PersonaSize.size32}
                                      />
                                      <div>
                                        <div
                                          style={{
                                            color: "#333",
                                            fontSize: "13px",
                                          }}
                                        >
                                          {item2.name}
                                        </div>
                                        <div
                                          style={{
                                            color: "#333",
                                            fontSize: "12px",
                                          }}
                                        >
                                          {item2.job}
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </>
                            );
                          })
                        ) : (
                          <div></div>
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </React.Fragment>
              </div>
          </div>

       
            <div style={{ marginLeft: "auto" }}>
              <PrimaryButton text={"Add"} onClick={addrole} />
            </div>
         
        </div>      
        </div>
   
                   


            <div>
                <table className="excludeTable">
                <thead>
                    <tr>                    
                    <th>{"Employee Name"}</th>
                    <th>{"Email"}</th>
                                     
                    </tr>
                </thead>
                <tbody>
                {addroles.map((x:any)=>{ return (<tr><td>{x.empname}</td><td>{x.empemail}</td></tr>);})}
                   

                </tbody>
</table>
</div>
</div>
</NewDocumentWrapper>
  );
}
export default Mobile
