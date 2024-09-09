// import * as React from "react";
// import { DefaultButton, Icon, IconButton, Label, MessageBar, MessageBarType, Modal, PrimaryButton, Stack, TextField } from "@fluentui/react";
// import "./Styles.scss";
// import { useBoolean } from "@fluentui/react-hooks";
// import { Buffer } from 'buffer';
// import { BlobServiceClient } from "@azure/storage-blob";
// import * as XLSX from 'xlsx';
// import Excel from "exceljs";
// import { CommandBarButton, GetGroupCount } from "@fluentui/react";
// import useStore from "./store";
// import { gapi } from "gapi-script";
// import { GetSettingValues, updateSettingData } from "../Helpers/HelperFunctions";

// var exclname = "";
// const messageBarWarningStyles = {
//   root: {
//     backgroundColor: 'rgb(255, 244, 206)',
//   }
// };
// const messageBarInfoStyles = {
//   root: {
//     backgroundColor: 'rgb(243, 242, 241)',
//   }
// };
// const messageBarErrorStyles = {
//   root: {
//     backgroundColor: 'rgb(253, 231, 233)',
//   }
// };
// const messageBarSuccessStyles = {
//   root: {
//     backgroundColor: 'rgb(223, 246, 221)',
//   }
// };

// interface IRichText {
//   description: string;
// }

// var dataAPI: any = "";
// var parsedData: any = "";
// const KEY_NAME4 = "ExcludeUsersBulk";
// var containerClient: any;

// function ImportPronouns(props) {
//   const { changeExcludeUsersBulk } = useStore();
//   const[filename,setFileName]=React.useState("");
//   const [saved, setSaved] = React.useState(false);
//   const [saveMsg, setSaveMsg] = React.useState(null);
//   const [isModalOpen, { setTrue: openModal, setFalse: closeModal }] = useBoolean(false);
//   const [updateDataArray, setupdateDataArray] = React.useState<any>([]);
//   const [attachFile1, setattachFile1] = React.useState(null);
//   const [ButtonSaveText1, setButtonSaveText1] = React.useState<string>("Save");
//   const [loading1, setLoading1] = React.useState(false);

//   React.useEffect(() => {}, []);

//   function getFormattedTime() {
//     var today = new Date();
//     var y = today.getFullYear();
//     var m = today.getMonth() + 1; // JavaScript months are 0-based.
//     var d = today.getDate();
//     var h = today.getHours();
//     var mi = today.getMinutes();
//     var s = today.getSeconds();
//     return y + "" + m + "" + d + "" + h + "" + mi + "" + s;
//   }

//   var data: any[] = [
//     { 
//       givenName: '',
//       familyName: '',
//       fullName: '',
//     }
//   ];

//   const downloadTemplate = (csvData, fileName, sheetName) => {
//     var workbook = XLSX.utils.book_new();
//     var ws = XLSX.utils.json_to_sheet(csvData);
//     XLSX.utils.book_append_sheet(workbook, ws, sheetName);
//     XLSX.writeFile(workbook, `${fileName}` + '.xlsx', { type: 'file' });
//   }

//   const onAttachmentChange = (ev: any) => {
//     if (ev.target.files.length > 0) {
//       setattachFile1(ev.target.files);
//       console.log(ev.target.files[0]?.name,"----")
//       setFileName(ev.target.files[0]?.name);
//     } else {
//       setattachFile1(null);
//     }
//     console.log('calling');
//     processDataPronouns(ev);
//   };

//   const processDataPronouns = async (e: any) => {
//     const file = e.target.files[0];
//     const wb = new Excel.Workbook();
//     const reader = new FileReader();
//     var updateDataArray1: any[] = [];

