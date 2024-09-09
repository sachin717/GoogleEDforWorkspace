import {
  Checkbox,
  ChoiceGroup,
  DetailsList,
  Dropdown,
  Icon,
  Label,
  Panel,
  PanelType,
  SelectionMode,
  TextField,
} from "@fluentui/react";
import { useLanguage } from "../../Language/LanguageContext";
import { PrimaryButton } from "office-ui-fabric-react";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
};

const RestrictedAccess = ({ isOpen, onDismiss }) => {
  const [opneAccess, setOpenAccess] = useState(false);
  const { translation } = useLanguage();

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
      fieldName: "name",
      minWidth: 100,
      maxWidth: 500,
    },
    {
      key: "column3",
      name: "Status",
      fieldName: "name",
      minWidth: 100,
      maxWidth: 200,
    },
    {
      key: "column4",
      name: "Action",
      fieldName: "name",
      minWidth: 100,
      maxWidth: 200,
    },
  ];

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
            items={[]}
            selectionMode={SelectionMode.none}
          />
        </div>
      </Panel>
      <AddAccess isOpen={opneAccess} onDismiss={setOpenAccess} />
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

const AddAccess = ({ isOpen, onDismiss }) => {
  const choiceOptions: any = [
    { kye: "Include", text: "Include" },
    { kye: "Exclude", text: "Exclude" },
  ];

  const AndOrOptions: any = [
    { kye: "or", text: "or" },
    { kye: "and", text: "and" },
  ];

  const jobTitleRow = (
    <div>
      <div style={{ display: "flex", gap: "10px" }}>
        <Label style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <Icon iconName="GripperDotsVertical" />
          <div style={{ whiteSpace: "nowrap" }}>If user's Job title is</div>
        </Label>
        <Dropdown
          placeholder="Select job title"
          styles={{ root: { width: "200px" } }}
          options={[]}
          onChange={() => {}}
        />
        <Label style={{ whiteSpace: "nowrap" }}>or contains</Label>
        <TextField value="" onChange={() => {}} />
      </div>
      <ChoiceGroup
        // value={choice}
        options={AndOrOptions}
        // defaultSelectedKey={"Include"}
        // onChange={handleChangeChoice}
        styles={ChoiceGroupStyles}
        required
      />
    </div>
  );

  const locationRow = (
    <div>
      <div style={{ display: "flex", gap: "10px" }}>
        <Label style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <Icon iconName="GripperDotsVertical" />
          <div style={{ whiteSpace: "nowrap" }}>If user's Location is</div>
        </Label>
        <Dropdown
          placeholder="Select Location"
          styles={{ root: { width: "200px" } }}
          options={[]}
          onChange={() => {}}
        />
        <Label style={{ whiteSpace: "nowrap" }}>or contains</Label>
        <TextField value="" onChange={() => {}} />
      </div>
      <ChoiceGroup
        // value={choice}
        options={AndOrOptions}
        // defaultSelectedKey={"Include"}
        // onChange={handleChangeChoice}
        styles={ChoiceGroupStyles}
        required
      />
    </div>
  );

  const departmentRow = (
    <div>
      <div style={{ display: "flex", gap: "10px" }}>
        <Label style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <Icon iconName="GripperDotsVertical" />
          <div style={{ whiteSpace: "nowrap" }}>If user's Department is</div>
        </Label>
        <Dropdown
          placeholder="Select Department"
          styles={{ root: { width: "200px" } }}
          options={[]}
          onChange={() => {}}
        />
        <Label style={{ whiteSpace: "nowrap" }}>or contains</Label>
        <TextField value="" onChange={() => {}} />
      </div>
      <ChoiceGroup
        // value={choice}
        options={AndOrOptions}
        // defaultSelectedKey={"Include"}
        // onChange={handleChangeChoice}
        styles={ChoiceGroupStyles}
        required
      />
    </div>
  );

  const userRow = (
    <div style={{ display: "flex", gap: "10px" }}>
      <Label style={{ display: "flex", gap: "10px" }}>
        <Icon iconName="GripperDotsVertical" />
        <div style={{ whiteSpace: "nowrap" }}>If user is</div>
      </Label>
      <div style={{ marginLeft: "60px" }}>
        <TextField
          styles={{ root: { width: "205px" } }}
          placeholder="Enter User"
        />
      </div>
    </div>
  );

  const initialItems = [
    { id: "1", content: jobTitleRow },
    { id: "2", content: locationRow },
    { id: "3", content: departmentRow },
    { id: "4", content: userRow },
  ];

  const handleChangeChoice = (e, value) => {
    console.log("event", { e, value });
  };

  const [items, setItems] = useState(initialItems);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    // If no destination (dropped outside of list), do nothing
    if (!destination) return;

    const reorderedItems = Array.from(items);
    const [movedItem] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, movedItem);

    setItems(reorderedItems);
  };

  return (
    <div>
      <Panel
        type={PanelType.custom}
        customWidth="750px"
        isOpen={isOpen}
        onDismiss={() => onDismiss(false)}
        headerText="Add Restricted Access"
      >
        <div>
          <Label required>Restricted Asscss Name</Label>
          <TextField placeholder="Enter Name" />
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
            // value={choice}
            options={choiceOptions}
            defaultSelectedKey={"Include"}
            onChange={handleChangeChoice}
            styles={ChoiceGroupStyles}
            required
          />
        </div>
        <div>
          <Label required>Select Employee Directory's Properties</Label>
          <Dropdown options={[]} onChange={(e) => {}} />
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
                    {items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided: any) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              padding: 16,
                              marginBottom: 8,
                              background: "#fff",
                              borderRadius: 4,
                              ...provided.draggableProps.style,
                            }}
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <div style={{marginTop:"10px", display:"flex", rowGap:"10px", flexDirection:"column"}}>
            <Checkbox label="Active"/>
            <div style={{display:"flex", gap:"10px"}}>
              <PrimaryButton>Sava</PrimaryButton>
              <PrimaryButton>Cancel</PrimaryButton>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
};

export default RestrictedAccess;
