import * as React from "react";
import { useBoolean } from "@fluentui/react-hooks";
import "./Styles.scss";
import { BlobServiceClient } from "@azure/storage-blob";
import { Buffer } from "buffer";
import useStore from "./store";

import { TeachingBubble } from "@fluentui/react/lib/TeachingBubble";
import { Checkbox } from "@fluentui/react";
import {
  Label,
  IDropdownStyles,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  DefaultButton,
  IconButton,
  Modal,
  Toggle,
  TextField,
  IPivotStyles,
  IDropdownOption,
  Dropdown,
  Stack,
  ICheckboxStyles,
} from "office-ui-fabric-react";
import { DirectionalHint } from "@fluentui/react/lib/Callout";
import CustomEdit from "./CustomEdit";
import { Icon, Link } from "@fluentui/react";
import { gapi } from "gapi-script";
import getschemasfields from "./getCustomSchema";
import { useLanguage } from "../../Language/LanguageContext";

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

// const checkboxStyle: ICheckboxStyles = {
//   text: {
//       fontWeight: 600,
//   },
//   checkmark: {
//       color: 'white',
//       backgroundColor: "[theme:themePrimary]",
//       padding: '3px',
//   },
//   checkbox: {
//       backgroundColor:'white',
//       border: '1px solid #333'
//   },
//   root: {
//       "&:hover": {
//           ".ms-Checkbox-checkbox":{
//               color: "[theme:themePrimary]",
//               backgroundColor: "[theme:themePrimary]",
//           }
//       }
//   }
// };

