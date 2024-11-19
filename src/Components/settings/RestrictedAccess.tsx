import {
  Checkbox,
  DetailsList,
  Icon,
  Label,
  Panel,
  PanelType,
  SelectionMode,
  TextField,
} from "@fluentui/react";
import {
  ChoiceGroup,
  IChoiceGroupOptionProps,
  IconButton,
} from "office-ui-fabric-react";
import { useLanguage } from "../../Language/LanguageContext";
import { PrimaryButton } from "office-ui-fabric-react";
import { useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ReactSelect from "react-select";
import { useSttings } from "../SelectSource/store";
import { SweetAlerts } from "../SelectSource/Utils/SweetAlert";
import { useFields } from "../../context/store";
import { SETTING_LIST, updateSettingJson } from "../../api/storage";

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
  root:{
    "& .ms-DetailsRow-cell":{
      display:"flex",
      alignItems:"center",
    }
  }
};

const KEY = "RestrictedAccess";

const RestrictedAccess = ({ isOpen, onDismiss }) => {
  const { SweetPrompt: comfirmDelete, SweetAlert: successDeleted } =
    SweetAlerts("#show-access", true);
  const { appSettings, setAppSettings } = useSttings();
  const [opneAccess, setOpenAccess] = useState(false);
  const [openEditPanel, setOpenEditPanel] = useState(false);
  const { translation } = useLanguage();
  const [accesses, setAccesses] = useState([]);
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState<any>(null);

  const deleteAccess = (accessItem: any) => {
    const remainingAccess = accesses.filter(
      (x) => x.accessId !== accessItem.accessId
    );

    const setting = {
      ...appSettings,
      [KEY]: remainingAccess,
    };

    updateSettingJson(SETTING_LIST, setting);
    setAppSettings(setting);
    setAccesses(remainingAccess);
  };

  const editAccess = (editAccessItem) => {
    if (!editAccessItem) {
      return;
    }
    setEditItem(editAccessItem);
    setOpenEditPanel(true);
  };

  const columns = [
    {
      key: "column1",
      name: "Restricted Access Name",
      fieldName: "name",
      minWidth: 100,
      maxWidth: 200,
    },
    {
      key: "column2",
      name: "Description",
      fieldName: "description",
      minWidth: 100,
      maxWidth: 500,
    },
    {
      key: "column3",
      name: "Status",
      fieldName: "status",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item: any) => {
        return item.active ? (
          <IconButton iconProps={{ iconName: "Accept" }} />
        ) : (
          <IconButton iconProps={{ iconName: "Cancel" }} />
        );
      },
    },
    {
      key: "column4",
      name: "Action",
      fieldName: "action",
      minWidth: 100,
      maxWidth: 200,
      onRender: (item: any) => {
        return (
          <div>
            <IconButton
              onClick={() => editAccess(item)}
              iconProps={{ iconName: "Edit" }}
            />
            <IconButton
              onClick={() => {
                comfirmDelete(
                  "warning",
                  "Do you want to delete this access?"
                ).then((res) => {
                  if (res.isConfirmed) {
                    deleteAccess(item);
                    successDeleted("success", "Access deleted successfully");
                  }
                });
              }}
              iconProps={{ iconName: "Delete" }}
            />
          </div>
        );
      },
    },
  ];

  const listItems = useMemo(()=>{
    const listData = appSettings.RestrictedAccess?.map((x: any) => ({
      name: x.accessName,
      description: x.description,
      active: x.active,
      accessId: x.accessId,
    }));
    return listData
  },[accesses, appSettings])

  useEffect(() => {
    setAccesses(appSettings.RestrictedAccess || []);
  }, []);

  return (
    <div>
      <Panel
        headerText={translation.RestrictedAccess}
        isOpen={isOpen}
        onDismiss={() => onDismiss(false)}
        type={PanelType.custom}
        customWidth="950px"
        onOuterClick={() => {}}
      >
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            gap: "10px 0px",
            flexDirection: "column",
          }}
          id="show-access"
        >
          <PrimaryButton
            styles={{
              root: {
                backgroundColor: "rgb(0, 112, 220)",
                border: "none",
                outline: "none",
                width: "50px",
              },
            }}
            onClick={() => setOpenAccess(true)}
          >
            <div
              style={{
                display: "flex",
                gap: "5px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon iconName="Add" />
              <p>Add</p>
            </div>
          </PrimaryButton>
          <DetailsList
            styles={ListStyles}
            columns={columns}
            items={listItems || []}
            selectionMode={SelectionMode.none}
          />
        </div>
      </Panel>
      <AddAccess
        accesses={accesses}
        setAccesses={setAccesses}
        isOpen={opneAccess}
        onDismiss={setOpenAccess}
      />
      {editItem !== null && (
        <EditAccess
          isOpen={openEditPanel}
          onDismiss={setOpenEditPanel}
          accesses={accesses}
          setAccesses={setAccesses}
          editItem={editItem}
        />
      )}
    </div>
  );
};

