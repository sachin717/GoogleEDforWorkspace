// import * as React from "react";
// import { useBoolean } from "@fluentui/react-hooks";
// import "./Styles.scss";
// import { BlobServiceClient } from "@azure/storage-blob";
// import { Buffer } from "buffer";
// import useStore, { useSttings } from "./store";

// import { Dropdown, IDropdownOption, TextField } from "office-ui-fabric-react";
// import { useFields } from "../../context/store";
// import { useEffect, useState } from "react";
// import { removeDuplicatesFromObject } from "../Helpers/HelperFunctions";
// import { Checkbox, IDropdownStyles } from "@fluentui/react";

// import { TeachingBubble } from "@fluentui/react/lib/TeachingBubble";
// import { Checkbox } from "@fluentui/react";
// import {
//   Label,
//   IDropdownStyles,
//   MessageBar,
//   MessageBarType,
//   PrimaryButton,
//   DefaultButton,
//   IconButton,
//   Modal,
//   Toggle,
//   TextField,
//   IPivotStyles,
//   IDropdownOption,
//   Dropdown,
//   Stack,
//   ICheckboxStyles,
// } from "office-ui-fabric-react";
// import { DirectionalHint } from "@fluentui/react/lib/Callout";
// import CustomEdit from "./CustomEdit";
// import { Icon, Link } from "@fluentui/react";
// import { gapi } from "gapi-script";
// import getschemasfields from "./getCustomSchema";
// import { useLanguage } from "../../Language/LanguageContext";
// import { getSettingJson, SETTING_LIST, updateSettingJson } from "../../api/storage";

// const messageBarWarningStyles = {
//   root: {
//     backgroundColor: "rgb(255, 244, 206)",
//   },
// };
// const messageBarInfoStyles = {
//   root: {
//     backgroundColor: "rgb(243, 242, 241)",
//   },
// };
// const messageBarErrorStyles = {
//   root: {
//     backgroundColor: "rgb(253, 231, 233)",
//   },
// };
// const messageBarSuccessStyles = {
//   root: {
//     backgroundColor: "rgb(223, 246, 221)",
//   },
// };

// // const checkboxStyle: ICheckboxStyles = {
// //   text: {
// //       fontWeight: 600,
// //   },
// //   checkmark: {
// //       color: 'white',
// //       backgroundColor: "[theme:themePrimary]",
// //       padding: '3px',
// //   },
// //   checkbox: {
// //       backgroundColor:'white',
// //       border: '1px solid #333'
// //   },
// //   root: {
// //       "&:hover": {
// //           ".ms-Checkbox-checkbox":{
// //               color: "[theme:themePrimary]",
// //               backgroundColor: "[theme:themePrimary]",
// //           }
// //       }
// //   }
// // };

