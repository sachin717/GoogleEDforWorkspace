import { useEffect, useState } from "react";
import { Modal, Persona, PersonaSize } from "@fluentui/react";
import OrgChart from "react-orgchart";
import "react-orgchart/index.css";
import styles from "./ModalOrgChart.module.scss";
import "./modal.css";
import { useFields, useLists } from "../../context/store";

function ModalOrgChart({ email }) {
  const [chartData, setChartData] = useState<any>({});
  const [additionalManagers, setAdditionalManagers] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { allUsers } = useFields();
  const { usersList } = useLists();
  const Users = usersList?.Users ?? [];

  const getChartData = (email: string) => {
    let data: any = [...allUsers, ...Users];
    const user = data?.find((x:any) => x.email == email);
    const manager = data?.find((x:any) => user.manager === x.email);

    const reportees = data?.filter((x) => {
      if (x?.manager == user?.email) {
        return {
          name: x?.name ?? "",
          department: x?.department ?? "",
          jobTitle: x?.job ?? "",
          location: x?.location ?? "",
          image: x?.image ?? "",
          initials: x?.initials ?? "",
        };
      }
    });

    if (manager === undefined) {
      const signleNode = {
        name: user.name,
        department: user.name,
        jobTitle: user.job,
        location: user.location,
        image: user.image,
        initials: user.initials,
        children: reportees,
      };
      setChartData(signleNode);
      return;
    }

    const additionalManager = allUsers?.filter((x) => {
      if (user?.AdditionalManager?.includes(x.email)) {
        return x;
      }
    });

    let additionalManagerTree = [];
    for (let i = 0; i < additionalManager?.length; i++) {
      additionalManagerTree.push({
        name: additionalManager[i]?.name,
        department: additionalManager[i]?.name,
        jobTitle: additionalManager[i]?.job,
        location: additionalManager[i]?.location,
        image: additionalManager[i]?.image,
        initials: additionalManager[i]?.initials,
        children: [],
      });
    }
    setAdditionalManagers(additionalManagerTree);
    const tree = {
      name: manager.name,
      department: manager.department,
      jobTitle: manager.job,
      location: manager.location,
      image: manager.image,
      initials: manager.initials,
      children: [
        {
          name: user.name,
          department: user.department,
          jobTitle: user.job,
          location: user.location,
          image: user.image,
          initials: user.initials,
          children: reportees,
        },
      ],
    };
    setChartData(tree);
    console.log("treee", tree);
  };

  useEffect(() => {
    getChartData(email);
  }, []);

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
        style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}
      >
        <OrgChart tree={chartData} NodeComponent={Node} />
        <div>
          {additionalManagers.length > 0 &&
            additionalManagers.map((x) => (
              <OrgChart tree={x} NodeComponent={SingleNode} />
            ))}
          <div className={additionalManagers.length > 0 && styles.lines}></div>
        </div>
      </div>
    </div>
  );
}

const Node = ({ node }) => {
  return (
    <div id="mail" style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
      <div className={styles.topbar}></div>
      <div className={styles.warpper}>
        <Persona
          imageInitials={node.initials}
          imageAlt={node.initials}
          imageUrl={node.image}
          size={PersonaSize.size72}
          styles={{
            root:{
              display:"block"
            }
          }}
        />
        <div className={styles.textContainer}>
          <div className={styles.name}>{node.name}</div>
          <div className={styles.text}>{node.jobTitle}</div>
          <div className={styles.text}>{node.department}</div>
          <div className={styles.text}>{node.location}</div>
        </div>
      </div>
    </div>
  );
};

const SingleNode = ({ node }) => {
  return (
    <div>
      <div className={styles.singleNodeTopBar}></div>
      <div className={styles.warpper}>
        <Persona
          imageInitials={node.initials}
          imageUrl={node.image}
          size={PersonaSize.size72}
        />
        <div className={styles.textContainer}>
          <div className={styles.name}>{node.name}</div>
          <div className={styles.text}>{node.jobTitle}</div>
          <div className={styles.text}>{node.department}</div>
          <div className={styles.text}>{node.location}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalOrgChart;
