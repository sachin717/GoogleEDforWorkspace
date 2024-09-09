import * as React from "react";
import {
  DatePicker,
  DefaultButton,
  Icon,
  IconButton,
  Label,
  MessageBar,
  MessageBarType,
  Modal,
  Persona,
  PersonaSize,
  PrimaryButton,
  Stack,
  TextField,
} from "@fluentui/react";
import { gapi } from "gapi-script";
import { useBoolean } from "@fluentui/react-hooks";
import { style } from "./styles";
import styled from "styled-components";
import DefaultImage from "../assets/images/DefaultImg1.png";
import useStore from "../SelectSource/store";
import { useLanguage } from "../../Language/LanguageContext";
const NewDocumentWrapper = styled.div`
  ${style}
`;

//const bdayLogo:any = require("../../assets/two.png");

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

var ColumnType: any = [];
let finalDataNonM365: any = [];
let optionList: any = [];
var managerEmail = "";

function EditProfile(props: any) {
  const [saved, setSaved] = React.useState(false);
  const [imageFile, setimageFile] = React.useState(null);
  const [saveMsg, setSaveMsg] = React.useState<any>(null);
  const [isModalOpen, { setTrue: openModal, setFalse: closeModal }] =
    useBoolean(false);
  const [currentLogo, setCurrentLogo] = React.useState(null);
  const [error, setError] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState("");
  const [selectedemail, setselectedemail] = React.useState<string>();
  const [selectedname, setselectedname] = React.useState<string>();
  const [selectedtitle, setselectedtitle] = React.useState<string>();
  const [selecteddept, setselecteddept] = React.useState<string>();
  const [selectedloc, setselectedloc] = React.useState<string>();
  const [selectedmob, setselectedmob] = React.useState<string>();
  const [selectedwp, setselectedwp] = React.useState<string>();
  const [selectedid, setselectedid] = React.useState<string>();
  const [selectedcc, setselectedcc] = React.useState<string>();
  const [selectedaddress, setselectedaddress] = React.useState<string>();
  const [selectedfname, setselectedfname] = React.useState<string>();
  const [selectedfsection, setselectedfsection] = React.useState<string>();
  const [selectedbid, setselectedbid] = React.useState<string>();
  const [Dateofbirth, setDateofbirth] = React.useState<Date | undefined>(
    new Date()
  );
  const [Dateofjoin, setDateofjoin] = React.useState<Date | undefined>(
    new Date()
  );
  const [usermanager, setusermanager] = React.useState(String);
  const [userinput, setuserinput] = React.useState(String);
  const [show365user, setshow365] = React.useState(false);
  const [senddata, setsenddata] = React.useState(String);
  const [customfield1, setcustomfield1] = React.useState<string>();
  const [customfield2, setcustomfield2] = React.useState<string>();
  const [customfield3, setcustomfield3] = React.useState<string>();
  const [customfield4, setcustomfield4] = React.useState<string>();
  const [customfield5, setcustomfield5] = React.useState<string>();
  const [setwork1, setSendwork1] = React.useState({});
  const [setwork2, setSendwork2] = React.useState({});
  const [CustomDateChangeWork, setCustomDateChangeWork] = React.useState<any>();
  const {translation}=useLanguage();
  const { reRenderState } = useStore();

  React.useEffect(() => {
    RichTextSett();
  }, []);

  const onTextChangename = (event: any): void => {
    setselectedname(event.target.value as string);
  };

  const onTextChangedesign = (event: any): void => {
    setselectedtitle(event.target.value as string);
  };

  const onTextChangedept = (event: any): void => {
    setselecteddept(event.target.value as string);
  };

  const onTextChangeemail = (event: any): void => {
    setselectedemail(event.target.value as string);
  };
  const onTextChangeofc = (event: any): void => {
    setselectedloc(event.target.value as string);
  };
  const onTextChangemob = (event: any): void => {
    setselectedmob(event.target.value as string);
  };
  const onTextChangewp = (event: any): void => {
    setselectedwp(event.target.value as string);
  };
  const onTextChangeeid = (event: any): void => {
    setselectedid(event.target.value as string);
  };
  const onTextChangecc = (event: any): void => {
    setselectedcc(event.target.value as string);
  };
  const onTextChangeaddress = (event: any): void => {
    setselectedaddress(event.target.value as string);
  };
  const onTextChangefsection = (event: any): void => {
    setselectedfsection(event.target.value as string);
  };
  const onTextChangefname = (event: any): void => {
    setselectedfname(event.target.value as string);
  };
  const onTextChangebid = (event: any): void => {
    setselectedbid(event.target.value as string);
  };

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
    //  optionList = [];

    setuserinput(text.target.value);

    if (text.target.value.length > 3) {
      getAllUsersInOrg(text.target.value).then((item: any) => {
        let staffMember = item.map((user: any) => {
          if (user?.name?.givenName != null) {
            var names = user.name.givenName.split(" "),
              initials = names[0].substring(0, 1).toUpperCase();
            if (names.length > 1) {
              initials += names[names.length - 1].substring(0, 1).toUpperCase();
            }
          }
          return {
            firstName: user?.name?.givenName,
            lastName: user?.name?.familyName,
            name: user?.name?.fullName,
            email: user?.primaryEmail,
            id: user?.id,
            job: user?.hasOwnProperty("organizations")
              ? user.organizations[0].hasOwnProperty("title")
                ? user.organizations[0].title
                : ""
              : "",
            initials: initials,
            department: user?.hasOwnProperty("organizations")
              ? user.organizations[0].hasOwnProperty("department")
                ? user.organizations[0].department
                : ""
              : "",

            workphone: getUserOrgWPItem(user),
            mobile: getUserOrgMBItem(user),
            manager: getUserOrgMGItem(user),
            employeeid: getUserOrgEIDItem(user),

            costcenter: user?.hasOwnProperty("organizations")
              ? user.organizations[0].hasOwnProperty("costCenter")
                ? user.organizations[0].costCenter
                : ""
              : "",
            buildingid: user?.hasOwnProperty("locations")
              ? user.locations[0].hasOwnProperty("buildingId")
                ? user.locations[0].buildingId
                : ""
              : "",
            floorname: user?.hasOwnProperty("locations")
              ? user.locations[0].hasOwnProperty("floorName")
                ? user.locations[0].floorName
                : ""
              : "",
            floorsection: user?.hasOwnProperty("locations")
              ? user.locations[0].hasOwnProperty("floorSection")
                ? user.locations[0].floorSection
                : ""
              : "",
            location: getUserOrgLOCItem(user),
            address: getUserOrgADDItem(user),
            image: user?.hasOwnProperty("thumbnailPhotoUrl")
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
    var tempid = items.Id;
    if (items.name != null || items.name != "" || items.name != undefined) {
      console.log(items);

      setuserinput(items.name);
      managerEmail = items.email;
      setusermanager(managerEmail);
      // nonm365id=tempid;

      // {items.Email};

      setshow365(false);
      // setsendData("true");
    }
  }
  async function bthdaytemp() {
    var updateData = {
      // "primaryEmail": selectedemail,
      // "name": {
      //     "fullName": selectedname
      // },
      externalIds: [
        {
          value: selectedid,
          type: "organization",
        },
      ],
      relations: [
        {
          value: usermanager,
          type: "manager",
        },
      ],
      addresses: [
        {
          type: "work",
          formatted: selectedaddress,
        },
      ],
      organizations: [
        {
          title: selectedtitle,
          primary: true,
          customType: "",
          department: selecteddept,

          costCenter: selectedcc,
        },
      ],
      phones: [
        {
          value: selectedwp,
          type: "work",
        },
        {
          value: selectedmob,
          type: "mobile",
        },
      ],
      locations: [
        {
          type: "desk",
          area: "desk",
          buildingId: selectedbid,
          floorName: selectedfname,
          floorSection: selectedfsection,
        },
      ],
    };
    await gapi.client.directory.users
      .patch({
        userKey: selectedemail,
        // projection: "full",
        resource: updateData,
      })
      .then(() => {
        // setSaved(true);
        // setSaveMsg("Settings saved successfully!");
        props.SweetAlertEditProfile("success",translation.SettingSaved)
        reRenderState();
        setTimeout(() => {
          messageDismiss();
        }, 3000);
      });
  }
  async function getUserName(userEmail: any) {
    let page: any = "";
    let staffList: any = [];
    page = await gapi.client.directory.users.get({
      userKey: userEmail,
      projection: "full",
      orderBy: "givenName",
    });
    staffList = staffList.concat(page.result);
    return staffList;
  }
  function RichTextSett() {
    let managername = "";

    setselectedid(props.user.EmployeeId);
    setselectedname(props.user.name);
    setselectedemail(props.user.email);
    setselectedtitle(props.user.jtitle);
    setselecteddept(props.user.dept);
    setselectedloc(props.user.loc);
    setselectedmob(props.user.mobile);
    setselectedwp(props.user.wphone);
    setselectedcc(props.user.CostCenter);
    setselectedaddress(props.user.Address);
    setselectedfsection(props.user.FloorSection);
    setselectedfname(props.user.FloorName);
    setselectedbid(props.user.BuildingId);
    if (props.user.manager != "") {
      getUserName(props.user.manager).then((getuser: any) => {
        managername = getuser[0].name.fullName;
        setuserinput(managername);
      });
    }

    setusermanager(props.user.manager);
  }

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
      dismissButtonAriaLabel={"Close"}
    >
      {saveMsg ? saveMsg : "Settings saved successfully!"}
    </MessageBar>
  );
  const ErrorMsg = () => (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
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
      <div id="editProfile">
    
        <Icon
          iconName="save"
          onClick={bthdaytemp}
          style={{
            position: "fixed",
            right: "60px",
            top: "16px",
            color: "white",
            cursor: "pointer",
          }}
        />

        <div className="editorBlockStyles">
          <div className="RichEditorBlk">
            <div className="ms-Grid" dir="ltr">
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                  {/* <div className={styles.tab1}> */}
                  <Label>{"Name"}</Label>
                  <TextField
                    onChange={onTextChangename}
                    value={selectedname}
                    readOnly
                  />
                </div>
                <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                  {/* <div className={styles.tab1}> */}
                  <Label>{"Employee ID"}</Label>
                  <TextField onChange={onTextChangeeid} value={selectedid} />
                </div>

                <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                  <Label>{"Designation"}</Label>
                  <TextField
                    onChange={onTextChangedesign}
                    value={selectedtitle}
                  />
                </div>
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                  <Label>{"Department"}</Label>
                  <TextField onChange={onTextChangedept} value={selecteddept} />
                </div>

                <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                  <Label>{"Email"}</Label>
                  <TextField
                    onChange={onTextChangeemail}
                    value={selectedemail}
                    readOnly
                  />
                </div>
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                  <Label>{"Office"}</Label>
                  <TextField onChange={onTextChangeofc} value={selectedloc} />
                </div>

                <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                  <Label>{"Mobile"}</Label>
                  <TextField onChange={onTextChangemob} value={selectedmob} />
                </div>
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                  {/* <div className={styles.tab1}> */}
                  <Label>{"Work Phone"}</Label>
                  <TextField onChange={onTextChangewp} value={selectedwp} />
                </div>
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                  <Label>{"Cost center"}</Label>
                  <TextField
                    multiline
                    onChange={onTextChangecc}
                    value={selectedcc}
                  />
                </div>
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                  {/* <div className={styles.tab1}> */}
                  <Label>{"Address"}</Label>
                  <TextField
                    multiline
                    onChange={onTextChangeaddress}
                    value={selectedaddress}
                  />
                </div>

                <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                  <Label>{"Floor section"}</Label>
                  <TextField
                    multiline
                    onChange={onTextChangefsection}
                    value={selectedfsection}
                  />
                </div>
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                  <Label>{"Floor name"}</Label>
                  <TextField
                    multiline
                    onChange={onTextChangefname}
                    value={selectedfname}
                  />
                </div>

                <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                  <Label>{"Building ID"}</Label>
                  <TextField
                    multiline
                    onChange={onTextChangebid}
                    value={selectedbid}
                  />
                </div>

                <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                  <Label>{"Manager"}</Label>
                  {/* <TextField
                    multiline
                    onChange={onTextChangemanager}
                    value={selectedManager}
                  /> */}
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

                {/* <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
              
                <Label>
                  {"Custom Field 1"}
                </Label>
                <TextField
                  multiline
                  onChange={onTextChangecf1}
                  value={customfield1}
                />
              </div>
              <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
            
                <Label>
                {"Custom Field 2"}
                </Label>
                <TextField
                  multiline
                  onChange={onTextChangecf2}
                  value={customfield2}
                />
              </div>
              <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
              
                <Label>
                {"Custom Field 3"}
                </Label>
                <TextField
                  multiline
                  onChange={onTextChangecf3}
                  value={customfield3}
                />
              </div>
              <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
            
                <Label>
                {"Custom Field 4"}
                </Label>
                <TextField
                  multiline
                  onChange={onTextChangecf4}
                  value={customfield4}
                />
              </div>
              <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
              
                <Label>
                {"Custom Field 5"}
                </Label>
                <TextField
                  multiline
                  onChange={onTextChangecf5}
                  value={customfield5}
                />
              </div>  */}
                {/* {senddata == "true" ? (
                <>
                  {ColumnType.map((x) => {
                    var xx = x.FieldType;
                    var yy = x.DisplayName;
                    var zz = x.FieldName;

                    if (xx == "Single line of text") {
                      return (
                        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                          <Label>{yy}</Label>
                          <TextField
                            onChange={getworkvalue1}
                            value={setwork1[zz] || ""}
                            id={zz}
                          />
                        </div>
                      );
                    }

                    if (xx == "Date and time") {
                      return (
                        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                          <DatePicker
                            label={yy}
                            onSelectDate={(Date) => {
                              onCustomDateChangeWork(Date, zz);
                            }}
                            id={zz}
                            value={
                              CustomDateChangeWork?.[zz]
                                ? new Date(CustomDateChangeWork?.[zz])
                                : null
                            }
                          />
                        </div>
                      );
                    }
                    if (xx == "Multiple lines of text") {
                      return (
                        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                          <Label>{yy}</Label>
                          <TextField
                            onChange={getworkvalue2}
                            value={setwork2[zz] || ""}
                            id={zz}
                            multiline
                          />
                        </div>
                      );
                    }
                  })}
                </>
              ) : (
                ""
              )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </NewDocumentWrapper>
  );
}

export default EditProfile;
