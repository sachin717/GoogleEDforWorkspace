import {
  Dropdown,
  Label,
  PrimaryButton,
} from "@fluentui/react";
import { useEffect, useState } from "react";
import MiniModals from "../SelectSource/MiniModals";
import { useLanguage } from "../../Language/LanguageContext";
import { useSttings } from "../SelectSource/store";
import ReactSelect from "react-select";
import { getCurrentUser } from "../Helpers/HelperFunctions";
import { useFields } from "../../context/store";
import { SweetAlerts } from "../SelectSource/Utils/SweetAlert";
import { getSettingJson, SETTING_LIST, updateSettingJson } from "../../api/storage";

const OrgChart = ({ dismissPanelOrgChartType, isOpenOrgChartType }) => {
  const {SweetAlert} = SweetAlerts("#orgchart-modal");
  const orgChartTypes = [
    { key: "FullOrgChart", text: "Full Org Chart" },
    { key: "TwoLevelOrgChart", text: "Org Chart - Two levels" },
  ];
  const { translation } = useLanguage();
  const { appSettings,setAppSettings } = useSttings();
  const [selectedType, setSelectedType] = useState<any>("FullOrgChart");
  const [chartHead, setChartHead] = useState<any>({ label: "", value: "" });
  const { allUsers } = useFields();

  const KEY = "OrgChart";

  const saveSetting = () => {
    if (selectedType == "TwoLevelOrgChart") {
      const label = getCurrentUser().Ad;
      const value = getCurrentUser().cu;
      const setting = {
        ...appSettings,
        [KEY]: { chartType: selectedType, chartHead: { label: label , value: value } },
      };
      updateSettingJson(SETTING_LIST, setting);
      setAppSettings(setting);
    } else {
      const setting = {
        ...appSettings,
        [KEY]: { chartType: selectedType, chartHead: chartHead },
      };
      updateSettingJson(SETTING_LIST, setting);
      setAppSettings(setting);
    }
    SweetAlert("success",translation.SettingSaved);
  };

  useEffect(() => {
    const getSettingData = async()=>{
      const data = await getSettingJson(SETTING_LIST)
      setChartHead(data?.OrgChart?.chartHead);
      setSelectedType(data?.OrgChart?.chartType);
    }
    getSettingData();
  }, []);

  return (
    <div id="orgchart-modal">
      {isOpenOrgChartType && (
        <MiniModals
          isPanel={false}
          crossButton={true}
          heading={
            translation.OrganizationChartType ?? "Organization chart type"
          }
          closeAction={dismissPanelOrgChartType}
        >
          <div style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Label>{translation.OrganizationChartType}</Label>
              <Dropdown
                styles={{ root: { minWidth: "210px" } }}
                options={orgChartTypes}
                selectedKey={selectedType}
                defaultSelectedKey={selectedType}
                onChange={(e, value) => setSelectedType(value.key)}
              />
            </div>
            <div>
              {selectedType === "FullOrgChart" && (
                <PeoplePicker
                  chartHead={chartHead}
                  setChartHead={setChartHead}
                />
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "35px",
              }}
            >
              <PrimaryButton onClick={saveSetting}>
                {translation.save}
              </PrimaryButton>
            </div>
          </div>
        </MiniModals>
      )}
    </div>
  );
};

const stylesForDropDown: any = {
  control: (provided, state) => ({
    ...provided,
    width: 210,
    height: 29,
    borderRadius: "0px",
    minHeight: "32px",
    boxShadow: state.isFocused ? `0 0 0 .5px black` : provided.boxShadow,
    borderColor: state.isFocused ? `black` : provided.borderColor,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#AAA",
    fontSize: "15px",
  }),
};

const PeoplePicker = ({ chartHead, setChartHead }) => {
  const [options, setOptions] = useState([]);
  const { FormatedUserData } = useFields();

  useEffect(() => {
    const options = FormatedUserData.map((x) => ({
      value: x.email,
      label: x.name,
    }));
    setOptions(options);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "end",
        marginRight: "20px",
        marginTop: "10px",
      }}
    >
      <ReactSelect
        menuPosition="fixed"
        menuShouldScrollIntoView
        styles={stylesForDropDown}
        options={options}
        value={chartHead}
        onChange={(e: any) => setChartHead(e)}
      />
    </div>
  );
};

export default OrgChart;