// const checkboxStyle: ICheckboxStyles = {
//   text: {
//       fontWeight: 600,
//   },
//   checkmark: {
//       color: localStorage.getItem("lightdarkmode") == 'light' ? 'var(--lightdarkColor)' : 'var(--lightdarkBGGray)',
//       backgroundColor: '#fff',
//       padding: '2px',
//       width: '20px',
//   },
//   checkbox: {
//       color: 'var(--lightdarkBGGray)',
//       border: '1px solid #333 !important'
//   },
//   // root: {
//   //     "&:hover": {
//   //         ".ms-Checkbox-checkbox": {
//   //             color: 'var(--lightdarkBGGray)',
//   //             backgroundColor: '#fff',
//   //         }
//   //     }
//   // }
// };
const dropdownstyles: Partial<IDropdownStyles> = {
  callout: {
    minWidth: "270px !important",
    width: "290px !important",
    maxWidth: "300px !important",
  },
};
var _custom;
var _spocustom;
var checkCustmField;
let allItems = [];
let GridReodering = [];
let SearchFltrReodering = [];
var empisadmin: any;
var parsedData: any = "";
let optionList: any = [];
var containerClient: any;
var KEY_NAME = "GridViewPrope";
function CustomAdd(props) {
  var sortedPeople;
  React.useEffect(() => {
    // getCustomfields();
  }, [allItems.length]);
  const { translation } = useLanguage();
  const [titles, settitles] = React.useState([]);
  const [formData, setFormData] = React.useState([]);
  const [editData, setEditData] = React.useState([]);
  const [optioncustomfields, setoptioncustomfields] = React.useState([]);
  const [optionselected, setoptionselected] = React.useState(String);
  const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>();
  const [selectedPropertyName, setselectedPropertyName] =
    React.useState<string>();
  const [sendData, setsendData] = React.useState(String);
  const [teachingBubbleVisible3, { toggle: toggleTeachingBubbleVisible3 }] =
    useBoolean(false);
  const [sendptype, setsendptype] = React.useState(String);
  const [sendColData, setsendColData] = React.useState(String);
  const [CheckChecked, setCheckChecked] = React.useState(false);
  const [ShowLabelChecked, setShowLabelChecked] = React.useState(false);
  const [ShowProfileCard, setShowProfileCard] = React.useState(false);
  const [HideChecked, setHideChecked] = React.useState(false);
  const [TextCustom, setTextCustom] = React.useState(false);
  const [DropdownCustom, setDropdownCustom] = React.useState(true);
  const [DateCustom, setDateCustom] = React.useState(false);
  const [StringValue, setStringValue] = React.useState("Dropdown");
  const [ButtonSaveText1, setButtonSaveText1] =
    React.useState<string>("Submit");
  const [loading1, setLoading1] = React.useState(false);
  const [users, setusers] = React.useState<any>([]);
  const { changeCustomFields } = useStore();
  const { changeDeleteCustomData } = useStore();
  const [people, setPeople] = React.useState([
    {
      id: 1,
      name: "name",
      checkbox: true,
      nameAPI: "",
      isCustomField: true,
    },
    {
      id: 2,
      name: "email",
      checkbox: true,
      nameAPI: "",
      isCustomField: true,
    },
    {
      id: 3,
      name: "job",
      checkbox: true,
      nameAPI: "",
      isCustomField: true,
    },
    {
      id: 4,
      name: "department",
      checkbox: true,
      nameAPI: "",
      isCustomField: true,
    },
    {
      id: 5,
      name: "location",
      checkbox: true,
      nameAPI: "",
      isCustomField: true,
    },
    {
      id: 6,
      name: "phone",
      checkbox: true,
      nameAPI: "",
      isCustomField: true,
    },
    {
      id: 7,
      name: "mobile",
      checkbox: true,
      nameAPI: "",
      isCustomField: true,
    },
    {
      id: 8,
      name: "manager",
      checkbox: true,
      nameAPI: "",
      isCustomField: true,
    },
  ]);

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
          console.log(newTitles, "newtitles");
        };
        generateData(sortedPeople);

        console.log(sortedPeople, "sortedPeopleadd");
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

  const onhideChange = React.useCallback(
    (
      ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
      checked?: boolean
    ): void => {
      if (ev.currentTarget.title == "Hide field") {
        if (checked) {
          setHideChecked(true);
        } else {
          setHideChecked(false);
        }
      }
    },
    []
  );
  React.useEffect(() => {
    GetSettingData();
  }, []);

  const handleClickEdit = (data: any) => {
    setEditData(data);
  };

  const onchangeCustom = React.useCallback(
    (
      ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
      checked?: boolean
    ): void => {
      if (ev.currentTarget.title == "Text") {
        if (checked) {
          setTextCustom(true);
          setStringValue("Text");
          setDropdownCustom(false);
          setDateCustom(false);
        }
      } else if (ev.currentTarget.title == "Dropdown") {
        if (checked) {
          setDropdownCustom(true);
          setStringValue("Dropdown");
          setTextCustom(false);
          setDateCustom(false);
        }
      } else if (ev.currentTarget.title == "Date") {
        if (checked) {
          setDateCustom(true);
          setDropdownCustom(false);
          setStringValue("Date");
          setTextCustom(false);
        }
      }
    },
    []
  );

  const onShowProfileCard = React.useCallback(
    (
      ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
      checked?: boolean
    ): void => {
      if (ev.currentTarget.title == "Display in only profile card") {
        if (checked) {
          setShowProfileCard(true);
        } else {
          setShowProfileCard(false);
        }
      }
    },
    []
  );

  const onshowlabelChange = React.useCallback(
    (
      ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
      checked?: boolean
    ): void => {
      if (ev.currentTarget.title == "Show field") {
        if (checked) {
          setShowLabelChecked(true);
        } else {
          setShowLabelChecked(false);
        }
      }
    },
    []
  );
  const onfiltersChange = React.useCallback(
    (
      ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
      checked?: boolean
    ): void => {
      if (ev.currentTarget.title == "Check field") {
        if (checked) {
          setCheckChecked(true);
        } else {
          setCheckChecked(false);
        }
      }
    },
    []
  );

  const handleClick = () => {
    const data = {
      filed: selectedItem,
      customField: selectedPropertyName,
      filterable: true,
      hide: HideChecked,
      displayProperty: ShowLabelChecked,
      displayOnlyProfileCard: ShowProfileCard,
      text: TextCustom,
      dropdown: DropdownCustom,
      date: DateCustom,
    };
    // Check if selectedPropertyName already exists in people array
    const existingProperty =
      selectedPropertyName &&
      people.find(
        (person) =>
          person.name === selectedPropertyName ||
          person.nameAPI === data.filed.key
      );

    if (
      !existingProperty &&
      selectedPropertyName !== undefined &&
      ShowLabelChecked !== undefined
    ) {
      people.push({
        id: people.length + 1,
        name: selectedPropertyName,
        checkbox: ShowLabelChecked,
        isCustomField: true,
        nameAPI: selectedItem?.text ?? "",
      });
      // SuccessMsg();
      changeDeleteCustomData(data);
      setFormData((prevFormData) => [...prevFormData, data]);
      const updatedParsedData = { ...parsedData, [KEY_NAME]: people };
      // setSaved(true);
      console.log(updatedParsedData, "pa");
      if (Object.keys(parsedData).length > 0) {
        updateSetting(updatedParsedData);
        // props.SweetAlertCustomfunc("success",translation.SettingSaved);
      }
      settitles((prevFormData) => [...prevFormData, data]);
      console.log(titles, "titles");
    } else {
      // setError(true);
      // ErrorMsg();
      props.SweetAlertCustomfunc("info", "Please select property");
      // Display a message indicating that the property already exists
      console.log(`${selectedPropertyName} already exists.`);
    }
  };

  const oncontainsChange = (event): void => {
    setselectedPropertyName(event.target.value as string);
    // console.log("Property Value Check", event.target.value )
  };

  const onChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    console.log(optioncustomfields, "change");
    setSelectedItem(item);
    console.log(item, "item");
  };
  const ontitlechange = (checked, colname: string, ptype: string) => {
    // console.log(titles);
    var filteredtitle = [...titles];
    filteredtitle.filter((x) => x.colname == colname)[0].checked =
      checked.target.checked;
    var _selectedtextoption = filteredtitle.filter(
      (x) => x.colname == colname
    )[0].displayname;
    var _selectedadoption = filteredtitle.filter((x) => x.colname == colname)[0]
      .colname;
    var _selectedadischecked = false;
    _selectedadischecked = filteredtitle.filter((x) => x.colname == colname)[0]
      .ischecked;
    var _selectedadisnamechecked = false;
    _selectedadisnamechecked = filteredtitle.filter(
      (x) => x.colname == colname
    )[0].isforths;
    var _selectedhidechecked = false;
    _selectedhidechecked = filteredtitle.filter((x) => x.colname == colname)[0]
      .isfifths;
    var _selectedfilterable = filteredtitle.filter(
      (x) => x.colname == colname
    )[0].issixth;
    var _selecteddisplaychecked = false;
    _selecteddisplaychecked = filteredtitle.filter(
      (x) => x.colname == colname
    )[0].isseventh;

    setoptionselected(
      _selectedtextoption +
        ";" +
        _selectedadoption +
        ";" +
        _selectedadischecked +
        ";" +
        _selectedadisnamechecked +
        ";" +
        _selectedhidechecked +
        ";" +
        _selectedfilterable +
        ";" +
        _selecteddisplaychecked
    );
    setsendData("true");
    setsendptype("AD");
    if (ptype == "AD") {
      setsendColData(_custom);
    } else {
      setsendColData(_spocustom);
    }
    settitles(filteredtitle);
  };
  async function addrole() {
    var rolesUser = "";
    if (users.length == 0) {
      // setAlertMsg("Please enter one user");
      props.SweetAlertCustomfunc("info", "Please enter one user");
      // setAlert(true);
      setTimeout(() => {
        // messageDismiss();
        props.dismissPanelCustomField();
      }, 5000);
      return;
    }
    let usrarr = [];

    for (var y = 0; y < users.length; y++) {
      usrarr.push(
        users[y].text.replace(/,/g, "#%#").replace(/-/g, "#%%#") +
          "!!" +
          users[y].secondaryText
            .replace(/(\d{4}|\d{5}|\d{6}|\d{3}|\d{2}|\d{1}|\d{10})$/, "")
            .trim()
      );
    }
    if (empisadmin != "") {
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

    parsedData["CustomRolesAdd"] = rolesUser;
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
        // setSaved(true);
        setusers([]);
        optionList = [];

        setTimeout(() => {
          // messageDismiss();
          props.dismissPanelCustomField();
        }, 5000);
        //  GetSettingData();
      });

    //excuserview = usrarr.join(",");
    // var ListItemData = null;

    //ListItemData = [{ "DefaultView": defaultview, "__metadata": { "type": "SP.Data.SettingListItem" } }];
  }
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
        props.SweetAlertCustomfunc("success", translation.SettingSaved);
        GetSettingData();
        // props.dismiss();

        // SuccessMsg();
        setTimeout(() => {
          // messageDismiss();
          props.dismissPanelCustomField();
        }, 5000);
      });
  }

  React.useEffect(() => {
    const ListData = async () => {
      try {
        const list = await getschemasfields();
        const fieldNames = list.map((item) => ({
          key: item.fieldName,
          text: item.displayname,
        }));
        console.log(fieldNames, "field names");
        setoptioncustomfields(fieldNames);
      } catch (error) {
        console.error("Error fetching list data:", error);
      }
    };
    ListData();
  }, []);
  React.useEffect(() => {}, [optioncustomfields]);

  return (
    <div>
      {sendData == "true" ? (
        sendptype == "AD" ? (
          <CustomEdit
            /* LicenseType={props.LicenseType} */ data={editData}
            editeddata={optionselected}
            coldata={sendColData}
            cftype={sendptype}
            /* langcode={props.langcode} */ PGridReodering={GridReodering}
            PSearchFltrReodering={SearchFltrReodering}
            dismiss={props.dismiss}
          />
        ) : (
          <>
            {/* <SharePointPropEdit LicenseType={props.LicenseType} data={sendData} editeddata={optionselected} coldata={sendColData} cftype={sendptype} langcode={props.langcode} PGridReodering={GridReodering}/> */}
          </>
        )
      ) : (
        <Stack>
          <div>
            <div
              className={"addCustomBlock"}
              style={{
                justifyContent: "space-between",
                columnGap: "15px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    flexDirection: "column",
                  }}
                >
                  <label style={{ marginBottom: "5px" }}>
                    {"Custom fields"}
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
                        calloutProps={{
                          directionalHint: DirectionalHint.bottomCenter,
                        }}
                        target="#Tooltip"
                        isWide={true}
                        hasCloseButton={true}
                        closeButtonAriaLabel={"Close"}
                        onDismiss={toggleTeachingBubbleVisible3}
                        headline=""
                      >
                        {
                          "You can view custom attributes of the employees on all the views and filter by adding filter. At present, customer attributes are not part of 'free search' attribute. "
                        }
                      </TeachingBubble>
                    )}
                  </label>

                  <Dropdown
                    styles={dropdownstyles}
                    placeholder={"Select an option"}
                    options={optioncustomfields}
                    onChange={onChange}
                    selectedKey={selectedItem ? selectedItem.text : null}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "13px",
                    flexDirection: "column",
                  }}
                >
                  <label>{"Property Name"}</label>
                  <TextField
                    onChange={oncontainsChange}
                    value={selectedPropertyName}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <div className={"newgridcustom"}>
                  {/*  <div className={"customfieldBlock"} title={
                 "This feature is available in Enterprise version!"
                } style={{
                  marginRight: '0px', width: "100%", display: "flex",

                }}>
                  <label>
                    {"Filterable"}</label>
                  <Checkbox checked={CheckChecked} title="Check field" onChange={onfiltersChange} />

                </div>

                <div className={"customfieldBlock"} style={{
                  width: '100%', maxWidth: "100%", display: "flex",

                }}>
                  <label>
                    {"Hide"}
                  </label>
                  <Checkbox checked={HideChecked} title="Hide field" onChange={onhideChange} />

                </div> */}

                  <div
                    style={{
                      display: "flex",
                      gap: "13px",
                      flexDirection: "column",
                    }}
                  >
                    <label style={{ whiteSpace: "nowrap" }}>
                      {"Display Property"}
                    </label>
                    <Checkbox
                      checked={ShowLabelChecked}
                      title="Show field"
                      onChange={onshowlabelChange}
                    />
                  </div>

                  {/*   <div className={"customfieldBlock"} style={{
                  width: '100%', maxWidth: "100%", display: "flex",
                }}>
                  <label>
                    {"Display in only profile card"}</label>
                  <Checkbox checked={ShowProfileCard} title="Display in only profile card" onChange={onShowProfileCard} />

                </div> */}
                </div>
                {CheckChecked == true ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "90px 88px 75px",
                    }}
                  >
                    <div
                      className={"customfieldBlock"}
                      style={{
                        width: "100%",
                        maxWidth: "100%",
                        display: "flex",
                      }}
                    >
                      <label>{"Text"}</label>
                      <Checkbox
                        checked={TextCustom}
                        title="Text"
                        onChange={onchangeCustom}
                      />
                    </div>

                    <div
                      className={"customfieldBlock"}
                      style={{
                        width: "100%",
                        maxWidth: "100%",
                        display: "flex",
                      }}
                    >
                      <label>{"Dropdown"}</label>
                      <Checkbox
                        checked={DropdownCustom}
                        title="Dropdown"
                        onChange={onchangeCustom}
                      />
                    </div>
                    <div
                      className={"customfieldBlock"}
                      style={{
                        width: "100%",
                        maxWidth: "100%",
                        display: "flex",
                      }}
                    >
                      <label>{"Date"}</label>
                      <Checkbox
                        checked={DateCustom}
                        title="Date"
                        onChange={onchangeCustom}
                      />
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className={"fieldSubmitBtn"}>
              <PrimaryButton onClick={handleClick}>
                {ButtonSaveText1}
                {loading1 && (
                  <div className={"elementToFadeInAndOut"}>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                )}
              </PrimaryButton>
            </div>
            <div className={"tablescroll"}>
              <table className="customTable">
                <thead>
                  <tr>
                    <th>{"Action"}</th>
                    <th>{"Type"}</th>
                    <th>{"Property Name"}</th>
                    <th>{"Display Name"}</th>
                    <th>{"Filterable"}</th>
                    <th>{"Display Property"}</th>
                    {/*  <th>{"Hide"}</th> */}
                    {/*  <th>{"Display in only profile card"}</th> */}
                  </tr>
                </thead>
                <tbody>
                  {titles.map((x, index) => {
                    return (
                      <tr>
                        <td style={{ textAlign: "center" }} key={index}>
                          <Link
                            onClick={(checked) =>
                              ontitlechange(checked, x.colname, x.ptype)
                            }
                          >
                            <Icon
                              title={"Edit"}
                              onClick={() => handleClickEdit(x)}
                              iconName="Edit"
                            />
                          </Link>
                        </td>
                        <td>{""}</td>
                        <td>{x.field}</td>
                        <td>{x.customField}</td>
                        <td>
                          {x.filterable === true ? (
                            <Icon
                              style={{ marginLeft: "10px" }}
                              iconName="CheckMark"
                            ></Icon>
                          ) : (
                            <Icon
                              style={{ marginLeft: "10px" }}
                              iconName="Cancel"
                            />
                          )}
                        </td>
                        {/* <td>{x.hide === true ? <Icon style={{ marginLeft: '10px' }} iconName="CheckMark"></Icon> : <Icon style={{ marginLeft: '10px' }} iconName="Cancel" />}</td> */}
                        <td>
                          {x.displayProperty == true ? (
                            <Icon
                              style={{ marginLeft: "10px" }}
                              iconName="CheckMark"
                            ></Icon>
                          ) : (
                            <Icon
                              style={{ marginLeft: "10px" }}
                              iconName="Cancel"
                            />
                          )}
                        </td>
                        {/* <td>{x.displayOnlyProfileCard == true? <Icon style={{ marginLeft: '10px' }} iconName="CheckMark"></Icon> : <Icon style={{ marginLeft: '10px' }} iconName="Cancel" />}</td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Stack>
      )}
    </div>
  );
}

export default CustomAdd;