// // const checkboxStyle: ICheckboxStyles = {
// //   text: {
// //       fontWeight: 600,
// //   },
// //   checkmark: {
// //       color: localStorage.getItem("lightdarkmode") == 'light' ? 'var(--lightdarkColor)' : 'var(--lightdarkBGGray)',
// //       backgroundColor: '#fff',
// //       padding: '2px',
// //       width: '20px',
// //   },
// //   checkbox: {
// //       color: 'var(--lightdarkBGGray)',
// //       border: '1px solid #333 !important'
// //   },
// //   // root: {
// //   //     "&:hover": {
// //   //         ".ms-Checkbox-checkbox": {
// //   //             color: 'var(--lightdarkBGGray)',
// //   //             backgroundColor: '#fff',
// //   //         }
// //   //     }
// //   // }
// // };
// const dropdownstyles: Partial<IDropdownStyles> = {
//   callout: {
//     minWidth: "270px !important",
//     width: "290px !important",
//     maxWidth: "300px !important",
//   },
// };
// var _custom;
// var _spocustom;
// var checkCustmField;
// let allItems = [];
// let GridReodering = [];
// let SearchFltrReodering = [];
// var empisadmin: any;
// var parsedData: any = "";
// let optionList: any = [];
// var containerClient: any;
// var KEY_NAME = "GridViewPrope";
// function CustomAdd(props) {
//   const { appSettings, setAppSettings } = useSttings();
//   var sortedPeople;
//   React.useEffect(() => {
//     // getCustomfields();
//   }, [allItems.length]);
//   const { translation } = useLanguage();
//   const [titles, settitles] = React.useState([]);
//   const [formData, setFormData] = React.useState([]);
//   const [editData, setEditData] = React.useState([]);
//   const [optioncustomfields, setoptioncustomfields] = React.useState([]);
//   const [optionselected, setoptionselected] = React.useState(String);
//   const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>();
//   const [selectedPropertyName, setselectedPropertyName] =
//     React.useState<string>();
//   const [sendData, setsendData] = React.useState(String);
//   const [teachingBubbleVisible3, { toggle: toggleTeachingBubbleVisible3 }] =
//     useBoolean(false);
//   const [sendptype, setsendptype] = React.useState(String);
//   const [sendColData, setsendColData] = React.useState(String);
//   const [CheckChecked, setCheckChecked] = React.useState(false);
//   const [ShowLabelChecked, setShowLabelChecked] = React.useState(false);
//   const [ShowProfileCard, setShowProfileCard] = React.useState(false);
//   const [HideChecked, setHideChecked] = React.useState(false);
//   const [TextCustom, setTextCustom] = React.useState(false);
//   const [DropdownCustom, setDropdownCustom] = React.useState(true);
//   const [DateCustom, setDateCustom] = React.useState(false);
//   const [StringValue, setStringValue] = React.useState("Dropdown");
//   const [ButtonSaveText1, setButtonSaveText1] =
//     React.useState<string>("Submit");
//   const [loading1, setLoading1] = React.useState(false);
//   const [users, setusers] = React.useState<any>([]);
//   const { changeCustomFields } = useStore();
//   const { changeDeleteCustomData } = useStore();
//   const [people, setPeople] = React.useState([
//     {
//       id: 1,
//       name: "name",
//       checkbox: true,
//       nameAPI: "",
//       isCustomField: true,
//     },
//     {
//       id: 2,
//       name: "email",
//       checkbox: true,
//       nameAPI: "",
//       isCustomField: true,
//     },
//     {
//       id: 3,
//       name: "job",
//       checkbox: true,
//       nameAPI: "",
//       isCustomField: true,
//     },
//     {
//       id: 4,
//       name: "department",
//       checkbox: true,
//       nameAPI: "",
//       isCustomField: true,
//     },
//     {
//       id: 5,
//       name: "location",
//       checkbox: true,
//       nameAPI: "",
//       isCustomField: true,
//     },
//     {
//       id: 6,
//       name: "phone",
//       checkbox: true,
//       nameAPI: "",
//       isCustomField: true,
//     },
//     {
//       id: 7,
//       name: "mobile",
//       checkbox: true,
//       nameAPI: "",
//       isCustomField: true,
//     },
//     {
//       id: 8,
//       name: "manager",
//       checkbox: true,
//       nameAPI: "",
//       isCustomField: true,
//     },
//   ]);

//   async function GetSettingData() {
  

//     const settingJson = await getSettingJson(SETTING_LIST);
//     if (Object.keys(settingJson)?.length) {
//     parsedData = settingJson;
//      setAppSettings(settingJson);
//       // logic for profileview checkboxes
//       if (parsedData?.GridViewPrope) {
//         const updatedPeople = parsedData?.GridViewPrope?.map((person) => {
//           const updatedPerson = parsedData[KEY_NAME].find(
//             (data) => data.id === person.id
//           );
//           if (updatedPerson) {
//             return {
//               ...person,
//               checkbox: updatedPerson.checkbox,
//             };
//           }
//           return person;
//         });
//         sortedPeople = updatedPeople.sort((a, b) => a.id - b.id);
//         // settitles(sortedPeople)

//         const generateData = (sortedPeople) => {
//           const newTitles = sortedPeople
//             .filter((object) => object.isCustomField === true)
//             .map((object) => ({
//               field: object.nameAPI,
//               customField: object.name,
//               filterable: true,
//               hide: false,
//               displayProperty: true,
//               displayOnlyProfileCard: false,
//               text: false,
//               dropdown: false,
//               date: false,
//             }));
//           settitles(newTitles);
//           console.log(newTitles, "newtitles");
//         };
//         generateData(sortedPeople);

//         console.log(sortedPeople, "sortedPeopleadd");
//         setPeople(sortedPeople);
//       }
//     }
//   }
//   async function blobToString(blob: any) {
//     const fileReader = new FileReader();
//     return new Promise((resolve, reject) => {
//       fileReader.onloadend = (ev) => {
//         resolve((ev.target as any).result);
//       };
//       fileReader.onerror = reject;
//       fileReader.readAsArrayBuffer(blob);
//     });
//   }

