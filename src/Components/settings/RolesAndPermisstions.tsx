import * as React from "react";
import { gapi } from "gapi-script";
import styles from "../SCSS/Ed.module.scss";
import {
  PrimaryButton,
  TextField,
  PersonaSize,
  Persona,
  Checkbox,
  Panel,
  PanelType,
} from "@fluentui/react";
import { style } from "../SelectSource/styles";
import styled from "styled-components";
import { BlobServiceClient } from "@azure/storage-blob";
import DefaultImage from "../assets/images/DefaultImg1.png";
import { Buffer } from "buffer";
import { useLanguage } from "../../Language/LanguageContext";
import { SweetAlerts } from "../SelectSource/Utils/SweetAlert";

const NewDocumentWrapper = styled.div`
  ${style}
`;

var empisadmin: any;
let allItems: any = [];
var managerEmail = "";
let finalDataNonM365: any = [];
let optionList: any = [];
var parsedData: any = "";
var containerClient: any;

function RolesAndPermisstions(props: any) {
  const { isOpen, onDismiss } = props;
  const { SweetAlert: SweetAlertInPanel } = SweetAlerts("#RAN", true);

  const { translation } = useLanguage();
  const [addroles, setaddroles] = React.useState([]);
  const [isUserSelected, setUserSelected] = React.useState(false);
  const [users, setusers] = React.useState<any>([]);
  const [userinput, setuserinput] = React.useState(String);
  const [show365user, setshow365] = React.useState(false);

  React.useEffect(() => {
    GetSettingData();
  }, []);

  allItems = [];

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

  function filterByTaxonomySearchMulti(items: any) {
    var tempid = items.Id;
    var arr = [];
    if (items.name !== null || items.name !== "" || items.name !== undefined) {
      console.log(items, "1");

      setuserinput(items.name);
      managerEmail = items.email;
      arr.push({ text: items.name, secondaryText: managerEmail });
      setusers(arr);
      setshow365(false);
    }
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
      console.log("Downloaded blob content11", downloaded, "2");
      // const jsonData = downloadBlockBlobResponse.toString();
      // Parse the JSON data
      //const buf = new ArrayBuffer(downloaded.maxByteLength);
      const decoder = new TextDecoder();
      const str = decoder.decode(downloaded);
      //_parsedData=str;
      parsedData = JSON.parse(str);
      empisadmin = parsedData.IsAdmin;
      //console.log(parsedData);
      if (empisadmin !== "" && empisadmin !== undefined) {
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
        console.log(allItems, "allItyems");
        setaddroles(allItems);
        let selectedUserCount = allItems?.filter((item) => item.checked);
        setUserSelected(selectedUserCount?.length > 0 ? true : false);
      }
    }
  }

  async function addrole() {
    var rolesUser = "";
    if (users.length == 0) {
      SweetAlertInPanel("error", "Please enter one user");
      return;
    }

    let usrarr: any = [];

    for (var y = 0; y < users.length; y++) {
      usrarr.push(
        users[y].text.replace(/,/g, "#%#").replace(/-/g, "#%%#") +
          "-" +
          users[y].secondaryText
      );
    }
    if (empisadmin !== null) {
      var _rolesUser = empisadmin + ";" + usrarr.join(";");

      var splitted = _rolesUser.split(";");
      var collector: any = {};
      for (var i = 0; i < splitted.length; i++) {
        key = splitted[i].replace(/^\s*/, "").replace(/\s*$/, "");
        collector[key] = true;
      }
      var out = [];
      for (var key in collector) {
        out.push(key);
      }
      rolesUser = out.join(";");
    } else {
      rolesUser = usrarr.join(";");
    }
    console.log(rolesUser, "roleUser");
    parsedData["IsAdmin"] = rolesUser;

    var _parsedData = JSON.stringify(parsedData);
    var domain = gapi.auth2
      .getAuthInstance()
      .currentUser.le.wt.cu.split("@")[1];
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
        SweetAlertInPanel("success", "User added successfully!");
        setusers([]);
        optionList = [];
        setuserinput("");
      });
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
    if (user.hasOwnProperty("phones")) {
      const primaryOrg = user.phones.filter((x: any) => x.type === "work")[0]
        .value;

      return primaryOrg;
    } else {
      return "";
    }
  }
  function getUserOrgMBItem(user: any) {
    if (user.hasOwnProperty("phones")) {
      const primaryOrg = user.phones.filter((x: any) => x.type === "mobile")[0]
        .value;

      return primaryOrg;
    } else {
      return "";
    }
  }
  function getUserOrgMGItem(user: any) {
    if (user.hasOwnProperty("relations")) {
      const primaryOrg = user.relations.filter(
        (x: any) => x.type === "manager"
      )[0].value;

      return primaryOrg;
    } else {
      return "";
    }
  }
  function getUserOrgEIDItem(user: any) {
    if (user.hasOwnProperty("externalIds")) {
      const primaryOrg = user.externalIds.filter(
        (x: any) => x.type === "organization"
      )[0].value;

      return primaryOrg;
    } else {
      return "";
    }
  }
  function getUserOrgADDItem(user: any) {
    if (user.hasOwnProperty("addresses")) {
      const primaryOrg = user.addresses.filter((x: any) => x.type === "work")[0]
        .formatted;

      return primaryOrg;
    } else {
      return "";
    }
  }
  function getUserOrgLOCItem(user: any) {
    if (user.hasOwnProperty("locations")) {
      var bid = user.locations[0].hasOwnProperty("buildingId")
        ? user.locations[0].buildingId
        : "";
      var floorname = user.locations[0].hasOwnProperty("floorName")
        ? user.locations[0].floorName
        : "";
      var floorsection = user.locations[0].hasOwnProperty("floorSection")
        ? user.locations[0].floorSection
        : "";
      return bid + " " + floorname + " " + floorsection;
    } else {
      return "";
    }
  }
  function getUserlist(text: any) {
    setuserinput(text.target.value);

    if (text.target.value.length > 3) {
      getAllUsersInOrg(text.target.value).then((item: any) => {
        if (typeof item[0] === "undefined") {
          optionList = [];
        } else {
          let staffMember = item.map((user: any) => {
            if (
              user.name.givenName !== null &&
              user.name.givenName !== undefined
            ) {
              var names = user.name.givenName.split(" "),
                initials = names[0].substring(0, 1).toUpperCase();
              if (names.length > 1) {
                initials += names[names.length - 1]
                  .substring(0, 1)
                  .toUpperCase();
              }
            }
            return {
              firstName: user.name.givenName,
              lastName: user.name.familyName,
              name: user.name.fullName,
              email: user.primaryEmail,
              id: user.id,
              job: user.hasOwnProperty("organizations")
                ? user.organizations[0].hasOwnProperty("title")
                  ? user.organizations[0].title
                  : ""
                : "",
              initials: initials,
              department: user.hasOwnProperty("organizations")
                ? user.organizations[0].hasOwnProperty("department")
                  ? user.organizations[0].department
                  : ""
                : "",

              workphone: getUserOrgWPItem(user),
              mobile: getUserOrgMBItem(user),
              manager: getUserOrgMGItem(user),
              employeeid: getUserOrgEIDItem(user),

              costcenter: user.hasOwnProperty("organizations")
                ? user.organizations[0].hasOwnProperty("costCenter")
                  ? user.organizations[0].costCenter
                  : ""
                : "",
              buildingid: user.hasOwnProperty("locations")
                ? user.locations[0].hasOwnProperty("buildingId")
                  ? user.locations[0].buildingId
                  : ""
                : "",
              floorname: user.hasOwnProperty("locations")
                ? user.locations[0].hasOwnProperty("floorName")
                  ? user.locations[0].floorName
                  : ""
                : "",
              floorsection: user.hasOwnProperty("locations")
                ? user.locations[0].hasOwnProperty("floorSection")
                  ? user.locations[0].floorSection
                  : ""
                : "",
              location: getUserOrgLOCItem(user),
              address: getUserOrgADDItem(user),
              image: user.hasOwnProperty("thumbnailPhotoUrl")
                ? user.thumbnailPhotoUrl
                : DefaultImage,
            };
          });
          finalDataNonM365 = staffMember.filter((obj: any, index: any) => {
            return (
              index === staffMember.findIndex((o: any) => obj.email === o.email)
            );
          });

          optionList = finalDataNonM365
            ? finalDataNonM365.map((items: any) => ({
                name: items.name,
                initials: items.initials,
                job: items.job,
                id: items.id,
                email: items.email?.toLowerCase(),
                location: items.location,
                department: items.department,
                image: "url(" + items.image + ")",
              }))
            : [];

          setTimeout(() => {
            setshow365(true);
          }, 1000);
        }
      });
    } else {
      optionList = [];
      setshow365(false);
    }
  }

  const onChangeSelectionRoles = (e, value) => {
    console.log(value);
    var allData = [...addroles];
    const index = allData.findIndex((x) => x.empemail === value.empemail);
    if (index >= 0) {
      allData[index].checked = e.target.checked;
    }
    setaddroles(allData);
    let selectedUser = addroles?.filter((item) => item.checked == true);
    setUserSelected(selectedUser?.length > 0 ? true : false);
  };

  async function handleBulkDelete() {
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
      SweetAlertInPanel("error", "Please select users to remove!");
      return false;
    } else {
      for (var y = 0; y < excluderoles.length; y++) {
        if (displayname !== excluderoles[y].empname) {
          roledelarray.push(
            excluderoles[y].empname.replace(/,/g, "#%#").replace(/-/g, "#%%#") +
              "-" +
              excluderoles[y].empemail
          );
        } else {
          SweetAlertInPanel(
            "error",
            "You can not remove yourself from the role"
          );
          return;
        }
      }

      if (empisadmin !== null) {
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

      parsedData["IsAdmin"] = _anthsplit.join(";");
      console.log(parsedData, "called");
      var _parsedData = JSON.stringify(parsedData);
      var domain = gapi.auth2
        .getAuthInstance()
        .currentUser.le.wt.cu.split("@")[1];
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
          SweetAlertInPanel("success", "User deleted successfully!");
          setusers([]);
        });
    }
  }

  return (
    <div>
      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={
          translation.Updateusersroleandpermissions ?? "Role and permissions"
        }
        isOpen={isOpen}
        onDismiss={onDismiss}
        closeButtonAriaLabel={"Close"}
      >
        <NewDocumentWrapper>
          <div style={{ margin: "20px 0" }} id="RAN">
            <div id="role" className="settingBlock">
              <div className={styles.rolesandpermissionscon}>
                <div style={{ width: 450 }}>
                  <TextField
                    type="text"
                    onChange={getUserlist}
                    value={userinput}
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

                <div
                  style={{ marginLeft: "auto", display: "flex", gap: "5px" }}
                >
                  <PrimaryButton text={"Add"} onClick={addrole} />
                  {isUserSelected ? (
                    <PrimaryButton
                      text={"Bulk Delete"}
                      style={{ whiteSpace: "nowrap" }}
                      onClick={handleBulkDelete}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>

            <div>
              <table className="excludeTable">
                <thead>
                  <tr>
                    <th>{"Select"}</th>
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
                          {" "}
                          <Checkbox
                            checked={x.checked}
                            // title={x.field}
                            onChange={(checked) =>
                              onChangeSelectionRoles(checked, x)
                            }
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
      </Panel>
    </div>
  );
}

export default RolesAndPermisstions;