const ChoiceGroupStyles = {
  root: {
    "& .ms-ChoiceFieldGroup-flexContainer": {
      display: "flex",
      gap: "10px",
    },
  },
};

const departmentStylesReactSelect: any = {
  control: (provided, state) => ({
    ...provided,
    width: 200,
    minHeight: 30,
    borderRadius: "0px",
    boxShadow: state.isFocused ? `0 0 0 .5px black` : provided.boxShadow,
    borderColor: state.isFocused ? `black` : provided.borderColor,
    "&:hover": {
      borderColor: state.isFocused ? `black` : provided.borderColor,
    },
  }),
};

const locationStylesReactSelect = {
  control: (provided, state) => ({
    ...provided,
    width: 200,
    minHeight: 30,
    marginLeft: "22px",
    borderRadius: "0px",
    boxShadow: state.isFocused ? `0 0 0 .5px black` : provided.boxShadow,
    borderColor: state.isFocused ? `black` : provided.borderColor,
    "&:hover": {
      borderColor: state.isFocused ? `black` : provided.borderColor,
    },
  }),
};

const jobTitleStylesReactSelect = {
  control: (provided, state) => ({
    ...provided,
    width: 200,
    minHeight: 30,
    marginLeft: "26px",
    borderRadius: "0px",
    boxShadow: state.isFocused ? `0 0 0 .5px black` : provided.boxShadow,
    borderColor: state.isFocused ? `black` : provided.borderColor,
    "&:hover": {
      borderColor: state.isFocused ? `black` : provided.borderColor,
    },
  }),
};

const userStylesReactSelect = {
  control: (provided, state) => ({
    ...provided,
    width: 200,
    minHeight: 30,
    marginLeft: "84px",
    borderRadius: "0px",
    boxShadow: state.isFocused ? `0 0 0 .5px black` : provided.boxShadow,
    borderColor: state.isFocused ? `black` : provided.borderColor,
    "&:hover": {
      borderColor: state.isFocused ? `black` : provided.borderColor,
    },
  }),
};

