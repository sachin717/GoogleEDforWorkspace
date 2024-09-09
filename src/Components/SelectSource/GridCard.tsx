import { Icon, IconButton, Label, Persona, PersonaSize } from "@fluentui/react";
import { Modal } from "@fluentui/react";
import { useEffect, useRef, useState } from "react";
import "./Edp.scss";
import { useSttings } from "./store";
import googleChat from "../assets/images/googleChatIcon.png";
import gmailLogo from "../assets/images/gmail.png";
import styles from "../SCSS/Ed.module.scss";
import chart from "../SCSS/EmployeeDetailModal.module.scss";
import FarraAnimationGif from "../assets/images/birthanimation.gif";
import {
  formatDate,
  getCurrentUser,
  isUserAdmin,
} from "../Helpers/HelperFunctions";
import HoverCardComponent from "../HoverCard";
import { gapi } from "gapi-script";
import { useLanguage } from "../../Language/LanguageContext";
import ModalOrgChart from "../OrgChart/ModalOrgChart";

const modalPropsStyles = {
  main: {
    maxWidth: 3000,
    minWidth: 700,
    padding: "20px",
    margin: "10px",
    height: 500,
    overflowY: "hidden",
  },
};

function GridCard({
  users,
  item,
  userGridView,
  ISStartLastname,
  openPanelForUser,
}) {
  const { translation } = useLanguage();
  const [backgroundColor, setBackgroundColor] = useState("");
  const [isAdmin, setIsUserAdmin] = useState(false);
  const [fontColor, setFontColor] = useState("");
  const [labelValueLength, setLabelValueLength] = useState(0);
  const [managerDetails, setManagerDetails] = useState(null);
  const [showManager, setShowManager] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [isChartOpen, openChartModal] = useState(false);
  const [labelValue, setLabelValue] = useState<any>();
  const { appSettings } = useSttings();
  const {
    CollaborationSettings: { Chat, Mobile, WorkPhone },
    ShowHideViewModules: { ShowJoyfulAnimation },
  } = appSettings;
  const buttonRef = useRef(null);

  useEffect(() => {
    // let text1 = localStorage.getItem("cardcolor");
    let text1= appSettings?.ImageProfileTagData
    if (text1?.length) {
      let imageTagValues = text1?.split("^");
      setLabelValueLength(item[imageTagValues[0]]?.length);

      setLabelValue(item[imageTagValues[0]]?.split(""));

      setBackgroundColor(
        colorManager(item[imageTagValues[0]]?.length, imageTagValues[1])
      );
      setFontColor(imageTagValues[2]);
    }
    // getManagerDetails();
    isUserAdmin(item.email).then((isAdmin) => {
      setIsUserAdmin(isAdmin);
    });
    //  }
  }, []);
  function getManagerDetails() {
    console.log("item==", item);
    let initials = "";
    if (item?.manager && item.manager !== "") {
      getUserManager(item?.manager).then((getuser) => {
        if (getuser?.length > 0) {
          const user = getuser[0];
          console.log(user, "{]");
          const names = user?.name?.givenName?.split(" ");
          // const initials = names[0][0]?.toUpperCase() + (names?.length > 1 ? names[names?.length - 1][0]?.toUpperCase() : '');

          const managerInfo = {
            firstName: user?.name?.givenName,
            lastName: user?.name?.familyName,
            initials: initials,
            name: user?.name?.fullName,
            email: user?.primaryEmail,
            id: user?.id,
            job: user?.organizations?.[0]?.title || "",
            department: user?.organizations?.[0]?.department || "",
            image: user?.thumbnailPhotoUrl,
          };

          setManagerDetails(managerInfo);
          console.log("managerInfo", managerInfo);
          setShowManager(true);
        } else {
          setShowManager(false);
        }
      });
    } else {
      setShowManager(false);
    }
  }
  function showWFHOrWFOIcon() {
    let styles: any = {
      position: "absolute",
      right: "8px",
      top: "8px",
    };
    const individualWFHDetail = appSettings?.WorkWeekData?.find(
      (person) => person?.email === item?.email
    );
    console.log("ind", individualWFHDetail, appSettings?.WorkWeekData);
    let res = individualWFHDetail?.CurrentWeek?.find((val) => {
      console.log(
        "val?.date==formatDate(new Date());",
        val?.date == formatDate(new Date())
      );
      return val?.date == formatDate(new Date());
    });
    console.log("Res->", res);
    if (res) {
      let title = res?.status == "WFO" ? "Work from office" : "Work from home";
      return res?.status == "WFO" ? (
        <Icon style={styles} title={title} iconName="CityNext2" />
      ) : (
        <Icon style={styles} title={title} iconName="Home" />
      );
    } else {
      return (
        <Icon style={styles} title={"Work from office"} iconName="Office" />
      );
    }
  }
  const onRenderCompactCard: any = (item: any): JSX.Element => {
    getManagerDetails();
    return (
      <>
        <div style={{ padding: "0 10px" }}>
          <div style={{ display: "flex" }}>
            <div style={{ width: "80px", padding: "8px 0" }}>
              <Persona
                imageInitials={item.initials}
                size={PersonaSize.size72}
                // className="PersonaInitial"
                imageUrl={item.image}
                // presence={PersonaPresence.away}
              />
            </div>

            <div className="cards " style={{ padding: "8px 0" }}>
              {item?.name && (
                <div className="card hovercard-content">
                  <p className="name">
                    {ISStartLastname === "familyName"
                      ? `${item.lastName} ${item.firstName}`
                      : `${item.firstName} ${item.lastName}`}
                  </p>
                </div>
              )}
              {item?.location === "location" && (
                <span className="card hovercard-content">
                  <p>{item["location"]}</p>
                </span>
              )}

              {item?.email && (
                <span className="card hovercard-content">
                  <p className="link">
                    <a href={`mailto:${item["email"]}`}>{item["email"]}</a>
                  </p>
                </span>
              )}

              {item.workphone !== "" && (
                <div className="card hovercard-content">
                  <p className="link">
                    <a href={`tel:${item["workphone"]}`}>{item["workphone"]}</a>
                  </p>
                </div>
              )}

              {item.job !== "" && (
                <span className="card hovercard-content">
                  <p>{item["job"]}</p>
                </span>
              )}

              {item.department !== "" && (
                <span className="card hovercard-content">
                  <p>{item["department"]}</p>
                </span>
              )}
            </div>
          </div>
          <div
            className="empDetailIconView"
            style={{
              display: "flex",
              paddingLeft: "5px",
              justifyContent: "flex-start",
              gap: "20px",
            }}
          >
            {item.email && (
              <div>
                <a
                  //style={{ paddingLeft: "0px" }}
                  className="empDetailIcon"
                  href={"https://chat.google.com/"}
                  // href={`${Chat}:${item.email}`}
                  title={item.email}
                  target="_blank"
                >
                  <Icon style={{ fontSize: "20px" }} iconName="Message"></Icon>
                </a>
              </div>
            )}
            {item.email && (
              <div>
                <a
                  className="empDetailIcon"
                  href={"https://mail.google.com"}
                  // href={`${}`}
                  title={item.email}
                  target="_blank"
                >
                  <Icon style={{ fontSize: "20px" }} iconName="Mail"></Icon>
                </a>
              </div>
            )}

            {
              <div>
                <a
                  className={"empDetailIcon"}
                  title={"Organizational Chart"}
                  //title="Organizational Chart"
                  target="_blank"
                  // onClick={()=>{openChartModal()}}
                  onClick={() => {
                    openChartModal(true);
                  }}
                >
                  <Icon
                    style={{ fontSize: "20px", cursor: "pointer" }}
                    iconName="Org"
                  ></Icon>
                </a>
              </div>
            }
          </div>
        </div>
      </>
    );
  };

  const onRenderExpandedCard: any = (item: any): JSX.Element => {
    return (
      <div style={{ padding: "5px 10px" }}>
        {managerDetails?.email || managerDetails?.initials ? (
          <>
            {" "}
            <Label>Manager</Label>
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #ddd",
                borderTop: "1px solid #ddd",
              }}
            >
              <div style={{ width: "80px", padding: "8px 0" }}>
                <Persona
                  imageInitials={managerDetails?.initials}
                  size={PersonaSize.size72}
                  imageUrl={managerDetails?.image}
                />
              </div>
              <div>
                {managerDetails?.name && (
                  <div className="hovercard-content">
                    <p className="name">{managerDetails?.name}</p>
                  </div>
                )}
                {managerDetails?.job !== "" && (
                  <span className="card hovercard-content">
                    <p>{managerDetails?.job}</p>
                  </span>
                )}
                {managerDetails?.department !== "" && (
                  <span className="card hovercard-content">
                    <p>{managerDetails?.department}</p>
                  </span>
                )}
              </div>
            </div>
          </>
        ) : (
          <div style={{ borderTop: "1px solid #ddd" }}></div>
        )}

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Label style={{ width: "20%" }}>About:</Label>
            <span>{item?.About_Me}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Label style={{ width: "20%" }}>School:</Label>
            <span>{item?.Schools || ""}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Label style={{ width: "20%" }}>Projects:</Label>
            <span>{item?.Projects}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Label style={{ width: "20%" }}>Skills:</Label>
            <span>{item?.Skills}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Label style={{ width: "20%" }}>Hobbies:</Label>
            <span>{item?.Hobbies}</span>
          </div>
        </div>
      </div>
    );
  };

  function colorManager(textlength, bgColor) {
    let BGcolor = "";
    if (textlength <= 3) {
      BGcolor =
       "linear-gradient(to bottom left,rgba(255,0,0,0),rgba(255,0,0,0),rgba(255,0,0,0),rgba(255,0,0,0),rgba(255,0,0,0)," +
        bgColor +
        "," +
        bgColor 
    } 
   else if (textlength <= 6) {
      BGcolor =
        "linear-gradient(to bottom left,rgba(255,0,0,0)," +
        bgColor +
        "," +
        bgColor +
        "," +
        bgColor;
    } else if (textlength <= 12) {
      BGcolor =
        "linear-gradient(to bottom left,rgba(255,0,0,0),rgba(255,0,0,0),rgba(255,0,0,0),rgba(255,0,0,0),rgba(255,0,0,0),rgba(255,0,0,0)," +
        bgColor +
        "," +
        bgColor +
        "," +
        bgColor +
        "," +
        bgColor;
    } else if (textlength <= 18) {
      BGcolor =
        "linear-gradient(to bottom left,rgba(255,0,0,0),rgba(255,0,0,0),rgba(255,0,0,0),rgba(255,0,0,0),rgba(255,0,0,0),rgba(255,0,0,0)," +
        bgColor +
        "," +
        bgColor +
        "," +
        bgColor +
        "," +
        bgColor +
        "," +
        bgColor;
    } else if (textlength <= 24) {
      BGcolor =
        "linear-gradient(to bottom left,rgba(255,0,0,0),rgba(255,0,0,0),rgba(255,0,0,0),rgba(255,0,0,0),rgba(255,0,0,0)," +
        bgColor +
        "," +
        bgColor +
        "," +
        bgColor +
        "," +
        bgColor +
        "," +
        bgColor;
    } else if (textlength <= 30) {
      BGcolor =
        "linear-gradient(to bottom left,rgba(255,0,0,0),rgba(255,0,0,0),rgba(255,0,0,0),rgba(255,0,0,0)," +
        bgColor +
        "," +
        bgColor +
        "," +
        bgColor +
        "," +
        bgColor +
        "," +
        bgColor +
        "," +
        bgColor;
    }
    return BGcolor;
  }

  let today = null;
  let userDOB = "";
  let userAniversary = "";

  useEffect(() => {
    function createDate(dateString: string) {
      if (dateString == undefined) return;
      const [year, month, day] = dateString?.split("-")?.map(Number);
      return new Date(month - 1, day).toLocaleDateString();
    }

    const todayDate = new Date();
    const day = todayDate.getDate();
    const month = todayDate.getMonth() + 1;
    const year = todayDate.getFullYear();

    today = createDate(`${year}-${month}-${day}`);
    userDOB = createDate(item?.DOB);
    userAniversary = createDate(item?.DOJ);
  }, []);

  async function getUserManager(userEmail: string): Promise<any[]> {
    let page: any = "";
    let staffList: any[] = [];

    try {
      page = await gapi.client.directory?.users.get({
        userKey: userEmail,
        projection: "full",
        orderBy: "givenName",
      });

      if (page && page.result) {
        staffList = staffList.concat(page.result);
      } else {
        console.warn("No data returned for the user:", userEmail);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    return staffList;
  }

  return (
    <>
      {((ShowJoyfulAnimation && today == userDOB) ||
        today == userAniversary) && (
        <img
          onClick={(): any => {
            openPanelForUser(item);
          }}
          style={{ position: "absolute", zIndex: "10", height: "170px" }}
          src={FarraAnimationGif}
        />
      )}

      <Modal
        isOpen={isChartOpen}
        onDismiss={() => openChartModal(false)}
        isBlocking={true}
        styles={modalPropsStyles}
        topOffsetFixed={false}
      >
        <div className={chart.modalWrapper}>
          <h4 className={chart.heading}>
            {translation?.OrganizationChart
              ? translation?.OrganizationChart
              : "Organization Chart"}
          </h4>
          <div className={chart.iconBtnContainer}>
            <IconButton
              className={chart.iconBtn}
              title={"Download OrgChart as PDF..."}
              iconProps={{ iconName: "Print" }}
              ariaLabel="Download OrgChart PDF"
              //onClick={OrgChartPdf}
            />
            <IconButton
              className={chart.iconBtn}
              iconProps={{ iconName: "Cancel" }}
              ariaLabel="Close popup modal"
              onClick={() => openChartModal(false)}
            />
          </div>
        </div>

        <div className={chart.orgChartContainer}>
          {<ModalOrgChart userObj={users} selected={item?.email} />}
        </div>
      </Modal>

      {(isAdmin || getCurrentUser().cu === item?.email) && appSettings?.ShowWFH
        ? showWFHOrWFOIcon()
        : ""}

      <div
        ref={buttonRef}
        onClick={(): any => {
          openPanelForUser(item);
        }}
        style={{ cursor: "pointer", marginBottom: "5px" }}
        className="makeCenterStyles"
      >
        <HoverCardComponent
          item={item}
          renderCompactCard={onRenderCompactCard}
          renderExpandedCard={onRenderExpandedCard}
          columnKeyForHoverCard="image"
        >
          <div style={{ position: "relative" }}>
            <Persona
              imageInitials={item.initials}
              size={PersonaSize.size100}
              className="PersonaInitial"
              imageUrl={item.image}
              // presence={PersonaPresence.away}
            />
            <div
              // style={diffStyle}
              style={{ position: "absolute", bottom: "-1px", zIndex: "11" }}
              // className="Onhover"
            >
              {labelValueLength != 0 && (
                <div className="MainContainer">
                  <div
                    className="MainBox"
                    style={{ background: backgroundColor }}
                  >
                    <div
                      className={
                        labelValueLength <= 6
                          ? "textvested6"
                          : labelValueLength <= 12
                          ? "textvested12"
                          : labelValueLength <= 18
                          ? "textvested18"
                          : labelValueLength <= 24
                          ? "textvested24"
                          : "textvested"
                      }
                      style={{ color: "white" }}
                    >
                      <div style={{ position: "relative" }}>
                        <svg width="100" height="100" viewBox="0 0 200 200">
                          <defs>
                            <path
                              id="textPath"
                              d="M100,100 m-100,0 a100,95 0 1,0 200,0 a100,95 0 1,0 -200,0"
                            />
                          </defs>
                          <text
                            fill={fontColor}
                            fontSize="20"
                            letterSpacing="3"
                            transform="translate(-4, 4)"
                          >
                            <textPath
                              href="#textPath"
                              startOffset={`${
                                labelValueLength > 18 ? "37%" : "30%"
                              }`}
                            >
                              {labelValue?.join("")}
                            </textPath>
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </HoverCardComponent>
      </div>

      <div className="newclass" style={{ marginBottom: "20px" }}>
        {userGridView &&
          userGridView.map((item1, index) => {
            if (
              item1.checkbox &&
              item1.name !== "id" &&
              item1.name !== "image"
            ) {
              return (
                <div className="cards" key={index}>
                  {item1.name === "name" && (
                    <div className="card">
                      <p className="name">
                        {ISStartLastname === "familyName"
                          ? `${item.lastName} ${item.firstName}`
                          : `${item.firstName} ${item.lastName}`}
                      </p>
                    </div>
                  )}

                  {item1.name === "location" && (
                    <div className="card">
                      <Icon iconName="Location" />
                      <p>{item[item1.name]}</p>
                    </div>
                  )}

                  {item1.name === "email" && (
                    <div className="card">
                      <p className="link">
                        <a href={`${Chat}:${item[item1.name]}`}>
                          {" "}
                          <Icon iconName="mail" />
                          {item[item1.name]}
                        </a>
                      </p>
                    </div>
                  )}

                  {item1.name === "workphone" && item.workphone !== "" && (
                    <div className="card">
                      <p className="link">
                        <a href={`${Mobile}:${item[item1.name]}`}>
                          <Icon iconName="Phone" />
                          {item[item1.name]}
                        </a>
                      </p>
                    </div>
                  )}

                  {item1.name === "job" && item.job !== "" && (
                    <div className="card">
                      <p>{item[item1.name]}</p>
                    </div>
                  )}

                  {item1.name === "department" && item.department !== "" && (
                    <div className="card">
                      <p>{item[item1.name]}</p>
                    </div>
                  )}

                  {item1.isCustomField === true && (
                    <div className="card">
                      <p>{item[item1.nameAPI]}</p>
                    </div>
                  )}
                </div>
              );
            }
            return null; // Handle other conditions or return nothing
          })}
      </div>

      {ShowJoyfulAnimation && today == userDOB && (
        <div className={styles.bdayStyles}>
          <div className={styles.cubeFaceFont}>
            <span className={styles.clr1}>H</span>
            <span className={styles.clr2}>A</span>
            <span className={styles.clr3}>P</span>
            <span className={styles.clr4}>P</span>
            <span className={styles.clr5}>Y</span>
            <div>
              <span className={styles.clr1}>B</span>
              <span className={styles.clr2}>I</span>
              <span className={styles.clr3}>R</span>
              <span className={styles.clr4}>T</span>
              <span className={styles.clr5}>H</span>
              <span className={styles.clr4}>D</span>
              <span className={styles.clr3}>A</span>
              <span className={styles.clr2}>Y</span>
            </div>
          </div>
        </div>
      )}

      {ShowJoyfulAnimation && today == userAniversary && (
        <div className={styles.bdayStyles}>
          <div className={styles.cubeFaceFont}>
            <span className={styles.clr1}>H</span>
            <span className={styles.clr2}>A</span>
            <span className={styles.clr3}>P</span>
            <span className={styles.clr4}>P</span>
            <span className={styles.clr5}>Y</span>
            <div>
              <span className={styles.clr1}>A</span>
              <span className={styles.clr2}>N</span>
              <span className={styles.clr3}>N</span>
              <span className={styles.clr4}>I</span>
              <span className={styles.clr5}>V</span>
              <span className={styles.clr4}>E</span>
              <span className={styles.clr3}>R</span>
              <span className={styles.clr2}>S</span>
              <span className={styles.clr1}>A</span>
              <span className={styles.clr2}>R</span>
              <span className={styles.clr3}>Y</span>
            </div>
          </div>
        </div>
      )}
      <div>

      </div>

      <div
        style={{
          display: "flex",
          gap: "5px",
          position: "absolute",
          bottom: "0px",
        }}
      >
        <a href={"https://chat.google.com"} target="_blank">
          <img
            className="logo"
            src={googleChat}
            alt="Google Chat"
            style={{ cursor: "pointer" }}
          />
        </a>
        <a
          href={`mailto:${item.email}`}
          style={{ cursor: "pointer" }}
          target="_blank"
        >
          <img
            className="logo"
            src={gmailLogo}
            alt="Gmail"
            style={{ cursor: "pointer" }}
          />
        </a>
      </div>
    </>
  );
}

export default GridCard;
