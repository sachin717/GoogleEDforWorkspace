import { IconButton, Label } from "@fluentui/react";
import FullOrgChart from "../OrgChart/FullOrgChart";
import styles from "../SCSS/OrgChartPage.module.scss";
import { useLanguage } from "../../Language/LanguageContext";

const OrgChartPage = ({ setShowOrgChart, setShowHomePage, filterByLetter }) => {
  const {languagePartUpdate,setLanguagePartUpdate,translation, setTranslation,languages, setLanguage, getTranslation } = useLanguage();
  return (
    <div>
      <div className={styles.container}>
        <div>
          <Label className={styles.orgChartHeader}>{translation.OrganizationalChart?translation.OrganizationalChart:"Organization Chart"}</Label>
        </div>
        <div className={styles.cancleBtn}>
          <IconButton
            title={"Close"}
            iconProps={{ iconName: "ChromeClose" }}
            style={{
              backgroundColor: "transparent",
              marginRight: "10px",
            }}
            onClick={() => {
              setShowOrgChart(false);
              setShowHomePage(true);
              filterByLetter("ALL");
            }}
          />
        </div>
      </div>
      <FullOrgChart />
    </div>
  );
};

export default OrgChartPage;