const AddAccess = ({ isOpen, onDismiss, accesses, setAccesses }) => {
  const { SweetAlert: SweetAlertInPanel } = SweetAlerts(
    "#RestrictedAccess",
    true
  );

  const { appSettings, setAppSettings } = useSttings();
  const { allUsers } = useFields();
  // Access states
  const [accessName, setAccessName] = useState("");
  const [accessType, setAccessType] = useState("Include");
  const [proprties, setProperties] = useState([]);

  //job title
  const [jobTitles, setJobTitles] = useState([]);
  const [jobTitleContains, setJobTitleContains] = useState("");
  const [jobTitleCondition, setJobTitleCondition] = useState("or");

  // location
  const [locations, setLocations] = useState([]);
  const [locationContains, setLocationContains] = useState("");
  const [locationCondition, setLocationCondition] = useState("or");

  // department
  const [departments, setDepartments] = useState([]);
  const [departmentContains, setDepartmentContains] = useState("");
  const [departmentCondition, setDepartmentCondition] = useState("or");

  // user
  const [user, setUser] = useState<any>([]);
  const [userCondition, setUserCondition] = useState("or");
  const [userContains, setUserContains] = useState("");

  //Active
  const [active, setActive] = useState(true);

  const resetForm = () => {
    setAccessName("");
    setAccessType("Include");
    setProperties([]);

    setJobTitles([]);
    setJobTitleContains("");
    setJobTitleCondition("or");

    setLocations([]);
    setLocationContains("");
    setLocationCondition("or");

    setDepartments([]);
    setDepartmentContains("");
    setDepartmentCondition("or");

    setUser([]);
    setUserCondition("or");
    setUserContains("");
  };

  function getCondition(order, index) {
    let res = false;
    let nextFields;
    for (let i = index + 1; i < order.length; i++) {
      switch (order[i]) {
        case "department":
          nextFields = departments.length
            ? departments
            : departmentContains
            ? [departmentContains]
            : [];

          if (nextFields.length) {
            return true;
          }
          break;
        case "location":
          nextFields = locations.length
            ? locations
            : locationContains
            ? [locationContains]
            : [];
          if (nextFields.length) {
            return true;
          }
          break;
        case "jobtitle":
          nextFields = jobTitles.length
            ? jobTitles
            : jobTitleContains
            ? [jobTitleContains]
            : [];
          if (nextFields.length) {
            return true;
          }
          break;
        case "user":
          nextFields = user.length ? user : [];
          if (nextFields.length) {
            return true;
          }
          break;
        default:
          break;
      }
    }

    return false;
  }

  function descriptionText(order) {
    let properties = properitesOption.map((item) => item?.label).join(", ");
    let desMsg = "Show " + properties;
    order.forEach((item, index) => {
      let msg, contmsg;
      switch (item) {
        case "department":
          msg =
            accessType == "Include"
              ? "is "
              : accessType == "Exclude"
              ? "is not "
              : "";
          desMsg += `${
            departments.length
              ? " if department(s) " +
                msg +
                departments.map((item) => item?.value).join(", ")
              : ""
          }`;
          contmsg =
            accessType == "Include"
              ? ""
              : accessType == "Exclude"
              ? " not "
              : "";
          if (!departments.length) {
            desMsg += `${
              departmentContains != ""
                ? " department " + contmsg + "contains " + departmentContains
                : ""
            } `;
          } else {
            desMsg += `${
              departmentContains != ""
                ? " or department " + contmsg + "contains " + departmentContains
                : ""
            } `;
          }
          if (departments.length || departmentContains != "") {
            if (getCondition(order, index)) {
              desMsg += " " + departmentCondition;
            }
          }
          break;
        case "location":
          msg =
            accessType == "Include"
              ? "is "
              : accessType == "Exclude"
              ? "is not "
              : "";
          desMsg += `${
            locations.length
              ? " if location(s) " +
                msg +
                locations.map((item) => item?.value).join(", ")
              : ""
          }`;
          contmsg =
            accessType == "Include"
              ? ""
              : accessType == "Exclude"
              ? " not "
              : "";
          if (!locations.length) {
            desMsg += `${
              locationContains != ""
                ? " location " + contmsg + "contains " + locationContains
                : ""
            }`;
          } else {
            desMsg += `${
              locationContains != ""
                ? " or location " + contmsg + "contains " + locationContains
                : ""
            }`;
          }
          if (locations.length || locationContains != "") {
            if (getCondition(order, index)) {
              desMsg += " " + locationCondition;
            }
          }
          break;
        case "jobtitle":
          msg =
            accessType == "Include"
              ? "is "
              : accessType == "Exclude"
              ? "is not "
              : "";
          desMsg += `${
            jobTitles.length
              ? " if jobtitle(s) " +
                msg +
                jobTitles.map((item) => item?.value).join(", ")
              : ""
          }`;
          contmsg =
            accessType == "Include"
              ? ""
              : accessType == "Exclude"
              ? "is not "
              : "";
          if (!jobTitles.length) {
            desMsg += `${
              jobTitleContains != ""
                ? " jobtitle " + contmsg + "contains " + jobTitleContains
                : ""
            } `;
          } else {
            desMsg += `${
              jobTitleContains != ""
                ? " or jobtitle " + contmsg + "contains " + jobTitleContains
                : ""
            }`;
          }
          if (jobTitles.length || jobTitleContains != "") {
            let isAndOr = getCondition(order, index);
            if (isAndOr) {
              desMsg += " " + jobTitleCondition;
            }
          }
          break;
        case "user":
          if (user.length) {
            msg =
              accessType == "Include"
                ? "is "
                : accessType == "Exclude"
                ? "is not "
                : "";
            desMsg += " if user " + msg + user.map((val) => val).join(",");
          }
          if (user.length || userCondition != "") {
            if (getCondition(order, index)) {
              desMsg += " " + userCondition;
            }
          }
          break;
        default:
          break;
      }
    });
    return desMsg;
  }

  const choiceOptions: IChoiceGroupOptionProps[] = [
    { key: "Include", text: "Include" },
    { key: "Exclude", text: "Exclude" },
  ];

  const AndOrOptions: any = [
    { key: "or", text: "or" },
    { key: "and", text: "and" },
  ];

  const properitesOption = [
    { value: "Projects", label: "Projects" },
    { value: "Hobbies", label: "Hobbies" },
    { value: "DOB", label: "Date of Birth" },
    { value: "DOJ", label: "Date of Joining" },
    { value: "Skills", label: "Skills" },
    { value: "About_Me", label: "About Me" },
    { value: "firstName", label: "First Name" },
    { value: "lastName", label: "Last Name" },
    { value: "name", label: "Full Name" },
    { value: "email", label: "Email" },
    { value: "job", label: "Job Title" },
    { value: "department", label: "Department" },
    { value: "workphone", label: "Work Phone" },
    { value: "mobile", label: "Mobile" },
    { value: "manager", label: "Manager" },
    { value: "employeeid", label: "Employee ID" },
    { value: "costcenter", label: "Cost Center" },
    { value: "buildingid", label: "Building ID" },
    { value: "floorname", label: "Floor Name" },
    { value: "floorsection", label: "Floor Section" },
    { value: "location", label: "Location" },
    { value: "address", label: "Address" },
  ];

  const [items, setItems] = useState([
    {
      id: "1",
      label: "If users' Department is",
      name: "department",
      MultiSelectOptions: [],
      value: departments,
    },
    {
      id: "2",
      label: "If users' Location is",
      name: "location",
      MultiSelectOptions: [],
      value: locations,
    },
    {
      id: "3",
      label: "If users' JobTitle is",
      name: "jobTitle",
      MultiSelectOptions: [],
      value: jobTitles,
    },
    {
      id: "4",
      label: "If users is",
      name: "user",
      MultiSelectOptions: [],
      value: user,
    },
  ]);

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    const reorderedItems = Array.from(items);
    const [movedItem] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, movedItem);
    setItems(reorderedItems);
  };

  const handleMultiSelect = (value, name) => {
    if (name === "department") {
      setDepartments(value);
    }
    if (name === "location") {
      setLocations(value);
    }
    if (name === "jobTitle") {
      setJobTitles(value);
    }
    if (name === "user") {
      setUser(value);
    }
  };

  const handleContains = (value, name) => {
    if (name === "department") {
      setDepartmentContains(value);
    }
    if (name === "location") {
      setLocationContains(value);
    }
    if (name === "jobTitle") {
      setJobTitleContains(value);
    }
    if (name === "user") {
      setUserContains(value);
    }
  };

  const handleTypeChange = (value, name) => {
    if (name === "department") {
      setDepartmentCondition(value);
    }
    if (name === "location") {
      setLocationCondition(value);
    }
    if (name === "jobTitle") {
      setJobTitleCondition(value);
    }
    if (name === "user") {
      setUserCondition(value);
    }
  };

  const getRadioValue = () => {
    let radioValues = {};
    items.map((item) => {
      if (item.name == "department") {
        radioValues["department"] = departmentCondition;
      } else if (item.name == "location") {
        radioValues["location"] = locationCondition;
      } else if (item.name == "jobTitle") {
        radioValues["jobTitle"] = jobTitleCondition;
      } else if (item.name == "user") {
        radioValues["user"] = userCondition;
      }
    });
    return radioValues;
  };

  function generateRandomId(length = 4) {
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

  const save = () => {
    if (accessName.length < 1 || proprties.length < 1) {
      SweetAlertInPanel("error", "Name and Proprties are required");
      return;
    }

    const radioValues = getRadioValue();

    const access = {
      accessId: generateRandomId(),
      accessName: accessName,
      accessType: accessType,
      proprties: proprties,
      active: active,
      description: descriptionText(items),
      departmentCriteria: {
        departments,
        departmentContains,
        departmentCondition,
      },
      jobTitleCriteria: {
        jobTitles,
        jobTitleContains,
        jobTitleCondition,
      },
      locationCriteria: {
        locations,
        locationContains,
        locationCondition,
      },
      userCriteria: {
        users: user,
        userContains,
        userCondition,
      },
      radioValue: radioValues,
    };

    const setting = {
      ...appSettings,
      [KEY]: [...accesses, access],
    };

    setAccesses([...accesses, access]);
    updateSettingJson(SETTING_LIST, setting);

    setAppSettings(setting);
    resetForm();
    SweetAlertInPanel("success", "Access created");
  };

  const callback = () => {
    const departments = allUsers.map((x: any) => ({
      value: x.department,
      label: x.department,
    }));
    const locations = allUsers.map((x: any) => ({
      value: x.location,
      label: x.location,
    }));
    const jobs = allUsers.map((x: any) => ({ value: x.job, label: x.job }));
    const users = allUsers.map((x: any) => ({ value: x.email, label: x.name }));

    setItems([
      {
        id: "1",
        label: "If users' Department is",
        name: "department",
        MultiSelectOptions: departments,
        value: departments,
      },
      {
        id: "2",
        label: "If users' Location is",
        name: "location",
        MultiSelectOptions: locations,
        value: locations,
      },
      {
        id: "3",
        label: "If users' JobTitle is",
        name: "jobTitle",
        MultiSelectOptions: jobs,
        value: jobTitles,
      },
      {
        id: "4",
        label: "If users is",
        name: "user",
        MultiSelectOptions: users,
        value: user,
      },
    ]);
  };

  useEffect(callback, []);

  return (
    <div>
      <Panel
        type={PanelType.custom}
        customWidth="750px"
        isOpen={isOpen}
        onDismiss={() => onDismiss(false)}
        headerText="Add Restricted Access"
      >
        <div id="RestrictedAccess">
          <Label required>Restricted Asscss Name</Label>
          <TextField
            value={accessName}
            onChange={(e: any) => setAccessName(e.target.value)}
            placeholder="Enter Name"
          />
        </div>
        <div>
          <Label required>Include / Exclude access based on selection</Label>
          <li>
            If exclude is selected, certain selected proprties will not be shown
            to the excuded users
          </li>
          <li>
            if include is selected, certain selected proprties of employees
            directory will be visible to selected users even though in settings
            those proprties are marked as hidden or turned off.
          </li>
          <ChoiceGroup
            options={choiceOptions}
            defaultSelectedKey={"Include"}
            value={accessType}
            onChange={(e: any, option) => setAccessType(option.key)}
            selectedKey={accessType}
            styles={ChoiceGroupStyles}
            required
          />
        </div>
        <div>
          <Label required>Select Employee Directory's Properties</Label>
          <ReactSelect
            isMulti
            options={properitesOption}
            value={proprties}
            onChange={(e: any[]) => setProperties(e)}
          />
        </div>
        <div>
          <Label required>
            Select user based on any of the below criteria(s)
          </Label>
          <div>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided: any) => (
                  <ul
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{}}
                  >
                    {items.map((x, index) => {
                      return (
                        <Draggable key={x.id} draggableId={x.id} index={index}>
                          {(provided: any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                borderRadius: 4,
                                ...provided.draggableProps.style,
                              }}
                            >
                              <div style={{ display: "flex", gap: "10px" }}>
                                <Label
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "center",
                                  }}
                                >
                                  <Icon iconName="GripperDotsVertical" />
                                  <div style={{ whiteSpace: "nowrap" }}>
                                    {x.label}
                                  </div>
                                </Label>
                                <ReactSelect
                                  options={x.MultiSelectOptions}
                                  value={
                                    (x.name === "department" && departments) ||
                                    (x.name === "location" && locations) ||
                                    (x.name === "jobTitle" && jobTitles) ||
                                    (x.name === "user" && user)
                                  }
                                  isMulti
                                  onChange={(value) =>
                                    handleMultiSelect(value, x.name)
                                  }
                                  styles={
                                    (x.name === "department" && departmentStylesReactSelect) ||
                                    (x.name === "location" && locationStylesReactSelect) ||
                                    (x.name === "jobTitle" && jobTitleStylesReactSelect) ||
                                    (x.name === "user" && userStylesReactSelect)
                                  }
                                />
                                <Label style={{ whiteSpace: "nowrap" }}>
                                  or contains
                                </Label>
                                <TextField
                                  value={
                                    (x.name === "department" &&
                                      departmentContains) ||
                                    (x.name === "location" &&
                                      locationContains) ||
                                    (x.name === "jobTitle" &&
                                      jobTitleContains) ||
                                    (x.name === "user" && userContains)
                                  }
                                  onChange={(e: any) =>
                                    handleContains(e.target.value, x.name)
                                  }
                                />
                              </div>
                              {index !== 3 && (
                                <ChoiceGroup
                                  options={AndOrOptions}
                                  styles={ChoiceGroupStyles}
                                  onChange={(e: any, option: any) => {
                                    handleTypeChange(option.key, x.name);
                                  }}
                                  value={
                                    (x.name === "department" &&
                                      departmentCondition) ||
                                    (x.name === "location" &&
                                      locationCondition) ||
                                    (x.name === "jobTitle" &&
                                      jobTitleCondition) ||
                                    (x.name === "user" && userCondition)
                                  }
                                  selectedKey={
                                    (x.name === "department" &&
                                      departmentCondition) ||
                                    (x.name === "location" &&
                                      locationCondition) ||
                                    (x.name === "jobTitle" &&
                                      jobTitleCondition) ||
                                    (x.name === "user" && userCondition)
                                  }
                                  required
                                />
                              )}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              rowGap: "10px",
              flexDirection: "column",
            }}
          >
            <Checkbox
              checked={active}
              onChange={(e, v) => setActive(v)}
              label="Active"
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <PrimaryButton onClick={save}>Sava</PrimaryButton>
              <PrimaryButton
                onClick={() => {
                  resetForm();
                  onDismiss(false);
                }}
              >
                Cancel
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
};