//   const onhideChange = React.useCallback(
//     (
//       ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
//       checked?: boolean
//     ): void => {
//       if (ev.currentTarget.title == "Hide field") {
//         if (checked) {
//           setHideChecked(true);
//         } else {
//           setHideChecked(false);
//         }
//       }
//     },
//     []
//   );
//   React.useEffect(() => {
//     GetSettingData();
//   }, []);

//   const handleClickEdit = (data: any) => {
//     setEditData(data);
//   };

//   const onchangeCustom = React.useCallback(
//     (
//       ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
//       checked?: boolean
//     ): void => {
//       if (ev.currentTarget.title == "Text") {
//         if (checked) {
//           setTextCustom(true);
//           setStringValue("Text");
//           setDropdownCustom(false);
//           setDateCustom(false);
//         }
//       } else if (ev.currentTarget.title == "Dropdown") {
//         if (checked) {
//           setDropdownCustom(true);
//           setStringValue("Dropdown");
//           setTextCustom(false);
//           setDateCustom(false);
//         }
//       } else if (ev.currentTarget.title == "Date") {
//         if (checked) {
//           setDateCustom(true);
//           setDropdownCustom(false);
//           setStringValue("Date");
//           setTextCustom(false);
//         }
//       }
//     },
//     []
//   );

//   const onShowProfileCard = React.useCallback(
//     (
//       ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
//       checked?: boolean
//     ): void => {
//       if (ev.currentTarget.title == "Display in only profile card") {
//         if (checked) {
//           setShowProfileCard(true);
//         } else {
//           setShowProfileCard(false);
//         }
//       }
//     },
//     []
//   );

//   const onshowlabelChange = React.useCallback(
//     (
//       ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
//       checked?: boolean
//     ): void => {
//       if (ev.currentTarget.title == "Show field") {
//         if (checked) {
//           setShowLabelChecked(true);
//         } else {
//           setShowLabelChecked(false);
//         }
//       }
//     },
//     []
//   );
//   const onfiltersChange = React.useCallback(
//     (
//       ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
//       checked?: boolean
//     ): void => {
//       if (ev.currentTarget.title == "Check field") {
//         if (checked) {
//           setCheckChecked(true);
//         } else {
//           setCheckChecked(false);
//         }
//       }
//     },
//     []
//   );

//   const handleClick = () => {
//     const data = {
//       filed: selectedItem,
//       customField: selectedPropertyName,
//       filterable: true,
//       hide: HideChecked,
//       displayProperty: ShowLabelChecked,
//       displayOnlyProfileCard: ShowProfileCard,
//       text: TextCustom,
//       dropdown: DropdownCustom,
//       date: DateCustom,
//     };
//     // Check if selectedPropertyName already exists in people array
//     const existingProperty =
//       selectedPropertyName &&
//       people.find(
//         (person) =>
//           person.name === selectedPropertyName ||
//           person.nameAPI === data.filed.key
//       );

//     if (
//       !existingProperty &&
//       selectedPropertyName !== undefined &&
//       ShowLabelChecked !== undefined
//     ) {
//       people.push({
//         id: people.length + 1,
//         name: selectedPropertyName,
//         checkbox: ShowLabelChecked,
//         isCustomField: true,
//         nameAPI: selectedItem?.text ?? "",
//       });
//       // SuccessMsg();
//       changeDeleteCustomData(data);
//       setFormData((prevFormData) => [...prevFormData, data]);
//       const updatedParsedData = { ...parsedData, [KEY_NAME]: people };
//       // setSaved(true);
//       console.log(updatedParsedData, "pa");
//       if (Object.keys(parsedData).length > 0) {
//         updateSettingJson(SETTING_LIST,updatedParsedData);
//         props.SweetAlertCustomFields("success",translation.SettingSaved);
//       }
//       settitles((prevFormData) => [...prevFormData, data]);
//       console.log(titles, "titles");
//     } else {
//       // setError(true);
//       // ErrorMsg();
//       props.SweetAlertCustomFields("info", "Please select property");
//       // Display a message indicating that the property already exists
//       console.log(`${selectedPropertyName} already exists.`);
//     }
//   };

//   const oncontainsChange = (event): void => {
//     setselectedPropertyName(event.target.value as string);
//     // console.log("Property Value Check", event.target.value )
//   };

