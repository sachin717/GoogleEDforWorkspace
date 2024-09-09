import {
  Checkbox,
  Dropdown,
  IconButton,
  Link,
  Panel,
  PanelType,
  Pivot,
  PivotItem,
  PrimaryButton,
  TextField,
} from "@fluentui/react";
import { useEffect, useState } from "react";
import { useFields } from "../../context/store";
import { useLanguage } from "../../Language/LanguageContext";
import { SweetAlerts } from "../SelectSource/Utils/SweetAlert";
import getschemasfields from "../SelectSource/getCustomSchema";
import {
  removeDuplicatesFromObject,
  updateSettingData,
} from "../Helpers/HelperFunctions";
import { useSttings } from "../SelectSource/store";

const ExecutiveAssistantRelationship = ({ isOpen, onDismiss }) => {
  const { SweetAlert: SweetAlertExecutiveAssistant } = SweetAlerts(
    "#ExecutiveAssistant",
    true
  );
  const { SweetAlert: SweetAlertEditPanel } = SweetAlerts(
    "#edit-EAR-panel",
    true
  );
  // edit-EAR-panel
  const { translation } = useLanguage();
  const { assistant } = useFields();
  const [selectedEmail, setSelectedEmail] = useState<any>("");
  const [displayName, setDisplayName] = useState("");
  const [userWithAssistant, setUsersWithAssistant] = useState([]);

  const [openEditPanel, setEditOpenPanel] = useState(false);
  const [editItem, setEditItem] = useState<any>({
    displayName:"",
    email:""
  });
  const [customFields, setCustomFields] = useState<any>([]);
  const { appSettings, setAppSettings } = useSttings();
  useEffect(() => {
    const ListData = async () => {
      try {
        const list = await getschemasfields();
        const fieldNames = list.map((item) => ({
          key: item.fieldName,
          text: item.displayname,
        }));
        console.log(fieldNames, "field names");
        setCustomFields(fieldNames);
      } catch (error) {
        console.error("Error fetching list data:", error);
      }
    };
    setUsersWithAssistant(assistant);
    ListData();
  }, []);
  const handelEdit = (item: any) => {
    setEditItem(item);
    setEditOpenPanel(true);
  };

  const handleUpadte = () => {
    if (editItem.email.length == 0 || editItem?.displayName?.length == 0) {
      SweetAlertEditPanel("error","All fields are required")
    }else{
      const KEY = "AssistantData";
      const index = userWithAssistant.findIndex(
        (x) => x.email === editItem.email
      );
      userWithAssistant[index] = editItem;
      const setting = { ...appSettings, [KEY]: userWithAssistant };
      updateSettingData(setting);
      setAppSettings(setting);
      setUsersWithAssistant(userWithAssistant);
      SweetAlertEditPanel("success", translation.SettingSaved);
    }
  };

  const handleSubmit = () => {
    if (selectedEmail && displayName?.length) {
      const KEY = "AssistantData";
      const x = removeDuplicatesFromObject(
        [
          ...userWithAssistant,
          { email: selectedEmail, displayName: displayName },
        ],
        "email"
      );
      const data = { email: selectedEmail, displayName: displayName };
      setUsersWithAssistant(x);
      const setting = {
        ...appSettings,
        [KEY]: x,
      };

      updateSettingData(setting);
      setAppSettings(setting);

      setSelectedEmail("");
      setDisplayName("");
      SweetAlertExecutiveAssistant("success", translation.SettingSaved);
    } else {
      SweetAlertExecutiveAssistant("info", "Please select property");
    }
  };

  return (
    <div>
      <Panel
        isOpen={isOpen}
        onDismiss={() => onDismiss(false)}
        type={PanelType.medium}
        headerText={translation.Executive ?? "Executive Assistant relationship"}
        onOuterClick={() => {}}
      >
        <div>
          <div id="ExecutiveAssistant">
            <p>
              A custom column can be used to add the assistant's email ID to
              build the assistant's association with executives. Once a custom
              column is defined, Open each executive's mailbox from{" "}
              <Link
                target="_blank"
                href="https://admin.exchange.microsoft.com/#/mailboxes"
              >
                https://admin.exchange.microsoft.com/#/mailboxes
              </Link>{" "}
              and use the same custom column to add the assistant's email ID.
            </p>
          </div>
          <div>
            <Pivot>
              <PivotItem headerText={translation.Add ?? "Add"}>
                <div>
                  <div
                    style={{ display: "flex", gap: "20px", margin: "10px 0px" }}
                  >
                    <Dropdown
                      label={translation.GoogleProperties ?? "Google Properties"}
                      placeholder={translation.Selectanoption ?? "Select an option"}
                      styles={{ root: { width: "50%" } }}
                      options={customFields}
                      selectedKey={selectedEmail}
                      onChange={(e, option) => setSelectedEmail(option.key)}
                    />
                    <TextField
                      label={translation.Displayname ?? "Display name"}
                      styles={{ root: { width: "50%" } }}
                      value={displayName}
                      onChange={(e: any) => setDisplayName(e.target.value)}
                    />
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <PrimaryButton onClick={handleSubmit}>{translation.Submit ?? "Submit"}</PrimaryButton>
                  </div>
                </div>
                <div>
                  <table className={"excludeTable"}>
                    <thead>
                      <tr>
                      <th>{translation.Action?translation.Action:"Action"}</th>
                      <th>{translation.PropertyName?translation.PropertyName:"Property Name"}</th>
                      <th>{translation.Displayname?translation.Displayname:"Display name"}</th>
                      </tr>
                    </thead>
                    {userWithAssistant.length ? (
                      <tbody>
                        {userWithAssistant.map((x, i) => {
                          return (
                            <tr key={i}>
                              <td>
                                <IconButton
                                  onClick={() => handelEdit(x)}
                                  iconProps={{ iconName: "Edit" }}
                                />
                              </td>
                              <td>{x.email}</td>
                              <td>{x.displayName}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    ) : (
                      <tbody>
                        <tr>
                          <td colSpan={3}>{translation.NoRecordsFound?translation.NoRecordsFound:"No Records Found"}</td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                </div>
              </PivotItem>
              <PivotItem headerText={translation.Delete ?? "Delete"}>
                <Delete
                  userWithAssistant={userWithAssistant}
                  setUsersWithAssistant={setUsersWithAssistant}
                />
              </PivotItem>
            </Pivot>
          </div>
        </div>
      </Panel>
      <Panel
        onOuterClick={() => {}}
        type={PanelType.medium}
        isOpen={openEditPanel}
        onDismiss={() => setEditOpenPanel(false)}
      >
        <div id="edit-EAR-panel">
          <div style={{ display: "flex", gap: "20px", margin: "10px 0px" }}>
            <Dropdown
              label="Google Properties"
              placeholder="Select an option"
              styles={{ root: { width: "50%" } }}
              options={customFields}
              selectedKey={editItem.email}
              onChange={(e, option) =>
                setEditItem((prev: any) => ({ ...prev, email: option.key }))
              }
            />
            <TextField
              label="Display name"
              styles={{ root: { width: "50%" } }}
              value={editItem.displayName}
              onChange={(e: any) =>
                setEditItem((prev: any) => ({
                  ...prev,
                  displayName: e.target.value,
                }))
              }
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <PrimaryButton onClick={handleUpadte}>{translation.Update?translation.Update:"Update"}</PrimaryButton>
          </div>
        </div>
      </Panel>
    </div>
  );
};

const Delete = ({ userWithAssistant, setUsersWithAssistant }) => {
  const { translation } = useLanguage();
  const { appSettings, setAppSettings } = useSttings();
  const [selectedEmails, setSelectedEmails] = useState<any>([]);
  const { SweetAlert: SweetAlertExecutiveAssistantDelete } = SweetAlerts(
    "#ExecutiveAssistantDelete",
    true
  );
  const handelSelectEmail = (checked: boolean, email: string) => {
    if (checked) {
      setSelectedEmails((prev) => [...prev, email]);
    } else {
      const x = selectedEmails.filter((x) => x.email !== email);
      setSelectedEmails(x);
    }
  };

  const handleDelete = () => {
    if (selectedEmails?.length) {
      const KEY = "AssistantData";
      const deleted = userWithAssistant.filter((x) => {
        if (!selectedEmails.includes(x.email)) {
          return x;
        }
      });
      const setting = { ...appSettings, [KEY]: deleted };
      updateSettingData(setting);
      setAppSettings(setting);
      setUsersWithAssistant(deleted);
      SweetAlertExecutiveAssistantDelete("success", translation.SettingSaved);
    } else {
      SweetAlertExecutiveAssistantDelete("info", "Please select property");
    }
  };

  return (
    <div id="ExecutiveAssistantDelete">
      <table className={"excludeTable"}>
        <thead>
          <tr>
           <th>{translation.Action?translation.Action:"Action"}</th>
            <th>{translation.PropertyName?translation.PropertyName:"Property Name"}</th>
            <th>{translation.Displayname?translation.Displayname:"Display name"}</th>
          </tr>
        </thead>
        {userWithAssistant.length ? (
          <tbody>
            {userWithAssistant.map((x, i) => {
              return (
                <tr key={i}>
                  <td>
                    <Checkbox
                      onChange={(e, checked: boolean) =>
                        handelSelectEmail(checked, x.email)
                      }
                    />
                  </td>
                  <td>{x.email}</td>
                  <td>{x.displayName}</td>
                </tr>
              );
            })}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={3}>No Records Found</td>
            </tr>
          </tbody>
        )}
      </table>
      <div>
        <PrimaryButton onClick={handleDelete}>Delete</PrimaryButton>
      </div>
    </div>
  );
};

export default ExecutiveAssistantRelationship;
