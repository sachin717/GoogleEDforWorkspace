import * as React from "react";
import  "../SCSS/DragDrop.scss"
import {
  DefaultButton,
  Icon,
  IconButton,
  MessageBar,
  MessageBarType,
  Modal,
  PrimaryButton,
  Stack,
  TextField,
} from "@fluentui/react";
import   "./Styles.scss";
import { useBoolean } from "@fluentui/react-hooks";
import { Buffer } from 'buffer';
import { BlobServiceClient } from "@azure/storage-blob";

import * as XLSX from 'xlsx';
import Excel from "exceljs";
//const bdayLogo:any = require("../../assets/two.png");
import  DragDropImage from ".././assets/images/AttachmentAreaBGImage.png"
import { CommandBarButton, GetGroupCount } from "@fluentui/react";
import useStore, { useSttings } from "./store";
import { gapi } from "gapi-script";
import { useLanguage } from "../../Language/LanguageContext";
import { updateSettingData } from "../Helpers/HelperFunctions";
import DragDrop from "./Utils/DragDrop";

var exclname = "";
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
interface IRichText {
 
  description: string;
}
var dataAPI: any = "";
var parsedData: any = "";
const KEY_NAME4 = "ExcludeUsersBulk";
var containerClient: any;
function ExcludeCSV(props){
    const {changeExcludeUsersBulk} = useStore();
    const {translation}=useLanguage();
    const [saved, setSaved] = React.useState(false);
    const [file, setFile] = React.useState([]);
    const { appSettings, setAppSettings } = useSttings();
    // const [imageFile, setimageFile] = React.useState(null);
    const [saveMsg, setSaveMsg] = React.useState(null);
    const [isModalOpen, { setTrue: openModal, setFalse: closeModal }] =
    useBoolean(false);
    const [updateDataArray, setupdateDataArray] = React.useState<any>([]);
    // const [currentLogo, setCurrentLogo] = React.useState(null);
    const [error, setError] = React.useState(false);
    const [alert, setAlert] = React.useState(false);
    const [alertMsg, setAlertMsg] = React.useState("");
    const [attachFile1, setattachFile1] = React.useState(null);
    const [ButtonSaveText1, setButtonSaveText1] = React.useState<string>("Save");
    const [loading1, setLoading1] = React.useState(false);
    //  React.useEffect(()=>{
    //      setupdateDataArray(file[0]);
    //      console.log(file[0]);

    //  },[file?.length])

      function getFormattedTime() {
        var today = new Date();
        var y = today.getFullYear();
        // JavaScript months are 0-based.
        var m = today.getMonth() + 1;
        var d = today.getDate();
        var h = today.getHours();
        var mi = today.getMinutes();
        var s = today.getSeconds();
        return y + "" + m + "" + d + "" + h + "" + mi + "" + s;
    }
        var data: any[] = [
            { 
                
                fullName:'',
            }
        ];
        // const csvReport = {
        //   data: data,
        //   headers: headers,
        //   filename: 'Exclude_user-'+getFormattedTime()+'.csv'
        // };

        const downloadTemplate = (csvData, fileName, sheetName) => {
          var workbook = XLSX.utils.book_new();
          var ws = XLSX.utils.json_to_sheet(csvData);
          XLSX.utils.book_append_sheet(workbook, ws, sheetName);
          XLSX.writeFile(workbook, `${fileName}` + '.xlsx', { type: 'file' });
        }

 
      const onAttachmentChange = (ev:any) => {
        if (ev.target.files.length > 0) {
          setattachFile1(ev.target.files);
        } else {
          setattachFile1(null);
        }
        console.log('calling')
        processData(ev);
      };



const processData = async (e: any) => {
    const file = e.target.files[0];
    const wb = new Excel.Workbook();
    const reader = new FileReader();
   var updateDataArray1:any=[];
    reader.readAsArrayBuffer(file);
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
                            if (key !== null) {
                                mappedData[key] = value;
                            }
                        });
                        console.log(mappedData,'mappeddat')
                        var updateData = {
                          
                            name: {                                     
                                      
                                      fullName: '',
                                 },
                                 checked: true,
                          };
                          Object.entries(mappedData).forEach(([key, value]) => {
                              if(key === "fullName"){
                                updateData.name.fullName = value;
                              }
                           
                          });
                          updateDataArray1.push(updateData);
                          setupdateDataArray(updateDataArray1);
                       
                         //console.log(mappedData,'map')
                        
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



const saveData = ()=>{

  let data=[...appSettings?.ExcludeUsersBulk,...updateDataArray.slice(1)]

    const updatedParsedData = { ...appSettings, [KEY_NAME4]: data};
    console.log(data,'padatarse')
    //console.log(parsedData,'listview settings')
      updateSettingData(updatedParsedData);
      setAppSettings(updatedParsedData);
      props.SweetAlertCsvPanel("success",translation.SettingSaved);
    
    // changeExcludeUsersBulk(updateDataArray);
}

// const handleRemove = (path) => {
//   setFile((prevFile) => prevFile.filter(item => item.path !== path));
// };

    return(
      
        <div className={"CSVPanelMain"} id="csvpanel"> 
         
         

            
            {/* <div className={styles.bdayUploadLogo}>
                
                {/* <div className={styles.upURL}>
                    <label>Upload Image</label>
                   <span> <TextField  /></span>
                    <Icon iconName="Save"></Icon>
                </div> 
            </div> */}
          <div className={"uploadCSVblkStyles"}> 
          <Stack>
          <DefaultButton className={"downloadButton"} 
          style={{
            color: "#333",
            borderRadius: "20px",
            marginBottom: "2%",
            maxWidth: "200px"
          }}
          onClick={() => downloadTemplate(data, "user_detail-" + getFormattedTime(), "A")} >
            {/* <CSVLink {...csvReport}>
              <CommandBarButton text={props.langcode.sett10?props.langcode.sett10:"Download sample file"} />
              </CSVLink> */}  
                <CommandBarButton text={"Download sample file"} />
          </DefaultButton>
          </Stack>
          <div className={"importCSVFileBlk"}>
          <div className={"importCSVFile"}>
                {/* <label>{"Import File"}</label> */}
                <input onChange={onAttachmentChange} type="file"/>              
          </div>       
          <div>
            <PrimaryButton onClick={saveData} >
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
          {/* <div style={{margin:"15px 0"}}>
          <DragDrop file={file} setFile={setFile} />
          {file.map((item)=>{
            return <div style={{border:"1px solid #ddd",display:"inline-block",padding:"8px",background:"#fff",marginLeft:"2px",marginBlock:"5px"}}>{item?.path} <Icon style={{cursor:"pointer"}} onClick={()=>handleRemove(item.path)} iconName="cancel" /></div>
          })}
          </div>
          */}
          
          <div>
              <h3><b>{"Instructions:-"}</b></h3>
               <ul style={{marginLeft: "20px"}}>
               <li>
                 <label>{"Add multiple records upto 100 records per file.."}</label></li>
                  <li><span>*</span>{"Please fill the details with exact match to avoid conflicts of CSV file."}</li>
                   <li>{"Please don't add any commas or any other fields to avoid conflicts with commas of CSV file."}</li>
                    <li><span>*</span>{"Please don't change order of the columns or don't add new columns, this may lead into feeding values in incorrect columns."}</li>
            </ul>
            </div>
        </div>
        
    );    
}



export default ExcludeCSV;
