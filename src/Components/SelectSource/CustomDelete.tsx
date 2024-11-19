// import {
//   Checkbox,
//   DefaultButton,
//   Dropdown,
//   IDropdownOption,
//   MessageBar,
//   MessageBarType,
//   Panel,
//   PanelType,
//   PrimaryButton,
//   Stack,
//   TextField,
//   Toggle,
// } from "@fluentui/react";
// import * as React from "react";
// import "./Styles.scss";

// import { useBoolean } from "@fluentui/react-hooks";
// import useStore from "./store";
// import { gapi } from "gapi-script";
// import { Buffer } from "buffer";
// import { BlobServiceClient } from "@azure/storage-blob";
// import { useLanguage } from "../../Language/LanguageContext";
// import { getSettingJson, SETTING_LIST, updateSettingJson } from "../../api/storage";

// var containerClient: any;
// var parsedData: any = "";
// var KEY_NAME = "GridViewPrope";
// var sortedPeople;
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

// function CustomDelete(props) {
//   const { translation } = useLanguage();
// //   const { deleteCustomData } = useStore();
//   const [titles, settitles] = React.useState([]);
// //   const { userGridView } = useStore();

// //   const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>();
// //   const [selectedPropertyName, setselectedPropertyName] =
// //     React.useState<string>();

// //   //
// //   let arr123 = [];

// //   const oncontainsChange = (event): void => {
// //     setselectedPropertyName(event.target.value as string);
// //   };
// //   const onChange = (
// //     event: React.FormEvent<HTMLDivElement>,
// //     item: IDropdownOption
// //   ): void => {
// //     setSelectedItem(item);
// //   };
// //   /* const ontitlechange = (checked, value:any) => {

// //     var filteredtitle = [...titles];

// //      filteredtitle.filter((x) => x.customField == value)[0].displayProperty =
// //       checked.target.checked;
// //       console.log(filteredtitle,'filter')
// //     //settitles(filteredtitle);
// //  // settitles(updatedTitles);
    
// //   }; */
// //   const ontitlechange = (checked, value) => {
// //     //console.log(checked,'checked')
// //     var filteredTitles = [...titles];
// //     const filteredItem = filteredTitles.find((x) => x.field === value);
// //     if (filteredItem) {
// //       filteredItem.displayProperty = checked.target.checked;
// //       settitles(filteredTitles);
// //     } else {
// //       console.error(`No item found with customField "${value}"`);
// //     }
// //   };

// //   const stackTokens = { childrenGap: 15 };
// //   const [isOpenAdd, { setTrue: openPanelAdd, setFalse: dismissPanelAdd }] =
// //     useBoolean(false);
// //   const [isOpenEdit, { setTrue: openPanelEdit, setFalse: dismissPanelEdit }] =
// //     useBoolean(false);
// //   const [saved, setSaved] = React.useState(false);
// //   const [error, setError] = React.useState(false);
// //   const [alert, setAlert] = React.useState(false);
// //   const [alertMsg, setAlertMsg] = React.useState("");
// //   const messageDismiss = () => {
// //     setSaved(false);
// //     setError(false);
// //     setAlert(false);
// //   };
// //   const SuccessMsg = () => (
// //     <MessageBar
// //       messageBarType={MessageBarType.success}
// //       isMultiline={false}
// //       onDismiss={messageDismiss}
// //       styles={messageBarSuccessStyles}
// //       dismissButtonAriaLabel={"Close"}
// //     >
// //       {"Settings saved successfully!"}
// //     </MessageBar>
// //   );
// //   const ErrorMsg = () => (
// //     <MessageBar
// //       messageBarType={MessageBarType.error}
// //       isMultiline={false}
// //       styles={messageBarErrorStyles}
// //       onDismiss={messageDismiss}
// //       dismissButtonAriaLabel={"Close"}
// //     >
// //       {"Something went wrong!"}
// //     </MessageBar>
// //   );
// //   const AlertMsg = () => (
// //     <MessageBar
// //       messageBarType={MessageBarType.warning}
// //       isMultiline={false}
// //       onDismiss={messageDismiss}
// //       styles={messageBarWarningStyles}
// //       dismissButtonAriaLabel={"Close"}
// //     >
// //       {alertMsg}
// //     </MessageBar>
// //   );

// //   // get settings
// //   async function 
// //   GetSettingData() {
    
// //     const settingJson = await getSettingJson(SETTING_LIST);
// //     if (Object.keys(settingJson)?.length) {
// //     parsedData = settingJson;


// //       // logic for profileview checkboxes
// //       if (parsedData?.GridViewPrope) {
// //         const updatedPeople = parsedData?.GridViewPrope?.map((person) => {
// //           const updatedPerson = parsedData[KEY_NAME].find(
// //             (data) => data.id === person.id
// //           );
// //           if (updatedPerson) {
// //             return {
// //               ...person,
// //               checkbox: updatedPerson.checkbox,
// //             };
// //           }
// //           return person;
// //         });
// //         sortedPeople = updatedPeople.sort((a, b) => a.id - b.id);
// //         // settitles(sortedPeople)

// //         const generateData = (sortedPeople) => {
// //           const newTitles = sortedPeople
// //             .filter((object) => object.isCustomField === true)
// //             .map((object) => ({
// //               field: object.nameAPI,
// //               customField: object?.name,
// //               filterable: true,
// //               hide: false,
// //               displayProperty: true,
// //               displayOnlyProfileCard: false,
// //               text: false,
// //               dropdown: false,
// //               date: false,
// //             }));
// //           settitles(newTitles);
// //           console.log(newTitles, "newtitles");
// //         };
// //         generateData(sortedPeople);

