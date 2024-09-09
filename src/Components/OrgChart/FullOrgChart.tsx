import { useRef, useEffect, useState } from "react";
import { OrgChart } from "d3-org-chart";
import { Icon, Spinner, SpinnerSize } from "@fluentui/react";
import useStore from "../SelectSource/store";
import OrgChartSettings from "./OrgChartSettings";
import { IconButton, Modal } from "@fluentui/react";
import { useLanguage } from "../../Language/LanguageContext";
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
  const { topManager, userArray, typeOrg, orgChartHead } = useStore();
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
  const { translation } = useLanguage();
  const { appSettings } = useSttings();
  //  ------------------ STYLE STATES ENDS-------------

  const d3Container = useRef(null);
  let chart = null;

  useEffect(() => {
    if (appSettings.orgChartType === "StanderdOrgCharts") {
      // Find the selected user
      const selectedUser = userArray.find((user) => user.email === topManager);

      if (!selectedUser) return;
      // Initialize tree with the selected user

      let tree = [
        {
          id: selectedUser.id,
          parentId: "", // This is the root, so parentId is empty
          name: selectedUser.userName ?? selectedUser.name,
          jobTitle: selectedUser.job,
          department: selectedUser.department,
          location: selectedUser.location,
          imageUrl: selectedUser.image,
          tag: selectedUser.name,
          email: selectedUser.email,
          manager: selectedUser.manager,
        },
      ];

      // Function to add managers to the tree
      const addManagersToTree = (currentUser, tree) => {
        console.log("currentUser..", currentUser);
        if (!currentUser.manager) return; // Stop if there's no manager

        const manager = userArray.find(
          (user) => user.email === currentUser.manager
        );
        if (manager) {
          // Add the manager to the tree if not already present
          if (!tree.some((user) => user.email === manager.email)) {
            tree.unshift({
              id: manager.id,
              parentId: "", // This manager is the root, so parentId is empty
              tag: manager.name,
              email: manager.email,
              manager: manager.manager,
              //--------------
              imageUrl: manager.image,
              name: manager.userName ?? manager.name,
              jobTitle: manager.job,
              department: manager.department,
              location: manager.location,
            });
          }

          // Update the parentId of the current user to the manager's id
          const currentUserIndex = tree.findIndex(
            (user) => user.email === currentUser.email
          );
          if (currentUserIndex !== -1) {
            tree[currentUserIndex].parentId = manager.id;
          }
        }
      };

      // Function to add reportees to the tree
      const addReporteesToTree = (userEmail, tree) => {
        console.log("userEmail............", { userEmail, tree });
        userArray
          .filter((user) => user.manager === userEmail)
          .forEach((reportee) => {
            // Add the reportee to the tree if not already present
            if (!tree.some((user) => user.email === reportee.email)) {
              tree.push({
                id: reportee.id,
                parentId: tree.find((user) => user.email === userEmail).id, // Set the parentId to the current user's id
                positionName: reportee.name,
                imageUrl: reportee.image,
                tag: reportee.name,
                email: reportee.email,
                manager: reportee.manager,
                //-------------
                name: reportee.userName ?? reportee.name,
                jobTitle: reportee.job,
                department: reportee.department,
                location: reportee.location,
              });
            }
          });
      };

      // Add managers to the tree, if any
      addManagersToTree(selectedUser, tree);

      // Add reportees to the tree, starting with the selected user's email
      addReporteesToTree(selectedUser.email, tree);

      console.log("Final tree structure if condition", tree);
      setChartData(tree);
    } else {
      console.log(topManager, "selecyted user");

      const selectedUser = userArray.find(
        (user) => user.email === appSettings.orgChartHead
      );
      if (!selectedUser) return;

      const tree = [];

      // Function to add a user to the tree
      const addUserToTree = (user, parentId = "") => {
        console.log("addUserToTree..........", user);
        tree.push({
          id: user.id,
          parentId: parentId,
          imageUrl: user.image, //img
          userName: user.userName ?? user.name, //name
          jobTitle: user.job, // jobTitle
          location: user.location, //location
          department: user.department, //department
          //----------
          name: user.userName ?? user.name,
          positionName: user.department,
          email: user.email,
          manager: user.manager,
          tag: user.name,
          user: user,
        });
      };

      // Recursive function to add reportees to the tree
      const addReporteesToTree = (managerEmail) => {
        const reportees = userArray.filter(
          (user) => user.manager === managerEmail
        );
        reportees.forEach((reportee) => {
          if (!tree.some((t) => t.email === reportee.email)) {
            const parent = tree.find((t) => t.email === managerEmail);
            addUserToTree(reportee, parent ? parent.id : "");
            addReporteesToTree(reportee.email);
          }
        });
      };

      // Initialize the tree with the topManager as the root
      addUserToTree(selectedUser);

      // Add all direct and indirect reportees of the topManager
      addReporteesToTree(selectedUser.email);

      console.log("Final tree structure",tree);
      setChartData(tree);
    }
  }, [topManager, userArray, appSettings.orgChartType]);

  useEffect(() => {
    if (!chart && chartData.length > 0 && d3Container.current) {
      chart = new OrgChart();
      chart.container(d3Container.current).data(chartData).render();
    } else if (chartData.length === 1) {
      // If there's only one node, manually set its position
      const singleNode = chartData[0];
      singleNode.x = 50;
      singleNode.y = 50;
      chart = new OrgChart();
      chart.container(d3Container.current).data(chartData).render();
    } else if (chartData.length === 0) {
      console.log("0");
    }

    return () => {
      if (chart && d3Container.current) {
        d3Container.current.innerHTML = "";
        chart = null;
      }
    };
  }, [chartData]);

  const handleNodeClick = (node: any) => {
    const user = FormatedUserData.find((x: any) => x.id === node.data.id);
    setClickedCard(<EmployeeDetailModal isModalOpenTrans={true} user={user} />);
    setIsModalOpen(true);
  };

  // useEffect which renders the chart on DOM
  useEffect(() => {
    setRootChartNode(chartData[0]);
    if (!chart) {
      chart = new OrgChart();
    }

    chart
      .container(d3Container.current)
      .data(chartData)
      .childrenMargin((node) => 60)
      .nodeWidth((d) => 250)
      .nodeHeight((d) => 175)
      .onNodeClick((d, i, arr) => {
        handleNodeClick(d);
      })

      .buttonContent(({ node, state }) => {
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

      .nodeContent(function (d, i, arr, state) {
        const { imageUrl, name, jobTitle, department, location } = d.data;

        //---------- Styles for org chart--------
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

        //---------- Styles for org chart end--------

        // ----------------Org Chart Card------------
        return `
        <div style="${orgChartStyles.wrapper}">
          <div style="${orgChartStyles.container}">
            <div style="${orgChartStyles.imgCon}">
              ${`
                <img
                  src="${imageUrl}";
                  alt="IMAGE"
                  style="${orgChartStyles.img}"
                />
              `}
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
