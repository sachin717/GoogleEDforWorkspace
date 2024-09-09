import { useRef, useEffect, useState } from "react";
import { OrgChart } from "d3-org-chart";
import OrgChartSettings from "./OrgChartSettings";
import { IconButton, Modal, Icon } from "@fluentui/react";
import EmployeeDetailModal from "../SelectSource/EmployeeDetailModal";
import { useSttings } from "../SelectSource/store";
import { useFields } from "../../context/store";

const modalPropsStylesEmpPC = {
  main: {
    maxWidth: 1000,
    minWidth: 1000,
    maxHeight: "100%",
  },
};

const iconButtonStyles = {
  root: {
    marginLeft: "auto",
    marginTop: "4px",
    marginRight: "2px",
  },
  rootHovered: {
    backgroundColor: "#ededed",
  },
};

export default function FullOrgChart() {
  const [chartData, setChartData] = useState([]);
  const [rootChartNode, setRootChartNode] = useState<any>(null);
  const [isOpenSettingPanel, setIsOpenSettingsPanel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedCard, setClickedCard] = useState(null);
  const { FormatedUserData } = useFields();

  //  ------------------ STYLE STATES -----------------
  const [imagesPosition, setImagePosition] = useState<string>("center");
  const [textOverFlow, setTextOverFlow] = useState<any>("unset");
  const [headerFontSize, setHeaderFontSize] = useState<number>(18);
  const [departmentFontSize, setDepartmentFontSize] = useState<number>(15);
  const [jobTitleFontSize, setJobTitleFontSize] = useState<number>(15);
  const [locationFontSize, setLocationSize] = useState<number>(12);

  const [headerTextFontStyles, setHeaderTextFontStyles] = useState<any>({
    bold: false,
    italic: false,
    underline: false,
  });

  const [departmentFontStyles, setDepartmentFontStyles] = useState<any>({
    bold: false,
    italic: false,
    underline: false,
  });

  const [jobTitleFontStyle, setJobTitleFontStyle] = useState<any>({
    bold: false,
    italic: false,
    underline: false,
  });

  //dependencies for OrgChart to re-render with updated styles
  const dependices = [
    imagesPosition,
    textOverFlow,
    headerFontSize,
    departmentFontSize,
    jobTitleFontSize,
    headerTextFontStyles,
    departmentFontStyles,
    jobTitleFontStyle,
  ];
  const { appSettings } = useSttings();
  const { allUsers } = useFields();
  //  ------------------ STYLE STATES ENDS-------------

  const d3Container = useRef(null);
  let chart = null;

  const getChartData = (rootEmail: string) => {
    if (rootEmail == "") return;
    const root = allUsers.find((x: any) => x.email === rootEmail);
    const reportees = allUsers.filter((x: any) => root.email === x.manager);

    const rootUser = {
      id: root.id,
      parentId: "",
      imageUrl: root.image,
      name: root.name,
      jobTitle: root.job,
      department: root.department,
      location: root.location,
    };

    const reporteesToRoot = reportees.map((x: any) => {
      return {
        id: x.id,
        parentId: root.id,
        imageUrl: x.image,
        name: x.name,
        jobTitle: x.job,
        department: x.department,
        location: x.location,
      };
    });

    setChartData([...reporteesToRoot, rootUser]);
    setRootChartNode(rootUser);
  };

  useEffect(() => {
    getChartData(appSettings.OrgChart?.chartHead?.value || "");
    setHeaderFontSize(appSettings?.OrgChartStyles?.headFontSize || "20");
    setImagePosition(appSettings?.OrgChartStyles?.position || "center");
    setJobTitleFontSize(appSettings?.OrgChartStyles?.jobFontSize || "15");
    setDepartmentFontSize(appSettings?.OrgChartStyles?.depFontSize || "15");

    setDepartmentFontStyles(
      appSettings?.OrgChartStyles?.department || {
        bold: false,
        italic: false,
        underline: false,
      }
    );
    setHeaderTextFontStyles(
      appSettings?.OrgChartStyles?.headerText || {
        bold: false,
        italic: false,
        underline: false,
      }
    );
    setJobTitleFontStyle(
      appSettings?.OrgChartStyles?.jobTitle || {
        bold: false,
        italic: false,
        underline: false,
      }
    );
  }, []);

  const handleNodeClick = (node: any) => {
    const user = FormatedUserData.find((x: any) => x.id === node.data.id);
    setClickedCard(<EmployeeDetailModal isModalOpenTrans={true} user={user} />);
    setIsModalOpen(true);
  };

  // useEffect which renders the chart on DOM
  useEffect(() => {
    if (!chart) {
      chart = new OrgChart();
    }

    chart
      .container(d3Container.current)
      .data(chartData)
      .childrenMargin((node) => 60)
      .nodeWidth(() => 250)
      .nodeHeight(() => 175)
      .onNodeClick((d: any) => handleNodeClick(d))
      .buttonContent(({ node }) => {
        const buttonStyles = `
          color:#FFF;
          padding:3px 6px;
          font-size:10px;
          margin:auto auto;
          background-color: rgb(0, 112, 220);
        `;

        return `<div style="${buttonStyles}"> 
                  <span style="font-size:9px">${
                    node.children
                      ? `<i class="fas fa-angle-up"></i>`
                      : `<i class="fas fa-angle-down"></i>`
                  }
                  </span> 
                  ${node.data._directSubordinates}  
                </div>`;
      })

      .nodeContent((d: any) => {
        const { imageUrl, name, jobTitle, department, location } = d.data;

        const orgChartStyles = {
          imgCon: `
            text-align: ${imagesPosition};
            margin-left: -10px;
            margin-right: -10px
          `,
          img: `
            margin-top:-30px;
            border-radius:100px;
            width:60px;
            height:60px;
            object-fit:cover;
          `,
          wrapper: `
            padding-top:30px;
            background-color:none;
            margin-left:1px;
            height:${d.height}px;
            border-radius:2px;
            overflow:visible; 
            // transform: scale(0.8)
          `,
          container: `
            height:${d.height - 32}px;
            padding-top:0px;
            background-color:#f4f4f4;
            border:1px solid lightgray;
            
          `,
          textWrapper: `
            margin-top:-34px;
            background-color: rgb(0, 112, 220);
            height:10px;
            width:${d.width - 2}px;
            border-radius:1px
          `,
          textContainer: `
            padding:30px; 
            padding-top:35px;
            text-align:center;
            padding-bottom:10px;
            margin-left-5px;
          `,
          name: `
            color:#333;
            font-size:${headerFontSize}px;
            font-weight:${headerTextFontStyles.bold && "bold"};
            font-style:${headerTextFontStyles.italic && "italic"};
            text-decoration: ${headerTextFontStyles.underline && "underline"};
          `,
          jobTitle: `
            font-size:${jobTitleFontSize}px;
            font-weight: ${jobTitleFontStyle.bold === true ? "bold" : ""};
            font-style: ${jobTitleFontStyle.italic === true ? "italic" : ""};
            text-decoration: ${
              jobTitleFontStyle.underline === true ? "underline" : ""
            };
            text-overflow: ${textOverFlow}
            color:#333;
            margin-top:4px;
          `,
          department: `
            font-size:${departmentFontSize}px;
            color:#404040;
            margin-top:4px;
            font-weight:${departmentFontStyles.bold && "bold"};
            font-style: ${departmentFontStyles.italic && "italic"};
            text-decoration: ${departmentFontStyles.underline && "underline"};
            text-overflow: ${textOverFlow}
          `,
          location: `
            font-size: ${locationFontSize}px;
            color:#404040;
            margin-top:4px;
            text-overflow: ${textOverFlow}
          `,
        };

        const initial = name[0];

        //---------- Styles for org chart end--------

        // ----------------Org Chart Card------------

        return `
        <div style="${orgChartStyles.wrapper}">
          <div style="${orgChartStyles.container}">
            <div style="${orgChartStyles.imgCon}">
              <img
                src="${imageUrl}";
                onerror="this.src='${`https://api.dicebear.com/9.x/initials/svg?backgroundColor=0070DC&seed=${initial}`}'"
                alt="IMAGE"
                style="${orgChartStyles.img}"
              />
            </div>
            <div style="${orgChartStyles.textWrapper}">
              <div style="${orgChartStyles.textContainer}">
                <div style="${orgChartStyles.name}">${name}</div>
                <div style="${orgChartStyles.jobTitle}">${jobTitle}</div>
                <div style="${orgChartStyles.department}">${department}</div>
                <div style="${orgChartStyles.location}">${location}</div>
              </div>
            </div>
          </div>
        </div>`;
      })
      .render();

    return () => {
      // Cleanup function to remove the chart from the DOM when the component is unmounted
      if (d3Container.current) {
        d3Container.current.innerHTML = ""; // Clear the container
      }
    };
  }, [chartData, ...dependices]);

  return (
    <div>
      <div>
        <OrgChartSettings
          // ----handlers----
          handleOnDismiss={setIsOpenSettingsPanel}
          setImagePosition={setImagePosition}
          setTextOverFlow={setTextOverFlow}
          setDepartmentFontSize={setDepartmentFontSize}
          setJobTitleFontSize={setJobTitleFontSize}
          setHeaderFontSize={setHeaderFontSize}
          setHeaderTextFontStyles={setHeaderTextFontStyles}
          setDepartmentFontStyles={setDepartmentFontStyles}
          setJobTitleFontStyle={setJobTitleFontStyle}
          // ---- values ---
          isOpen={isOpenSettingPanel}
          imagesPosition={imagesPosition}
          departmentFontSize={departmentFontSize}
          textOverFlow={textOverFlow}
          headerFontSize={headerFontSize}
          jobTitleFontSize={jobTitleFontSize}
          locationFontSize={locationFontSize}
          headerTextFontStyles={headerTextFontStyles}
          departmentFontStyles={departmentFontStyles}
          jobTitleFontStyle={jobTitleFontStyle}
          rootChartNode={rootChartNode}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            marginTop: "10px",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={() => setIsOpenSettingsPanel(true)}
            iconProps={{ iconName: "Settings" }}
          />
        </div>
      </div>

      <div
        style={{
          position: "relative",
          scale: "0.75",
          display: "flex",
          justifyContent: "center",
        }}
        ref={d3Container}
        id={"D3orgchart"}
      />

      <div>
        <Modal
          isOpen={isModalOpen}
          onDismiss={() => setIsModalOpen(false)}
          isBlocking={true}
          styles={modalPropsStylesEmpPC}
          topOffsetFixed={false}
        >
          <div>
            <Icon
              className={"closeiconprofile"}
              styles={iconButtonStyles}
              iconName={"cancel"}
              onClick={() => setIsModalOpen(false)}
            />
            {clickedCard}
          </div>
        </Modal>
      </div>
    </div>
  );
}
