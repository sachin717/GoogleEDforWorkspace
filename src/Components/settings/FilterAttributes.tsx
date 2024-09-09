import { useState } from "react";
import MiniModals from "../SelectSource/MiniModals";
import "../SCSS/SweetAlert.scss";
import {
  DetailsList,
  IColumn,
  Icon,
  IconButton,
  Label,
  Link,
  Panel,
  PanelType,
  SelectionMode,
  TextField,
  PrimaryButton,
  Toggle,
} from "@fluentui/react";
import { useFields } from "../../context/store";
import { updateSettingData } from "../Helpers/HelperFunctions";
import { useSttings } from "../SelectSource/store";
import { SweetAlerts } from "../SelectSource/Utils/SweetAlert";

const KEY = "FilterAttribute";

const FilterAttributes = ({ isOpen, onDismiss }:any) => {
  const [openDepPanel, setOpenDepPanel] = useState(false);
  const [openJobPanel, setOpenJobPanel] = useState(false);
  const [openLocationPanel, setOpenLocationPanel] = useState(false);
  const { departments, locations, jobTitles } = useFields();
  console.log("FIEDS......",locations,jobTitles,departments);
  const { appSettings,setAppSettings } = useSttings();
  const [allDepartments, setAllDepartments] = useState(departments);
  const [allJobTitles, setAllJballJobTitles] = useState(jobTitles);
  const [allLocations, setAllLocations] = useState(locations);

  const updateSetting = () => {
    const setting = {
      ...appSettings,
      [KEY]: {
        departments: allDepartments,
        jobTitles: allJobTitles,
        locations: allLocations,
      },
    };
    updateSettingData(setting);
    setAppSettings(setting);
  };

  return (
   <div>
    {
      isOpen &&  <MiniModals
      width={"500px"}
      isPanel={false}
      crossButton={true}
      heading={"Filter attributes"}
      closeAction={() => onDismiss(false)}
    >
      <div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Label>Update department</Label>
            <Link onClick={() => setOpenDepPanel(true)}>Update department</Link>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Label>Update job title</Label>
            <Link onClick={() => setOpenJobPanel(true)}>Update job title</Link>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Label>Update location</Label>
            <Link onClick={() => setOpenLocationPanel(true)}>
              Update location
            </Link>
          </div>
        </div>
        {/*------------------------------ Panels for settings---------------------- */}
        <div>
          <Panel
            type={PanelType.custom}
            customWidth="500px"
            headerText={"Add Department"}
            isOpen={openDepPanel}
            onDismiss={() => setOpenDepPanel(false)}
            closeButtonAriaLabel={"Close"}
          >
            <AddDepartment
              allDepartments={allDepartments}
              setAllDepartments={setAllDepartments}
              updateSetting={updateSetting}
            />
          </Panel>

          <Panel
            type={PanelType.custom}
            customWidth="500px"
            headerText={"Add job title"}
            isOpen={openJobPanel}
            onDismiss={() => setOpenJobPanel(false)}
            closeButtonAriaLabel={"Close"}
          >
            <AddJobTitle
              allJobTitles={allJobTitles}
              setAllJballJobTitles={setAllJballJobTitles}
              updateSetting={updateSetting}
            />
          </Panel>

          <Panel
            type={PanelType.custom}
            customWidth="500px"
            headerText={"Add Location"}
            isOpen={openLocationPanel}
            onDismiss={() => setOpenLocationPanel(false)}
            closeButtonAriaLabel={"Close"}
          >
            <AddLocation
              allLocations={allLocations}
              setAllLocations={setAllLocations}
              updateSetting={updateSetting}
            />
          </Panel>
        </div>
      </div>
    </MiniModals>
    }
   </div>
  );
};

