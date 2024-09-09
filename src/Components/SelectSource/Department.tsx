import React, { useEffect, useRef, useState } from "react";
import { PrimaryButton } from "@fluentui/react";
import { Checkbox, Label, SearchBox } from "@fluentui/react";
import ReactSelect from "react-select";
import { Icon } from "office-ui-fabric-react";
import useStore from "./store";
import { updateSettingData } from "../Helpers/HelperFunctions";
import { useLanguage } from "../../Language/LanguageContext";

const Department = ({ appSettings, setAppSettings, SweetAlertExcludeDept, departmentFields }) => {
    const { translation } = useLanguage();
    const { excludeByDomain, changeExcludeByDomain } = useStore();
    
    const [excludedValues, setExcludedValues] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [excludedDept, setExcludedDept] = useState([]);
    const [showButton, setShowButton] = useState(appSettings?.ExcludeByDepartment?.length > 0);
    
    const KEY_NAME3 = "ExcludeByDepartment";
    const allItems = appSettings?.ExcludeByDepartment || [];
    const searchRef = useRef(null);
    const searchBoxRef = useRef(null);

    useEffect(() => {
        setExcludedDept(appSettings?.ExcludeByDepartment || []);
    }, [appSettings]);

    const handleDeptChange = (e, value) => {
        const updatedDept = excludedDept.map(dept => 
            dept.value === value ? { ...dept, checked: e.target.checked } : dept
        );
        setExcludedDept(updatedDept);
    };

    const searchItems = (text) => {
        if (text === "") {
            setExcludedDept([...allItems]);
            setShowButton(allItems.length > 0);
            return;
        }
        const filteredDept = excludedDept.filter(x => x.value.toLowerCase().includes(text.toLowerCase()));
        setExcludedDept(filteredDept);
        setShowButton(filteredDept.length > 0);
    };

    const include = () => {
        const selectedDept = excludedDept.filter(dept => dept.checked).map(dept => dept.value);
        
        if (selectedDept.length === 0) {
            SweetAlertExcludeDept("Please select!");
            return;
        }
        
        const updatedExcludeByDept = appSettings?.ExcludeByDepartment.filter(dept => !selectedDept.includes(dept.value));
        const updatedParsedData = { ...appSettings, [KEY_NAME3]: updatedExcludeByDept };
        
        updateSettingData(updatedParsedData);
        setAppSettings(updatedParsedData);
        setExcludedDept(updatedExcludeByDept);
        SweetAlertExcludeDept("success", translation.SettingSaved);
    };

    const handleClickSearch = () => {
        setIsExpanded(true);
        if (searchBoxRef.current) {
            searchBoxRef.current.focus();
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (!searchRef.current.contains(document.activeElement)) {
                setIsExpanded(false);
            }
        }, 100);
    };

    const excludeDept = () => {
        if (excludedValues.length) {
            const currentExcluded = appSettings[KEY_NAME3] || [];
            const isDataPresent = excludedValues.every(value => currentExcluded.includes(value));
            
            if (isDataPresent) {
                SweetAlertExcludeDept("info", "Data already exists.");
            } else {
                const updatedExcluded = [...currentExcluded, ...excludedValues];
                const updatedParsedData = { ...appSettings, [KEY_NAME3]: updatedExcluded };
                
                updateSettingData(updatedParsedData);
                setAppSettings(updatedParsedData);
                SweetAlertExcludeDept("success", translation.SettingSaved);
            }

            setExcludedValues([]);
            setShowButton(true);
        } else {
            SweetAlertExcludeDept("info", "Please select domain(s)");
        }
    };

    return (
        <div className="tabMainDiv" id="excludeDept">
            <div style={{ padding: "0%" }}>
                <Label>Select department(s) to exclude</Label>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "end", gap: "8px" }}>
                        <ReactSelect
                            options={departmentFields}
                            onChange={(value:any)=>setExcludedValues(value)}
                            value={excludedValues}
                            isMulti
                            menuShouldScrollIntoView
                            menuPosition="fixed"
                            maxMenuHeight={150}
                        />
                        {excludedValues.length > 0 && (
                            <PrimaryButton
                                text="Exclude"
                                onClick={excludeDept}
                            />
                        )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                            style={{
                                paddingTop: "1%",
                                width: isExpanded ? "200px" : "0px",
                                transition: "width 0.45s ease-in-out",
                                overflow: "hidden",
                            }}
                            ref={searchRef}
                            onBlur={handleBlur}
                        >
                            <SearchBox
                                ref={searchBoxRef}
                                onSearch={searchItems}
                                onChange={(e, newValue) => searchItems(newValue)}
                                onClear={() => {
                                    setExcludedDept([...allItems]);
                                    setShowButton(allItems.length > 0);
                                }}
                                placeholder="Search"
                                iconProps={{ iconName: "search" }}
                            />
                        </div>
                        {!isExpanded && (
                            <Icon
                                style={{ fontSize: "16px", cursor: "pointer", padding: "2px" }}
                                iconName="Search"
                                onClick={handleClickSearch}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div>
                <table className="excludeTable">
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Department</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    {showButton ? (
                        <tbody>
                            {excludedDept.map(x => (
                                <tr key={x.value}>
                                    <td>
                                        <Checkbox
                                            checked={x.checked}
                                            title={x.value}
                                            onChange={(checked) => handleDeptChange(checked, x.value)}
                                        />
                                    </td>
                                    <td>{x.value}</td>
                                    <td>Excluded</td>
                                </tr>
                            ))}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan={3}>No Records Found</td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>
            {excludedDept.length > 0 && (
                <div>
                    <PrimaryButton text="Include" onClick={include} />
                </div>
            )}
        </div>
    );
};

export default Department;

