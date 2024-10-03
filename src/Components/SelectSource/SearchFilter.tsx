
import {
  Checkbox,
  FontIcon,
  Icon,
  PrimaryButton,
  Stack,
} from "@fluentui/react";
import { useState, useRef, useEffect } from "react";
//import {changeUserGridView} from "./store";
import useStore, { useSttings } from "./store";
import { BlobServiceClient } from "@azure/storage-blob";
import { gapi } from "gapi-script";
import { Buffer } from "buffer";
import { useLanguage } from "../../Language/LanguageContext";
import { SETTING_LIST, updateSettingJson } from "../../api/storage";

let parsedData: any = "";
var containerClient: any;
var KEY_NAME = "SearchFiltersPrope";

export function SearchFilter(props) {
  const { changeSearchFilters } = useStore();
  const { translation } = useLanguage();
  const {appSettings, setAppSettings} = useSttings();
  var sortedPeopleFilter;
  const [peopleFilter, setPeopleFilter] = useState([
    {
      id: 1,
      name: translation.Name ? translation.Name : "Name",
      checkbox: true,
    },
    {
      id: 2,
      name: translation.SelectTitles ? translation.SelectTitles : "Title",
      checkbox: true,
    },
    {
      id: 3,
      name: translation.Departments ? translation.Departments : "Departments",
      checkbox: true,
    },
    // {
    //   id: 4,
    //   name: translation.Customfieldssearch?translation.Customfieldssearch:"Custom Fields",
    //   checkbox: true,
    // },
  ]);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleDragStart = (e, index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
    e.preventDefault();
  };

  /* const handleDragEnd = () => {
    const copiedItems = [...peopleFilter];
    const draggedItemContent = copiedItems[dragItem.current];
    copiedItems.splice(dragItem.current, 1);
    copiedItems.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setPeopleFilter(copiedItems);
    changeSearchFilters(copiedItems);
  }; */
  const handleDragEnd = () => {
    const copiedItems = [...peopleFilter];
    const draggedItemContent = copiedItems[dragItem.current];
    copiedItems.splice(dragItem.current, 1);
    copiedItems.splice(dragOverItem.current, 0, draggedItemContent);

    // Update the IDs based on the new order
    const updatedItems = copiedItems.map((item, index) => ({
      ...item,
      id: index + 1, // Update the id starting from 1
    }));

    setPeopleFilter(updatedItems);
    changeSearchFilters(updatedItems);

    dragItem.current = null;
    dragOverItem.current = null;
  };

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
      //console.log("Downloaded blob content11", downloaded,'2');
      // const jsonData = downloadBlockBlobResponse.toString();
      // Parse the JSON data
      //const buf = new ArrayBuffer(downloaded.maxByteLength);
      const decoder = new TextDecoder();
      const str = decoder.decode(downloaded);
      //_parsedData=str;
      parsedData = JSON.parse(str);
      // logic for profileview checkboxes
      if (parsedData?.SearchFiltersPrope) {
        console.log(parsedData?.SearchFiltersPrope, "data");
        const updatedPeople = parsedData?.SearchFiltersPrope?.map((person) => {
          const updatedPerson = parsedData[KEY_NAME].find(
            (data) => data.id === person.id
          );
          if (updatedPerson) {
            return {
              ...person,
              checkbox: updatedPerson.checkbox,
            };
          }
          console.log(updatedPerson, " filters");
          return person;
        });
        console.log(updatedPeople, "update");
        sortedPeopleFilter = updatedPeople.sort((a, b) => a.id - b.id);
        console.log(sortedPeopleFilter, "search filters");
        setPeopleFilter(sortedPeopleFilter);
      } else {
        setPeopleFilter(peopleFilter);
      }
    } else {
      setPeopleFilter(peopleFilter);
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



  const handleCheckboxChange = (index, isChecked) => {
    setPeopleFilter((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, checkbox: isChecked } : item
      )
    );
  };

  /*   const handleCheckboxChange = (index:any, isChecked:any) => {
    setPeopleFilter((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, checkbox: isChecked } : item
      )
    );
  }; */

  const handleSaveFilter: any = () => {
    const setting = { ...appSettings, [KEY_NAME]: peopleFilter };

   
    updateSettingJson(SETTING_LIST, setting);
    setAppSettings(setting);
    props.SweetAlertSearchFilter("success", translation.SettingSaved);
  };
  useEffect(() => {
    if (appSettings?.SearchFiltersPrope) {
      const updatedPeople = appSettings?.SearchFiltersPrope?.map((person) => {
        const updatedPerson = appSettings[KEY_NAME].find(
          (data:any) => data.id === person.id
        );
        if (updatedPerson) {
          return {
            ...person,
            checkbox: updatedPerson.checkbox,
          };
        }
        return person;
      });
      sortedPeopleFilter = updatedPeople.sort((a:any, b:any) => a.id - b.id);
      setPeopleFilter(sortedPeopleFilter);
    } else {
      setPeopleFilter(peopleFilter);
    }
  }, [appSettings.SearchFiltersPrope]);
  
  return (
    <main id="searchfilters">
      <Icon
        iconName="save"
        onClick={handleSaveFilter}
        style={{
          position: "fixed",
          right: "60px",
          top: "16px",
          color: "white",
          cursor: "pointer",
        }}
      />
      <div style={{ position: "absolute", top: "10px", right: "10px" }}></div>
      {peopleFilter.map((person, index) => (
        <div
          style={{
            display: "grid",
            rowGap: "50px",
            justifyContent: "space-between",
            marginTop: "3%",
          }}
          className="relative flex space-x-3 border rounded p-2 bg-gray-100"
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnter={(e) => handleDragEnter(e, index)}
          onDragEnd={handleDragEnd}
        >
          <Stack
            style={{
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
              width: "70px",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <FontIcon iconName="GripperDotsVertical" />
            <Checkbox
              label={person.name}
              title={person.name}
              checked={person.checkbox}
              onChange={(ev, isChecked) =>
                handleCheckboxChange(index, isChecked)
              }
            />
          </Stack>
        </div>
      ))}
    </main>
  );
}
