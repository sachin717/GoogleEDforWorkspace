import * as React from "react";
import { CommandBar as Navbar } from "@fluentui/react/lib/CommandBar";
import {
  getCurrentUser,
  // isUserAdmin,
  // isUserAdminCheck,
} from "../Helpers/HelperFunctions";
import { useLanguage } from "../../Language/LanguageContext";
import styled from "styled-components";
import "./Edp.scss";
import { useSttings } from "./store";
import { useFields, useLists } from "../../context/store";

const Container = styled.div`
  .item-139:hover .ms-Icon {
    color: #ffff;
  }
`;

const commandBarItemStyles = {
  root: {
    border: "none",
    height: "35px",
    backgroundColor: "#f4f4f4",
    padding: "0px 0px !important",
    justifyContent: "center",
    icon: {
      padding: "8px 12px",
      margin: "0px !important",
    },

    "& .activeColor": {
      backgroundColor: "rgb(0, 120, 212) !important",
      color: "#fff",
    },
    "& .farItem:hover span i": {
      color: "#fff",
    },
  },
};

export interface IShowPanelProps {
  filterByLetter: (letter: string) => void;
  Settings?: any;
  isUserAdmin: boolean;
  setshowDashboard: any;
  appSettings:any;
  setSettings: (val: boolean) => void;
  setShowOrgChart: (val: boolean) => void;
  setShowHomePage: (val: boolean) => void;
  parsedData: any;
  UserArray: any;
  setDownloadCsvModal: (val: boolean) => void;
  toPDF: () => void;
  generatePDF: () => void;
  setBirthAndAnivModalOpen: any;
  showHomePage: boolean;
  setShowHelpPage:any;
}

