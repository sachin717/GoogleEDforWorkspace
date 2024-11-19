import { useRef, useEffect, useState, useMemo } from "react";
import { OrgChart } from "d3-org-chart";
import OrgChartSettings from "./OrgChartSettings";
import { IconButton, Modal, Icon } from "@fluentui/react";
import EmployeeDetailModal from "../SelectSource/EmployeeDetailModal";
import { useSttings } from "../SelectSource/store";
import { useFields } from "../../context/store";
import { getCurrentUser } from "../Helpers/HelperFunctions";
import * as jspdf from "jspdf";
import html2canvas from "html2canvas";
import ReactSelect from "react-select";

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

const stylesReactSelect: any = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderRadius: "0px",
    minHeight: "32px",
    boxShadow: state.isFocused ? `0 0 0 .5px black` : provided.boxShadow,
    borderColor: state.isFocused ? `black` : provided.borderColor,
    "&:hover": {
      borderColor: state.isFocused ? `black` : provided.borderColor,
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#AAA",
    fontSize: "15px",
  }),
};

export default function FullOrgChart({
  setSettings,
  setShowHomePage,
  setShowOrgChart,
  setshowDashboard,
}) {
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
  const [locationFontSize] = useState<number>(12);

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

  const [refres, setRefresh] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newUser, setNewUser] = useState<any>(null);

  function backToHome() {
    setSettings(false);
    setShowHomePage(true);
    setShowOrgChart(false);
    setshowDashboard(false);
  }

  const generatePDF = () => {
    const input = document.getElementById("D3orgchart");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jspdf.jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("OrgChart");
    });
  };

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
    refres,
    newUser,
  ];
  const { appSettings } = useSttings();
  const { allUsers } = useFields();
  //  ------------------ STYLE STATES ENDS-------------

  const ref = useRef(null);
  let chart = useMemo(() => new OrgChart(), [allUsers, ...dependices]);
  const userOption = useMemo(
    () => allUsers.map((x: any) => ({ value: x.email, label: x.name })),
    [allUsers]
  );

  const getChartData = (rootEmail: string) => {
    if (rootEmail === "") return;

    const root = allUsers.find((x: any) => x.email === rootEmail);

    const getReportees = (managerEmail: string, parentId: string) => {
      const reportees = allUsers.filter((x: any) => x.manager === managerEmail);
      return reportees.flatMap((x: any) => [
        {
          id: x.id,
          parentId: parentId,
          imageUrl: x.image,
          name: x.name,
          jobTitle: x.job,
          department: x.department,
          location: x.location,
        },
        ...getReportees(x.email, x.id),
      ]);
    };

    const rootUser = {
      id: root.id,
      parentId: "",
      imageUrl: root.image,
      name: root.name,
      jobTitle: root.job,
      department: root.department,
      location: root.location,
    };

    const reporteesToRoot = getReportees(root.email, root.id);

    setChartData([rootUser, ...reporteesToRoot]);
    setRootChartNode(rootUser);
  };

  useEffect(() => {
    if (appSettings.OrgChart.chartType === "TwoLevelOrgChart") {
      const user = getCurrentUser();
      getChartData(user.cu ?? "");
      setNewUser({ value: user.cu, label: user.Ad });
    } else {
      getChartData(appSettings.OrgChart?.chartHead?.value || "");
      setNewUser(appSettings.OrgChart?.chartHead || null);
    }

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
    chart
      .container(ref.current)
      .data(chartData)
      .initialZoom(0.7)
      .childrenMargin(() => 60)
      .nodeWidth(() => 250)
      .nodeHeight(() => 175)
      .onNodeClick((d: any) => handleNodeClick(d))
      .buttonContent(({ node }: any) => {
        const buttonStyles = `
            color:#FFF;
            padding:3px 6px;
            font-size:10px;
            margin:auto auto;
            background-color: rgb(0, 112, 220);
          `;
        return `<div style="${buttonStyles}">${node.data._directSubordinates}</div>`;
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
              padding-top:35px;
              padding-bottom:10px;
              margin-left-5px;
              display:flex;
              justify-content:center;
              flex-direction:column;
              align-items:center;
            `,
          name: `
              color:#333;
              font-size:${headerFontSize}px;
              font-weight:${headerTextFontStyles.bold && "bold"};
              font-style:${headerTextFontStyles.italic && "italic"};
              text-decoration: ${headerTextFontStyles.underline && "underline"};
              width: 180px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              text-align:center;
            `,
          jobTitle: `
              font-size:${jobTitleFontSize}px;
              font-weight: ${jobTitleFontStyle.bold === true ? "bold" : ""};
              font-style: ${jobTitleFontStyle.italic === true ? "italic" : ""};
              text-decoration: ${
                jobTitleFontStyle.underline === true ? "underline" : ""
              };
              color:#333;
              margin-top:4px;
              width: 180px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              text-align:center;
            `,
          department: `
              width: 180px;
              font-size:${departmentFontSize}px;
              color:#404040;
              font-weight:${departmentFontStyles.bold && "bold"};
              font-style: ${departmentFontStyles.italic && "italic"};
              text-decoration: ${departmentFontStyles.underline && "underline"};
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              text-align:center;
            `,
          location: `
              width: 180px;
              font-size: ${locationFontSize}px;
              color:#404040;
              margin-top:4px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              text-align:center;
            `,
        };

        const initial = name[0];

        return `
          <div style="${orgChartStyles.wrapper}">
            <div style="${orgChartStyles.container}">
              <div style="${orgChartStyles.imgCon}">
                <img
                  src="${imageUrl}"
                  onerror="this.src='${`https://api.dicebear.com/9.x/initials/svg?backgroundColor=0070DC&seed=${initial}`}'"
                  style="${orgChartStyles.img}"
                />
              </div>
              <div style="${orgChartStyles.textWrapper}">
                <div style="${orgChartStyles.textContainer}">
                  <div title="${`${name}`}" style="${orgChartStyles.name}">${name}</div>
                  <div title="${`${jobTitle}`}" style="${orgChartStyles.jobTitle}">${jobTitle}</div>
                  <div title="${`${department}`}" style="${orgChartStyles.department}">${department}</div>
                  <div title="${`${location}`}" style="${orgChartStyles.location}">${location}</div>
                </div>
              </div>
            </div>
          </div>`;
      })
      .render();

    return () => {
      // Cleanup function to remove the chart from the DOM when the component is unmounted
      if (ref.current) {
        ref.current.innerHTML = ""; // Clear the container
      }
    };
  }, [chartData, ...dependices, allUsers]);

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
            gap: "3px",
          }}
        >
          <div>
            <div>
              <ReactSelect
                options={userOption}
                value={newUser}
                isClearable={appSettings.OrgChart?.chartHead?.value === newUser?.value ? false :true}
                placeholder="Select user"
                styles={stylesReactSelect}
                onChange={(value: any) => {
                  if (value === null) {
                    getChartData(appSettings.OrgChart?.chartHead?.value || "");
                    setNewUser(appSettings.OrgChart?.chartHead);
                    return;
                  }
                  getChartData(value.value);
                  setNewUser(value);
                }}
              />
            </div>
            <div style={{ display: "flex", marginTop: "5px", alignItems:"center" }}>
              <div
                style={{ color: "rgb(0, 120, 212)", cursor: "pointer" }}
                onClick={
                  isExpanded
                    ? () => {
                        setIsExpanded(false);
                        chart.collapseAll();
                      }
                    : () => {
                        setIsExpanded(true);
                        chart.expandAll();
                      }
                }
              >
                {isExpanded ? "Collapse all" : "Expand all"}
              </div>
              {/* <IconButton
                onClick={() => chart.zoomIn()}
                iconProps={{ iconName: "ZoomIn" }}
                title="Zoom in"
              />
              <IconButton
                onClick={() => chart.zoomOut()}
                iconProps={{ iconName: "ZoomOut" }}
                title="Zoom out"
              /> */}
              <IconButton
                onClick={backToHome}
                iconProps={{ iconName: "Home" }}
              />
              <IconButton
                onClick={() => setRefresh((prev) => prev + 1)}
                iconProps={{ iconName: "Refresh" }}
                title="Home"
              />
              <IconButton
                onClick={() => generatePDF()}
                iconProps={{ iconName: "Print" }}
                title="Print"
              />
              <IconButton
                onClick={() => chart.exportSvg()}
                iconProps={{ iconName: "Generate" }}
                title="Generate"
              />
              <IconButton
                onClick={() => setIsOpenSettingsPanel(true)}
                iconProps={{ iconName: "Repair" }}
                title="Repair"
              />
            </div>
          </div>
        </div>
      </div>

      <div ref={ref} id={"D3orgchart"} />

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
