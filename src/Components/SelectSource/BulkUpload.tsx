
import {
  CommandBarButton,
  DefaultButton,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Stack,
} from "@fluentui/react";
import React, { useContext, useEffect, useState } from "react";
import "../../App.css";
import * as XLSX from "xlsx";
import Excel from "exceljs";
import { gapi } from "gapi-script";
//import { UserContext } from ".";
import { Domain } from "domain";
import useStore from "./store";
// import { UserContext } from ".";

function BulkUpload(props:any){
    interface UpdateData {
        userKey: string;
        name: {
            fullName: string;
        };
        externalIds: {
            value: string;
            type: string;
        }[];
        relations: {
            value: string;
            type: string;
        }[];
        addresses: {
            type: string;
            formatted: string;
        }[];
        organizations: {
            title: string;
            primary: boolean;
            customType: string;
            department: string;
            costCenter: string;
        }[];
        phones: {
            value: number;
            type: string;
        }[];
        locations: {
            type: string;
            area: string;
            buildingId: number;
            floorName: string;
            floorSection: string;
        }[];
    }
    
    // Usage:
    const [updatedataList, setUpdateDataList] = useState<UpdateData>({
        userKey: '',
        name: {
            fullName: '',
        },
        externalIds: [
            {
                value: '',
                type: "organization",
            },
        ],
        relations: [
            {
                value: '',
                type: "manager",
            },
        ],
        addresses: [
            {
                type: "work",
                formatted: '',
            },
        ],
        organizations: [
            {
                title: '',
                primary: true,
                customType: "",
                department: '',
                costCenter: '',
            },
        ],
        phones: [
            {
                value: 1,
                type: "work",
            },
            {
                value: 1,
                type: "mobile",
            },
        ],
        locations: [
            {
                type: "desk",
                area: "desk",
                buildingId: 1,
                floorName: '',
                floorSection: '',
            },
        ],
    });
    const [loading1, setLoading1] = React.useState(false);
    const [saved, setSaved] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [alert, setAlert] = React.useState(false);
    const [attachFile1, setattachFile1] = React.useState(null);
    const [updateDataArray, setupdateDataArray] = React.useState<any>([]);
    const [validEmail, setValidEmail] = useState(false);
    const [domain, setDomain] = useState('');
    const [UserArray, setUserArray] = useState([]);
    const { userArray } = useStore();
    //var updateDataArray: any[] = [];
    const user = userArray
 
    const Buffer = require('buffer').Buffer;
    var data: any[] = [
        { 
            firstName: '',
            lastName: '',
            email: '',
            location: '',
            mobile:'',
            work:'',
            floorsection:'',
            floorName:'',
        }
    ];
    const ErrorMsg = () => (
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={false}
          onDismiss={messageDismiss}
          dismissButtonAriaLabel={
             "Close"
          }
        >
        </MessageBar>
      );
    const messageDismiss = () => {
        setSaved(false);
        setError(false);
        setAlert(false);
      };
      const [saveMsg, setSaveMsg] = React.useState(null);
      const AlertMsg = () => (
        <MessageBar
          messageBarType={MessageBarType.warning}
          isMultiline={false}
          //styles={messageBarWarningStyles}
          onDismiss={messageDismiss}
          dismissButtonAriaLabel={
             "Close"
          }
        >
          {''}
        </MessageBar>
      );
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
    const SuccessMsg = () => (
        <MessageBar
          messageBarType={MessageBarType.success}
          isMultiline={false}
          onDismiss={messageDismiss}
          dismissButtonAriaLabel={
           "Close"
          }
        >
          {saveMsg
            ? saveMsg
           
            : "Settings saved successfully!"}
        </MessageBar>
      );
      const downloadTemplate = (csvData:any, fileName:any, sheetName:any) => {
        var workbook = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(csvData);
        XLSX.utils.book_append_sheet(workbook, ws, sheetName);
        XLSX.writeFile(workbook, `${fileName}` + ".xlsx", { type: "file" });
      };
      const onAttachmentChange = (ev:any) => {
        if (ev.target.files.length > 0) {
          setattachFile1(ev.target.files);
        } else {
          setattachFile1(null);
        }
        console.log('calling')
        processData(ev);
      };
      function replaceChar(origString:any, replaceChar:string, index:number) {
        let firstPart = origString.substr(0, index);
        let lastPart = origString.substr(index + 2);
    
        let newString = firstPart + replaceChar + lastPart;
        return newString;
      }
      //
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
                            //console.log(mappedData,'mappeddat')
    
                            var updateData = {
                                userKey: '',
                              
                                name: {
                                          fullName:'',                                       
                                          familyName:'',
                                          givenName:''
                                     },
                                externalIds: [
                                  {
                                    value: '',
                                    type: "organization",
                                  },
                                ],
                                relations: [
                                  {
                                    value: '',
                                    type: "manager",
                                  },
                                ],
                                addresses: [
                                  {
                                    type: "work",
                                    formatted: '',
                                  },
                                ],
                                organizations: [
                                  {
                                    title: '',
                                    primary: true,
                                    customType: "",
                                    department: '',
                          
                                    costCenter: '',
                                  },
                                ],
                                phones: [
                                  {
                                    value: 1,
                                    type: "work",
                                  },
                                  {
                                    value: 1,
                                    type: "mobile",
                                  },
                                ],
                                locations: [
                                  {
                                    type: "desk",
                                    area: "desk",
                                    buildingId: 1,
                                    floorName: '',
                                    floorSection: '',
                                  },
                                ],
                              };
                             //console.log(mappedData,'map')
                            
                             user?.forEach((entry:any) => {
                                const [username, domain] = entry.email.split('@');
                                setDomain(domain);
                            });
                            // user?.forEach((element:any) => {
                            //     console.log(element.email,'email')
                            // });
                           setUserArray(user);
                            Object.entries(mappedData).forEach(([key, value]) => {
                              //console.log(key,'key')
                                if (key === "email") {
                                    updateData.userKey = value.text;
                                } else if (key === "firstName") {
                                  console.log('name',value)
                                    updateData.name.givenName = value;
                                }
                                else if(key === "fullName"){
                                  updateData.name.fullName = value;
                                 // console.log(value,'valfullname')
                                }else if(key === "givenName"){
                                  updateData.name.givenName = value;
                                  // console.log(value,'valgivenname')
                                } else if(key === "lastName"){
                                  
                                  updateData.name.familyName = value;
                                }
                                 else if (key === "floorName") {
                                  console.log('floorName',value)
                                    if (updateData.locations.length >= 1) {
                                        updateData.locations[0].floorName = value;
                                    }
                                }
                                else if(key === "buildingId") {
                                  if(updateData.locations.length>=1){
                                    updateData.locations[0].buildingId = value;
                                  }
                                } 
                                else if(key === "mobile"){
                                  if(updateData.phones.length>1){
                                    updateData.phones[1].value = value;
                                  }
                                }
                                else if(key === "work"){
                                  if(updateData.phones.length>1){
                                    updateData.phones[0].value = value;
                                  }
                                }
                             
                            });
                            updateDataArray1.push(updateData);
                             // setUpdateDataList(...updateData,);
                            // setUpdateDataList([...updatedataList, ...updateData]);

                             setupdateDataArray(updateDataArray1)
                             console.log(updateDataArray1,'updated list')
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

    // const batchAPI = () => gapi.load('client', async () => {

    //     await gapi.client.init({ /* Your initialization */ });
    //     const batch = gapi.client.newBatch();
    //     updateDataArray.forEach((updateData: any) => {
    //         extractDomainFromEmail(updateData.userKey);
    //         if(validateEmail(updateData.userKey,domain)){
    //             const userKey = updateData.userKey;
    //             const patchRequest = gapi.client.directory.users.patch({
    //                 userKey: userKey,
    //                 resource: updateData
    //             });
    //             batch.add(patchRequest);
    //         }
    //     });

    //     batch.execute((response: any) => {
    //         console.log('Batch operation response:', response);
    //     });
    // });
    function validateEmail(email:string) {
        const regex = new RegExp(`^[a-zA-Z0-9._%+-]+@${domain}$`, 'i');
        return regex.test(email);
    }
    const batchAPI = () => gapi.load('client', async () => {
      // console.log('calling')
       console.log(updateDataArray,'updated')
        await gapi.client.init({ /* Your initialization */ });
        const batch = gapi.client.newBatch();
        updateDataArray.forEach((updateData:any) => {
            if (validateEmail(updateData.userKey)) {
              const emails = user.map((user: { email: any; }) => user.email);
              const currentEmail = updateData.userKey;
              const presentInOtherEmails = emails.includes(currentEmail);
              if(presentInOtherEmails){
                const userKey = updateData.userKey;
                const patchRequest = gapi.client.directory.users.patch({
                    userKey: userKey,
                    resource: updateData
                });
                batch.add(patchRequest);
               } else {
              //   (async () => {
              //     console.log('entered');
              //     await gapi.client.init({ /* Your initialization */ });
              //     const userKey = updateData.userKey;
              //     const addRequest = gapi.client.directory.users.insert({
              //          userKey: userKey,
              //         //resource: { primaryEmail: userKey, updateData }
              //         recourse: updateData,
              //     }).execute();
              //     batch.add(addRequest);
              // })();
                } }
        });
        batch.execute((response:any) => {
            console.log('Batch operation response:', response);
            setSaved(true);
            <SuccessMsg />
            props.dismiss();
        });
    });
    

    //
    //   function bthdaytemp() {
    //     setLoading1(true);
    //     // setButtonSaveText1("");
    //     if (attachFile1 != null) {
    //       const file = attachFile1[0];
    //       const reader = new FileReader();
    //       reader.onload = (evt) => {
    //         /* Parse data */
    //         const bstr = reader.result;
    //         const wb = XLSX.read(bstr, { type: "binary", cellDates: true });
    //         /* Get first worksheet */
    //         const wsname = wb.SheetNames[0];
    //         const ws = wb.Sheets[wsname];
    //         let x = ws["!ref"];
    //         let newref = replaceChar(x, "A1", 0); //B1:K4
    //         ws["!ref"] = newref;
    //         /* Convert array of arrays */
    //         const data = XLSX.utils.sheet_to_json(ws, {
    //           defval: "",
    //           blankrows: true,
    //         });
    //         processData(data);
    //       };
    //       reader.readAsBinaryString(file);
    //     } else {
    //       setAlert(true);
    //       setLoading1(false);
    //       setTimeout(() => {
    //         messageDismiss();
    //       }, 5000);
    //       return false;
    //     }
    //   }
    return(
        <div className={''}>
      {saved ? (
        <SuccessMsg />
      ) : error ? (
        <ErrorMsg />
      ) : alert ? (
        <AlertMsg />
      ) : (
        ""
      )}

      {/* <div className={styles.bdayUploadLogo}>
                
                {/* <div className={styles.upURL}>
                    <label>Upload Image</label>
                   <span> <TextField  /></span>
                    <Icon iconName="Save"></Icon>
                </div> 
            </div> */}
      <div className={'uploadCSVblkStyles'}>
        <Stack>
          <DefaultButton
             className={''}
             style={{
                color: "#333",
                borderRadius: "20px",
                marginBottom: "2%",
                maxWidth: "200px"
              }}
            onClick={() =>
              downloadTemplate(data, "user_detail-" + getFormattedTime(), "A")
            }
          >
            {/* <CSVLink {...csvReport}><CommandBarButton text={props.langcode.sett10 ? props.langcode.sett10 : "Download sample file"} /></CSVLink> */}
            <CommandBarButton
              text={
                "Download sample file"
              }
            />
          </DefaultButton>
        </Stack>
        <div className={''}  style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ color: "#333" }}>
              { "Import File"}
            </label>
             <input onChange={onAttachmentChange} type="file" />
             <div className={''}  style={{ display: 'flex', justifyContent: 'flex-end',marginLeft:'auto' }}>
             <PrimaryButton
              text={"Save"}
               onClick={() => batchAPI()}
              style={{}}//inline style
              styles={{root:{ className:'sample'}}} // for fluent ui styles in root
            >
              {loading1 && (
                <div className={''}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              )}
            </PrimaryButton>
            </div>
          
          </div>
      </div>

      <div style={{ color: "#333" }}>
        <h3 style={{ color: "#333" }}>
          <b>
            { "Instructions:-"}
          </b>
        </h3>
        <ul>
          <li>
            <span>*</span>
            { "FirstName, LastName, DisplayName, Email fields are mandatory"}
          </li>
          <li>
            <label>
              { " Add multiple records upto 100 records per file."}
            </label>
          </li>

          <li>
            <span>*</span>
            {"Please fill the details with exact match to avoid conflicts of CSV file."}
          </li>
          <li>
            { "Please don't add any commas or any other fields to avoid conflicts with commas of CSV file."}
          </li>
          <li>
            <span>*</span>
            {"Please don't change order of the columns or don't add new columns, this may lead into feeding values in incorrect columns."}
          </li>
        </ul>
      </div>
    </div>
    )
}
export default BulkUpload;