//   const onChange = (
//     event: React.FormEvent<HTMLDivElement>,
//     item: IDropdownOption
//   ): void => {
//     console.log(optioncustomfields, "change");
//     setSelectedItem(item);
//     console.log(item, "item");
//   };
//   const ontitlechange = (checked, colname: string, ptype: string) => {
//     // console.log(titles);
//     var filteredtitle = [...titles];
//     filteredtitle.filter((x) => x.colname == colname)[0].checked =
//       checked.target.checked;
//     var _selectedtextoption = filteredtitle.filter(
//       (x) => x.colname == colname
//     )[0].displayname;
//     var _selectedadoption = filteredtitle.filter((x) => x.colname == colname)[0]
//       .colname;
//     var _selectedadischecked = false;
//     _selectedadischecked = filteredtitle.filter((x) => x.colname == colname)[0]
//       .ischecked;
//     var _selectedadisnamechecked = false;
//     _selectedadisnamechecked = filteredtitle.filter(
//       (x) => x.colname == colname
//     )[0].isforths;
//     var _selectedhidechecked = false;
//     _selectedhidechecked = filteredtitle.filter((x) => x.colname == colname)[0]
//       .isfifths;
//     var _selectedfilterable = filteredtitle.filter(
//       (x) => x.colname == colname
//     )[0].issixth;
//     var _selecteddisplaychecked = false;
//     _selecteddisplaychecked = filteredtitle.filter(
//       (x) => x.colname == colname
//     )[0].isseventh;

//     setoptionselected(
//       _selectedtextoption +
//         ";" +
//         _selectedadoption +
//         ";" +
//         _selectedadischecked +
//         ";" +
//         _selectedadisnamechecked +
//         ";" +
//         _selectedhidechecked +
//         ";" +
//         _selectedfilterable +
//         ";" +
//         _selecteddisplaychecked
//     );
//     setsendData("true");
//     setsendptype("AD");
//     if (ptype == "AD") {
//       setsendColData(_custom);
//     } else {
//       setsendColData(_spocustom);
//     }
//     settitles(filteredtitle);
//   };
//   async function addrole() {
//     var rolesUser = "";
//     if (users.length == 0) {
//       // setAlertMsg("Please enter one user");
//       props.SweetAlertCustomfunc("info", "Please enter one user");
//       // setAlert(true);
//       setTimeout(() => {
//         // messageDismiss();
//         props.dismiss();
//       }, 5000);
//       return;
//     }
//     let usrarr = [];

//     for (var y = 0; y < users.length; y++) {
//       usrarr.push(
//         users[y].text.replace(/,/g, "#%#").replace(/-/g, "#%%#") +
//           "!!" +
//           users[y].secondaryText
//             .replace(/(\d{4}|\d{5}|\d{6}|\d{3}|\d{2}|\d{1}|\d{10})$/, "")
//             .trim()
//       );
//     }
//     if (empisadmin != "") {
//       var _rolesUser = empisadmin + ";" + usrarr.join(";");

//       var splitted = _rolesUser.split(";");
//       var collector: any = {};
//       for (var i = 0; i < splitted.length; i++) {
//         key = splitted[i].replace(/^\s*/, "").replace(/\s*$/, "");
//         collector[key] = true;
//       }
//       var out = [];
//       for (var key in collector) {
//         out.push(key);
//       }
//       rolesUser = out.join(";");
//     } else {
//       rolesUser = usrarr.join(";");
//     }

//     parsedData["CustomRolesAdd"] = rolesUser;
//     console.log(parsedData);
//     var _parsedData = JSON.stringify(parsedData);
//     var domain = gapi.auth2
//       .getAuthInstance()
//       .currentUser.le.wt.cu.split("@")[1];
//     //console.log(domain);
//     var _domain = domain.replace(/\./g, "_");
//     var storagedetails =
//       '[{"storageaccount":"mystorageaccountparj","containername":"parjinder1","blobfilename":"' +
//       _domain +
//       '.json"}]';
//     var mappedcustomcol = JSON.parse(storagedetails);
//     await containerClient
//       .getBlockBlobClient(mappedcustomcol[0].blobfilename)
//       .upload(_parsedData, Buffer.byteLength(_parsedData))
//       .then(() => {
//         // setSaved(true);
//         setusers([]);
//         optionList = [];

//         setTimeout(() => {
//           // messageDismiss();
//           props.dismiss();
//         }, 5000);
       
//       });

//     //excuserview = usrarr.join(",");
//     // var ListItemData = null;

//     //ListItemData = [{ "DefaultView": defaultview, "__metadata": { "type": "SP.Data.SettingListItem" } }];
//   }
 

//   React.useEffect(() => {
//     const ListData = async () => {
//       try {
//         const list = await getschemasfields();
//         const fieldNames = list.map((item) => ({
//           key: item.fieldName,
//           text: item.displayname,
//         }));
//         console.log(fieldNames, "field names");
//         setoptioncustomfields(fieldNames);
//       } catch (error) {
//         console.error("Error fetching list data:", error);
//       }
//     };
//     ListData();
//   }, []);
//   React.useEffect(() => {}, [optioncustomfields]);

