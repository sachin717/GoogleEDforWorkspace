import { Checkbox, IconButton, Separator } from "@fluentui/react";
import { Label, Panel, PrimaryButton, TextField } from "@fluentui/react";
import { useState } from "react";
import styles from "../SCSS/OrgChartPage.module.scss";
import PreviewCard from "./PreviewCard";
import { useLanguage } from "../../Language/LanguageContext";

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
  const [position, setPosition] = useState<any>(imagesPosition);
  const [headFontSize, setHeadFontSize] = useState(headerFontSize);
  const [jobFontSize, setJobFontSize] = useState(jobTitleFontSize);
  const [depFontSize, setDepFontSize] = useState(departmentFontSize);

  // name font styles controls
  const [boldName, setBoldName] = useState(headerTextFontStyles.bold);
  const [italicName, setItalicName] = useState(headerTextFontStyles.italic);
  const [underlineName, setUnderlineName] = useState(
    headerTextFontStyles.underline
  );

  // job title font styles controls
  const [boldJob, setBoldJob] = useState(jobTitleFontStyle.bold);
  const [italicJob, setItalicJob] = useState(jobTitleFontStyle.italic);
  const [underlineJob, setUnderlineJob] = useState(jobTitleFontStyle.underline);

  // department font styles controls
  const [boldDep, setBoldDep] = useState(departmentFontStyles.bold);
  const [italicDep, setItalicDep] = useState(departmentFontStyles.italic);
  const [underlineDep, setUnderlineDep] = useState(
    departmentFontStyles.underline
  );
  const { translation } = useLanguage();
  // button to save the all Panel settings
  const save = () => {
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
  };

  return (
    <div>
      <Panel
        headerText={
          translation.CustomizeChart
            ? translation.CustomizeChart
            : "Customize Chart"
        }
        isOpen={isOpen}
        onDismiss={() => handleOnDismiss(false)}
      >
        {/* --------------------- name font setting------------------ */}
        <div className={styles.nameStyles}>
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
          <PrimaryButton
            onClick={() => {
              save();
              handleOnDismiss(false);
            }}
          >
            {translation.save}
          </PrimaryButton>
        </div>
      </Panel>
    </div>
  );
};

export default OrgChartSettings;