const ListStyles = {
  headerWrapper: {
    flex: "0 0 auto",
    selectors: {
      "& [role=presentation]": {
        selectors: {
          "& [role=row]": {
            background: "rgb(0, 120, 212, .4)",
            padding: "4px 0px",
            color: "inherit",

            selectors: {
              ".ms-DetailsHeader-cellTitle": {
                color: "rgb(0, 120, 212)",
              },
              ".ms-DetailsHeader-cell:hover": {
                color: "#fff",
                background: "rgb(0, 120, 212,0)",
              },
            },
          },
        },
      },
    },
  },

  contentWrapper: {
    flex: "1 1 auto",
    ".ms-DetailsRow-fields": {
      alignItems: "center",
    },
  },
};

const AddDepartment = ({
  allDepartments,
  setAllDepartments,
  updateSetting,
}) => {
  const { SweetPrompt: SweetAlertDeleteDept } = SweetAlerts("#addDepartment",true);
  const { SweetAlert: SweetAlertUpdateDep } = SweetAlerts("#addDepartment",true);
  const { SweetAlert: SweetAlertAddedDep } = SweetAlerts("#department",true);

  const [openEditPanel, setOpenEditPanel] = useState(false);

  const [addedDep, setAddedDep] = useState({
    Key: allDepartments?.length,
    Department: "",
    Active: true,
  });

  const [Department, setDepartment] = useState("");
  const [Active, setActive] = useState(false);
  const [Key, setKey] = useState(0);

  const handleAdd = () => {
    if (addedDep.Department === "") {
      SweetAlertAddedDep("error", "Department name is required");
      return;
    }
    allDepartments.push(addedDep);
    setAllDepartments(allDepartments);
    SweetAlertAddedDep("success", "Department added");
    setAddedDep({
      Key: allDepartments.length,
      Department: "",
      Active: true,
    });
    updateSetting();
  };

  const handleUpdate = () => {
    const index = allDepartments.findIndex((dep: any) => dep.Key === Key);
    const data = { Key, Department, Active };
    const newDep = allDepartments;
    newDep[index] = data;
    setAllDepartments(newDep);
    SweetAlertUpdateDep("success", "Department updated");
    updateSetting();
  };

  const handleDelete = () => {
    const index = allDepartments.findIndex((dep: any) => dep.Key === Key);
    const newDep = allDepartments;
    if (index !== -1) {
      newDep.splice(index, 1);
      setAllDepartments(newDep);
    }
    SweetAlertUpdateDep("success", "Department deleted");
    setTimeout(() => {
      setOpenEditPanel(false);
    }, 2000);
    updateSetting();
  };

  const columns: IColumn[] = [
    {
      key: "column1",
      name: "Department Name",
      fieldName: "Department",
      minWidth: 180,
      maxWidth: 200,
      isRowHeader: true,
      isResizable: true,
      data: "string",
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      isPadded: true,
    },
    {
      key: "column2",
      name: "Status",
      fieldName: "Active",
      minWidth: 30,
      maxWidth: 60,
      isRowHeader: true,
      isResizable: true,
      data: "string",
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      isPadded: true,
      onRender: (item) =>
        item.Active ? (
          <Icon iconName="CheckMark"></Icon>
        ) : (
          <Icon iconName="Cancel"></Icon>
        ),
    },
    {
      key: "column3",
      name: "Action",
      fieldName: "Action",
      minWidth: 30,
      maxWidth: 60,
      isRowHeader: true,
      isResizable: true,
      data: "string",
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      isPadded: true,
      onRender: (item) => (
        <IconButton
          iconProps={{ iconName: "Edit" }}
          onClick={() => {
            setOpenEditPanel(true);
            setDepartment(item.Department);
            setActive(item.Active);
            setKey(item.Key);
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginTop: "10px" }}>
        <div>
          <PrimaryButton
            styles={{
              root: {
                backgroundColor: "rgb(0, 112, 220, .4)",
                border: "none",
                color: "rgb(0, 112, 220)",
              },
            }}
          >
            Import csv
          </PrimaryButton>
        </div>
        <div id="department">
          <Label>Add Department</Label>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "5px",
              alignItems: "center",
            }}
          >
            <TextField
              styles={{ root: { minWidth: "365px" } }}
              placeholder="Enter Department"
              value={addedDep.Department}
              onChange={(e: any) =>
                setAddedDep((prev) => ({ ...prev, Department: e.target.value }))
              }
            />
            <PrimaryButton onClick={handleAdd}>Add</PrimaryButton>
          </div>
        </div>
        <div style={{ marginTop: "10px" }}>
          <DetailsList
            columns={columns}
            selectionMode={SelectionMode.none}
            styles={ListStyles}
            items={allDepartments || []}
          />
        </div>
      </div>
      <div>
        <Panel
          type={PanelType.custom}
          customWidth="450px"
          isOpen={openEditPanel}
          onDismiss={() => setOpenEditPanel(false)}
          headerText="Edit Department"
        >
          <div id="addDepartment" style={{ marginTop: "10px" }}>
            <TextField
              label="Department"
              name="Department"
              value={Department}
              onChange={(e: any) => setDepartment(e.target.value)}
              required={true}
            />
            <Toggle
              onChange={(_, checked: boolean) => setActive(checked)}
              checked={Active}
              label="Active"
            />
            <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
              <PrimaryButton onClick={handleUpdate}>Update</PrimaryButton>
              <PrimaryButton
                onClick={() => {
                  SweetAlertDeleteDept(
                    "warning",
                    "Do you want to delete it ?"
                  ).then((res) => {
                    if (res.isConfirmed) {
                      handleDelete();
                    }
                  });
                }}
              >
                Delete
              </PrimaryButton>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

const AddJobTitle = ({ allJobTitles, setAllJballJobTitles, updateSetting }) => {
  const { SweetPrompt: SweetAlertAddJobTitle } = SweetAlerts("#addJobTitle",true);
  const { SweetAlert: SweetAlertUpdateJobTitle } = SweetAlerts("#addJobTitle",true);
  const { SweetAlert: SweetAlertAddedJobTitle } = SweetAlerts("#addedJobTitle",true);

  const [openEditPanel, setOpenEditPanel] = useState(false);
  const [addedJobTitle, setAddedJobTitle] = useState({
    Key: allJobTitles?.length,
    JobTitle: "",
    Active: true,
  });

  const [JobTitle, setJobTitles] = useState("");
  const [Active, setActive] = useState(false);
  const [Key, setKey] = useState(0);

  const handleAdd = () => {
    if (addedJobTitle.JobTitle === "") {
      SweetAlertAddedJobTitle("error", "Job title is required");
      return;
    }
    allJobTitles.push(addedJobTitle);
    setAllJballJobTitles(allJobTitles);
    SweetAlertAddedJobTitle("success", "Job title added");
    setAddedJobTitle({
      Key: allJobTitles.length,
      JobTitle: "",
      Active: true,
    });
    updateSetting();
  };

  const handleUpdate = () => {
    const index = allJobTitles.findIndex((dep: any) => dep.Key === Key);
    const data = { Key, JobTitle, Active };
    const newJob = allJobTitles;
    newJob[index] = data;
    setAllJballJobTitles(newJob);
    SweetAlertUpdateJobTitle("success", "Job title updated");
    updateSetting();
  };

  const handleDelete = () => {
    const index = allJobTitles.findIndex((dep: any) => dep.Key === Key);
    const newDep = allJobTitles;
    if (index !== -1) {
      newDep.splice(index, 1);
      setAllJballJobTitles(newDep);
    }
    SweetAlertUpdateJobTitle("success", "Job title deleted");
    setTimeout(() => {
      setOpenEditPanel(false);
    }, 2000);
    updateSetting();
  };

  const columns: IColumn[] = [
    {
      key: "column1",
      name: "Job title",
      fieldName: "JobTitle",
      minWidth: 180,
      maxWidth: 200,
      isRowHeader: true,
      isResizable: true,
      data: "string",
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      isPadded: true,
    },
    {
      key: "column2",
      name: "Status",
      fieldName: "Active",
      minWidth: 30,
      maxWidth: 60,
      isRowHeader: true,
      isResizable: true,
      data: "string",
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      isPadded: true,
      onRender: (item) =>
        item.Active ? (
          <Icon iconName="CheckMark"></Icon>
        ) : (
          <Icon iconName="Cancel"></Icon>
        ),
    },
    {
      key: "column3",
      name: "Action",
      fieldName: "Action",
      minWidth: 30,
      maxWidth: 60,
      isRowHeader: true,
      isResizable: true,
      data: "string",
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      isPadded: true,
      onRender: (item) => (
        <IconButton
          iconProps={{ iconName: "Edit" }}
          onClick={() => {
            setOpenEditPanel(true);
            setJobTitles(item.JobTitle);
            setActive(item.Active);
            setKey(item.Key);
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginTop: "10px" }}>
        <div>
          <PrimaryButton
            styles={{
              root: {
                backgroundColor: "rgb(0, 112, 220, .4)",
                border: "none",
                color: "rgb(0, 112, 220)",
              },
            }}
          >
            Import csv
          </PrimaryButton>
        </div>
        <div id="addedJobTitle">
          <Label>Add Job title</Label>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "5px",
              alignItems: "center",
            }}
          >
            <TextField
              styles={{ root: { minWidth: "365px" } }}
              placeholder="Enter job title"
              value={addedJobTitle.JobTitle}
              onChange={(e: any) =>
                setAddedJobTitle((prev) => ({
                  ...prev,
                  JobTitle: e.target.value,
                }))
              }
            />
            <PrimaryButton onClick={handleAdd}>Add</PrimaryButton>
          </div>
        </div>
        <div style={{ marginTop: "10px" }}>
          <DetailsList
            columns={columns}
            selectionMode={SelectionMode.none}
            styles={ListStyles}
            items={allJobTitles || []}
          />
        </div>
      </div>
      <div>
        <Panel
          type={PanelType.custom}
          customWidth="450px"
          isOpen={openEditPanel}
          onDismiss={() => setOpenEditPanel(false)}
          headerText="Edit job title"
        >
          <div id="addJobTitle" style={{ marginTop: "10px" }}>
            <TextField
              label="Job title"
              onChange={(e: any) => setJobTitles(e.target.value)}
              value={JobTitle}
              required
            />
            <Toggle
              onChange={(_, checked: boolean) => setActive(checked)}
              checked={Active}
              label="Active"
            />
            <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
              <PrimaryButton onClick={handleUpdate}>Update</PrimaryButton>
              <PrimaryButton
                onClick={() => {
                  SweetAlertAddJobTitle(
                    "warning",
                    "Do you want to delete it ? "
                  ).then((res) => {
                    if (res.isConfirmed) {
                      handleDelete();
                    }
                  });
                }}
              >
                Delete
              </PrimaryButton>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

const AddLocation = ({ allLocations, setAllLocations, updateSetting }) => {
  const { SweetPrompt: SweetAlertDeleteLocation } = SweetAlerts("#addLocation",true);
  const { SweetAlert: SweetAlertUpdateLocation } = SweetAlerts("#addLocation",true);
  const { SweetAlert: SweetAlertAddedLocation } = SweetAlerts("#addedLocation",true);
  const [openEditPanel, setOpenEditPanel] = useState(false);

  const [Location, setLocation] = useState("");
  const [Active, setActive] = useState(false);
  const [Key, setKey] = useState(0);

  const [addedLocation, setAddedLocation] = useState({
    Key: allLocations?.length,
    Location: "",
    Active: true,
  });

  const handleAdd = () => {
    if (addedLocation.Location === "") {
      SweetAlertAddedLocation("error", "Location name is required");
      return;
    }
    allLocations.push(addedLocation);
    setAllLocations(allLocations);
    SweetAlertAddedLocation("success", "Job title added");
    setAddedLocation({
      Key: allLocations.length,
      Location: "",
      Active: true,
    });
    updateSetting();
  };

  const handleUpdate = () => {
    const index = allLocations.findIndex((dep: any) => dep.Key === Key);
    const data = { Key, Location, Active };
    const newJob = allLocations;
    newJob[index] = data;
    setAllLocations(newJob);
    SweetAlertUpdateLocation("success", "Job title updated");
    updateSetting();
  };

  const handleDelete = () => {
    const index = allLocations.findIndex((dep: any) => dep.Key === Key);
    const newDep = allLocations;
    if (index !== -1) {
      newDep.splice(index, 1);
      setAllLocations(newDep);
    }
    SweetAlertUpdateLocation("success", "Location deleted");
    setTimeout(() => {
      setOpenEditPanel(false);
    }, 2000);
    updateSetting();
  };

  const columns: IColumn[] = [
    {
      key: "column1",
      name: "Location",
      fieldName: "Location",
      minWidth: 180,
      maxWidth: 200,
      isRowHeader: true,
      isResizable: true,
      data: "string",
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      isPadded: true,
    },
    {
      key: "column2",
      name: "Status",
      fieldName: "Active",
      minWidth: 30,
      maxWidth: 60,
      isRowHeader: true,
      isResizable: true,
      data: "string",
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      isPadded: true,
      onRender: (item) =>
        item.Active ? (
          <Icon iconName="CheckMark"></Icon>
        ) : (
          <Icon iconName="Cancel"></Icon>
        ),
    },
    {
      key: "column3",
      name: "Action",
      fieldName: "Action",
      minWidth: 30,
      maxWidth: 60,
      isRowHeader: true,
      isResizable: true,
      data: "string",
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      isPadded: true,
      onRender: (item) => (
        <IconButton
          iconProps={{ iconName: "Edit" }}
          onClick={() => {
            setOpenEditPanel(true);
            setLocation(item.Location);
            setActive(item.Active);
            setKey(item.Key);
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginTop: "10px" }}>
        <div>
          <PrimaryButton
            styles={{
              root: {
                backgroundColor: "rgb(0, 112, 220, .4)",
                border: "none",
                color: "rgb(0, 112, 220)",
              },
            }}
          >
            Import csv
          </PrimaryButton>
        </div>
        <div id="addedLocation">
          <Label>Add Location</Label>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "5px",
              alignItems: "center",
            }}
          >
            <TextField
              styles={{ root: { minWidth: "365px" } }}
              placeholder="Enter Location"
              value={addedLocation.Location}
              onChange={(e: any) =>
                setAddedLocation((prev) => ({
                  ...prev,
                  Location: e.target.value,
                }))
              }
            />
            <PrimaryButton onClick={handleAdd}>Add</PrimaryButton>
          </div>
        </div>
        <div style={{ marginTop: "10px" }}>
          <DetailsList
            columns={columns}
            selectionMode={SelectionMode.none}
            styles={ListStyles}
            items={allLocations || []}
          />
        </div>
      </div>
      <div>
        <Panel
          type={PanelType.custom}
          customWidth="450px"
          isOpen={openEditPanel}
          onDismiss={() => setOpenEditPanel(false)}
          headerText="Edit Location"
        >
          <div id="addLocation" style={{ marginTop: "10px" }}>
            <TextField
              onChange={(e: any) => setLocation(e.target.value)}
              label="Location"
              value={Location}
              required
            />
            <Toggle
              onChange={(_, checked: boolean) => setActive(checked)}
              checked={Active}
              label="Active"
            />
            <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
              <PrimaryButton onClick={handleUpdate}>Update</PrimaryButton>
              <PrimaryButton
                onClick={() => {
                  SweetAlertDeleteLocation(
                    "warning",
                    "Do you want to delete it ?"
                  ).then((res) => {
                    if (res.isConfirmed) {
                      handleDelete();
                    }
                  });
                }}
              >
                Delete
              </PrimaryButton>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default FilterAttributes;