//   return (
//     <div>
//       {sendData == "true" ? (
//         sendptype == "AD" ? (
//           <CustomEdit
//             /* LicenseType={props.LicenseType} */ data={editData}
//             editeddata={optionselected}
//             coldata={sendColData}
//             cftype={sendptype}
//             /* langcode={props.langcode} */ PGridReodering={GridReodering}
//             PSearchFltrReodering={SearchFltrReodering}
//             dismiss={props.dismiss}
//           />
//         ) : (
//           <>
//             {/* <SharePointPropEdit LicenseType={props.LicenseType} data={sendData} editeddata={optionselected} coldata={sendColData} cftype={sendptype} langcode={props.langcode} PGridReodering={GridReodering}/> */}
//           </>
//         )
//       ) : (
//         <Stack>
//           <div>
//             <div
//               className={"addCustomBlock"}
//               style={{
//                 justifyContent: "space-between",
//                 columnGap: "15px",
//                 width: "100%",
//               }}
//             >
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: "10px",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: "5px",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <label style={{ marginBottom: "5px" }}>
//                     {"Custom fields"}
//                     <IconButton
//                       id="Tooltip"
//                       style={{ height: "22px", marginLeft: "0px" }}
//                       title={
//                         "You can view custom attributes of the employees on all the views and filter by adding filter. At present, customer attributes are not part of 'free search' attribute. "
//                       }
//                       onClick={toggleTeachingBubbleVisible3}
//                       iconProps={{ iconName: "Info" }}
//                     ></IconButton>
//                     {teachingBubbleVisible3 && (
//                       <TeachingBubble
//                         calloutProps={{
//                           directionalHint: DirectionalHint.bottomCenter,
//                         }}
//                         target="#Tooltip"
//                         isWide={true}
//                         hasCloseButton={true}
//                         closeButtonAriaLabel={"Close"}
//                         onDismiss={toggleTeachingBubbleVisible3}
//                         headline=""
//                       >
//                         {
//                           "You can view custom attributes of the employees on all the views and filter by adding filter. At present, customer attributes are not part of 'free search' attribute. "
//                         }
//                       </TeachingBubble>
//                     )}
//                   </label>

//                   <Dropdown
//                     styles={dropdownstyles}
//                     placeholder={"Select an option"}
//                     options={optioncustomfields}
//                     onChange={onChange}
//                     selectedKey={selectedItem ? selectedItem.text : null}
//                   />
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: "13px",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <label>{"Property Name"}</label>
//                   <TextField
//                     onChange={oncontainsChange}
//                     value={selectedPropertyName}
//                   />
//                 </div>
//               </div>

//               <div style={{ display: "flex", flexDirection: "column" }}>
//                 <div className={"newgridcustom"}>
//                   {/*  <div className={"customfieldBlock"} title={
//                  "This feature is available in Enterprise version!"
//                 } style={{
//                   marginRight: '0px', width: "100%", display: "flex",

//                 }}>
//                   <label>
//                     {"Filterable"}</label>
//                   <Checkbox checked={CheckChecked} title="Check field" onChange={onfiltersChange} />

//                 </div>

//                 <div className={"customfieldBlock"} style={{
//                   width: '100%', maxWidth: "100%", display: "flex",

//                 }}>
//                   <label>
//                     {"Hide"}
//                   </label>
//                   <Checkbox checked={HideChecked} title="Hide field" onChange={onhideChange} />

//                 </div> */}

//                   <div
//                     style={{
//                       display: "flex",
//                       gap: "13px",
//                       flexDirection: "column",
//                     }}
//                   >
//                     <label style={{ whiteSpace: "nowrap" }}>
//                       {"Display Property"}
//                     </label>
//                     <Checkbox
//                       checked={ShowLabelChecked}
//                       title="Show field"
//                       onChange={onshowlabelChange}
//                     />
//                   </div>

//                   {/*   <div className={"customfieldBlock"} style={{
//                   width: '100%', maxWidth: "100%", display: "flex",
//                 }}>
//                   <label>
//                     {"Display in only profile card"}</label>
//                   <Checkbox checked={ShowProfileCard} title="Display in only profile card" onChange={onShowProfileCard} />

