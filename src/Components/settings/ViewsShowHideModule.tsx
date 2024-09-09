import { Label, Panel, PanelType, Toggle } from "@fluentui/react";
import { useLanguage } from "../../Language/LanguageContext";
import styles from "../SCSS/Ed.module.scss";
import { useEffect, useState } from "react";
import { updateSettingData } from "../Helpers/HelperFunctions";
import { useSttings } from "../SelectSource/store";
import { SweetAlerts } from "../SelectSource/Utils/SweetAlert";

const ViewsShowHideModule = ({
    isOpen,
    onDismiss,
}) => {
  const { translation } = useLanguage();
  const [visibleReportIncorrectIcon, setVisibleResportIncorrectIcon] =
    useState(false);
  const [ShowJoyfulAnimation, setShowJoyfulAnimation] = useState(false);
  const [ShowExtFields, setShowExtFields] = useState(false);
  const [ShowAsDropdown, setShowAsDropdown] = useState(false);

  const { appSettings, setAppSettings } = useSttings();
  const { SweetAlert: SweetAlertShowHideForView } = SweetAlerts(
    "#ShowHideForView",
    true
  );

  const onVisibleReportIncorrectIconChange = (e: any, checked: any) => {
    setVisibleResportIncorrectIcon(checked);
    const updatedSHMStates = {
      visibleReportIncorrectIcon: checked,
      ShowJoyfulAnimation,
      ShowExtFields,
      ShowAsDropdown,
    };
    updateSettingData({
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
    updateSettingData({
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
    updateSettingData({
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
    updateSettingData({
      ...appSettings,
      ShowHideViewModules: updatedSHMStates,
    });
    setAppSettings({ ...appSettings, ShowHideViewModules: updatedSHMStates });
    SweetAlertShowHideForView("success", translation.SettingSaved);
  };

  useEffect(() => {
    setVisibleResportIncorrectIcon(
      appSettings.ShowHideViewModules.visibleReportIncorrectIcon
    );
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