const EditAccess = ({ isOpen, onDismiss, accesses, setAccesses, editItem }) => {
  const { SweetAlert: SweetAlertInPanel } = SweetAlerts(
    "#EditRestrictedAccess",
    true
  );

  const { appSettings, setAppSettings } = useSttings();
  const { allUsers } = useFields();
  // Access states
  const [accessName, setAccessName] = useState("");
  const [accessType, setAccessType] = useState("Include");
  const [accessId, setAccessId] = useState("");
  const [proprties, setProperties] = useState([]);

  //job title
  const [jobTitles, setJobTitles] = useState([]);
  const [jobTitleContains, setJobTitleContains] = useState("");
  const [jobTitleCondition, setJobTitleCondition] = useState("or");

  // location
  const [locations, setLocations] = useState([]);
  const [locationContains, setLocationContains] = useState("");
  const [locationCondition, setLocationCondition] = useState("or");

  // department
  const [departments, setDepartments] = useState([]);
  const [departmentContains, setDepartmentContains] = useState("");
  const [departmentCondition, setDepartmentCondition] = useState("or");

  // user
  const [user, setUser] = useState<any>([]);
  const [userCondition, setUserCondition] = useState("or");
  const [userContains, setUserContains] = useState("");

  //Active
  const [active, setActive] = useState(true);

  function getCondition(order, index) {
    let res = false;
    let nextFields;
    for (let i = index + 1; i < order.length; i++) {
      switch (order[i]) {
        case "department":
          nextFields = departments.length
            ? departments
            : departmentContains
            ? [departmentContains]
            : [];

          if (nextFields.length) {
            return true;
          }
          break;
        case "location":
          nextFields = locations.length
            ? locations
            : locationContains
            ? [locationContains]
            : [];
          if (nextFields.length) {
            return true;
          }
          break;
        case "jobtitle":
          nextFields = jobTitles.length
            ? jobTitles
            : jobTitleContains
            ? [jobTitleContains]
            : [];
          if (nextFields.length) {
            return true;
          }
          break;
        case "user":
          nextFields = user.length ? user : [];
          if (nextFields.length) {
            return true;
          }
          break;
        default:
          break;
      }
    }

    return false;
  }

  function descriptionText(order) {
    let properties = properitesOption.map((item) => item?.label).join(", ");
    let desMsg = "Show " + properties;
    order.forEach((item, index) => {
      let msg, contmsg;
      switch (item) {
        case "department":
          msg =
            accessType == "Include"
              ? "is "
              : accessType == "Exclude"
              ? "is not "
              : "";
          desMsg += `${
            departments.length
              ? " if department(s) " +
                msg +
                departments.map((item) => item?.value).join(", ")
              : ""
          }`;
          contmsg =
            accessType == "Include"
              ? ""
              : accessType == "Exclude"
              ? " not "
              : "";
          if (!departments.length) {
            desMsg += `${
              departmentContains != ""
                ? " department " + contmsg + "contains " + departmentContains
                : ""
            } `;
          } else {
            desMsg += `${
              departmentContains != ""
                ? " or department " + contmsg + "contains " + departmentContains
                : ""
            } `;
          }
          if (departments.length || departmentContains != "") {
            if (getCondition(order, index)) {
              desMsg += " " + departmentCondition;
            }
          }
          break;
        case "location":
          msg =
            accessType == "Include"
              ? "is "
              : accessType == "Exclude"
              ? "is not "
              : "";
          desMsg += `${
            locations.length
              ? " if location(s) " +
                msg +
                locations.map((item) => item?.value).join(", ")
              : ""
          }`;
          contmsg =
            accessType == "Include"
              ? ""
              : accessType == "Exclude"
              ? " not "
              : "";
          if (!locations.length) {
            desMsg += `${
              locationContains != ""
                ? " location " + contmsg + "contains " + locationContains
                : ""
            }`;
          } else {
            desMsg += `${
              locationContains != ""
                ? " or location " + contmsg + "contains " + locationContains
                : ""
            }`;
          }
          if (locations.length || locationContains != "") {
            if (getCondition(order, index)) {
              desMsg += " " + locationCondition;
            }
          }
          break;
        case "jobtitle":
          msg =
            accessType == "Include"
              ? "is "
              : accessType == "Exclude"
              ? "is not "
              : "";
          desMsg += `${
            jobTitles.length
              ? " if jobtitle(s) " +
                msg +
                jobTitles.map((item) => item?.value).join(", ")
              : ""
          }`;
          contmsg =
            accessType == "Include"
              ? ""
              : accessType == "Exclude"
              ? "is not "
              : "";
          if (!jobTitles.length) {
            desMsg += `${
              jobTitleContains != ""
                ? " jobtitle " + contmsg + "contains " + jobTitleContains
                : ""
            } `;
          } else {
            desMsg += `${
              jobTitleContains != ""
                ? " or jobtitle " + contmsg + "contains " + jobTitleContains
                : ""
            }`;
          }
          if (jobTitles.length || jobTitleContains != "") {
            let isAndOr = getCondition(order, index);
            if (isAndOr) {
              desMsg += " " + jobTitleCondition;
            }
          }
          break;
        case "user":
          if (user.length) {
            msg =
              accessType == "Include"
                ? "is "
                : accessType == "Exclude"
                ? "is not "
                : "";
            desMsg += " if user " + msg + user.map((val) => val).join(",");
          }
          if (user.length || userCondition != "") {
            if (getCondition(order, index)) {
              desMsg += " " + userCondition;
            }
          }
          break;
        default:
          break;
      }
    });
    return desMsg;
  }

  const choiceOptions: IChoiceGroupOptionProps[] = [
    { key: "Include", text: "Include" },
    { key: "Exclude", text: "Exclude" },
  ];

  const AndOrOptions: any = [
    { key: "or", text: "or" },
    { key: "and", text: "and" },
  ];

  const properitesOption = [
    { value: "Projects", label: "Projects" },
    { value: "Hobbies", label: "Hobbies" },
    { value: "DOB", label: "Date of Birth" },
    { value: "DOJ", label: "Date of Joining" },
    { value: "Skills", label: "Skills" },
    { value: "About_Me", label: "About Me" },
    { value: "firstName", label: "First Name" },
    { value: "lastName", label: "Last Name" },
    { value: "name", label: "Full Name" },
    { value: "email", label: "Email" },
    { value: "job", label: "Job Title" },
    { value: "department", label: "Department" },
    { value: "workphone", label: "Work Phone" },
    { value: "mobile", label: "Mobile" },
    { value: "manager", label: "Manager" },
    { value: "employeeid", label: "Employee ID" },
    { value: "costcenter", label: "Cost Center" },
    { value: "buildingid", label: "Building ID" },
    { value: "floorname", label: "Floor Name" },
    { value: "floorsection", label: "Floor Section" },
    { value: "location", label: "Location" },
    { value: "address", label: "Address" },
  ];

  const [items, setItems] = useState([
    {
      id: "1",
      label: "If users' Department is",
      name: "department",
      MultiSelectOptions: [],
      value: departments,
    },
    {
      id: "2",
      label: "If users' Location is",
      name: "location",
      MultiSelectOptions: [],
      value: locations,
    },
    {
      id: "3",
      label: "If users' JobTitle is",
      name: "jobTitle",
      MultiSelectOptions: [],
      value: jobTitles,
    },
    {
      id: "4",
      label: "If users is",
      name: "user",
      MultiSelectOptions: [],
      value: user,
    },
  ]);

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    const reorderedItems = Array.from(items);
    const [movedItem] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, movedItem);
    setItems(reorderedItems);
  };

  const handleMultiSelect = (value, name) => {
    if (name === "department") {
      setDepartments(value);
    }
    if (name === "location") {
      setLocations(value);
    }
    if (name === "jobTitle") {
      setJobTitles(value);
    }
    if (name === "user") {
      setUser(value);
    }
  };

  const handleContains = (value, name) => {
    if (name === "department") {
      setDepartmentContains(value);
    }
    if (name === "location") {
      setLocationContains(value);
    }
    if (name === "jobTitle") {
      setJobTitleContains(value);
    }
    if (name === "user") {
      setUserContains(value);
    }
  };

  const handleTypeChange = (value, name) => {
    if (name === "department") {
      setDepartmentCondition(value);
    }
    if (name === "location") {
      setLocationCondition(value);
    }
    if (name === "jobTitle") {
      setJobTitleCondition(value);
    }
    if (name === "user") {
      setUserCondition(value);
    }
  };

  const getRadioValue = () => {
    let radioValues = {};
    items.map((item) => {
      if (item.name == "department") {
        radioValues["department"] = departmentCondition;
      } else if (item.name == "location") {
        radioValues["location"] = locationCondition;
      } else if (item.name == "jobTitle") {
        radioValues["jobTitle"] = jobTitleCondition;
      } else if (item.name == "user") {
        radioValues["user"] = userCondition;
      }
    });
    return radioValues;
  };

  const update = () => {
    if (accessName.length < 1 || proprties.length < 1) {
      SweetAlertInPanel("error", "Name and Proprties are required");
      return;
    }

    const radioValues = getRadioValue();

    const access = {
      accessId: accessId,
      accessName: accessName,
      accessType: accessType,
      proprties: proprties,
      active: active,
      description: descriptionText(items),
      departmentCriteria: {
        departments,
        departmentContains,
        departmentCondition,
      },
      jobTitleCriteria: {
        jobTitles,
        jobTitleContains,
        jobTitleCondition,
      },
      locationCriteria: {
        locations,
        locationContains,
        locationCondition,
      },
      userCriteria: {
        users: user,
        userContains,
        userCondition,
      },
      radioValue: radioValues,
    };

    const index = accesses.findIndex((x) => x.accessId === accessId);
    const newacc = (accesses[index] = access);

    const setting = {
      ...appSettings,
      [KEY]: accesses,
    };
    setAccesses(accesses);
    updateSettingJson(SETTING_LIST, setting);
    setAppSettings(setting);

    SweetAlertInPanel("success", "Access updated successfully");
    setTimeout(() => onDismiss(false), 3500);
  };

  const callback = () => {
    const departments = allUsers.map((x: any) => ({
      value: x.department,
      label: x.department,
    }));
    const locations = allUsers.map((x: any) => ({
      value: x.location,
      label: x.location,
    }));
    const jobs = allUsers.map((x: any) => ({ value: x.job, label: x.job }));
    const users = allUsers.map((x: any) => ({ value: x.email, label: x.name }));

    setItems([
      {
        id: "1",
        label: "If users' Department is",
        name: "department",
        MultiSelectOptions: departments,
        value: departments,
      },
      {
        id: "2",
        label: "If users' Location is",
        name: "location",
        MultiSelectOptions: locations,
        value: locations,
      },
      {
        id: "3",
        label: "If users' JobTitle is",
        name: "jobTitle",
        MultiSelectOptions: jobs,
        value: jobTitles,
      },
      {
        id: "4",
        label: "If users is",
        name: "user",
        MultiSelectOptions: users,
        value: user,
      },
    ]);
  };

  const setEditValues = () => {
    const item = accesses.find((x: any) => x.accessId === editItem.accessId);

    setAccessName(item.accessName);
    setAccessType(item.accessType);
    setProperties(item.proprties);
    setAccessId(item.accessId);
    setActive(item.active);

    setJobTitles(item.jobTitleCriteria.jobTitles);
    setJobTitleContains(item.jobTitleCriteria.jobTitleContains);
    setJobTitleCondition(item.jobTitleCriteria.jobTitleCondition);

    setLocations(item.locationCriteria.locations);
    setLocationContains(item.locationCriteria.locationContains);
    setLocationCondition(item.locationCriteria.locationCondition);

    setDepartments(item.departmentCriteria.departments);
    setDepartmentContains(item.departmentCriteria.departmentContains);
    setDepartmentCondition(item.departmentCriteria.departmentCondition);

    setUser(item.userCriteria.users);
    setUserCondition(item.userCriteria.userCondition);
    setUserContains(item.userCriteria.userContains);
  };

  useEffect(() => {
    callback();
    setEditValues();
  }, []);

  return (
    <div>
      <Panel
        type={PanelType.custom}
        customWidth="750px"
        isOpen={isOpen}
        onDismiss={() => onDismiss(false)}
        headerText="Edit Restricted Access"
      >
        <div id="EditRestrictedAccess">
          <Label required>Restricted Asscss Name</Label>
          <TextField
            value={accessName}
            onChange={(e: any) => setAccessName(e.target.value)}
            placeholder="Enter Name"
          />
        </div>
        <div>
          <Label required>Include / Exclude access based on selection</Label>
          <li>
            If exclude is selected, certain selected proprties will not be shown
            to the excuded users
          </li>
          <li>
            if include is selected, certain selected proprties of employees
            directory will be visible to selected users even though in settings
            those proprties are marked as hidden or turned off.
          </li>
          <ChoiceGroup
            options={choiceOptions}
            defaultSelectedKey={"Include"}
            value={accessType}
            onChange={(e: any, option) => setAccessType(option.key)}
            selectedKey={accessType}
            styles={ChoiceGroupStyles}
            required
          />
        </div>
        <div>
          <Label required>Select Employee Directory's Properties</Label>
          <ReactSelect
            isMulti
            options={properitesOption}
            value={proprties}
            onChange={(e: any[]) => setProperties(e)}
          />
        </div>
        <div>
          <Label required>
            Select user based on any of the below criteria(s)
          </Label>
          <div>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided: any) => (
                  <ul
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{}}
                  >
                    {items.map((x, index) => {
                      return (
                        <Draggable key={x.id} draggableId={x.id} index={index}>
                          {(provided: any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                borderRadius: 4,
                                ...provided.draggableProps.style,
                              }}
                            >
                              <div style={{ display: "flex", gap: "10px" }}>
                                <Label
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "center",
                                  }}
                                >
                                  <Icon iconName="GripperDotsVertical" />
                                  <div style={{ whiteSpace: "nowrap" }}>
                                    {x.label}
                                  </div>
                                </Label>
                                <ReactSelect
                                  options={x.MultiSelectOptions}
                                  value={
                                    (x.name === "department" && departments) ||
                                    (x.name === "location" && locations) ||
                                    (x.name === "jobTitle" && jobTitles) ||
                                    (x.name === "user" && user)
                                  }
                                  isMulti
                                  onChange={(value) =>
                                    handleMultiSelect(value, x.name)
                                  }
                                  styles={
                                    (x.name === "department" && departmentStylesReactSelect) ||
                                    (x.name === "location" && locationStylesReactSelect) ||
                                    (x.name === "jobTitle" && jobTitleStylesReactSelect) ||
                                    (x.name === "user" && userStylesReactSelect)
                                  }
                                />
                                <Label style={{ whiteSpace: "nowrap" }}>
                                  or contains
                                </Label>
                                <TextField
                                  value={
                                    (x.name === "department" &&
                                      departmentContains) ||
                                    (x.name === "location" &&
                                      locationContains) ||
                                    (x.name === "jobTitle" &&
                                      jobTitleContains) ||
                                    (x.name === "user" && userContains)
                                  }
                                  onChange={(e: any) =>
                                    handleContains(e.target.value, x.name)
                                  }
                                />
                              </div>
                              {index !== 3 && (
                                <ChoiceGroup
                                  options={AndOrOptions}
                                  styles={ChoiceGroupStyles}
                                  onChange={(e: any, option: any) => {
                                    handleTypeChange(option.key, x.name);
                                  }}
                                  value={
                                    (x.name === "department" &&
                                      departmentCondition) ||
                                    (x.name === "location" &&
                                      locationCondition) ||
                                    (x.name === "jobTitle" &&
                                      jobTitleCondition) ||
                                    (x.name === "user" && userCondition)
                                  }
                                  selectedKey={
                                    (x.name === "department" &&
                                      departmentCondition) ||
                                    (x.name === "location" &&
                                      locationCondition) ||
                                    (x.name === "jobTitle" &&
                                      jobTitleCondition) ||
                                    (x.name === "user" && userCondition)
                                  }
                                  required
                                />
                              )}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              rowGap: "10px",
              flexDirection: "column",
            }}
          >
            <Checkbox
              checked={active}
              onChange={(e, v) => setActive(v)}
              label="Active"
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <PrimaryButton onClick={update}>Update</PrimaryButton>
              <PrimaryButton onClick={() => onDismiss(false)}>
                Cancel
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
};

export default RestrictedAccess;