//                 </div> */}
//                 </div>
//                 {CheckChecked == true ? (
//                   <div
//                     style={{
//                       display: "grid",
//                       gridTemplateColumns: "90px 88px 75px",
//                     }}
//                   >
//                     <div
//                       className={"customfieldBlock"}
//                       style={{
//                         width: "100%",
//                         maxWidth: "100%",
//                         display: "flex",
//                       }}
//                     >
//                       <label>{"Text"}</label>
//                       <Checkbox
//                         checked={TextCustom}
//                         title="Text"
//                         onChange={onchangeCustom}
//                       />
//                     </div>

//                     <div
//                       className={"customfieldBlock"}
//                       style={{
//                         width: "100%",
//                         maxWidth: "100%",
//                         display: "flex",
//                       }}
//                     >
//                       <label>{"Dropdown"}</label>
//                       <Checkbox
//                         checked={DropdownCustom}
//                         title="Dropdown"
//                         onChange={onchangeCustom}
//                       />
//                     </div>
//                     <div
//                       className={"customfieldBlock"}
//                       style={{
//                         width: "100%",
//                         maxWidth: "100%",
//                         display: "flex",
//                       }}
//                     >
//                       <label>{"Date"}</label>
//                       <Checkbox
//                         checked={DateCustom}
//                         title="Date"
//                         onChange={onchangeCustom}
//                       />
//                     </div>
//                   </div>
//                 ) : (
//                   ""
//                 )}
//               </div>
//             </div>
//             <div className={"fieldSubmitBtn"}>
//               <PrimaryButton onClick={handleClick}>
//                 {ButtonSaveText1}
//                 {loading1 && (
//                   <div className={"elementToFadeInAndOut"}>
//                     <div></div>
//                     <div></div>
//                     <div></div>
//                   </div>
//                 )}
//               </PrimaryButton>
//             </div>
//             <div className={"tablescroll"}>
//               <table className="customTable">
//                 <thead>
//                   <tr>
//                     <th>{"Action"}</th>
//                     <th>{"Type"}</th>
//                     <th>{"Property Name"}</th>
//                     <th>{"Display Name"}</th>
//                     <th>{"Filterable"}</th>
//                     <th>{"Display Property"}</th>
//                     {/*  <th>{"Hide"}</th> */}
//                     {/*  <th>{"Display in only profile card"}</th> */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {titles.map((x, index) => {
//                     return (
//                       <tr>
//                         <td style={{ textAlign: "center" }} key={index}>
//                           <Link
//                             onClick={(checked) =>
//                               ontitlechange(checked, x.colname, x.ptype)
//                             }
//                           >
//                             <Icon
//                               title={"Edit"}
//                               onClick={() => handleClickEdit(x)}
//                               iconName="Edit"
//                             />
//                           </Link>
//                         </td>
//                         <td>{""}</td>
//                         <td>{x.field}</td>
//                         <td>{x.customField}</td>
//                         <td>
//                           {x.filterable === true ? (
//                             <Icon
//                               style={{ marginLeft: "10px" }}
//                               iconName="CheckMark"
//                             ></Icon>
//                           ) : (
//                             <Icon
//                               style={{ marginLeft: "10px" }}
//                               iconName="Cancel"
//                             />
//                           )}
//                         </td>
//                         {/* <td>{x.hide === true ? <Icon style={{ marginLeft: '10px' }} iconName="CheckMark"></Icon> : <Icon style={{ marginLeft: '10px' }} iconName="Cancel" />}</td> */}
//                         <td>
//                           {x.displayProperty == true ? (
//                             <Icon
//                               style={{ marginLeft: "10px" }}
//                               iconName="CheckMark"
//                             ></Icon>
//                           ) : (
//                             <Icon
//                               style={{ marginLeft: "10px" }}
//                               iconName="Cancel"
//                             />
//                           )}
//                         </td>
//                         {/* <td>{x.displayOnlyProfileCard == true? <Icon style={{ marginLeft: '10px' }} iconName="CheckMark"></Icon> : <Icon style={{ marginLeft: '10px' }} iconName="Cancel" />}</td> */}
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </Stack>
//       )}
//     </div>
//   );
// }

// export default CustomAdd;
// import React, { useEffect, useState } from 'react';
// import { Dropdown, IDropdownOption, IDropdownStyles } from 'office-ui-fabric-react/lib/Dropdown';
// import { TextField } from 'office-ui-fabric-react/lib/TextField';
// import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
// import { useFields } from '../../context/store';
// import { removeDuplicatesFromObject } from '../Helpers/HelperFunctions';
// import { Icon, Label } from 'office-ui-fabric-react';
// import { PrimaryButton } from '@fluentui/react';
// import { v4 as uuidv4 } from 'uuid'; // Importing UUID
// import CustomEdit from './CustomEdit';