//     reader?.readAsArrayBuffer(file);
//     reader.onload = () => {
//       const buffer = reader.result;
//       if (buffer instanceof ArrayBuffer) {
//         wb.xlsx.load(Buffer.from(buffer)).then((workbook: { eachSheet: (arg0: (sheet: any, id: any) => void) => void; }) => {
//           workbook.eachSheet((sheet, id) => {
//             sheet.eachRow((row: { eachCell: (arg0: (cell: any, colNumber: any) => void) => void; }, rowIndex: any) => {
//               const mappedData: { [key: string]: any } = {};
//               row.eachCell((cell, colNumber) => {
//                 const key = sheet.getRow(1).getCell(colNumber).value as string;
//                 const value = cell.value;
//                 if (key !== null) {
//                   mappedData[key] = value;
//                 }
//               });
//               console.log(mappedData, 'mappeddat');
//               var updateData = {
//                 name: {                                     
//                   familyName: '',
//                   givenName: '',
//                   fullName: '',
//                 },
//                 checked: true,
//               };
//               Object.entries(mappedData).forEach(([key, value]) => {
//                 if (key === "givenName") {
//                   updateData.name.givenName = value;
//                 } else if (key === "familyName") {
//                   updateData.name.familyName = value;
//                 } else if (key === "fullName") {
//                   updateData.name.fullName = value;
//                 }
//               });
//               updateDataArray1.push(updateData);
//               setupdateDataArray(updateDataArray1);
//             });
//           });
//         }).catch((error: any) => {
//           console.error("Error loading workbook:", error);
//         });
//       } else {
//         console.error("Failed to load file as ArrayBuffer.");
//       }
//     };
//   };

//   const saveDataPronouns = () => {
//     setLoading1(true);
//     setButtonSaveText1("");
//     const updatedParsedData = { ...dataAPI, [KEY_NAME4]: updateDataArray.slice(1) };
//     console.log(updatedParsedData, 'parse');
//     updateSettingData(updatedParsedData);
//     setTimeout(()=>{

//         setLoading1(false)
//         setButtonSaveText1("Save")
//     },1000)
//   };

//   React.useEffect(() => {
//     GetSettingValues().then((data)=>{
//         dataAPI=data;
//     });
//   }, []);

//   return (
//     <div className={"CSVPanelMain"}>
//       <div className={"uploadCSVblkStyles"}> 
//         <Stack>
//           <DefaultButton 
//             className={"downloadButton"} 
//             style={{
//               color: "#333",
//               borderRadius: "20px",
//               marginBottom: "2%",
//               maxWidth: "200px"
//             }}
//             onClick={() => downloadTemplate(data, "user_detail-" + getFormattedTime(), "A")}
//           >
//             <CommandBarButton text={"Download sample file"} />
//           </DefaultButton>
//         </Stack>
//         <div className={"importCSVFileBlk"}>
//           <div  className={"importCSVFile"} style={{ display: "flex", gap: "5px", alignItems: "center" }}>
//             <Label onClick={() => document.getElementById("pronousimport").click()}   style={{whiteSpace:"nowrap"}} >{"Import File"}</Label>
//             <Icon onClick={() => document.getElementById("pronousimport").click()}  iconName="Attach" style={{ cursor: "pointer" }} />
//             <span style={{whiteSpace:"nowrap"}}>{filename}</span>
//             <input id="pronousimport" onChange={onAttachmentChange} type="file" style={{ display: "none" }} />              
//           </div>       
//           <div>
//             <PrimaryButton onClick={saveDataPronouns}>
//               {ButtonSaveText1}
//               {loading1 && (
//                 <div className={"elementToFadeInAndOut"}>
//                   <div></div>
//                   <div></div>
//                   <div></div>
//                 </div>
//               )}
//             </PrimaryButton>
//           </div>      
//         </div>
//       </div>
      
//       <div>
//         <h3><b>{"Instructions:-"}</b></h3>
//         <ul>
//           <li><label>{"Add multiple records up to 100 records per file.."}</label></li>
//           <li>{"Please fill the details with exact match to avoid conflicts of CSV file."}</li>
//           <li>{"Please don't add any commas or any other fields to avoid conflicts with commas of CSV file."}</li>
//           <li>{"Please don't change the order of the columns or add new columns; this may lead to feeding values in incorrect columns."}</li>
//         </ul>
//       </div>
//     </div>
//   );    
// }

