import {
  Label,
  Panel,
  PanelType,
  PrimaryButton,
  TextField,
  Toggle,
} from "@fluentui/react";
import { useLanguage } from "../../Language/LanguageContext";
import styles from "../SCSS/Ed.module.scss";
import { useEffect, useState } from "react";
import { useSttings } from "../SelectSource/store";
import { SweetAlerts } from "../SelectSource/Utils/SweetAlert";
import { SETTING_LIST, updateSettingJson } from "../../api/storage";

const ViewsShowHideModule = ({ isOpen, onDismiss }) => {
  const { translation } = useLanguage();
  const [visibleReportIncorrectIcon, setVisibleResportIncorrectIcon] =
    useState(false);
  const [ShowJoyfulAnimation, setShowJoyfulAnimation] = useState(false);
  const [ShowExtFields, setShowExtFields] = useState(false);
  const [ShowAsDropdown, setShowAsDropdown] = useState(false);
  const [showInputBox, setShowInputBox] = useState(false);
  const [emails, setEmails] = useState("");

  const { appSettings, setAppSettings } = useSttings();
  const { SweetAlert: SweetAlertShowHideForView } = SweetAlerts(
    "#ShowHideForView",
    true
  );

  const onVisibleReportIncorrectIconChange = (e: any, checked: any) => {
    if (checked === true) {
      setShowInputBox(true);
    } else {
      setShowInputBox(false);
    }
    setVisibleResportIncorrectIcon(checked);
    const updatedSHMStates = {
      visibleReportIncorrectIcon: checked,
      ShowJoyfulAnimation,
      ShowExtFields,
      ShowAsDropdown,
    };
    updateSettingJson(SETTING_LIST, {
      ...appSettings,
      ShowHideViewModules: updatedSHMStates,
    });
    setAppSettings({ ...appSettings, ShowHideViewModules: updatedSHMStates });
    SweetAlertShowHideForView("success", translation.SettingSaved);
  };

  const handleChangeShowAnimation = (e: any, checked: boolean) => {
    setShowJoyfulAnimation(checked);
    const updatedSHMStates = {
      visibleReportIncorrectIcon,
      ShowJoyfulAnimation: checked,
      ShowExtFields,
      ShowAsDropdown,
    };
    updateSettingJson(SETTING_LIST, {
      ...appSettings,
      ShowHideViewModules: updatedSHMStates,
    });
    setAppSettings({ ...appSettings, ShowHideViewModules: updatedSHMStates });
    SweetAlertShowHideForView("success", translation.SettingSaved);
  };

  const handleChangeShowExtFields = (e: any, checked: boolean) => {
    setShowExtFields(checked);
    const updatedSHMStates = {
      visibleReportIncorrectIcon,
      ShowJoyfulAnimation,
      ShowExtFields: checked,
      ShowAsDropdown,
    };
    updateSettingJson(SETTING_LIST, {
      ...appSettings,
      ShowHideViewModules: updatedSHMStates,
    });
    setAppSettings({ ...appSettings, ShowHideViewModules: updatedSHMStates });
    SweetAlertShowHideForView("success", translation.SettingSaved);
  };

  const handleChangeShowAsDropDown = (e: any, checked: boolean) => {
    setShowAsDropdown(checked);
    const updatedSHMStates = {
      visibleReportIncorrectIcon,
      ShowJoyfulAnimation,
      ShowExtFields,
      ShowAsDropdown: checked,
    };
    updateSettingJson(SETTING_LIST, {
      ...appSettings,
      ShowHideViewModules: updatedSHMStates,
    });
    setAppSettings({ ...appSettings, ShowHideViewModules: updatedSHMStates });
    SweetAlertShowHideForView("success", translation.SettingSaved);
  };

  const handelSaveEmails = () => {
    const KEY = "ReportEmails";
    const setting = { ...appSettings, [KEY]: emails };
    console.log("setting", {setting, emails});
    updateSettingJson(SETTING_LIST, setting);
    setAppSettings(setting);
    SweetAlertShowHideForView("success", translation.SettingSaved);
  };

  useEffect(() => {
    setVisibleResportIncorrectIcon(
      appSettings.ShowHideViewModules.visibleReportIncorrectIcon
    );

    if(appSettings.ShowHideViewModules.visibleReportIncorrectIcon){
      setShowInputBox(true)
    }else{
      setShowInputBox(false);
    }

    setEmails(appSettings.ReportEmails)

    setShowJoyfulAnimation(
      appSettings?.ShowHideViewModules?.ShowJoyfulAnimation
    );

    setShowExtFields(appSettings?.ShowHideViewModules?.ShowExtFields);
    setShowAsDropdown(appSettings?.ShowHideViewModules?.ShowAsDropdown);
  }, []);

  return (
    <div>
      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={translation.HideShowText ?? "Show or hide modules"}
        isOpen={isOpen}
        onDismiss={() => onDismiss(false)}
        closeButtonAriaLabel={"Close"}
      >
        <div className={styles.SHMPanelContainer} id="ShowHideForView">
          <div className={styles.SHMItem}>
            <Label>
              {translation.ReportIncorrectInfo ?? "Report incorrect info"}
            </Label>
            <Toggle
              checked={visibleReportIncorrectIcon}
              onChange={(e: any, checked: any) =>
                onVisibleReportIncorrectIconChange(e, checked)
              }
            />
          </div>
          {showInputBox && (
            <div style={{ display: "flex", gap: "10px", alignItems:"end" }}>
              <TextField
                value={emails}
                onChange={(e: any) => setEmails(e.target.value)}
                placeholder="Email Id(s) to report incorrect info separated by comma"
                label="Email Id(s) to report incorrect info"
                styles={{ root: { width: "100%" } }}
              />
              <PrimaryButton onClick={handelSaveEmails}>Save</PrimaryButton>
            </div>
          )}

          <div className={styles.seprator}></div>

          <div className={styles.SHMItem}>
            <Label>{translation.joy ?? "Show joyful animations"}</Label>
            <Toggle
              checked={ShowJoyfulAnimation}
              onChange={handleChangeShowAnimation}
            />
          </div>

          <div className={styles.seprator}></div>

          <div className={styles.SHMItem}>
            <Label>
              {translation.Advance7 ?? "Show extended fields in list view"}
            </Label>
            <Toggle
              checked={ShowExtFields}
              onChange={handleChangeShowExtFields}
            />
          </div>

          <div className={styles.seprator}></div>

          <div className={styles.SHMItem}>
            <Label>Show as drop down</Label>
            <Toggle
              checked={ShowAsDropdown}
              onChange={handleChangeShowAsDropDown}
            />
          </div>
          <div className={styles.seprator}></div>
        </div>
      </Panel>
    </div>
  );
};

export default ViewsShowHideModule;