// function CustomAdd(props) {
//   const { FormatedUserData } = useFields();
//   const [options, setOptions] = useState<IDropdownOption[]>([]);
//   const [displayName, setDisplayName] = useState("");
//   const [data, setData] = useState([]);
//   const [propertyName, setPropertyName] = useState<IDropdownOption | null>(null);
//   const [isChecked, setIsChecked] = useState(false);
//   const [openEditPanel, setOpenEditPanel] = useState(false);

//   const dropdownstyles: Partial<IDropdownStyles> = {
//     callout: {
//       minWidth: "270px !important",
//       width: "290px !important",
//       maxWidth: "300px !important",
//     },
//   };

//   useEffect(() => {
//     const FilteredOptions = FormatedUserData.flatMap((item) => {
//       return Object.keys(item).map((key) => ({ key, text: key }));
//     });
//     const res = removeDuplicatesFromObject(FilteredOptions, "key");
//     setOptions(res);
//   }, [FormatedUserData]);

//   const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
//     setPropertyName(item);
//   };

//   const handleCheckboxChange = (ev: React.FormEvent<HTMLElement>, isChecked: boolean): void => {
//     setIsChecked(isChecked);
//   };

//   const onSaveCustomFields = () => {
//     if (propertyName && displayName) {
//       // Check if the entry already exists
//       const exists = data.some(x => x.field === propertyName.key && x.customField === displayName);

//       if (exists) {
//         props.SweetAlertCustomFields("info", "This property and display name combination already exists.");
//         return;
//       }

//       const newField = {
//         id: uuidv4(),
//         field: propertyName.key,
//         customField: displayName,
//         filterable: isChecked,
//       };

//       setData((prevData) => [...prevData, newField]);

//       // Reset state for new entry
//       setDisplayName("");
//       setPropertyName(null);
//       setIsChecked(false);
//     } else {
//       props.SweetAlertCustomFields("info", "Please select a property and enter a display name.");
//     }
//   };

//   function handleEdit(item){
//      setOpenEditPanel(true);
//   }

//   return (
//     <>
//     { openEditPanel?
//     <CustomEdit 
//      editeddata={data}
//      coldata={options}
//      dismiss={()=>setOpenEditPanel(false)}
    
//     />:""}
//       <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
//         <div style={{ display: "flex", gap: "20px" }}>
//           <div>
//             <Label>Google Properties</Label>
//             <Dropdown
//               styles={dropdownstyles}
//               placeholder={"Select an option"}
//               label=''
//               options={options}
//               onChange={onChange}
//               selectedKey={propertyName ? propertyName.key : null}
//             />
//           </div>
//           <div>
//             <Label>Display Name</Label>
//             <TextField
//               onChange={(e: any) => setDisplayName(e.target.value)}
//               value={displayName}
//             />
//           </div>
//           <div style={{ display: "flex", justifyContent: "space-around", flexDirection: "column" }}>
//             <Label>Filterable</Label>
//             <Checkbox
//               checked={isChecked}
//               onChange={handleCheckboxChange}
//             />
//           </div>
//         </div>
//         <div>
//           <PrimaryButton text='Submit' onClick={onSaveCustomFields} />
//         </div>
//       </div>

//       <table className="customTable">
//         <thead>
//           <tr>
//             <th>{"Action"}</th>
//             <th>{"Property Name"}</th>
//             <th>{"Display Name"}</th>
//             <th>{"Filterable"}</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((x) => {
//             return (
//               <tr key={x.id}>
//                 <td><Icon iconName='edit' onClick={()=>handleEdit(x)} /></td>
//                 <td>{x.field}</td>
//                 <td>{x.customField}</td>
//                 <td>
//                   {x.filterable ? (
//                     <Icon style={{ marginLeft: "10px" }} iconName="CheckMark" />
//                   ) : (
//                     <Icon style={{ marginLeft: "10px" }} iconName="Cancel" />
//                   )}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </>
//   );
// }

// export default CustomAdd;
import React, { useEffect, useState } from 'react';
import { Dropdown, IDropdownOption, IDropdownStyles } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { useFields } from '../../context/store';
import { removeDuplicatesFromObject } from '../Helpers/HelperFunctions';
import { Icon, Label } from 'office-ui-fabric-react';
import { PrimaryButton } from '@fluentui/react';
import { v4 as uuidv4 } from 'uuid'; // Importing UUID
import CustomEdit from './CustomEdit';
import { SETTING_LIST, updateSettingJson } from '../../api/storage';
import { useSttings } from './store';

