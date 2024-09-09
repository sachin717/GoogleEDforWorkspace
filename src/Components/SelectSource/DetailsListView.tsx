import { useEffect, useState } from "react";
import { Persona, PersonaSize, Icon, IconButton } from "@fluentui/react";
import { Modal } from "@fluentui/react";
import "../SelectSource/Edp.scss";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from "@fluentui/react/lib/DetailsList";
import EmployeeDetailModal from "./EmployeeDetailModal";
import useStore, { useSttings } from "./store";
import styles from "../SCSS/DetailsListView.module.scss";
import { useLanguage } from "../../Language/LanguageContext";
import GoogleChat from "../assets/images/googleChatIcon.png";
import GoogleMail from "../assets/images/gmail.png";

const personaTextStyles = {
  primaryText: {
    lineHeight: "20px",
  },
  secondaryText: {
    lineHeight: "20px",
  },
};

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

const ListStyles = {
  headerWrapper: {
    flex: "0 0 auto",
    selectors: {
      "& [role=presentation]": {
        selectors: {
          "& [role=row]": {
            background: "rgb(0, 120, 212, .4)",
            padding: "4px 0px",
            color: "inherit",

            selectors: {
              ".ms-DetailsHeader-cellTitle": {
                color: "rgb(0, 120, 212)",
              },
              ".ms-DetailsHeader-cell:hover": {
                color: "#fff",
                background: "rgb(0, 120, 212,0)",
              },
            },
          },
        },
      },
    },
  },

  contentWrapper: {
    flex: "1 1 auto",
    ".ms-DetailsRow-fields": {
      alignItems: "center",
      borderBottom: ".5px solid black",
    },

    "& .ms-DetailsRow-cell": {
      fontSize: "13px !important",
    },
  },
};

const DetailsListView = ({ employees }) => {
  const { translation } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { variable } = useStore();
  const {
    appSettings: {
      ShowHideViewModules: { ShowExtFields },
    },
  } = useSttings();
  const [allEmployees, setAllEmployees] = useState([]);
  const [userCard, setUserCard] = useState(null);
  const [showColumns, setShowColumns] = useState([]);

  const columns = [
    {
      key: "name",
      name: translation.Name || "Name",
      fieldName: "name",
      minWidth: 200,
      maxWidth: 250,
    },
    {
      key: "department",
      name: translation.Department || "Department",
      fieldName: "department",
      minWidth: 200,
      maxWidth: 250,
    },
    {
      key: "mobile",
      name: translation.Mobile || "Mobile",
      fieldName: "mobile",
      minWidth: 200,
      maxWidth: 250,
    },
    {
      key: "email",
      name: translation.Emails || "Email",
      fieldName: "email",
      minWidth: 200,
      maxWidth: 250,
    },
    {
      key: "manager",
      name: translation.Manager || "Manager",
      fieldName: "manager",
      minWidth: 200,
      maxWidth: 250,
    },
    {
      key: "address",
      name: translation.address || "Address",
      fieldName: "address",
      minWidth: 200,
      maxWidth: 250,
    },
    {
      key: "buildingId",
      name: "Building ID",
      fieldName: "buildingId",
      minWidth: 200,
      maxWidth: 250,
    },
    {
      key: "dateOfBirth",
      name: translation.DateofBirth || "Date of Birth",
      fieldName: "dateOfBirth",
      minWidth: 200,
      maxWidth: 250,
    },
    {
      key: "dateOfJoining",
      name: translation.DateofJoining || "Date of Joining",
      fieldName: "dateOfJoining",
      minWidth: 200,
      maxWidth: 250,
    },
  ];

  const openPanelForUser = (user: any) => {
    setUserCard(<EmployeeDetailModal isModalOpenTrans={true} user={user} />);
    setIsModalOpen(true);
  };

  const getAllEmployees = () => {
    const allEmployee = employees.map((x: any) => {
      const persona = (
        <div style={{ cursor: "pointer" }} onClick={() => openPanelForUser(x)}>
          <Persona
            imageInitials={x.initials}
            text={
              variable === "familyName"
                ? `${x.lastName} ${x.firstName}`
                : `${x.firstName} ${x.lastName}`
            }
            secondaryText={x.job}
            size={PersonaSize.size40}
            styles={personaTextStyles}
            imageUrl={x.image}
          />
        </div>
      );
      return {
        key: x.email,
        name: persona,
        department: x.department,
        mobile: x.mobile,
        email: x.email,
        job: x.job,
        manager: x.manager,
        address: x.floorname,
        buildingId: x.buildingid,
        dateOfBirth: x.DOB.split("-").reverse().join("/"),
        dateOfJoining: x.DOJ.split("-").reverse().join("/"),
      };
    });
    setAllEmployees(allEmployee);
  };

  useEffect(() => {
    if (!ShowExtFields) {
      const x = columns.splice(0, 5);
      setShowColumns(x);
    } else {
      setShowColumns(columns);
    }
    getAllEmployees();
  }, []);

  return (
    <div>
      <UserModal
        userCard={userCard}
        isModalOpen={isModalOpen}
        hideModal={() => setIsModalOpen(false)}
      />
      <div
        className={styles.listView}
        id="ViewListId"
        data-is-scrollable="true"
      >
        <DetailsList
          className={styles.detailsList}
          setKey="items"
          styles={ListStyles}
          items={allEmployees}
          columns={showColumns}
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible={true}
          onShouldVirtualize={() => false}
          selectionMode={SelectionMode.none}
          ariaLabelForGrid="Item details"
        />
      </div>
      <MobileViewOfDetailsList
        employees={employees}
        openPanelForUser={openPanelForUser}
      />
    </div>
  );
};