// export default ImportPronouns;


import * as React from "react";
import { DefaultButton, Icon, IconButton, Label, MessageBar, MessageBarType, Modal, PrimaryButton, Stack, TextField } from "@fluentui/react";
import "./Styles.scss";
import { useBoolean } from "@fluentui/react-hooks";
import { Buffer } from 'buffer';
import { BlobServiceClient } from "@azure/storage-blob";
import * as XLSX from 'xlsx';
import Excel from "exceljs";
import { CommandBarButton, GetGroupCount } from "@fluentui/react";
import useStore from "./store";
import { gapi } from "gapi-script";
import { encryptData, GetSettingValues, updateSettingData } from "../Helpers/HelperFunctions";
import { useLanguage } from "../../Language/LanguageContext";

var exclname = "";
const messageBarWarningStyles = {
  root: {
    backgroundColor: 'rgb(255, 244, 206)',
  }
};
const messageBarInfoStyles = {
  root: {
    backgroundColor: 'rgb(243, 242, 241)',
  }
};
const messageBarErrorStyles = {
  root: {
    backgroundColor: 'rgb(253, 231, 233)',
  }
};
const messageBarSuccessStyles = {
  root: {
    backgroundColor: 'rgb(223, 246, 221)',
  }
};

interface IRichText {
  description: string;
}

var dataAPI: any = "";
var parsedData: any = "";
const KEY_NAME4 = "Pronouns";
var containerClient: any;

