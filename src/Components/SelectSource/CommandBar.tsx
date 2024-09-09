import * as React from "react";
import { CommandBar as Navbar } from "@fluentui/react/lib/CommandBar";
import { getCurrentUser } from "../Helpers/HelperFunctions";
import { useLanguage } from "../../Language/LanguageContext";
import styled from "styled-components";
import "./Edp.scss"
import { useSttings } from "./store";

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
    },
  },
};

export interface IShowPanelProps {
  filterByLetter: (letter: string) => void;
  Settings?: any;
  isUserAdmin: boolean;
  setshowDashboard:any,
  setSettings: (val: boolean) => void;
  setShowOrgChart: (val: boolean) => void;
  setShowHomePage: (val: boolean) => void;
  parsedData: any;
  UserArray: any;
  setDownloadCsvModal: (val: boolean) => void;
  toPDF:()=>void;
  generatePDF:()=>void;
  setBirthAndAnivModalOpen:any,
  showHomePage: boolean;
}

const CommandBar: React.FC<IShowPanelProps> = (props) => {
  const {appSettings}=useSttings();
  const [selectedLetter, setSelectedLetter] = React.useState("All");
  const currentUserId = getCurrentUser()?.cu;
  const {translation} = useLanguage();
  const filterByLetter = (letter: string) => {
    setSelectedLetter(letter);
    props.filterByLetter(letter);
  };

  const createLetterItem = (letter: string) => ({
    key:letter.toLowerCase(),
    text: letter,
    id: `letter-${letter}`,
    onClick: () => {
      props.setShowHomePage(true);
      props.setSettings(false);
      props.setShowOrgChart(false)
      props.setshowDashboard(false);
      filterByLetter( letter=="All"?"ALL":letter);
    },
    className: selectedLetter.toLowerCase() === letter.toLowerCase() ? "activeColor" : "",
  });

  let filters=`${translation.All?translation.All:"All"} ${translation.A ? translation.A : "A"} ${translation.B ? translation.B : "B"} ${translation.C ? translation.C : "C"} ${translation.D ? translation.D : "D"} ${translation.E ? translation.E : "E"} ${translation.F ? translation.F : "F"} ${translation.G ? translation.G : "G"} ${translation.H ? translation.H : "H"} ${translation.I ? translation.I : "I"} ${translation.J ? translation.J : "J"} ${translation.K ? translation.K : "K"} ${translation.L ? translation.L : "L"} ${translation.M ? translation.M : "M"} ${translation.N ? translation.N : "N"} ${translation.O ? translation.O : "O"} ${translation.P ? translation.P : "P"} ${translation.Q ? translation.Q : "Q"} ${translation.R ? translation.R : "R"} ${translation.S ? translation.S : "S"} ${translation.T ? translation.T : "T"} ${translation.U ? translation.U : "U"} ${translation.V ? translation.V : "V"} ${translation.W ? translation.W : "W"} ${translation.X ? translation.X : "X"} ${translation.Y ? translation.Y : "Y"} ${translation.Z ? translation.Z : "Z"}`;
        
  let letterItems = filters.split(" ").map(createLetterItem);
  
  const baseFarItems = [
  
    {
      key: "Settings",
      text: "Settings",
      ariaLabel: "Settings",
      iconOnly: true,
      iconProps: { iconName: "Settings" },
      className: selectedLetter === "Settings" ? "activeColor" : "",
      onClick: () => {
        props.setShowOrgChart(false);
        props.setShowHomePage(false);
        props.setshowDashboard(false);
        props.setSettings(true);
        setSelectedLetter("Settings");
      },
    },
  ];
  
  const farItems = [...baseFarItems];

if (props?.parsedData?.IsAdmin?.includes(currentUserId)) {
    const additionalItems = [];
  

    if (props?.parsedData?.CustomHomePageUrl?.CustomHomePageLinkActive) {
      additionalItems.push({
        key: props?.parsedData?.CustomHomePageUrl.homeCustomUrlIconName,
        text: props?.parsedData?.CustomHomePageUrl.homeCustomUrlIconName,
        ariaLabel: props?.parsedData?.CustomHomePageUrl.homeCustomUrlIconName,
        iconOnly: true,
        iconProps: { iconName: props?.parsedData?.CustomHomePageUrl.homeCustomUrlIconName },
        className: selectedLetter === props?.parsedData?.CustomHomePageUrl.homeCustomUrlIconName ? "activeColor" : "",
        onClick: () => window.open(props?.parsedData?.CustomHomePageUrl?.homeCustomUrl, '_blank'),
      });
    }

    if (appSettings?.IsExportToCsv) {
      additionalItems.push({
        key: "ExportToCSV",
        text: "Export To CSV",
        ariaLabel: "Export To CSV",
        iconOnly: true,
        iconProps: { iconName: "ExcelDocument" },
        className: selectedLetter === "Export To CSV" ? "activeColor" : "",
        onClick: () => {props.setDownloadCsvModal(true); props.setshowDashboard(false);},
      });
    }
    if (appSettings?.showBirthAniv) {
      additionalItems.push({
        key: "birthAniv",
        text: "Birthday and anniversary",
        ariaLabel: "Birthday and anniversary",
        iconOnly: true,
        iconProps: { iconName: "BirthdayCake" },
        className: selectedLetter === "birthAniv" ? "activeColor" : "",
        onClick: () =>{ 
          props.setBirthAndAnivModalOpen(true);
          props.setshowDashboard(false);
        
        }
      });
    }
    // if ((props?.parsedData?.showDashboard && props?.parsedData?.dashboardFeature.AvailableForAll)||(props?.parsedData?.showDashboard && props?.parsedData?.dashboardFeature?.AvaliableForSpecificUser && props?.parsedData?.dashboardAccessUsers.map((item=>item.includes(getCurrentUser()?.cu)))) ) {
    //   additionalItems.push({
    //     key: "dashboard",
    //     text: "dashboard",
    //     ariaLabel: "dashboard",
    //     iconOnly: true,
    //     iconProps: { iconName: "BIDashboard" },
    //     className: selectedLetter === "dashboard" ? "activeColor" : "",
    //     onClick: () =>{
    //       props.setshowDashboard(true);
    //       props.setShowOrgChart(false);
    //       props.setShowHomePage(false);
    //       props.setSettings(false);
          
    //     }
    //   });
    // }
    let currentUser=getCurrentUser()?.cu;
    if (
      appSettings?.showDashboard && (
        appSettings?.dashboardFeature.AvailableForAll ||
        (
          appSettings?.dashboardFeature?.AvaliableForSpecificUser &&
          appSettings?.dashboardAccessUsers?.some(item => item.email.includes(currentUser))
        )
      )
    ) {
      additionalItems.push({
        key: "dashboard",
        text: "Dashboard",
        ariaLabel: "Dashboard",
        iconOnly: true,
        iconProps: { iconName: "BIDashboard" },
        className: selectedLetter === "dashboard" ? "activeColor" : "",
        onClick: () => {
          props.setshowDashboard(true);
          props.setShowOrgChart(false);
          props.setShowHomePage(false);
          props.setSettings(false);
        }
      });
    }
    

    if (props?.parsedData?.AllowUserToPrintPDF) {
      additionalItems.push({
        key: "Print",
        text: "Print to PDF",
        ariaLabel: "Print to PDF",
        iconProps: { iconName: "Print" },
        iconOnly: true,
        onClick:()=>{
          if(props.showHomePage){
            props.generatePDF()
          }
        }
      });
    }
    if(appSettings?.ShowOrgChart){
      additionalItems.push({
        key: "Org",
        text: "Organizational Chart",
        ariaLabel: "Organizational Chart",
        iconOnly: true,
        iconProps: { iconName: "Org" },
        className: selectedLetter === "Org" ? "activeColor" : "",
        onClick: () => {
          props.setSettings(false);
          props.setShowHomePage(false);
          props.setShowOrgChart(true);
          props.setshowDashboard(false);
        },
      })
    }

    farItems.unshift(...additionalItems);
  } else {
    // Remove 'Settings' if the user is not an admin
    const index = farItems.findIndex(item => item.key === "Settings");
    if (index !== -1) {
      farItems.splice(index, 1);
    }
  }
  
  return (
    <Container>
      <Navbar
        items={letterItems}
        farItems={props.isUserAdmin ? farItems : [] as any}
        styles={commandBarItemStyles}
      />
    </Container>
  );
};

export default CommandBar;