function CustomAdd(props) {
  const { FormatedUserData } = useFields();
  const { appSettings, setAppSettings } = useSttings();
  const [options, setOptions] = useState<IDropdownOption[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [data, setData] = useState([]);
  const [propertyName, setPropertyName] = useState<IDropdownOption | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [openEditPanel, setOpenEditPanel] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // New state for editing item

  const dropdownstyles: Partial<IDropdownStyles> = {
    callout: {
      minWidth: "270px !important",
      width: "290px !important",
      maxWidth: "300px !important",
    },
  };
  useEffect(()=>{
    let isCustomField=appSettings?.GridViewPrope.filter((item)=>{
      return item.isCustomField;
    })

setData(isCustomField);
  },[])


  useEffect(() => {

    const FilteredOptions = FormatedUserData.flatMap((item) => {
      return Object.keys(item).map((key) => ({ key, text: key }));
    });
    const res = removeDuplicatesFromObject(FilteredOptions, "key");
    setOptions(res);
  }, [FormatedUserData]);

  const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setPropertyName(item);
  };

  const handleCheckboxChange = (ev: React.FormEvent<HTMLElement>, isChecked: boolean): void => {
    setIsChecked(isChecked);
  };
  async function updateCustomFields(results){
    let isCustomField=results.filter((item)=>{
      return item.isCustomField;
    })

    await setAppSettings({...appSettings,GridViewPrope:results});
    await updateSettingJson(SETTING_LIST,{...appSettings,GridViewPrope:results});

  
setData(isCustomField);
    // setData(data);
  }
 
  const onSaveCustomFields = () => {
    if (propertyName && displayName) {
      const exists = data.some(x => x.field === propertyName.key && x.customField === displayName);

      if (exists && !editingItem) {
        props.SweetAlertCustomFields("info", "This property and display name combination already exists.");
        return;
      }

      const newField = {
        id: editingItem ? editingItem.id : uuidv4(),
        name: propertyName.key,
        checkbox:false,
        filterable: isChecked,
    
        nameAPI:displayName,
        isCustomField: true,
      
      };

  
        let results=[]
        if (editingItem) {
          results=appSettings?.GridViewPrope.map(x => x.id === editingItem.id ? newField : x);
        }else{
          results= [...appSettings?.GridViewPrope, newField];
        }
        // setData(results);
        updateCustomFields(results);
      
    

      resetForm();
    } else {
      props.SweetAlertCustomFields("info", "Please select a property and enter a display name.");
    }
  };

  const resetForm = () => {
    setDisplayName("");
    setPropertyName(null);
    setIsChecked(false);
    setEditingItem(null); 
    setOpenEditPanel(false);
  };

  const handleEdit = (item) => {
    setOpenEditPanel(true);
    setEditingItem(item);
    setDisplayName(item.nameAPI);
    setPropertyName(options.find(option => option.key === item.name));
    setIsChecked(item.filterable);
  };

  return (
    <>
    
      <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <div>
            <Label>Google Properties</Label>
            <Dropdown
              styles={dropdownstyles}
              placeholder={"Select an option"}
              label=''
              options={options}
              onChange={onChange}
              selectedKey={propertyName ? propertyName.key : null}
            />
          </div>
          <div>
            <Label>Display Name</Label>
            <TextField
              onChange={(e: any) => setDisplayName(e.target.value)}
              value={displayName}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", flexDirection: "column" }}>
            <Label>Filterable</Label>
            <Checkbox
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          </div>
        </div>
        <div>
          <PrimaryButton text={editingItem ? 'Update' : 'Submit'} onClick={onSaveCustomFields} />
        </div>
      </div>

     {!editingItem? <table className="customTable">
        <thead>
          <tr>
            <th>{"Action"}</th>
            <th>{"Property Name"}</th>
            <th>{"Display Name"}</th>
            <th>{"Filterable"}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((x) => {
            return (
              <tr key={x.id}>
                <td><Icon iconName='edit' onClick={() => handleEdit(x)} /></td>
                <td>{x.name}</td>
                <td>{x.nameAPI}</td>
                <td>
                  {x.filterable ? (
                    <Icon style={{ marginLeft: "10px" }} iconName="CheckMark" />
                  ) : (
                    <Icon style={{ marginLeft: "10px" }} iconName="Cancel" />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>:""
}
    </>
  );
}

export default CustomAdd;