// //         console.log(sortedPeople, "sortedPeopleadd");
// //         // setPeople(sortedPeople);
// //       }
// //     }
// //   }




// //   const includedelete = () => {
// //     const updatedCustomList = [...titles]
// //       .filter((x) => x.displayProperty == true)
// //       .map((y) => {
// //         return y.field;
// //       });
// //     console.log(updatedCustomList, "updatelist");
// //     if (updatedCustomList.length == 0) {
// //       props.SweetAlertCustomFields("info", "Please select field!");
// //       // setAlert(true);
// //       setTimeout(() => {
// //         messageDismiss();
// //       }, 5000);
// //       return false;
// //     }
// //     // console.log(titles,'tit')
// //     const updatedExcludeByCustomList = userGridView.filter(
// //       (item) => !updatedCustomList.includes(item.nameAPI)
// //     );
// //     const updatedParsedData = {
// //       ...parsedData,
// //       [KEY_NAME]: updatedExcludeByCustomList,
// //     };

// //     console.log(updatedParsedData, "par");
// //     if (Object.keys(parsedData).length > 0) {
// //       settitles(updatedExcludeByCustomList);
// //       updateSettingJson(SETTING_LIST,updatedParsedData);
// //       props.SweetAlertCustomFields(
// //         "success",
// //         translation.SettingSaved
// //       );
// //     }
// //   };
// //   React.useEffect(() => {
// //     GetSettingData();
// //   }, []);
//   return (
//     <div>
//       <Stack>
//         <div>
//           <table className={"customTable"}>
//             <thead>
//               <tr>
//                 <th>{"Action"}</th>
//                 <th>{"Type"}</th>
//                 <th>{"Property Name"}</th>
//                 <th>{"Display Name"}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {titles.map((x) => {
//                 {
//                   console.log(x, "xx");
//                 }
//                 return (
//                   <tr>
//                     <td>
//                       <Checkbox
//                         checked={x.displayProperty}
//                         title={x.field}
//                         onChange={(checked) => ontitlechange(checked, x.field)}
//                       />
//                     </td>
//                     <td>{x.field}</td>
//                     <td>{x.field}</td>
//                     <td>{x.customField}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//          {titles?.length ? <Stack style={{ width: "10%" }}>
//             <PrimaryButton onClick={includedelete}>{"Delete"}</PrimaryButton>
//           </Stack>:""}
//         </div>
//       </Stack>
//     </div>
//   );
// }

// export default CustomDelete;
import {
  Checkbox,
  PrimaryButton,
  Stack,
} from "@fluentui/react";
import * as React from "react";
import { useLanguage } from "../../Language/LanguageContext";
import { useSttings } from "./store";
import { SETTING_LIST, updateSettingJson } from "../../api/storage";

function CustomDelete({SweetPromptCustomFieldsDelete,SweetAlertCustomFields}) {
  const { translation } = useLanguage();
  const [titles, setTitles] = React.useState([]);
  const { appSettings, setAppSettings } = useSttings();
  React.useEffect(()=>{
    getSettingData()
  },[])
  function getSettingData(){
    let isCustomField=appSettings?.GridViewPrope.filter((item)=>{
      return item.isCustomField;
    })

     setTitles(isCustomField);
  }
  const handleTitleChange = (checked, id) => {
    setTitles((prevTitles) =>
      prevTitles.map((title) =>
        title.id === id ? { ...title, checkbox: checked } : title
      )
    );
  };

  const handleDelete = () => {

    SweetPromptCustomFieldsDelete("warning",translation?.AreYouSure).then(async(res)=>{
      if(res.isConfirmed){
        appSettings?.GridViewPrope.map((item)=>{
          if(item.isCustomField){
            return {...item,}
          }
        })
        let idsToRemove = titles?.map(title => {
          if (title.checkbox && title.isCustomField) {
              return title.id; // Return only the id
          }
      }).filter(id => id !== undefined)
        const filteredData = appSettings?.GridViewPrope.filter(item =>  !idsToRemove.includes(item.id));
        // setTitles(result);
     
        console.log("results",filteredData);
        await updateSettingJson(SETTING_LIST,{...appSettings,GridViewPrope:filteredData})
        setAppSettings({...appSettings,GridViewPrope:filteredData })
        SweetAlertCustomFields("success",translation.SettingSaved);
        let isCustomField=filteredData?.filter((item)=>{
          return item.isCustomField;
        })
    
         setTitles(isCustomField);
        // getSettingData()

      }
    })
    // setTitles((prevTitles) => ));

  };

  return (
    <div>
      <Stack>
        <div>
          <table className={"customTable"}>
            <thead>
              <tr>
              <th>{translation.Action||"Action"}</th>
                {/* <th>{"Type"}</th> */}
                <th>{translation.PropertyName||"Property Name"}</th>
                <th>{translation.Displayname||"Display Name"}</th>
              </tr>
            </thead>
            <tbody>
              {titles.map((x) => (
                <tr key={x.id}>
                  <td>
                    <Checkbox
                      checked={x.checkbox}
                      title={x.name}
                      onChange={(e, checked) => handleTitleChange(checked, x.id)}
                    />
                  </td>
                  <td>{x.name}</td>
             
                  <td>{x.nameAPI}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {titles.length > 0 && (
            <Stack style={{ width: "10%" }}>
              <PrimaryButton onClick={handleDelete}>{translation.Delete||"Delete"}</PrimaryButton>
            </Stack>
          )}
        </div>
      </Stack>
    </div>
  );
}

export default CustomDelete;
