import {
  Checkbox,
  FontIcon,
  Icon,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Separator,
  Shimmer,
  Stack,
  mergeStyles,
} from "@fluentui/react";
import { useState, useRef, useEffect } from "react";
//import {changeUserGridView} from "./store";
import useStore, { useSttings } from "./store";
// import { BlobServiceClient } from "@azure/storage-blob";
import { gapi } from "gapi-script";
// import { Buffer } from "buffer";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { position } from "html2canvas/dist/types/css/property-descriptors/position";
import Department from "./Department";
import styles from "../SCSS/Ed.module.scss"
import { getSettingJson, SETTING_LIST, updateSettingJson } from "../../api/storage";
let parsedData: any = "";
var containerClient: any;
var KEY_NAME = "GridViewPrope";
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
const messageBarWarningStyles = {
  root: {
    backgroundColor: "rgb(255, 244, 206)",
  },
};

const wrapperClass = mergeStyles({
  padding: 2,
  selectors: {
    "& > .ms-Shimmer-container": {
      margin: "10px 0",
    },
  },
});
let displayNames={
 Department:"Department",
  Location:"Location",
  Workphone: "Work phone",
  Email: "Email",
  Mobile: "Mobile",
  Manager: "Manager",
  Name: "Name",
  Jobtitle:"Job title"
}
export function UserPropsGridView(props) {
  var sortedPeople;
  const { appSettings, setAppSettings } = useSttings();
  const { changeUserGridView } = useStore();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);
  const [alert, setAlert] = useState(false);
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [gridViewFields, setGridViewFields] = useState([
    {
      id: 1,
      name: "name",
      checkbox: true,
      isCustomField: false,
      nameAPI: "name",
    },
    {
      id: 2,
      name: "email",
      checkbox: false,
      isCustomField: false,
      nameAPI: "email",
    },
    {
      id: 3,
      name: "job",
      checkbox: true,
      isCustomField: false,
      nameAPI: "job",
    },
    {
      id: 4,
      name: "department",
      checkbox: true,
      isCustomField: false,
      nameAPI: "department",
    },
    {
      id: 5,
      name: "location",
      checkbox: true,
      isCustomField: false,
      nameAPI: "location",
    },
    {
      id: 6,
      name: "workphone",
      checkbox: true,
      isCustomField: false,
      nameAPI: "workphone",
    },
    {
      id: 7,
      name: "mobile",
      checkbox: true,
      isCustomField: false,
      nameAPI: "mobile",
    },
    {
      id: 8,
      name: "manager",
      checkbox: true,
      isCustomField: false,
      nameAPI: "manager",
    },
  ]);
  useEffect(() => {
    GetSettingData();
    // let a=document.getElementsByClassName("swal2-container") as any ;
    // a.style.position="absolute";
  }, []);

  //setPeople(userGridView);
  const dragPerson = useRef(0);
  const draggedOverPerson = useRef(0);
  const messageDismiss = () => {
    setSaved(false);
    setError(false);
    setAlert(false);
  };

  function handleSort() {
    const peopleClone = [...gridViewFields];
    const temp = peopleClone[dragPerson.current];
    // Swap the elements
    peopleClone[dragPerson.current] = peopleClone[draggedOverPerson.current];
    peopleClone[draggedOverPerson.current] = temp;

    // Update IDs
    peopleClone.forEach((person, index) => {
      person.id = index + 1;
    });

    // Update state
    setGridViewFields(peopleClone);
    changeUserGridView(peopleClone);
  }

  function onfiltersChangedrag(_e: any, newVal: any, name: any) {
    const updatedPeople = gridViewFields.map((person, index) => {
      if (person.name === name) {
        return { ...person, checkbox: newVal };
      }
      return person;
    });
    console.log(updatedPeople, "updated");
    setGridViewFields(updatedPeople);
    changeUserGridView(updatedPeople);
  }

  async function GetSettingData() {
    const settingJson = await getSettingJson(SETTING_LIST);
    
   

  

    if (Object.keys(settingJson)?.length) {
      parsedData = settingJson;
  
      
      // logic for profileview checkboxes
      if (parsedData?.GridViewPrope) {
        /* const updatedPeople = parsedData?.GridViewPrope?.map(person => {
        const updatedPerson = parsedData[KEY_NAME].find(data => data.id === person.id);
        if (updatedPerson) {
          return {
            ...person,
            checkbox: updatedPerson.checkbox
          };
        }
        return person;
      });
       sortedPeople = updatedPeople.sort((a, b) => a.id - b.id);
       setPeople(sortedPeople); */
        const updatedPeople = parsedData?.GridViewPrope?.map((person) => {
          if (person.customFields && person.customFields.length > 0) {
            // Find the corresponding object in parsedData[KEY_NAME] array
            const updatedPerson = parsedData[KEY_NAME].find(
              (data) => data.id === person.id
            );
            if (updatedPerson) {
              // If found, update the person object including customFields
              return {
                ...person,
                ...updatedPerson,
              };
            }
          }
          // If no customFields or corresponding object found, return the original person object
          return person;
        });

        // Sort the updatedPeople array by id
        // const sortedPeople = updatedPeople.sort((a, b) => a.id - b.id);

        // Update the state with the sortedPeople array
        console.log(sortedPeople, "newdata");
        // setPeople(people);
        setGridViewFields(updatedPeople);
        setDataLoaded(true);
      } else {
        setGridViewFields(gridViewFields);
        setDataLoaded(true);
      }
    } else {
      setGridViewFields(gridViewFields);
      setDataLoaded(true);
    }
  }


 

  const handleSaveGrid = () => {
    const updatedParsedData = { ...parsedData, [KEY_NAME]: gridViewFields };
    
    
    console.log(updatedParsedData, "par");
    if (Object.keys(parsedData).length > 0) {
      updateSettingJson(SETTING_LIST,updatedParsedData);
      setAppSettings(updatedParsedData);
      
      
      props.SweetAlertGridView("success","Setting saved successfully")
      setGridViewFields(gridViewFields);
    }

 
  };

  const onDragEnd = (result) => {
    console.log(result, "dragresult");
    if (!result.destination) return;

    const newOrder = Array.from(gridViewFields);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);

    setGridViewFields(newOrder);
    changeUserGridView(newOrder);
  };
  function getDisplayName(name) {
    switch (name) {
        case "location":
            return displayNames.Location;
        case "department":
            return displayNames.Department;
        case "workphone":
            return displayNames.Workphone;
        case "job":
            return displayNames.Jobtitle;
        case "name":
            return displayNames.Name;
        case "mobile":
            return displayNames.Mobile;
        case "manager":
            return displayNames.Manager;
        case "email":
            return displayNames.Email;
        default:
            return name; 
    }
}

  return (
    <main
      // className="flex min-h-screen flex-col items-center space-y-4"
      style={{ marginTop: "5px" }}
      id="UserPrtiesGV"
    >
      
      
      <Icon
        iconName="save"
        onClick={handleSaveGrid}
        style={{
          position: "fixed",
          right: "60px",
          top: "16px",
          color: "white",
          cursor: "pointer",
        }}
      />

      {/* {sortedPeople? sortedPeople.map((person, index) => (
        <div
        style={{ display: 'grid', rowGap: "50px",justifyContent:'space-between',marginTop:'3%'}}
          className="relative flex space-x-3 border rounded p-2 bg-gray-100"
          draggable
          onDragStart={() => (dragPerson.current = index)}
          onDragEnter={() => (draggedOverPerson.current = index)}
          onDragEnd={handleSort}
          onDragOver={(e) => e.preventDefault()}
        >
          <Stack style={{
            flexDirection: "row", gap: "10px", alignItems: "center", width: "70px",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>

            <FontIcon iconName="GripperDotsVertical" />
            <Checkbox
              label={person.name}
              title={person.name}
              checked={person.checkbox}
              onChange={(e, newVal) => onfiltersChangedrag(e, newVal, person.name)}
            />

          </Stack>
          {person?.customFields && person?.customFields?.length > 0 && (
            person["customFields"].map((field, fieldIndex) => (
              <Checkbox
                key={fieldIndex} // Make sure to add a unique key to each checkbox
                label={field.name}
                title={field.name}
                checked={field.checkbox}
                onChange={(e, newVal) => onfiltersChangedrag(e, newVal, field.name)}
              />
            ))
            
        )}
              
        </div>
      )): gridViewFields.map((person, index) => (
        <div
        style={{ display: 'grid', rowGap: "50px",justifyContent:'space-between',marginTop:'3%'}}
          className="relative flex space-x-3 border rounded p-2 bg-gray-100"
          draggable
          onDragStart={() => (dragPerson.current = index)}
          onDragEnter={() => (draggedOverPerson.current = index)}
          onDragEnd={handleSort}
          onDragOver={(e) => e.preventDefault()}
        >
          <Stack style={{
            flexDirection: "row", gap: "10px", alignItems: "center", width: "70px",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>

            <FontIcon iconName="GripperDotsVertical" />
            <Checkbox
              label={person.name}
              title={person.name}
              checked={person.checkbox}
              onChange={(e, newVal) => onfiltersChangedrag(e, newVal, person.name)}
            />

          </Stack>
            
            
        </div>
      ))} */}

      {!isDataLoaded ? (
        <div className={wrapperClass}>
          <Shimmer />
          <Shimmer width="75%" />
          <Shimmer width="50%" />
        </div>
      ) : (
        <>
          {sortedPeople ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="checkboxes">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ display: "grid", rowGap: "10px" }}
                  >
                    {sortedPeople &&
                      sortedPeople?.map((checkbox, index) => (
                        <Draggable
                          key={checkbox.name}
                          draggableId={checkbox.name}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {/* <Stack className={styles.filterChecks} style={{ flexDirection: "row",gap:"5px",alignItems:"center" }}> */}
                              <Stack
                                style={{
                                  flexDirection: "row",
                                  gap: "5px",
                                  alignItems: "center",
                                }}
                              >
                                <FontIcon iconName="GripperDotsVertical" />
                                <Checkbox
                                label={getDisplayName(checkbox.name)}
                                  // label={checkbox.name=="location"?displayNames.Department:checkbox.name=="department"?displayNames.Department:checkbox.name=="workphone"?displayNames.Workphone:checkbox.name}
                                  title={getDisplayName(checkbox.name)}
                                  checked={checkbox.checkbox}
                                  onChange={(e, newVal) =>
                                    onfiltersChangedrag(
                                      e,
                                      newVal,
                                      checkbox.name
                                    )
                                  }
                                />
                                  {/* <Separator className={styles.seprator} /> */}
                              </Stack>
                              {checkbox?.customFields &&
                                checkbox?.customFields?.length > 0 &&
                                checkbox["customFields"].map(
                                  (field, fieldIndex) => (
                                    <Checkbox
                                      key={fieldIndex} // Make sure to add a unique key to each checkbox
                                      label={field.name}
                                      title={field.name}
                                      checked={field.checkbox}
                                      onChange={(e, newVal) =>
                                        onfiltersChangedrag(
                                          e,
                                          newVal,
                                          field.name
                                        )
                                      }
                                    />
                                  )
                                )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="checkboxes">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ display: "grid" }}
                  >
                    {gridViewFields &&
                      gridViewFields?.map((checkbox, index) => (
                        <Draggable
                          key={checkbox.name}
                          draggableId={checkbox.name}
                          index={index}
                        >
                          {(provided) => (
                            <div
                            
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Stack
                                style={{
                                  display:"flex",
                                
                                  flexDirection: "row",
                                  
                                  gap: "10px",
                                  alignItems: "center",
                                  width: "100%",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  padding:"10px 0",
                                  borderBottom:"1px solid #ddd"

                                }}
                              >
                                <FontIcon iconName="GripperDotsVertical" />
                                <Checkbox
                                   label={getDisplayName(checkbox.name)}
                                  title={getDisplayName(checkbox.name)}
                                  checked={checkbox.checkbox}
                                  onChange={(e, newVal) =>
                                    onfiltersChangedrag(
                                      e,
                                      newVal,
                                      checkbox.name
                                    )
                                  }
                                />
                              </Stack>
                                  {/* <Separator  className="separator" /> */}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </>
      )}
    </main>
  );
}
