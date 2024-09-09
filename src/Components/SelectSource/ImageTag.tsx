import * as React from "react";
import {
  Label,
  Dropdown,
  IDropdownStyles,
  Stack,
  PrimaryButton,
  IconButton,
  TextField,
  TeachingBubble,
  DirectionalHint,
} from "office-ui-fabric-react";
import { useId } from "@fluentui/react-hooks";
import Alert from "../Utils/Alert";
import { TooltipHost, ITooltipHostStyles } from "@fluentui/react/lib/Tooltip";
import { useLanguage } from "../../Language/LanguageContext";
import { updateSettingData } from "../Helpers/HelperFunctions";
import { useSttings } from "./store";
const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 300 },
};

const calloutProps = { gapSpace: 0 };
const hostStyles: Partial<ITooltipHostStyles> = {
  root: { display: "inline-block" },
};
function ImageTag(props) {
  const { appSettings, setAppSettings } = useSttings();
  const { translation } = useLanguage();
  const [attribute, setAttribute] = React.useState<any>("location");
  const [bgColor, setBgColor] = React.useState("");
  const [fontColor, setFontColor] = React.useState("");

  const [removelist, setremovelist] = React.useState(props.DValue);

  const [optioncustomfields, setoptioncustomfields] = React.useState([]);
  const [optionselected, setoptionselected] = React.useState(String);

  const [selectedPropertyName, setselectedPropertyName] =
    React.useState<string>();
  const [sendData, setsendData] = React.useState(String);
  const [sendptype, setsendptype] = React.useState(String);
  const [sendColData, setsendColData] = React.useState(String);
  const [CheckChecked, setCheckChecked] = React.useState(false);
  const [ButtonSaveText1, setButtonSaveText1] =
    React.useState<string>("Submit");
  const [ButtonSaveText2, setButtonSaveText2] =
    React.useState<string>("Remove");
  const [loading1, setLoading1] = React.useState(false);
  const [loading2, setLoading2] = React.useState(false);

  // /*
  const [teachingBubbleVisible6, toggleTeachingBubbleVisible6] =
    React.useState(false);
  const [teachingBubbleVisible7, toggleTeachingBubbleVisible7] =
    React.useState(false);
  // */

  // const [teachingBubbleVisible6, { toggle: toggleTeachingBubbleVisible6 }] =
  //   useBoolean(false);
  // const [teachingBubbleVisible7, { toggle: toggleTeachingBubbleVisible7 }] =
  //   useBoolean(false);

  const [BG, setBG] = React.useState("#03AB36");
  const [FC, setFC] = React.useState("#ffffff");
  const [saved, setSaved] = React.useState(false);
  const [removed, setRemoved] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState("");

  const tooltipId1 = useId("tooltip1");
  const tooltipId2 = useId("tooltip2");
  const messageDismiss = () => {
    setSaved(false);
    setError(false);
    setAlert(false);
  };
  let arr123 = [];
  var dvalue;
  const optionsdata: any[] = [
    { key: "department", text: "Department" },
    { key: "location", text: "Location" },
    { key: "workphone", text: "Work phone" },
    { key: "email", text: "Email" },
    { key: "mobile", text: "Mobile" },
    { key: "manager", text: "Manager" },
    { key: "job", text: "Job title" },
  ];
  React.useEffect(() => {
    // let imageTagValue = localStorage.getItem("cardcolor")?.split("^");
    let imageTagValue = appSettings?.ImageProfileTagData?.split("^");

    if (imageTagValue?.length) {
      setAttribute(imageTagValue[0]);
      setBG(imageTagValue[1]);
      setFC(imageTagValue[2]);
    }
  }, []);
  const onHandleAttributeChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: any
  ): void => {
    setAttribute(item.key);
  };

  const oncontainsFC = (event): void => {
    setFC(event.target.value as string);
  };
  const oncontainsBG = (event): void => {
    setBG(event.target.value as string);
  };
  function addccloumn() {
    setLoading1(true);
    setButtonSaveText1("");
    var _ccolumn;

    // if (_spocustom != null) {
    // }
    let usrarr = [];
    if (!attribute.length || !BG || !FC) {
      setAlertMsg("Please select property");
      setAlert(true);
      setLoading1(false);
      setButtonSaveText1("Submit");
      setTimeout(() => {
        messageDismiss();
      }, 5000);

      var attributesValue =
        removelist == null || props?.DValue == "" ? attribute : removelist;
      //   console.log(eattr)

      usrarr.push(attributesValue + "^" + BG + "^" + FC);
      // localStorage.setItem("cardcolor", attributesValue + "^" + BG + "^" + FC);
      let data=attributesValue + "^" + BG + "^" + FC;
      updateSettingData({...appSettings,ImageProfileTagData:data})
      setAppSettings({...appSettings,ImageProfileTagData:data});
    } else {
      usrarr.push(attributesValue + "^" + BG + "^" + FC);

      // localStorage.setItem("cardcolor", attribute + "^" + BG + "^" + FC);
      let data=attribute + "^" + BG + "^" + FC;
      updateSettingData({...appSettings,ImageProfileTagData:data})
      setAppSettings({...appSettings,ImageProfileTagData:data});
      setTimeout(() => {
        setLoading1(false);
        setButtonSaveText1("Submit");
        props.SweetAlertImgProfilePanel("success", translation.SettingSaved);
      }, 300);
    }

    // if (_spocustom != null) {
    //   _ccolumn = usrarr.join("^");
    // } else {
    //   _ccolumn = usrarr.join("^");
    // }

    console.log(_ccolumn);
    let ListItemData: string = JSON.stringify({
      ImageTagSet: _ccolumn,
    });
  }

  function removeccloumn() {
    localStorage.clear();
    updateSettingData({...appSettings,ImageProfileTagData:""})
    setAppSettings({...appSettings,ImageProfileTagData:""});
    setLoading1(false);
    // setButtonSaveText1("");
    setTimeout(() => {
      setLoading1(false);
      // setButtonSaveText1("Submit");
      props.SweetAlertImgProfilePanel("success", translation.SettingSaved);
    }, 300);
  }
  return (
    <Stack id="ImgProfilePanel">
      {(saved || error || alert || removed) && (
        <Alert
          type={saved || removed ? "success" : error ? "error" : "warning"}
          title="Skip"
          text={
            error
              ? props.langcode.Alert2
                ? props.langcode.Alert2
                : "Something went wrong"
              : saved
              ? props.langcode.Alert1
                ? props.langcode.Alert1
                : "Settings saved successfully"
              : removed
              ? "Settings removed successfully!"
              : alertMsg
          }
          isBehindVisible={false}
          isConfirmBtn={false}
          id={"#imgtag"}
          countdown={2000}
          popupCustomClass={"general-settings"}
        />
      )}
      <div className="mainImagetag">
        <div className="imageTag">
          <div>
            <label>{"User properties"}</label>
          </div>

          <div className="imagetagcolor">
            <Dropdown
              placeholder={"Select an option"}
              selectedKey={attribute}
              options={optionsdata}
              onChange={onHandleAttributeChange}
            />
          </div>
        </div>

        <div className="imageTag">
          <div>
            <label>{"BG color for the tag"}</label>

            <IconButton
              id="BGcolor"
              style={{ height: "22px", marginLeft: "0px" }}
              title={"Dark color is preferred"}
              onClick={() => toggleTeachingBubbleVisible6(true)}
              iconProps={{ iconName: "Info" }}
            ></IconButton>

            {teachingBubbleVisible6 && (
              // <TeachingBubble
              //   calloutProps={{
              //     directionalHint: DirectionalHint.bottomCenter,
              //   }}
              //   target="#BGcolor"
              //   isWide={true}
              //   hasCloseButton={true}
              //   closeButtonAriaLabel={
              //   "Close"
              //   }
              //   onDismiss={toggleTeachingBubbleVisible6}
              //   headline="Dark color is preferred"
              // >

              // </TeachingBubble>
              <TooltipHost
                content="Dark color is preferred"
                // This id is used on the tooltip itself, not the host
                // (so an element with this id only exists when the tooltip is shown)
                id={tooltipId1}
                calloutProps={calloutProps}
                styles={hostStyles}
              ></TooltipHost>
            )}
          </div>
          <TextField
            className="imagetagcolor"
            onChange={oncontainsBG}
            type="color"
            id="colorpicker"
            name="color"
            pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
            value={BG}
            defaultValue="#03AB36"
          />
        </div>

        <div className="imageTag">
          <div>
            <label>{"Font color for the tag"}</label>

            <IconButton
              id="Fontcolor"
              style={{ height: "22px", marginLeft: "0px" }}
              title={
                "white or light text color is preferred for correct vissibility of the font"
              }
              aria-describedby={tooltipId1}
              onClick={() => toggleTeachingBubbleVisible7(true)}
              iconProps={{ iconName: "Info" }}
            ></IconButton>
            {teachingBubbleVisible7 && (
              <TooltipHost
                content="Dark color is preferred"
                id={tooltipId2}
                calloutProps={calloutProps}
                styles={hostStyles}
              ></TooltipHost>
            )}
          </div>
          <TextField
            className="imagetagcolor"
            onChange={oncontainsFC}
            type="color"
            id="colorpicker1"
            name="color"
            pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
            value={FC}
            defaultValue="#fff"
          />
        </div>
      </div>

      <div className="fieldSubmitBtn">
        <PrimaryButton
          onClick={addccloumn}
          // className={styles.submitbtnimage}
        >
          {ButtonSaveText1}
          {loading1 && (
            <div className="elementToFadeInAndOut">
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
        </PrimaryButton>

        <PrimaryButton
          onClick={removeccloumn}
          // className={styles.submitbtnimage}
        >
          {ButtonSaveText2}
          {loading2 && (
            <div className="elementToFadeInAndOut">
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
        </PrimaryButton>
      </div>
    </Stack>
  );
}

export default ImageTag;