const CommandBar: React.FC<IShowPanelProps> = (props) => {
  const {
   
    allUsers,
    CommandBarItems,
    admins,
  } = useFields();
  
  const { appSettings } = useSttings();
  const { usersList } = useLists();


  const [selectedLetter, setSelectedLetter] = React.useState("All");
  const currentUserId = getCurrentUser()?.cu;
  const { translation } = useLanguage();

  const filterByLetter = (letter: string) => {
    setSelectedLetter(letter);
    props.filterByLetter(letter);
  };

  let str: any = "ALL A B C D E F G H I J K L M N O P Q R S T U V W X Y Z";
  str = str.split(" ");

  const createLetterItem = (letter: string, i: any) => ({
    key: letter.toLowerCase(),
    text: str[i] == "ALL" ? "All" : translation[letter],
    id: `letter-${str[i]}`,

    onClick: () => {
      props.setShowHomePage(true);
      props.setSettings(false);
      props.setShowOrgChart(false);
      props.setshowDashboard(false);
      filterByLetter(letter);
    },
    className:
      selectedLetter.toLowerCase() === letter.toLowerCase()
        ? "activeColor"
        : "",
  });

  let filters = "ALL A B C D E F G H I J K L M N O P Q R S T U V W X Y Z";

  let letterItems = filters.split(" ").map(createLetterItem);

  const baseFarItems = [];
  let currentUser = getCurrentUser()?.cu;
  if (
    (CommandBarItems?.showDashboard &&
      (appSettings?.dashboardFeature.AvailableForAll ||
        (appSettings?.dashboardFeature?.AvaliableForSpecificUser &&
          usersList?.DashboardSpecificUsers?.some((item) =>
            item.email.includes(currentUser)
          )))) ||
    (props.isUserAdmin && CommandBarItems?.showDashboard)
  ) {
    baseFarItems.push({
      key: "dashboard",
      text: "Dashboard",
      ariaLabel: "Dashboard",
      iconOnly: true,
      iconProps: { iconName: "BIDashboard" },
      className: selectedLetter === "dashboard" ? "activeColor" : "farItem",
      onClick: () => {
        props.setshowDashboard(true);
        props.setShowOrgChart(false);
        props.setShowHomePage(false);
        props.setSettings(false);
      },
    });
  }
  if (CommandBarItems?.IsExportToCsv) {
    baseFarItems.push({
      key: "ExportToCSV",
      text: "Export To CSV",
      ariaLabel: "Export To CSV",
      iconOnly: true,
      iconProps: { iconName: "ExcelDocument" },
      className: selectedLetter === "Export To CSV" ? "activeColor" : "farItem",
      onClick: () => {
        props.setDownloadCsvModal(true);
        props.setshowDashboard(false);
      },
    });
  }
  if (CommandBarItems?.showBirthAniv) {
    baseFarItems.push({
      key: "birthAniv",
      text: "Birthday and anniversary",
      ariaLabel: "Birthday and anniversary",
      iconOnly: true,
      iconProps: { iconName: "BirthdayCake" },
      className: selectedLetter === "birthAniv" ? "activeColor" : "farItem",
      onClick: () => {
        props.setBirthAndAnivModalOpen(true);
        // props.setshowDashboard(false);
        // props.setShowHomePage(true);
      },
    });
  }
  if (CommandBarItems.AllowUserToPrintPDF) {
    baseFarItems.push({
      key: "Print",
      text: "Print to PDF",
      ariaLabel: "Print to PDF",
      iconProps: { iconName: "Print" },
      className: selectedLetter === "Print" ? "activeColor" : "farItem",
      iconOnly: true,
      onClick: () => {
        if (props.showHomePage) {
          props.generatePDF();
        }
      },
    });
  }
  if (CommandBarItems?.ShowOrgChart) {
    baseFarItems.push({
      key: "Org",
      text: "Organizational Chart",
      ariaLabel: "Organizational Chart",
      iconOnly: true,
      iconProps: { iconName: "Org" },
      className: selectedLetter === "Org" ? "activeColor" : "farItem",
      onClick: () => {
        props.setSettings(false);
        props.setShowHomePage(false);
        props.setShowOrgChart(true);
        props.setshowDashboard(false);
      },
    });
  }
  if (appSettings.CustomHomePageUrl?.CustomHomePageLinkActive) {
    baseFarItems.push({
      key: props?.parsedData?.CustomHomePageUrl.homeCustomUrlIconName,
      text: props?.parsedData?.CustomHomePageUrl.homeCustomUrlIconName,
      ariaLabel: props?.parsedData?.CustomHomePageUrl.homeCustomUrlIconName,
      iconOnly: true,
      iconProps: {
        iconName: props?.parsedData?.CustomHomePageUrl.homeCustomUrlIconName,
      },
      className:
        selectedLetter ===
        props?.parsedData?.CustomHomePageUrl.homeCustomUrlIconName
          ? "activeColor"
          : "",
      onClick: () =>
        window.open(
          props?.parsedData?.CustomHomePageUrl?.homeCustomUrl,
          "_blank"
        ),
    });
  }

  if (props.isUserAdmin || admins.includes(currentUser)) {
    baseFarItems.push({
      key: "Settings",
      text: "Settings",
      ariaLabel: "Settings",
      iconOnly: true,
      iconProps: { iconName: "Settings" },
      className: selectedLetter === "Settings" ? "activeColor" : "farItem",
      onClick: () => {
        props.setShowOrgChart(false);
        props.setShowHomePage(false);
        props.setshowDashboard(false);
        props.setSettings(true);
        setSelectedLetter("Settings");
      },
    });
  }
 
    baseFarItems.push({
      key: "Help",
      text: "Help",
      ariaLabel: "Help",
      iconOnly: true,
      iconProps: { iconName: "Help" },
      className: selectedLetter === "question" ? "activeColor" : "farItem",
      onClick: () => props.setShowHelpPage(true)
    });
  
  const farItems = [...baseFarItems];

  return (
    <Container>
      <Navbar
        items={letterItems}
        // farItems={props.isUserAdmin ? farItems : [] as any}
        farItems={farItems || []}
        styles={commandBarItemStyles}
      />
    </Container>
  );
};

export default CommandBar;
