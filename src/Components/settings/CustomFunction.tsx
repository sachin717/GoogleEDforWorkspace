import {
  Checkbox,
  Dropdown,
  IconButton,
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
import { useSttings } from "../SelectSource/store";
import { removeDuplicatesFromObject, updateSettingData } from "../Helpers/HelperFunctions";

const CustomFunction = ({
  isOpen,
  onDismiss,
}) => {
  const { FormatedUserData, } = useFields();
  const [options, setOptions] = useState([]);
  const { SweetAlert: SweetAlertCustomFn } = SweetAlerts("#customFn", true);
  const { SweetAlert: EditAlert } = SweetAlerts("#edit-panel", true);
  const { additionalManagers } = useFields();
  const { appSettings, setAppSettings } = useSttings();
  const { translation } = useLanguage();
  const [customFunction, setCustomFunction] = useState("");
  const [fetchedValue, setFetchedValue] = useState<any>("");
  const [data, setData] = useState([]);
  const [openEditPanel, setEditOpenPanel] = useState(false);
  const [editItem, setEditItem] = useState<any>({});
  const [customFields, setCustomFields] = useState([]);

  useEffect(() => {
    const ListData = async () => {
      try {
        const list = await getschemasfields();
        const fieldNames:any = list.map((item:any) => ({
          key: item.fieldName,
          text: item.fetchedValue,
        }));
        setCustomFields(fieldNames);
      } catch (error) {
        console.error("Error fetching list data:", error);
      }

    };
    setData(appSettings?.CustomFunctionData)
    ListData();
    // setData();
  }, []);

  useEffect(() => {
    let FilteredOptions = FormatedUserData.flatMap((item) => {
      return Object.keys(item).map((key) => ({ key, text: key }));
    });
    let res = removeDuplicatesFromObject(FilteredOptions, "key");
    setOptions(res);
  }, [FormatedUserData]);

  const handleEdit = (item) => {
    setEditItem(item);
    setEditOpenPanel(true);
  };

  const handleUpdate = () => {
    if (editItem.property) {
      const KEY = "CustomFunctionData";
      const index = data.findIndex(
        (x) => x.property === editItem.property
      );
      if (index !== -1) {
        data[index] = editItem;
        const setting = { ...appSettings, [KEY]: data };
        updateSettingData(setting);
        setAppSettings(setting);
        setData(data);
        EditAlert("success", translation.SettingSaved);
      }
    } else {
      SweetAlertCustomFn("info", "Please select property");
    }
  };

  const handleSubmit = () => {
    if (customFunction) {
      const KEY = "CustomFunctionData";
      let newUser = { property: customFunction, value: fetchedValue };
      const updatedList = removeDuplicatesFromObject(
        [...data, newUser],
        "property"
      );
      setData(updatedList);
      const setting = { ...appSettings, [KEY]: updatedList };
      updateSettingData(setting);
      setAppSettings(setting);
      setCustomFunction("");
      setFetchedValue("");
      SweetAlertCustomFn("success", translation.SettingSaved);
    } else {
      SweetAlertCustomFn("info", "Please select property");
    }
  };

  return (
    <div>
      <Panel
        isOpen={isOpen}
        onDismiss={() => onDismiss(false)}
        type={PanelType.medium}
        headerText={translation.Customfunction ?? "Custom function"}
        onOuterClick={() => {}}
      >
        <div id="customFn">
          <Pivot>
            <PivotItem headerText={translation.Add ?? "Add"}>
              <div>
                <div style={{ display: "flex", gap: "20px", margin: "10px 0px" }}>
                  <Dropdown
                    label={translation.GoogleProperties ?? "Google Properties"}
                    placeholder={translation.Selectanoption ?? "Select an option"}
                    styles={{ root: { width: "50%" } }}
                    options={options}
                    selectedKey={customFunction}
                    onChange={(e:any, option:any) => setCustomFunction(option.key)}
                  />
                  <TextField
                    label={translation.PropertyName ?? "Property Name"}
                    styles={{ root: { width: "50%" } }}
                    value={fetchedValue}
                    onChange={(e:any) => setFetchedValue(e.target.value)}
                  />
                </div>
                <div style={{ marginTop: "10px" }}>
                  <PrimaryButton onClick={handleSubmit}>{translation.Submit ?? "Submit"}</PrimaryButton>
                </div>
              </div>
              <div>
                <table className="excludeTable">
                  <thead>
                    <tr>
                      <th>{translation.Action ?? "Action"}</th>
                      <th>{translation.PropertyName ?? "Property Name"}</th>
                      <th>{translation.fetchedValue ?? "Display name"}</th>
                    </tr>
                  </thead>
                  {data.length ? (
                    <tbody>
                      {data.map((x, i) => (
                        <tr key={i}>
                          <td>
                            <IconButton
                              onClick={() => handleEdit(x)}
                              iconProps={{ iconName: "Edit" }}
                            />
                          </td>
                          <td>{x.property}</td>
                          <td>{x.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan={3}>{translation.NoRecordsFound ?? "No Records Found"}</td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </PivotItem>
            <PivotItem headerText={translation.Delete ?? "Delete"}>
              <Delete
                data={data}
                setData={setData}
                translation={translation}
              />
            </PivotItem>
          </Pivot>
        </div>
      </Panel>
      <Panel
        onOuterClick={() => {}}
        type={PanelType.medium}
        isOpen={openEditPanel}
        onDismiss={() => setEditOpenPanel(false)}
      >
        <div>
          <div id="edit-panel" style={{ display: "flex", gap: "20px", margin: "10px 0px" }}>
            <Dropdown
              label="Google Properties"
              placeholder="Select an option"
              styles={{ root: { width: "50%" } }}
              options={options}
              selectedKey={editItem.property}
              onChange={(e, option) =>
                setEditItem((prev) => ({ ...prev, property: option.key }))
              }
            />
            <TextField
              label="Display name"
              styles={{ root: { width: "50%" } }}
              value={editItem.fetchedValue}
              onChange={(e:any) =>
                setEditItem((prev) => ({ ...prev, fetchedValue: e.target.value }))
              }
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <PrimaryButton onClick={handleUpdate}>Update</PrimaryButton>
          </div>
        </div>
      </Panel>
    </div>
  );
};

const Delete = ({ data, setData, translation }) => {
  const [customFunctions, setCustomFunctions] = useState<any>([]);
  const { appSettings, setAppSettings } = useSttings();
  const { SweetAlert: deleteSweetAlert } = SweetAlerts("#delete-panel", true);

  const handleSelectEmail = (checked, property) => {
    setCustomFunctions((prev) =>
      checked ? [...prev, property] : prev.filter((x) => x !== property)
    );
  };

  const handleDelete = () => {
    if (customFunctions.length) {
      const KEY = "CustomFunctionData";
      const deleted = data.filter((x) => !customFunctions.includes(x.property));
      const setting = { ...appSettings, [KEY]: deleted };
      updateSettingData(setting);
      setAppSettings(setting);
      setData(deleted);
      deleteSweetAlert("success", translation.SettingSaved);
    } else {
      deleteSweetAlert("info", "Please select property");
    }
  };

  return (
    <div id="delete-panel">
      <table className="excludeTable">
        <thead>
          <tr>
            <th>{translation.Action ?? "Action"}</th>
            <th>{translation.PropertyName ?? "Property Name"}</th>
            <th>{translation.fetchedValue ?? "Display name"}</th>
          </tr>
        </thead>
        {data.length ? (
          <tbody>
            {data.map((x:any, i:number) => (
              <tr key={i}>
                <td>
                  <Checkbox
                    onChange={(e, checked) => handleSelectEmail(checked, x.property)}
                  />
                </td>
                <td>{x.property}</td>
                <td>{x.value}</td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={3}>{translation.NoRecordsFound ?? "No Records Found"}</td>
            </tr>
          </tbody>
        )}
      </table>
      <div>
        <PrimaryButton onClick={handleDelete}>{translation.delete ?? "Delete"}</PrimaryButton>
      </div>
    </div>
  );
};

export default CustomFunction;