const MobileViewOfDetailsList = ({ employees, openPanelForUser }) => {
  return (
    <div>
      {employees.map((item:any, i:number) => {
        let diffStyle = {
          backgroundImage: "url('" + item.image + "')",
          backgroundRepeat: "no-repeat",
          width: "40px",
          height: "41px",
          position: "absolute",
          top: "10px",
          borderRadius: "50%",
          zIndex: 1,
          backgroundPosition: "center",
          backgroundSize: "cover",
        };
        console.log(item, "items");
        return (
          <>
            <div key={i} className="mblist">
              <div
                style={{ display: "flex", alignItems: "center", gap: "30px" }}
              >
                <div
                  style={{
                    backgroundImage: "url('" + item.image + "')",
                    cursor: "pointer",
                    backgroundRepeat: "no-repeat",
                    width: "72px",
                    height: "72px",
                    position: "absolute",
                    //  top: "8px",
                    borderRadius: "50%",
                    zIndex: 1,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                  onClick={() => openPanelForUser(item)}
                ></div>

                <Persona
                  imageInitials={item.initials}
                  // text={item.name}
                  // secondaryText={item.job}
                  size={PersonaSize.size72}
                  styles={personaTextStyles}
                />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    color: "#aaa",
                    fontSize: "13px",
                  }}
                >
                  <span title={item.name} className="mbViewName">
                    {item.name}
                  </span>
                  <span title={item.job}>{item.job}</span>
                  <span title={item.department}>{item.department}</span>
                  <span title={item.location}>{item.location}</span>
                  <span title={item.workphone}>{item.wpphone}</span>
                  <span title={item.mobile}>{item.mobile}</span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <a href="#" title={item.accName} target="_blank">
                  <img
                    src={GoogleChat}
                    width="22"
                    height="22"
                    alt="Word product icon"
                  />
                </a>

                <a
                  href={"mailto:" + item.email}
                  title={item.email}
                  target="_blank"
                >
                  <img
                    src={GoogleMail}
                    width="22"
                    height="22"
                    alt="Word product icon"
                  />
                </a>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

const UserModal = ({ isModalOpen, hideModal, userCard }) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onDismiss={hideModal}
      isBlocking={true}
      styles={modalPropsStylesEmpPC}
      topOffsetFixed={false}
    >
      <div>
        <IconButton
          style={{ position: "absolute", right: "10px",top:"5px" }}
          className={styles.closeEmpDetails}
          iconProps={{ iconName: "Cancel" }}
          ariaLabel="Close popup modal"
          onClick={hideModal}
        />
        {userCard}
      </div>
    </Modal>
  );
};

export default DetailsListView;
