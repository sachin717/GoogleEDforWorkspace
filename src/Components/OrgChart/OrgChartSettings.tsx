import { Checkbox, IconButton, PanelType, Separator } from "@fluentui/react";
import { Label, Panel, PrimaryButton, TextField } from "@fluentui/react";
import { useEffect, useState } from "react";
import styles from "../SCSS/OrgChartPage.module.scss";
import PreviewCard from "./PreviewCard";
import { useLanguage } from "../../Language/LanguageContext";
import { useSttings } from "../SelectSource/store";
import { SweetAlerts } from "../SelectSource/Utils/SweetAlert";
import { SETTING_LIST, updateSettingJson } from "../../api/storage";

const OrgChartSettings = ({
  handleOnDismiss,
  setImagePosition,
  setDepartmentFontSize,
  setJobTitleFontSize,
  setHeaderFontSize,
  setHeaderTextFontStyles,
  setDepartmentFontStyles,
  setJobTitleFontStyle,
  /* ----values---- */
  isOpen,
  imagesPosition,
  headerFontSize,
  departmentFontSize,
  jobTitleFontSize,
  locationFontSize,
  headerTextFontStyles,
  departmentFontStyles,
  jobTitleFontStyle,
  rootChartNode,
}: any) => {
  const { SweetAlert } = SweetAlerts("#orgchartPanel", true);
  const [position, setPosition] = useState<any>(imagesPosition);
  const [headFontSize, setHeadFontSize] = useState(headerFontSize);
  const [jobFontSize, setJobFontSize] = useState(jobTitleFontSize);
  const [depFontSize, setDepFontSize] = useState(departmentFontSize);

  const [boldName, setBoldName] = useState(headerTextFontStyles.bold);
  const [italicName, setItalicName] = useState(headerTextFontStyles.italic);
  const [underlineName, setUnderlineName] = useState(
    headerTextFontStyles.underline
  );

  const [boldJob, setBoldJob] = useState(jobTitleFontStyle.bold);
  const [italicJob, setItalicJob] = useState(jobTitleFontStyle.italic);
  const [underlineJob, setUnderlineJob] = useState(jobTitleFontStyle.underline);

  const [boldDep, setBoldDep] = useState(departmentFontStyles.bold);
  const [italicDep, setItalicDep] = useState(departmentFontStyles.italic);
  const [underlineDep, setUnderlineDep] = useState(
    departmentFontStyles.underline
  );

  const { translation } = useLanguage();
  const { appSettings } = useSttings();

  const save = () => {
    const KEY = "OrgChartStyles";

    const setting = {
      ...appSettings,
      [KEY]: {
        position,
        headFontSize,
        jobFontSize,
        depFontSize,
        headerText: {
          italic: italicName,
          underline: underlineName,
          bold: boldName,
        },
        jobTitle: {
          bold: boldJob,
          italic: italicJob,
          underline: underlineJob,
        },
        department: {
          bold: boldDep,
          italic: italicDep,
          underline: underlineDep,
        },
      },
    };

    updateSettingJson(SETTING_LIST, setting);
    setHeaderFontSize(headFontSize);
    setImagePosition(position);
    setJobTitleFontSize(jobFontSize);
    setDepartmentFontSize(depFontSize);
    setHeaderTextFontStyles({
      italic: italicName,
      underline: underlineName,
      bold: boldName,
    });
    setJobTitleFontStyle({
      bold: boldJob,
      italic: italicJob,
      underline: underlineJob,
    });
    setDepartmentFontStyles({
      bold: boldDep,
      italic: italicDep,
      underline: underlineDep,
    });
    SweetAlert("success", "Setting Saved");
  };

  useEffect(() => {
    setPosition(appSettings?.OrgChartStyles?.position || "center");
    setHeadFontSize(appSettings?.OrgChartStyles?.headFontSize || "20");
    setJobFontSize(appSettings?.OrgChartStyles?.jobFontSize || "15");
    setDepFontSize(appSettings?.OrgChartStyles?.depFontSize || "15");

    setBoldName(appSettings?.OrgChartStyles?.headerText.bold || false);
    setItalicName(appSettings?.OrgChartStyles?.headerText.italic || false);
    setUnderlineName(
      appSettings?.OrgChartStyles?.headerText.underline || false
    );

    setBoldJob(appSettings?.OrgChartStyles?.jobTitle?.bold || false);
    setItalicJob(appSettings?.OrgChartStyles?.jobTitle?.italic || false);
    setUnderlineJob(appSettings?.OrgChartStyles?.jobTitle?.underline || false);

    setBoldDep(appSettings?.OrgChartStyles?.department?.bold || false);
    setItalicDep(appSettings?.OrgChartStyles?.department?.italic || false);
    setUnderlineDep(
      appSettings?.OrgChartStyles?.department?.underline || false
    );
  }, []);

  return (
    <div>
      <Panel
        headerText={translation.CustomizeChart ?? "Customize Chart"}
        isOpen={isOpen}
        onDismiss={() => handleOnDismiss(false)}
        type={PanelType.custom}
        customWidth="380px"
      >
        {/* --------------------- name font setting------------------ */}
        <div id="orgchartPanel" className={styles.nameStyles}>
          <div>
            <Label>
              {translation.EmployeeNameFontSize
                ? translation.EmployeeNameFontSize
                : "Employee name font size"}
            </Label>
            <div className={styles.fontStylesGroup}>
              <IconButton
                iconProps={{ iconName: "Bold" }}
                id="NameBold"
                onClick={() => setBoldName(!boldName)}
                className={boldName && styles.bold}
              />
              <IconButton
                iconProps={{ iconName: "Italic" }}
                id="NameItalic"
                onClick={() => setItalicName(!italicName)}
                className={italicName && styles.italic}
              />
              <IconButton
                iconProps={{ iconName: "Underline" }}
                id="NameUnderline"
                onClick={() => setUnderlineName(!underlineName)}
                className={underlineName && styles.underline}
              />
            </div>
          </div>
          <TextField
            type="number"
            onChange={(e: any) => setHeadFontSize(e.target.value)}
            value={headFontSize}
            style={{ width: 70 }}
            min={10}
            max={25}
          />
        </div>
        <Separator />
        {/* --------------------- job title setting------------------ */}
        <div className={styles.nameStyles}>
          <div>
            <Label>
              {translation.JobTitleFontSize
                ? translation.JobTitleFontSize
                : "Job title font size"}
            </Label>
            <div className={styles.fontStylesGroup}>
              <IconButton
                iconProps={{ iconName: "Bold" }}
                id="NameBold"
                onClick={() => setBoldJob(!boldJob)}
                className={boldJob && styles.bold}
              />
              <IconButton
                iconProps={{ iconName: "Italic" }}
                id="NameItalic"
                onClick={() => setItalicJob(!italicJob)}
                className={italicJob && styles.italic}
              />
              <IconButton
                iconProps={{ iconName: "Underline" }}
                id="NameUnderline"
                onClick={() => setUnderlineJob(!underlineJob)}
                className={underlineJob && styles.underline}
              />
            </div>
          </div>
          <TextField
            type="number"
            onChange={(e: any) => setJobFontSize(e.target.value)}
            value={jobFontSize}
            style={{ width: 70 }}
            min={10}
            max={20}
          />
        </div>
        <Separator />
        <div className={styles.nameStyles}>
          <div>
            <Label>
              {translation.DepartmentFontSize
                ? translation.DepartmentFontSize
                : "Department font size"}
            </Label>
            <div className={styles.fontStylesGroup}>
              <IconButton
                iconProps={{ iconName: "Bold" }}
                id="NameBold"
                onClick={() => setBoldDep(!boldDep)}
                className={boldDep && styles.bold}
              />
              <IconButton
                iconProps={{ iconName: "Italic" }}
                id="NameItalic"
                onClick={() => setItalicDep(!italicDep)}
                className={italicDep && styles.italic}
              />
              <IconButton
                iconProps={{ iconName: "Underline" }}
                id="NameUnderline"
                onClick={() => setUnderlineDep(!underlineDep)}
                className={underlineDep && styles.underline}
              />
            </div>
          </div>
          <TextField
            type="number"
            onChange={(e: any) => setDepFontSize(e.target.value)}
            value={depFontSize}
            style={{ width: 70 }}
            min={10}
            max={20}
          />
        </div>
        <Separator />
        {/* -----------Image Positions Checkboxs start -----------*/}
        <div>
          <Label>
            {translation.AlignEmployeeImage
              ? translation.AlignEmployeeImage
              : "Align employee image"}
          </Label>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "10px",
            }}
          >
            <Checkbox
              label={translation.Left}
              onChange={() => setPosition("left")}
              checked={position === "left"}
            />
            <Checkbox
              label={translation.Center}
              onChange={() => setPosition("center")}
              checked={position === "center"}
            />
            <Checkbox
              label={translation.Right}
              onChange={() => setPosition("right")}
              checked={position === "right"}
            />
          </div>
        </div>
        <Separator />
        {/* -----------Image Positions Checkboxs end----------- */}

        {/*------------Preview card for updated styles--------- */}
        <div>
          <PreviewCard
            boldDep={boldDep}
            boldJob={boldJob}
            boldName={boldName}
            depFontSize={depFontSize}
            headFontSize={headFontSize}
            italicDep={italicDep}
            italicJob={italicJob}
            italicName={italicName}
            jobFontSize={jobFontSize}
            locationFontSize={locationFontSize}
            position={position}
            rootChartNode={rootChartNode}
            underlineDep={underlineDep}
            underlineJob={underlineJob}
            underlineName={underlineName}
          />
        </div>
        <div>
          <PrimaryButton onClick={() => save()}>
            {translation.save}
          </PrimaryButton>
        </div>
      </Panel>
    </div>
  );
};

export default OrgChartSettings;