function ImportPronouns(props) {
  const {translation}=useLanguage();
  const { changeExcludeUsersBulk } = useStore();
  const[filename,setFileName]=React.useState("");
  const [saved, setSaved] = React.useState(false);
  const [saveMsg, setSaveMsg] = React.useState(null);
  const [isModalOpen, { setTrue: openModal, setFalse: closeModal }] = useBoolean(false);
  const [updateDataArray, setupdateDataArray] = React.useState<any>([]);
  const [attachFile1, setattachFile1] = React.useState(null);
  const [ButtonSaveText1, setButtonSaveText1] = React.useState<string>("Save");
  const [loading1, setLoading1] = React.useState(false);

  React.useEffect(() => {}, []);

  function getFormattedTime() {
    var today = new Date();
    var y = today.getFullYear();
    var m = today.getMonth() + 1; // JavaScript months are 0-based.
    var d = today.getDate();
    var h = today.getHours();
    var mi = today.getMinutes();
    var s = today.getSeconds();
    return y + "" + m + "" + d + "" + h + "" + mi + "" + s;
  }

  var data: any[] = [
    { 
      givenName: '',
      familyName: '',
      fullName: '',
    }
  ];

  const downloadTemplate = (csvData, fileName, sheetName) => {
    csvData=csvData.map((item)=>{
       return { email:item?.email,pronouns:""}
    })
    var workbook = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(csvData);
    XLSX.utils.book_append_sheet(workbook, ws, sheetName);
    XLSX.writeFile(workbook, `${fileName}` + '.xlsx', { type: 'file' });
  }

  const onAttachmentChange = (ev: any) => {
    if (ev.target.files.length > 0) {
      setattachFile1(ev.target.files);
      console.log(ev.target.files[0]?.name,"----")
      setFileName(ev.target.files[0]?.name);
    } else {
      setattachFile1(null);
    }
    console.log('calling');
    processDataPronouns(ev);
  };

  const processDataPronouns = async (e: any) => {
    const file = e.target.files[0];
    const wb = new Excel.Workbook();
    const reader = new FileReader();
    var updateDataArray1: any[] = [];

    reader?.readAsArrayBuffer(file);
    reader.onload = () => {
      const buffer = reader.result;
      if (buffer instanceof ArrayBuffer) {
        wb.xlsx.load(Buffer.from(buffer)).then((workbook: { eachSheet: (arg0: (sheet: any, id: any) => void) => void; }) => {
          workbook.eachSheet((sheet, id) => {
            sheet.eachRow((row: { eachCell: (arg0: (cell: any, colNumber: any) => void) => void; }, rowIndex: any) => {
              const mappedData: { [key: string]: any } = {};
              row.eachCell((cell, colNumber) => {
                const key = sheet.getRow(1).getCell(colNumber).value as string;
                const value = cell.value;
                if (key !== null ) {
                  mappedData[key] = value;
                }
              });
            //   console.log(mappedData, 'mappeddat');
            //   var updateData = {
            //     name: {                                     
            //       familyName: '',
            //       givenName: '',
            //       fullName: '',
            //     },
            //     checked: true,
            //   };
            //   Object.entries(mappedData).forEach(([key, value]) => {
            //     if (key === "givenName") {
            //       updateData.name.givenName = value;
            //     } else if (key === "familyName") {
            //       updateData.name.familyName = value;
            //     } else if (key === "fullName") {
            //       updateData.name.fullName = value;
            //     }
            //   });
              updateDataArray1.push(mappedData);
              setupdateDataArray(updateDataArray1);
            });
          });
        }).catch((error: any) => {
          console.error("Error loading workbook:", error);
        });
      } else {
        console.error("Failed to load file as ArrayBuffer.");
      }
    };
  };

  const saveDataPronouns = () => {
    if(updateDataArray?.length){
    setLoading1(true);
    setButtonSaveText1("");
    const updatedParsedData = { ...dataAPI, [KEY_NAME4]: encryptData(JSON.stringify(updateDataArray.slice(1))) };
    console.log(updatedParsedData, 'parse');
    updateSettingData(updatedParsedData);
    props.SweetAlertPrononus("success",translation.SettingSaved);
    
    setTimeout(()=>{

        setLoading1(false)
        setButtonSaveText1("Save")
    },1000)
  }else{
    props.SweetAlertPrononus("info","Please select file");
  }
  };

  React.useEffect(() => {
    GetSettingValues().then((data)=>{
        dataAPI=data;
    });
  }, []);

  return (
    <div className={"CSVPanelMain"} id="pronouns" >
      <div className={"uploadCSVblkStyles"}> 
        <Stack>
          <DefaultButton 
            className={"downloadButton"} 
            style={{
              color: "#333",
              borderRadius: "20px",
              marginBottom: "2%",
              maxWidth: "200px"
            }}
            onClick={() => downloadTemplate(props.Users, "user_detail-" + getFormattedTime(), "A")}
          >
            <CommandBarButton text={"Download sample file"} />
          </DefaultButton>
        </Stack>
        <div className={"importCSVFileBlk"}>
          <div  className={"importCSVFile"} style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <Label onClick={() => document.getElementById("pronousimport").click()}   style={{whiteSpace:"nowrap"}} >{"Import File"}</Label>
            <Icon onClick={() => document.getElementById("pronousimport").click()}  iconName="Attach" style={{ cursor: "pointer" }} />
            <span style={{whiteSpace:"nowrap"}}>{filename}</span>
            <input id="pronousimport" onChange={onAttachmentChange} type="file" style={{ display: "none" }} />              
          </div>       
          <div>
            <PrimaryButton onClick={saveDataPronouns}>
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
        </div>
      </div>
      
      <div>
        <h3><b>{"Instructions:-"}</b></h3>
        <ul>
          <li><label>{"Add multiple records up to 100 records per file.."}</label></li>
          <li>{"Please fill the details with exact match to avoid conflicts of CSV file."}</li>
          <li>{"Please don't add any commas or any other fields to avoid conflicts with commas of CSV file."}</li>
          <li>{"Please don't change the order of the columns or add new columns; this may lead to feeding values in incorrect columns."}</li>
        </ul>
      </div>
    </div>
  );    
}

export default ImportPronouns;

