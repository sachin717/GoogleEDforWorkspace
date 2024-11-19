
import React, { useEffect, useState } from 'react';
import { Dropdown, IDropdownOption, IDropdownStyles } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { useFields } from '../../context/store';
import { removeDuplicatesFromObject } from '../Helpers/HelperFunctions';
import { Icon, Label } from 'office-ui-fabric-react';
import { PrimaryButton } from '@fluentui/react';
import { v4 as uuidv4 } from 'uuid'; // Importing UUID
import CustomEdit from './CustomEdit';
import { SETTING_LIST, updateSettingJson } from '../../api/storage';
import { useSttings } from './store';
import { useLanguage } from '../../Language/LanguageContext';

function CustomAdd(props) {
  const { FormatedUserData } = useFields();
  const {translation}=useLanguage();
  const { appSettings, setAppSettings } = useSttings();
  const [options, setOptions] = useState<IDropdownOption[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [data, setData] = useState([]);
  const [propertyName, setPropertyName] = useState<IDropdownOption | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [openEditPanel, setOpenEditPanel] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // New state for editing item

  const dropdownstyles: Partial<IDropdownStyles> = {
    callout: {
      minWidth: "270px !important",
      width: "290px !important",
      maxWidth: "300px !important",
    },
  };
  useEffect(()=>{
    let isCustomField=appSettings?.GridViewPrope.filter((item)=>{
      return item.isCustomField;
    })

setData(isCustomField);
  },[])


  useEffect(() => {

    const FilteredOptions = FormatedUserData.flatMap((item) => {
      return Object.keys(item).map((key) => ({ key, text: key }));
    });
    const res = removeDuplicatesFromObject(FilteredOptions, "key");
    setOptions(res);
  }, [FormatedUserData]);

  const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setPropertyName(item);
  };

  const handleCheckboxChange = (ev: React.FormEvent<HTMLElement>, isChecked: boolean): void => {
    setIsChecked(isChecked);
  };
  async function updateCustomFields(results){
    let isCustomField=results.filter((item)=>{
      return item.isCustomField;
    })

    await setAppSettings({...appSettings,GridViewPrope:results});
    await updateSettingJson(SETTING_LIST,{...appSettings,GridViewPrope:results});

  
setData(isCustomField);
    // setData(data);
  }
 
  const onSaveCustomFields = () => {
    if (propertyName && displayName) {
      const exists = data.some(x => x.field === propertyName.key && x.customField === displayName);

      if (exists && !editingItem) {
        props.SweetAlertCustomFields("info", "This property and display name combination already exists.");
        return;
      }

      const newField = {
        id: editingItem ? editingItem.id : uuidv4(),
        name: propertyName.key,
        checkbox:false,
        filterable: isChecked,
    
        nameAPI:displayName,
        isCustomField: true,
      
      };

  
        let results=[]
        if (editingItem) {
          results=appSettings?.GridViewPrope.map(x => x.id === editingItem.id ? newField : x);
        }else{
          results= [...appSettings?.GridViewPrope, newField];
        }
        // setData(results);
        updateCustomFields(results);
      
    

      resetForm();
    } else {
      props.SweetAlertCustomFields("info", "Please select a property and enter a display name.");
    }
  };

  const resetForm = () => {
    setDisplayName("");
    setPropertyName(null);
    setIsChecked(false);
    setEditingItem(null); 
    setOpenEditPanel(false);
  };

  const handleEdit = (item) => {
    setOpenEditPanel(true);
    setEditingItem(item);
    setDisplayName(item.nameAPI);
    setPropertyName(options.find(option => option.key === item.name));
    setIsChecked(item.filterable);
  };

  return (
    <>
    
      <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <div>
            <Label>{translation.GoogleProperties||"Google Properties"}</Label>
            <Dropdown
              styles={dropdownstyles}
              placeholder={"Select an option"}
              label=''
              options={options}
              onChange={onChange}
              selectedKey={propertyName ? propertyName.key : null}
            />
          </div>
          <div>
            <Label>{translation.Displayname||"Display Name"}</Label>
            <TextField
              onChange={(e: any) => setDisplayName(e.target.value)}
              value={displayName}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", flexDirection: "column" }}>
            <Label>{translation.Filterable||"Filterable"}</Label>
            <Checkbox
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          </div>
        </div>
        <div>
          <PrimaryButton text={editingItem ? translation.Update||'Update' : translation.Submit||'Submit'} onClick={onSaveCustomFields} />
        </div>
      </div>

     {!editingItem? <table className="customTable">
        <thead>
          <tr>
            <th>{translation.Action||"Action"}</th>
            <th>{translation.PropertyName||"Property Name"}</th>
            <th>{translation.Displayname||"Display Name"}</th>
            <th>{translation.Filterable||"Filterable"}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((x) => {
            return (
              <tr key={x.id}>
                <td><Icon iconName='edit' onClick={() => handleEdit(x)} /></td>
                <td>{x.name}</td>
                <td>{x.nameAPI}</td>
                <td>
                  {x.filterable ? (
                    <Icon style={{ marginLeft: "10px" }} iconName="CheckMark" />
                  ) : (
                    <Icon style={{ marginLeft: "10px" }} iconName="Cancel" />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>:""
}
    </>
  );
}

export default CustomAdd;
