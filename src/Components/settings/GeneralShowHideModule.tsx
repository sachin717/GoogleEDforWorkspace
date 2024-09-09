import {
  Label,
  Panel,
  PanelType,
  PrimaryButton,
  Toggle,
} from "@fluentui/react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../Language/LanguageContext";
import styles from "../SCSS/Ed.module.scss";
import ImageCropper from "../SelectSource/Utils/ImageCropper";
import {
  changeFavicon,
  convertToBase64,
  removeFavicon,
  updateSettingData,
} from "../Helpers/HelperFunctions";
import { useSttings } from "../SelectSource/store";
import { SweetAlerts } from "../SelectSource/Utils/SweetAlert";

const GeneralShowHideModule = ({ isOpen, onDismiss }) => {
  const { translation } = useLanguage();
  const [dashboard, setShowDashboard] = useState(false);
  const [allowUserToPrintPDF, setAllowUsersToPrintPDF] = useState(false);
  const [isExportToCsv, setExportToCsv] = useState(false);
  const [imageToCrop, setImageToCrop] = React.useState(undefined);
  const [favIcon, setFavIcon] = React.useState<any>("");
  const [showFav, setShowFav] = useState<any>("");
  const [croppedImage, setCroppedImage] = React.useState(undefined);
  const [CropButton, setCropButton] = React.useState(false);
  const [bLogo, setBlogo] = React.useState<any>("");
  const [imageCropper, setimageCropper] = React.useState(false);
  const { appSettings, setAppSettings } = useSttings();
  const { SweetAlert: SweetAlertGeneralHideShow } = SweetAlerts(
    "#generalHideShow",
    true
  );

  const [showBirthAniv, setShowBirthAniv] = React.useState(false);

  function onChangeDashboard(e: any, checked: any) {
    setShowDashboard(checked);
    updateSettingData({ ...appSettings, showDashboard: checked });
    setAppSettings({ ...appSettings, showDashboard: checked });
    SweetAlertGeneralHideShow("success", translation.SettingSaved);
  }

  function handleChangeBirthAniv(e: any, checked: any) {
    setShowBirthAniv(checked);
    const setting = { ...appSettings, showBirthAniv: checked };
    updateSettingData(setting);
    setAppSettings(setting);
    SweetAlertGeneralHideShow("success", translation.SettingSaved);
  }

  function handleshowHideFav(e: any, checked: any) {
    setShowFav(checked);
    if (checked == false) {
      let temp = { ...appSettings, Favicon: { isFavIconShow: false, url: "" } };
      updateSettingData(temp);
      removeFavicon();
      setFavIcon("");
      SweetAlertGeneralHideShow("success", translation.SettingSaved);
    }
  }

  const handleAllowUsersToPrintPDF = (_, checked: boolean) => {
    setAllowUsersToPrintPDF(checked);
    const setting = {
      ...appSettings,
      AllowUserToPrintPDF: checked,
    };
    updateSettingData(setting);
    setAppSettings(setting);
    SweetAlertGeneralHideShow("success", translation.SettingSaved);
  };

  function handleExportToCsv(e: any, checked: any) {
    setExportToCsv(checked);
    let temp = { ...appSettings, IsExportToCsv: checked };
    updateSettingData(temp);
    setAppSettings(temp);
    SweetAlertGeneralHideShow("success", translation.SettingSaved);
  }

  const onUploadFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const image = reader.result;
        setimageCropper(true);
        setImageToCrop(image);
        setBlogo(image);
        setCropButton(true);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  async function handleFavIconSave(imgUrl) {
    if (croppedImage) {
      let url = await convertToBase64(imgUrl);
      let temp = {
        ...appSettings,
        Favicon: { isFavIconShow: showFav, url: url },
      };
      updateSettingData(temp);
      changeFavicon(url);
    }
  }

  function handleRemoveFavIcon() {
    let temp = { ...appSettings, Favicon: { isFavIconShow: false, url: "" } };
    updateSettingData(temp);
    removeFavicon();
  }

  useEffect(() => {
    setShowBirthAniv(appSettings?.showBirthAniv);
    setExportToCsv(appSettings?.IsExportToCsv);
    setAllowUsersToPrintPDF(appSettings?.AllowUserToPrintPDF);
    setShowDashboard(appSettings?.showDashboard);
    if (
      appSettings?.Favicon?.url?.length &&
      appSettings?.Favicon?.isFavIconShow
    ) {
      setFavIcon(appSettings?.Favicon?.url);
      setShowFav(true);
    } else {
      setFavIcon("");
      setShowFav(false);
      removeFavicon();
    }
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
        <div id="generalHideShow">
          <div className={styles.showHideModulePanelItems}>
            <Label>
              {translation.HideShowDB
                ? translation.HideShowDB
                : "Show dashboard"}
            </Label>
            <Toggle
              checked={dashboard}
              onText={translation.show}
              offText={translation.hide}
              onChange={(e: any, checked: any) => onChangeDashboard(e, checked)}
            />
          </div>
          <div className={styles.seprator}></div>

          <div className={styles.showHideModulePanelItems}>
            <Label>
              {translation.UpcomingBirthdays
                ? translation.UpcomingBirthdays
                : "Upcoming birthday and work anniversaries"}
              <a className={styles.helpTag} href="#">
                {translation.configurehelp
                  ? translation.configurehelp
                  : "Configure help"}
              </a>{" "}
            </Label>
            <Toggle
              checked={showBirthAniv}
              onText={translation.show}
              offText={translation.hide}
              onChange={(e: any, checked: any) =>
                handleChangeBirthAniv(e, checked)
              }
            />
          </div>
          <div className={styles.seprator}></div>

          <div className={styles.showHideModulePanelItems}>
            <Label>
              {translation.HideShowPDF
                ? translation.HideShowPDF
                : "Allow users to print pdf"}
            </Label>
            <Toggle
              checked={allowUserToPrintPDF}
              onChange={(e: any, checked: any) => {
                handleAllowUsersToPrintPDF(e, checked);
              }}
              onText={translation.show}
              offText={translation.hide}
            />
          </div>
          <div className={styles.seprator}></div>

          <div className={styles.showHideModulePanelItems}>
            <Label>
              {translation.sett1
                ? translation.sett1
                : "Allow users to export directory"}
            </Label>
            <Toggle
              checked={isExportToCsv}
              onChange={(e: any, checked: any) => handleExportToCsv(e, checked)}
              onText={translation.show}
              offText={translation.hide}
            />
          </div>
          <div className={styles.seprator}></div>

          <div className={styles.showHideModulePanelItems}>
            <Label>
              {translation.showfavoriteicon
                ? translation.showfavoriteicon
                : "Show favorite icon"}
            </Label>
            <Toggle
              checked={showFav}
              onText={translation.show}
              offText={translation.hide}
              onChange={handleshowHideFav}
            />
          </div>
          <div className={styles.seprator}></div>
          {showFav && (
            <div className={styles.faviconWrapper}>
              <div className={styles.faviconContainer}>
                <Label>
                  {translation.customizethefavicon
                    ? translation.customizethefavicon
                    : "Customize the favicon"}
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
                {translation.faviconnote
                  ? translation.faviconnote
                  : `
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
                  {translation.crop ? translation.crop : "Crop"}
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

export default GeneralShowHideModule;
