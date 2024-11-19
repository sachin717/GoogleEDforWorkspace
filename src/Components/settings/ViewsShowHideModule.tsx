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
import { useCallback, useEffect, useState } from "react";
import { useSttings } from "../SelectSource/store";
import { SweetAlerts } from "../SelectSource/Utils/SweetAlert";
import { IMAGES_LIST, SETTING_LIST, updateSettingJson } from "../../api/storage";
import { useFields, useLists } from "../../context/store";
import ImageCropper from "../SelectSource/Utils/ImageCropper";

import {
  changeFavicon,
  convertToBase64,
  removeFavicon,
  
} from "../Helpers/HelperFunctions";
const ViewsShowHideModule = ({ isOpen, onDismiss }) => {
  const { translation } = useLanguage();
  const {

    setCommandBarItems,
    showHideSettings,
    setShowHideSettings
  
  } = useFields();
  
  const [visibleReportIncorrectIcon, setVisibleResportIncorrectIcon] =
    useState(false);
  const [ShowJoyfulAnimation, setShowJoyfulAnimation] = useState(false);
  const [ShowExtFields, setShowExtFields] = useState(false);
  const [dashboard, setShowDashboard] = useState(false);
  const [ShowAsDropdown, setShowAsDropdown] = useState(false);
  const [showInputBox, setShowInputBox] = useState(false);
  const [showOrgChart, setShowOrgChart] = useState(false);
  const [isExportToCsv, setExportToCsv] = useState(false);
  const [emails, setEmails] = useState("");
  const [WeekWorkStatus, setWeekWorkStatus] = useState(false);
  const [GroupsChecked, setGroupsChecked] = useState(false);
  const [imageCropper, setimageCropper] = useState(false);
  const [imageToCrop, setImageToCrop] =useState(undefined);
  const [showBirthAniv, setShowBirthAniv] =useState(false);
  const [showMemeberOf, setShowMemeberOf] = useState(false);
  const [showFav, setShowFav] = useState<any>(false);
  const [favIcon, setFavIcon] = useState<any>("");
  const [allowUserToPrintPDF, setAllowUsersToPrintPDF] = useState(false);
  const [showWFH, setShowWFH] = useState(false);
  const [CropButton, setCropButton] =useState(false);
  const [croppedImage, setCroppedImage] = useState(undefined);
  const [HideShowPronouns, setHideShowPronouns] = useState<any>(false);
  const { appSettings, setAppSettings } = useSttings();
  const { SweetAlert: SweetAlertShowHideForView } = SweetAlerts(
    "#ShowHideForView",
    true
  );
  const { imagesList, setImagesList } = useLists();
  const onUploadFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const image = reader.result;
        setimageCropper(true);
        setImageToCrop(image);
        
        // setBlogo(image);
        setCropButton(true);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };
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
      appSettings?.ShowHideViewModules.visibleReportIncorrectIcon
    );

    if(appSettings?.ShowHideViewModules.visibleReportIncorrectIcon){
      setShowInputBox(true)
    }else{
      setShowInputBox(false);
    }

    if(appSettings?.ShowOrgChart){
      setShowOrgChart(true)
    }else{
      setShowOrgChart(false);
    }

    if(appSettings?.Favicon){
      setShowFav(true)
    }else{
      setShowFav(false);
    }
    if(appSettings?.showBirthAniv){
      setShowBirthAniv(true)
    }else{
      setShowBirthAniv(false);
    }
    if(appSettings?.AllowUserToPrintPDF){
      setAllowUsersToPrintPDF(true)
    }else{
      setAllowUsersToPrintPDF(false);
    }
    if(appSettings?.showDashboard){
      setShowDashboard(true)
    }else{
      setShowDashboard(false);
    }
    if(appSettings?.HideShowPronouns){
      setHideShowPronouns(true)
    }else{
      setHideShowPronouns(false);
    }
    if(appSettings?.ShowWFH){
      setShowWFH(true)
    }else{
      setShowWFH(false);
    }
    if(appSettings?.ShowWeekWorkStatus){
      setWeekWorkStatus(true)
    }else{
      setWeekWorkStatus(false);
    }
    if(appSettings?.ShowMemeberOf){
      setShowMemeberOf(true)
    }else{
      setShowMemeberOf(false);
    }
    if(appSettings?.IsExportToCsv){
      setExportToCsv(true)
    }else{
      setExportToCsv(false);
    }
    let grpon = showHideSettings?.GroupsOn;
    if (grpon) {
      setGroupsChecked(true);
    } else {
      setGroupsChecked(false);
    }
    if (appSettings?.ShowWFH) {
      setShowWFH(appSettings?.ShowWFH);
    }


    setEmails(appSettings.ReportEmails)

    setShowJoyfulAnimation(
      appSettings?.ShowHideViewModules?.ShowJoyfulAnimation
    );

    setShowExtFields(appSettings?.ShowHideViewModules?.ShowExtFields);
    setShowAsDropdown(appSettings?.ShowHideViewModules?.ShowAsDropdown);
  }, []);
  const _onGRPChange =(e, checked?: boolean): void => {
    setGroupsChecked(checked);
    updateSettingJson(SETTING_LIST, { ...appSettings, GroupsOn: checked });
    setAppSettings({ ...appSettings, GroupsOn: checked });
    setShowHideSettings({ ...appSettings, GroupsOn: checked });
    SweetAlertShowHideForView("success", translation.SettingSaved);
  }
  function handleChangeWFH(e: any, checked: any) {
    setShowWFH(checked);
    let temp = { ...appSettings, ShowWFH: checked };
    updateSettingJson(SETTING_LIST, temp);
    setAppSettings(temp);
    SweetAlertShowHideForView("success", translation.SettingSaved);
  }
  
  function handleChangeOrgChart(e: any, checked: any) {
    setShowOrgChart(checked);
    let temp = { ...appSettings, ShowOrgChart: checked };
    updateSettingJson(SETTING_LIST, temp);
    setAppSettings(temp);
    setCommandBarItems({ ShowOrgChart: checked });
    SweetAlertShowHideForView("success", translation.SettingSaved);
  }
  function handleChangeMemeberOf(e: any, checked: any) {
    setShowMemeberOf(checked);
    let temp = { ...appSettings, ShowMemeberOf: checked };
    updateSettingJson(SETTING_LIST, temp);
    setAppSettings(temp);
    SweetAlertShowHideForView("success", translation.SettingSaved);
  }
  function handleWeeklyWorkStatus(e: any, checked: any) {
    setWeekWorkStatus(checked);
    let temp = { ...appSettings, ShowWeekWorkStatus: checked };
    updateSettingJson(SETTING_LIST, temp);
    setAppSettings(temp);
    SweetAlertShowHideForView("success", translation.SettingSaved);
  }
  function handleChnageHideShowPronouns(e: any, checked: any) {
    setHideShowPronouns(checked);
    let temp = { ...appSettings, HideShowPronouns: checked };
    updateSettingJson(SETTING_LIST, temp);
    setAppSettings(temp);
    SweetAlertShowHideForView("success", translation.SettingSaved);
  }
  async function onChangeDashboard(e: any, checked: any) {
    setShowDashboard(checked);
    updateSettingJson(SETTING_LIST, { ...appSettings, showDashboard: checked });
    setCommandBarItems({showDashboard: checked })
    setAppSettings({ ...appSettings, showDashboard: checked });
    SweetAlertShowHideForView("success", translation.SettingSaved);
  }
  function handleshowHideFav(e: any, checked: any) {
    setShowFav(checked);
    let temp = { ...appSettings, Favicon:checked};
    updateSettingJson(SETTING_LIST, temp);
    removeFavicon();
    setFavIcon("");
    SweetAlertShowHideForView("success", translation.SettingSaved);
  }

  function handleExportToCsv(e: any, checked: any) {
    setExportToCsv(checked);
    let temp = { ...appSettings, IsExportToCsv: checked };
    updateSettingJson(SETTING_LIST, temp);
    setCommandBarItems({IsExportToCsv: checked })
    setAppSettings(temp);
    SweetAlertShowHideForView("success", translation.SettingSaved);
  }
  const handleAllowUsersToPrintPDF = async (_, checked: boolean) => {
    setAllowUsersToPrintPDF(checked);
    const setting = {
      ...appSettings,
      AllowUserToPrintPDF: checked,
    };
    await updateSettingJson(SETTING_LIST, setting);
    setCommandBarItems({AllowUserToPrintPDF: checked })
    setAppSettings(setting);
    SweetAlertShowHideForView("success", translation.SettingSaved);
  };
  function handleChangeBirthAniv(e: any, checked: any) {
    setShowBirthAniv(checked);
    const setting = { ...appSettings, showBirthAniv: checked };
    updateSettingJson(SETTING_LIST, setting);
    setAppSettings(setting);
    setCommandBarItems({showBirthAniv: checked })
    console.log("appstt",appSettings)
    
    SweetAlertShowHideForView("success", translation.SettingSaved);
  }
  async function handleFavIconSave(imgUrl) {
    if (croppedImage) {
      let url = await convertToBase64(imgUrl);
      let temp = {
        ...appSettings,
        ShowFavicon:showFav,
      };
      const imagesJson = {...imagesList,FavIconUrl:url };
      updateSettingJson(IMAGES_LIST, imagesJson);
      updateSettingJson(SETTING_LIST, temp);
      changeFavicon(url);
      SweetAlertShowHideForView("success", translation.SettingSaved);
    }
  }
  
  function handleRemoveFavIcon() {
    // let temp = { ...imagesList, Favicon: { isFavIconShow: false, url: "" } };
    let settingData={...appSettings,ShowFavicon:false};
    updateSettingJson(SETTING_LIST,settingData);
    setAppSettings(settingData);
    let temp = { ...imagesList,  FavIconUrl: ""  };
    updateSettingJson(IMAGES_LIST, temp);
    setImagesList(temp);
    removeFavicon();
    SweetAlertShowHideForView("success", translation.SettingSaved);
  }

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

          <div className={styles.SHMItem}>
          <Label >{"Show groups"}</Label>
                  <Toggle
                    title={"groups"}
                   
                    checked={GroupsChecked}
                    onChange={_onGRPChange}
                    role="checkbox"
                  />
          </div>
          <div className={styles.seprator}></div>
          <div className={styles.SHMItem}>
          <Label>{translation.EnableWFHText ?? "Enable WFH"}</Label>
            <Toggle
              checked={showWFH}
              // onText={translation.show}
              // offText={translation.hide}
              onChange={(e: any, checked: any) => handleChangeWFH(e, checked)}
            />
          </div>
          <div className={styles.seprator}></div>
          <div className={styles.SHMItem}>
          <Label>
              {translation.OrganizationalChart ?? "Organizational Chart"}
            </Label>
            <Toggle
              checked={showOrgChart}
              onChange={(e: any, checked: any) =>
                handleChangeOrgChart(e, checked)
              }
              // onText={translation.show}
              // offText={translation.hide}
            />
          </div>
          <div className={styles.seprator}></div>
          <div className={styles.SHMItem}>
          <Label>
              {translation.ShowMember
                ? translation.ShowMember
                : "Show memeber of"}
            </Label>
            <Toggle
              checked={showMemeberOf}
              onChange={(e: any, checked: any) => {
                handleChangeMemeberOf(e, checked);
              }}
              // onText={translation.show}
              // offText={translation.hide}
            />
          </div>
          <div className={styles.seprator}></div>
          <div className={styles.SHMItem}>

            <Label>
              {translation.displayweeklyworkstatus ??
                "Display weekly work status on profile card"}
            </Label>
            <Toggle
              checked={WeekWorkStatus}
              // onText={translation.show}
              // offText={translation.hide}
              onChange={(e: any, checked: any) =>
                handleWeeklyWorkStatus(e, checked)
              }
            />
          
          </div>
          <div className={styles.seprator}></div>
          <div className={styles.SHMItem}>
          <Label>
              {translation.allowusertoupdatetheirpronouns ??
                "Allow user to update their pronouns"}
            </Label>
            <Toggle
              checked={HideShowPronouns}
              // onText={translation.show}
              // offText={translation.hide}
              onChange={(e: any, checked: any) =>
                handleChnageHideShowPronouns(e, checked)
              }
            />
          
          </div>
          <div className={styles.seprator}></div>
          <div className={styles.SHMItem}>
          <Label>{translation.HideShowDB ?? "Show dashboard"}</Label>
            <Toggle
              checked={dashboard}
              // onText={translation.show}
              // offText={translation.hide}
              onChange={(e: any, checked: any) => onChangeDashboard(e, checked)}
            />
          
          </div>
          <div className={styles.seprator}></div>
          <div className={styles.SHMItem}>
          <Label>
              {translation.sett1 ?? "Allow users to export directory"}
            </Label>
            <Toggle
              checked={isExportToCsv}
              onChange={(e: any, checked: any) => handleExportToCsv(e, checked)}
              // onText={translation.show}
              // offText={translation.hide}
            />
            </div>
            <div className={styles.seprator}></div>
          <div className={styles.SHMItem}>
          <Label>
              {translation.HideShowPDF ?? "Allow users to print pdf"}
            </Label>
            <Toggle
          
              checked={allowUserToPrintPDF}
              onChange={(e: any, checked: any) => {
                handleAllowUsersToPrintPDF(e, checked);
              }}
              // onText={translation.show}
              // offText={translation.hide}
            />
            </div>
            <div className={styles.seprator}></div>
          <div className={styles.SHMItem}>
          <Label>
              {translation.UpcomingBirthdays ??
                "Upcoming birthday and work anniversaries"}
              {/* <a className={styles.helpTag} href="#">
                {translation.configurehelp ?? "Configure help"}
              </a>{" "} */}
            </Label>
            <Toggle
              checked={showBirthAniv}
              // onText={translation.show}
              // offText={translation.hide}
              onChange={(e: any, checked: any) =>
                handleChangeBirthAniv(e, checked)
              }
            />
            </div>
            <div className={styles.seprator}></div>
          <div className={styles.SHMItem}>
          <Label>
              {translation.showfavoriteicon ?? "Show favorite icon"}
            </Label>
            <Toggle
              checked={showFav}
              // onText={translation.show}
              // offText={translation.hide}
              onChange={handleshowHideFav}
            />
       
            </div>
            <div className={styles.seprator}></div>
            {showFav && (
            <div >
              <div className={styles.faviconContainer}>
                <Label>
                  {translation.customizethefavicon ?? "Customize the favicon"}
                </Label>
                <input
                  style={{
                    float: "inline-end",
                    opacity: "-0.3",
                    position: "absolute",
                    zIndex: "1",
                    bottom: "16.2%",
                    width: "22%",
                    height: "31px",
                    display: "none",
                  }}
                  // style={{ display: "none" }}
                  onChange={onUploadFile}
                  id="fileUploadfav"
                  type="file"
                  accept="image/*"
                />

                <PrimaryButton
                  htmlFor="file-input"
                  onClick={() =>
                    document.getElementById("fileUploadfav").click()
                  }
                >
                  Upload
                </PrimaryButton>
              </div>
              <span>
                {translation.faviconnote ??
                  `
                Note : Please upload of 64 x 64 px size with the same aspect
                ratio and use <br /> transparent or white background for better
                viewing experience`}
              </span>
              {imageCropper && (
                <div style={{ margin: "5px" }}>
                  <ImageCropper
                    height={64}
                    width={64}
                    imageToCrop={imageToCrop}
                    onImageCropped={async (croppedImage) => {
                      setCroppedImage(croppedImage);
                      setFavIcon(await convertToBase64(croppedImage));
                    }}
                  />
                </div>
              )}
              {/* {croppedImage && Object.keys(croppedImage)?.length>0 &&<img style={{margin:"5px 0",display:"block"}} src={window.URL.createObjectURL(croppedImage)} />} */}
              {favIcon?.length && (
                <img
                  style={{ margin: "5px 0", display: "block" }}
                  src={favIcon}
                />
              )}
              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <PrimaryButton
                  onClick={async () => {
                    if (croppedImage != null) {
                      console.log(croppedImage, "crop");

                      setImageToCrop(undefined);
                      setimageCropper(false);
                      // SetsaveButton(true);
                      setCropButton(false);
                    }
                  }}
                >
                  {translation.crop ?? "Crop"}
                </PrimaryButton>
                <PrimaryButton onClick={() => handleFavIconSave(croppedImage)}>
                  {translation.Save ? translation.save : "Save"}
                </PrimaryButton>
                <PrimaryButton onClick={handleRemoveFavIcon}>
                  {translation.Remove ? translation.Remove : "Remove"}
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
};

export default ViewsShowHideModule;
