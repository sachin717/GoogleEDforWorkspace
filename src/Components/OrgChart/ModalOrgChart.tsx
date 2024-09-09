import { useRef, useEffect, useState } from "react";
import { OrgChart } from "d3-org-chart";
import { Modal } from "@fluentui/react";
import useStore from "../SelectSource/store";

export default function ModalOrgChart(props) {
  const [chartData, setChartData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userArray } = useStore();

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

  //  ------------------ STYLE STATES ENDS-------------
  const [cData, setCData] = useState([]);
  const d3Container = useRef(null);
  let chart = null;

  const generateChartData = () => {
    const userEmail = props.selected;
    const u = userArray.find((x) => x.email == userEmail);
    const m = userArray.find((x) => u.manager == x.email);
    const data = [u, m];
    console.log("data", data);

    const d = data.map((x) => {
      const pid = userArray.find((y) => {
        if (x.manager === y.email) {
          return y.id;
        }
      });
      const id = pid === undefined ? "" : pid.id;
      return {
        id: x.id,
        parentId: id,
        imageUrl: x.image,
        Initials: x.initials,
        name: x.name,
        jobTitle: x.job,
        department: x.department,
        location: x.location,
      };
    });
    setCData(d);
  };

  useEffect(() => {
    // generateChartData();
  }, []);

  useEffect(() => {
    console.log("First useEffect");

    console.log(props.selected, "selected", props.userObj);

    // Find the selected user from the userObj array
    const selectedUser = props.userObj.find(
      (user) => user.email === props.selected
    );

    console.log("seleted user", selectedUser);

    if (selectedUser) {
      // Initialize tree data with the selected user as the root
      const tree = [
        {
          id: selectedUser.id,
          parentId: "",
          positionName: selectedUser.name,
          tag: selectedUser.name,
          email: selectedUser.email,
          manager: selectedUser.manager,
          //-----------------
          imageUrl: selectedUser.image,
          name: selectedUser.name,
          jobTitle: selectedUser.job,
          department: selectedUser.department,
          location: selectedUser.location,
        },
      ];

      // If the selected user has a manager, find and include the manager in the tree data
      if (selectedUser.manager) {
        
        const manager = props.userObj.find(
          (user) => user.email === selectedUser.manager
        );

        if (manager) {
          tree.push({
            id: manager.id,
            parentId: "", // Set the parentId to an empty string for the manager
            positionName: manager.name,
            tag: manager.name,
            email: manager.email,
            manager: manager.manager,
            //--------------
            imageUrl: manager.image,
            name: manager.name,
            jobTitle: manager.job,
            department: manager.department,
            location: manager.location,
          });

          // Set the parentId of the selected user to the manager's id
          tree[0].parentId = manager.id;
        }
      } else {
        const reportingEmp = props.userObj.filter(
          (user) => user.manager === selectedUser.email
        );
        if (reportingEmp) {
          reportingEmp.map((reportee) => {
            tree.push({
              id: reportee.id,
              parentId: selectedUser.id, // Set the parentId to an empty string for the manager
              positionName: reportee.name,
              tag: reportee.name,
              email: reportee.email,
              manager: reportee.manager,
              //--------------
              imageUrl: reportee.image,
              name: reportee.name,
              jobTitle: reportee.job,
              department: reportee.department,
              location: reportee.location,
            });

            // Set the parentId of the selected user to the manager's id
            //tree[0].parentId = manager.id;
          });
        }
      }

      console.log("tree", tree);
      setChartData(tree);
    }
  }, [props.selected, props.userObj]);

  useEffect(() => {
    console.log("Second useEffect");
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

  // useEffect which renders the chart in Modal
  useEffect(() => {
    console.log("Third useEffect");

    if (!chart) {
      chart = new OrgChart();
    }

    chart
      .container(d3Container.current)
      .data(chartData)
      // .data(cData)
      .childrenMargin((node) => 60)
      .nodeWidth((d) => 250)
      .nodeHeight((d) => 175)
      .onNodeClick((d, i, arr) => {})
      .buttonContent(({ node, state }) => {
        const buttonStyles = `
          color:#FFF;
          padding:3px 6px;
          font-size:10px;
          margin:auto auto;
          background-color: rgb(0, 112, 220);
          margin-top: 5px;
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
        const { imageUrl, Initials, name, jobTitle, department, location } =
          d.data;

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
            transform: scale(0.8);
          `,
          container: `
            height:${d.height - 32}px;
            padding-top:0px;
            background-color:#f4f4f4;
            border:1px solid lightgray;
            padding-bottom:10px
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
                  src=" ${imageUrl}";
                  onerror="this.onerror=null; this.src='${imageUrl}';" 
                  alt="${Initials}"
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
  }, [chartData]);

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onDismiss={() => setIsModalOpen(false)}
        isBlocking={true}
        styles={{
          main: {
            maxWidth: 1000,
            minWidth: 1000,
            maxHeight: "100%",
            transition: "opacity 0.3s",
          },
        }}
        topOffsetFixed={false}
      ></Modal>
      <div
        style={{ position: "relative" }}
        ref={d3Container}
        id={"D3orgchart"}
      />
    </div>
  );
}
