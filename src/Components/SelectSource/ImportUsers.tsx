import * as React from "react";
import {
  DefaultButton,
  Icon,
  Label,
  PrimaryButton,
  Stack,
} from "@fluentui/react";
import "./Styles.scss";
import { useBoolean } from "@fluentui/react-hooks";
import { Buffer } from 'buffer';
import * as XLSX from 'xlsx';
import Excel from "exceljs";
import useStore from "./store";
import { useSttings } from "./store";
import { useLanguage } from "../../Language/LanguageContext";
import { updateSettingJson, USER_LIST } from "../../api/storage";
import { useLists } from "../../context/store";
import { encryptData } from "../Helpers/HelperFunctions";

const KEY_NAME4 = "Users";

interface ImportUsersProps {
  sampleFileData: any;
  SweetAlertImportUser: (type: string, message: string) => void;
}

const messageBarStyles = {
  warning: { root: { backgroundColor: 'rgb(255, 244, 206)' } },
  info: { root: { backgroundColor: 'rgb(243, 242, 241)' } },
  error: { root: { backgroundColor: 'rgb(253, 231, 233)' } },
  success: { root: { backgroundColor: 'rgb(223, 246, 221)' } }
};

const ImportUsers = (props) => {
  const { translation } = useLanguage();
  const {usersList, setUsersList} = useLists();
  const { appSettings, setAppSettings } = useSttings();
  const { SweetAlertImportUser } = props;
  const [filenameUser, setFileNameUser] = React.useState<string>("");
  const [updateDataArray, setUpdateDataArray] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isModalOpen, { setTrue: openModal, setFalse: closeModal }] = useBoolean(false);
  const [buttonSaveText, setButtonSaveText] = React.useState<string>("Save");

  const getFormattedTime = () => {
    const today = new Date();
    return `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}${today.getHours()}${today.getMinutes()}${today.getSeconds()}`;
  };

  const downloadTemplate = (csvData: any[], fileName: string, sheetName: string) => {
    const workbook = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(csvData);
    XLSX.utils.book_append_sheet(workbook, ws, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const onAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setFileNameUser(file.name);
      processDataPronouns(file);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return null;
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return null; // Invalid date
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const processDataPronouns = async (file: File) => {
    const wb = new Excel.Workbook();
    const reader = new FileReader();
  
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const buffer = reader.result;
      if (buffer instanceof ArrayBuffer) {
        try {
          await wb.xlsx.load(Buffer.from(buffer));
          wb.eachSheet((sheet) => {
            sheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
              // Skip the header row (usually the first row)
              if (rowIndex > 1) {
                const mappedData: { [key: string]: any } = {};
                const headerRow = sheet.getRow(1);
                
                // Iterate over all header cells
                headerRow.eachCell((cell, colNumber) => {
                  const key = cell.value as string; // Header row
                  let cellValue = row.getCell(colNumber).value; // Get the corresponding cell value in the current row
                  
                  if (key === 'DOB' || key === 'DOJ') {
                    cellValue = formatDate(cellValue);
                  }
  
                  mappedData[key] = cellValue ?? ""; // Assign cell value or empty string if undefined
                });
  
                mappedData["IsExternalUser"] = true;
                setUpdateDataArray((prev) => [...prev, mappedData]);
              }
            });
          });
        } catch (error) {
          console.error("Error loading workbook:", error);
        }
      } else {
        console.error("Failed to load file as ArrayBuffer.");
      }
    };
  };
  

  const transformData = (data: any[]) => {
    return data.map(item => ({
      ...item,
      email: typeof item.email === 'object' ? item.email.text : item.email,
      manager: typeof item.manager === 'object' ? item.manager.text : item.manager,
    }));
  };

  const saveDataUsers = () => {

    if (updateDataArray.length === 0) {
      SweetAlertImportUser("info", "Please select a file");
      return;
    }


    setIsLoading(true);
    setButtonSaveText("Saving...");
    let encryptedData =[];
  if(usersList.Users){
    
    encryptedData = [...updateDataArray,...usersList.Users];
  }else{
    encryptedData = updateDataArray;

  }
  let res=Array.from(new Map(transformData(encryptedData).map(item => [item.email, item])).values());
    let updatedParsedData = { ...usersList,Users:res};
    


    
     
    

   
    console.log("users bulk upload before",updatedParsedData);
    // const dataInc = {...data.Users }

    function generateRandomId(length = 10) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters[randomIndex];
      }
      return result;
    }
    
    let finalData= updatedParsedData?.Users?.map((item)=>{

      // let ID= await generateUniqueId(item.email);'
      const ID = generateRandomId();
      return {...item,id:ID}
    })
    console.log("users bulk upload",{...usersList,Users:finalData})
    let encData=encryptData(JSON.stringify({...usersList,Users:finalData}))
    updateSettingJson(USER_LIST,encData);
    setUsersList({...usersList,Users:finalData});
    props.setUserImportedByCsv(true)

    SweetAlertImportUser("success", translation.SettingSaved);

    setTimeout(() => {
      setIsLoading(false);
      setButtonSaveText("Save");
    }, 1000);
  };


  return (
    <div className="CSVPanelMain" id="importuser" style={{ margin: "10px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
      <div className="uploadCSVblkStyles">
        <Stack>
          <DefaultButton
            className="downloadButton"
            style={{ color: "#333", borderRadius: "20px", marginBottom: "2%", maxWidth: "200px" }}
            onClick={() => downloadTemplate(props.sampleFileData, `user_detail-${getFormattedTime()}`, "A")}
          >
            Download sample file
          </DefaultButton>
        </Stack>
        <div className="importCSVFileBlk">
          <div className="importCSVFile" style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <Label onClick={() => document.getElementById("pronousimport")?.click()} style={{ whiteSpace: "nowrap" }}>
              Import File
            </Label>
            <Icon onClick={() => document.getElementById("pronousimport")?.click()} iconName="Attach" style={{ cursor: "pointer" }} />
            <span style={{ whiteSpace: "nowrap" }}>{filenameUser}</span>
            <input id="pronousimport" onChange={onAttachmentChange} type="file" style={{ display: "none" }} />
          </div>
          <div>
            <PrimaryButton onClick={saveDataUsers}>
              {buttonSaveText}
              {isLoading && (
                <div className="elementToFadeInAndOut">
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
        <h3><b>Instructions:</b></h3>
        <ul style={{ margin: "15px 30px" }}>
          <li>Add multiple records up to 100 records per file.</li>
          <li>Please fill the details with exact match to avoid conflicts with the CSV file.</li>
          <li>Please don't add any commas or other characters to avoid conflicts with CSV commas.</li>
          <li>Please don't change the order of columns or add new columns; this may lead to incorrect data mapping.</li>
        </ul>
      </div>
    </div>
  );
};

export default ImportUsers;
