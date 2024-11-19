import React, { useEffect, useState } from "react";
import styles from "../SCSS/EmployeeDetailModal.module.scss";
import { Modal } from "@fluentui/react";
import PronounsImg from "../assets/images/Pronouns1.jpg";
import "sweetalert2/dist/sweetalert2.css";
import PronounsImg2 from "../assets/images/Pronouns.jpg";
import {
  Icon,
  Stack,
  IconButton,
  Panel,
  PanelType,
  Label,
  PrimaryButton,
  DefaultButton,
  TextField,
} from "@fluentui/react";
import {
  Persona,
  PersonaSize,
  PersonaPresence,
} from "@fluentui/react/lib/Persona";
import DefaultImage from "../assets/images/DefaultImg1.png";
import { gapi } from "gapi-script";
import { style } from "./styles";
import styled from "styled-components";
import useStore from "./store";
import ModalOrgChart from "../OrgChart/ModalOrgChart";
import "./Edp.scss";
import { useSttings } from "./store";
import {
  decryptData,
  encryptData,
  formatDate,
  getCurrentUser,
  isUserAdmin,
  isUserAdminCheck,
} from "../Helpers/HelperFunctions";
import MiniModals from "./MiniModals";
import { useLanguage } from "../../Language/LanguageContext";
import WeekTable from "./WeekTable";
import { SweetAlerts } from "./Utils/SweetAlert";
import { useFields, useLists } from "../../context/store";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  getSettingJson,
  SETTING_LIST,
  updateSettingJson,
} from "../../api/storage";
import { sendEmail } from "../../api/email";
import UpdateUserForm from "../UpdateUserForm";
const selectedDot: any = {
  height: "10px",
  width: "10px",
  borderRadius: "50%",
  backgroundColor: "var(--textIconColor)",
};
const notselectedDot: any = {
  height: "10px",
  width: "10px",
  borderRadius: "50%",
  backgroundColor: "gray",
};
const NewDocumentWrapper = styled.div`
  ${style}
`;
var diffStyle: any;
var memberof: any = [];
var managerof: any = [];
var ownerof: any = [];

const EmployeeDetailModal = (props: any) => {
  console.log("props",props)
  const [user, setUser] = useState<any>(null);
  const [pronouns, setPronouns] = useState<any>("");
  const [UserAdmin, setUserAdmin] = useState<any>(false);
  const [WFHText, setWFHText] = useState<any>("");
  const [showManager, setshowManager] = useState(false);
  const [id, setId] = useState("");
  const [showOFields, setshowOFields] = useState(false);
  const [userMgr, setUserMgr] = useState<any>(null);
  const [userM, setUserM] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [userData, setUserData] = useState<any>();
  const [ProfleIconUrl, setProfleIconUrl] = useState("");
  const [showWWTable, setShowWWTable] = useState<any>(false);
  const [message, setMessage] = React.useState("");
  const { checkboxesChecked, userGridView, userArray, reRenderState } = useStore();
  const { appSettings, setAppSettings } = useSttings();
  const { translation } = useLanguage();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const contentRef = React.useRef(null);

  const [isPronounsModalOpen, openPronsModal] = useState(false);
  const [isOpenWFHModal, OpenWFHModal] = useState(false);
  const [settingData, setSettingData] = useState<any>({});
  const [isPanelOpenWorkWeek, OpenPanelWorkWeek] = useState(false);
  const [isPronounsLoadMoreOpen, openPronsLoadMore] = useState(false);
  const [isChartOpen, openChartModal] = useState(false);
  const { imagesList } = useLists();
  const { usersWithHiddenManager, usersWithHiddenPhoneNo , admins} = useFields();

  const [showMainPanel, setShowMainPanel] = React.useState(true);
  const {
    CollaborationSettings: { Chat, Mobile, WorkPhone },
    ShowHideViewModules: { visibleReportIncorrectIcon },
  } = appSettings;
  const [ButtonSave, setButtonSave] = React.useState<string>("Save");
  const [loading, setloading] = React.useState(false);
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

  const { SweetAlert: SweetAlertEmpCard } = SweetAlerts("#empcard");
  const { SweetAlert: SweetAlertEditProfile } = SweetAlerts(
    "#editProfile",
    true
  );

  const [managerModal, setManagerModal] = useState(false);

  React.useEffect(() => {
    if (props.isModalOpenTrans) {
      setIsExpanded(false);

      const timer = setTimeout(() => {
        if (contentRef.current) {
          setIsExpanded(true);
        }
      }, 500);

      return () => clearTimeout(timer);
    } else {
      if (contentRef.current) {
        contentRef.current.style.maxHeight = "0px";
      }
    }
  }, [props.isModalOpenTrans]);
  React.useEffect(() => {
    if (props?.user) {
      GetDataForModal();
      const data = appSettings?.WFH?.find(
        (item) => item?.email === user?.email
      );
      if (data) {
        setWFHText(data?.WFHLocation);
      } else {
        setWFHText("");
      }
    }
    matchPronouns();
  }, [props?.user?.id]);
  React.useEffect(() => {
    console.log("SECOND USEEFFCT........");
    console.log(userArray, "userArray");
    setUserData(props.data);
    setUserAdmin(appSettings.isCurrentUserAdmin);
  }, []);

  const [openReportModal, setOpenResportModal] = useState(false);

  // const entries = Object.entries(props.checkedValue);
  const savePronous = async () => {
    // let pronounsStatus = {updatedProns}
    setloading(true);
    // setButtonSave("");
    if (settingData?.Pronouns) {
      let pronouns = settingData?.Pronouns;
      console.log("decripttt", pronouns);
      let updatedPronous = pronouns.map((item) => {
        if (item?.email == user?.email) {
          return { email: item.email, pronouns: message };
        } else {
          return item;
        }
      });
      console.log(updatedPronous, "updated");
      // updatedPronous =

      let temp = { ...settingData, Pronouns: updatedPronous };
      console.log(temp, "temp");

      setAppSettings(temp);

      await updateSettingJson(SETTING_LIST, temp);
      matchPronouns();
      SweetAlertEmpCard("success", translation.SettingSaved);
    }

    setTimeout(() => {
      setloading(false);
      setButtonSave("Save");
    }, 300);
  };
  function showWFHOrWFOIcon() {
    let styles: any = {
      position: "absolute",
      right: "8px",
      top: "8px",
    };
    const individualWFHDetail = appSettings?.WorkWeekData?.find(
      (person) => person?.email === props?.user?.email
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
      console.log(res?.status == "WFO" ? "CityNext2" : "Home");
      return res?.status == "WFO" ? "CityNext2" : "Home";

      // <Icon style={styles} title={title} iconName="CityNext2" />

      // <Icon style={styles} title={title} iconName="Home" />
    } else {
      console.log("office");
      return "CityNext2";
      // <Icon style={styles} title={"Work from office"} iconName="Office" />
    }
  }

  function formatBDate1(d: any) {
    if (d != "") {
      // var numbers = d.match(/\d+/g);
      // var date1 = new Date(numbers[2], numbers[1]-1, numbers[0]);
      if (d === null || d === undefined) {
      } else {
        if (d.indexOf("T") > 0) {
          var __date = new Date(d.split("T")[0].split("-"));
          // var str =
          //   (__date.getMonth() > 8
          //     ? __date.getMonth() + 1
          //     : "0" + (__date.getMonth() + 1)) +
          //   "/" +
          //   (__date.getDate() > 9 ? __date.getDate() : "0" + __date.getDate()) +
          //   "/" +
          //   __date.getFullYear();
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "June",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          //let date = new Date(d);
          var dd = __date.getDate();
          var mm = monthNames[__date.getMonth()];
          return (d = mm + " " + dd);
        }
      }
    }
  }
  function formatDate2(d: any) {
    if (d.indexOf("T") > 0) {
      var __date = new Date(d.split("T")[0].split("-"));

      //let date = new Date(d);
      var dd = __date.getDate();
      var mm = __date.getMonth() + 1;
      var yyyy = __date.getFullYear();
      return (d = mm + "/" + dd + "/" + yyyy);
    } else {
      let date = new Date(d);
      var dd = date.getDate();
      var mm = date.getMonth() + 1;
      var yyyy = date.getFullYear();

      return (d = mm + "/" + dd + "/" + yyyy);
    }
  }
  async function getAllUsersGrpMInOrg(userEmail: any) {
    let page: any = "";
    let pageToken = "";
    let staffList: any = [];
    //alert(allletter);
    do {
      page = await gapi.client.directory.members.list({
        groupKey: userEmail,
        maxResults: 100,
        pageToken: pageToken,
      });

      staffList = staffList.concat(page.result.members);

      pageToken = page.nextPageToken;
    } while (pageToken);

    return staffList;
  }
  async function getUserManager(userEmail: any) {
    if(userEmail == ""){
      return;
    }
    let page: any = "";
    let staffList: any = [];
    page = await gapi.client.directory.users.get({
      userKey: userEmail,
      projection: "full",
      orderBy: "givenName",
    });
    staffList = staffList.concat(page.result);
    return staffList;
  }

  async function getAllUsersGrpInOrg(userEmail: any) {
    if(userEmail === ""){
      return;
    }
    
    let page: any = "";
    let pageToken = "";
    let staffList: any = [];
    //alert(allletter);
    do {
      page = await gapi.client.directory.groups.list({
        userKey: userEmail,
        maxResults: 100,
        pageToken: pageToken,
      });

      staffList = staffList.concat(page.result.groups);

      pageToken = page.nextPageToken;
    } while (pageToken);

    return staffList.filter((x)=>x !== undefined)
  }
  const GetOFields = () => {
    memberof = [];
    ownerof = [];
    managerof = [];
    var returnObjectM = null;
    console.log();

    getAllUsersGrpInOrg(props?.user?.email).then((data: any) => {
      //console.log(data);
      if (data?.length) {
        // group.push(data);
        data?.forEach((group: any) => {
          //console.log(group);
          getAllUsersGrpMInOrg(group?.email).then((data1) => {
            var _d: any = data1?.filter(
              (person: any) => person?.email == props?.user?.email
            );
            if (_d.length > 0) {
              const primaryOrg = _d?.filter((x: any) => x.type === "USER")[0]
                ?.role;

              if (primaryOrg == "MEMBER") {
                memberof.push(group.name);
              }
              if (primaryOrg == "OWNER") {
                ownerof.push(group.name);
              }
              if (primaryOrg == "MANAGER") {
                managerof.push(group.name);
              }
            }
            returnObjectM = {
              MemberOf: memberof.toString(),
              OwnerOf: ownerof.toString(),
              ManagerOf: managerof.toString(),
            };
            setUserM(returnObjectM);
            setshowOFields(true);
            return returnObjectM;
          });
        });
      }
    });
  };

  const { additionalManagers, assistant } = useFields();

  const [additionalManager, setAdditionalManager] = useState<any>([]);
  const [AssistantData, setAssistantData] = useState<any>([]);

  const GetDataForModal = () => {
    var returnObject: any = null;
    var returnObjectMgr: any = null;

    let mappedcustomcol = props?.user?.mappedfields ?? [];

    try {
      if (typeof mappedcustomcol === "string") {
        mappedcustomcol = JSON.parse(mappedcustomcol);
      }
    } catch (error) {
      console.log("Error parsing JSON:", error);
      mappedcustomcol = [];
    }
    console.log(mappedcustomcol, "col");
    var aboutme =
      mappedcustomcol?.length > 0
        ? mappedcustomcol.filter(
            (item: any) => item.ExistingList == "About Me"
          )[0].ExternalList
        : "About Me";
    var school =
      mappedcustomcol?.length > 0
        ? mappedcustomcol.filter(
            (item: any) => item.ExistingList == "School"
          )[0].ExternalList
        : "School";
    var project =
      mappedcustomcol?.length > 0
        ? mappedcustomcol.filter(
            (item: any) => item.ExistingList == "Projects"
          )[0].ExternalList
        : "Projects";
    var skill =
      mappedcustomcol?.length > 0
        ? mappedcustomcol.filter(
            (item: any) => item.ExistingList == "Skills"
          )[0].ExternalList
        : "Skills";
    var hobbies =
      mappedcustomcol?.length > 0
        ? mappedcustomcol.filter(
            (item: any) => item.ExistingList == "Hobbies"
          )[0].ExternalList
        : "Hobbies";
    var dob =
      mappedcustomcol?.length > 0
        ? mappedcustomcol?.filter(
            (item: any) => item.ExistingList == "Date of Birth"
          )[0].ExternalList
        : "Date of Birth";
    var doj =
      mappedcustomcol?.length > 0
        ? mappedcustomcol.filter(
            (item: any) => item.ExistingList == "Date of Join"
          )[0].ExternalList
        : "Date of Join";
    console.log("m a n g", props?.user);

    if (props?.user?.AdditionalManager) {
      props?.user?.AdditionalManager?.map((item) => {
        getUserManager(item).then((adManager) => {
          const x = {
            department: adManager[0]?.organizations[0]?.department,
            name: adManager[0]?.name?.fullName,
            job: adManager[0]?.organizations[0]?.title,
            email: adManager[0].primaryEmail,
            image: adManager[0].thumbnailPhotoUrl,
          };
          setAdditionalManager((prev) => [...prev, x]);
          console.log("HELLO........", {
            x: [...additionalManager, x],
            adManager,
          });
        });
      });
    }
    if (props?.user?.AssistantData) {
      props?.user?.AssistantData?.map((item) => {
        getUserManager(item).then((Assistant) => {
          const x = {
            department: Assistant[0]?.organizations[0]?.department,
            name: Assistant[0]?.name?.fullName,
            job: Assistant[0]?.organizations[0]?.title,
            email: Assistant[0].primaryEmail,
            image: Assistant[0].thumbnailPhotoUrl,
          };
          setAssistantData((prev) => [...prev, x]);
          console.log("AssistantData........", {
            x: [...AssistantData, x],
            Assistant,
          });
        });
      });
    }
    if (props?.user?.manager !== "") {
      getUserManager(props?.user?.manager).then((getuser) => {
        console.log("man-ger", getuser);
        if (getuser.length > 0) {
          //console.log(getuser);
          if (getuser[0].name.givenName != null) {
            var names = getuser[0].name.givenName.split(" "),
              initials = names[0].substring(0, 1).toUpperCase();
            if (names.length > 1) {
              initials += names[names.length - 1].substring(0, 1).toUpperCase();
            }
          }

          returnObjectMgr = {
            isAdmin:getuser.isAdmin,
            firstName: getuser[0].name.givenName,
            lastName: getuser[0].name.familyName,
            initials: initials,
            name: getuser[0].name.fullName,
            email: getuser[0].primaryEmail,
            id: getuser[0].id,
            job: getuser[0].hasOwnProperty("organizations")
              ? getuser[0].organizations[0].hasOwnProperty("title")
                ? getuser[0].organizations[0].title
                : ""
              : "",
            //initials: initials,
            department: getuser[0].hasOwnProperty("organizations")
              ? getuser[0].organizations[0].hasOwnProperty("department")
                ? getuser[0].organizations[0].department
                : ""
              : "",
            image: getuser[0].hasOwnProperty("thumbnailPhotoUrl")
              ? getuser[0].thumbnailPhotoUrl
              : DefaultImage,
          };
          setId(returnObjectMgr.id);
          console.log(returnObjectMgr, "manager");

          setUserMgr(returnObjectMgr);
          setshowManager(true);
          return returnObjectMgr;
        }
      });
    } else {
      setshowManager(false);
    }
    var _aboutme = props?.user[aboutme] || "";
    var _school = props?.user[school] || "";
    var _project = props?.user[project] || "";
    var _skill = props?.user[skill] || "";
    var _hobbies = props?.user[hobbies] || "";
    var _dob = props?.user[dob] || "";
    var _doj = props?.user[doj] || "";

    // returnObject = {
    //   initials: props.user.initials,
    //   img: props.user.image,
    //   //customproperty:customproperty,
    //   name: props.user.name,
    //   dept: props.user.department,
    //   jtitle: props.user.job,
    //   loc: props.user.location,
    //   wphone: props.user.workphone,
    //   mobile: props.user.mobile,
    //   email: props.user.email,
    //   manager: props.user.manager,
    //   AboutMe: _aboutme === undefined ? "" : _aboutme,
    //   School: _school === undefined ? "" : _school,
    //   Projects: _project === undefined ? "" : _project,
    //   Skills: _skill === undefined ? "" : _skill,
    //   Hobbies: _hobbies === undefined ? "" : _hobbies,
    //   DateofBirth: _dob === undefined ? "" : formatBDate1(_dob + "T"),
    //   DateofJoin: _doj === undefined ? "" : formatDate2(_doj + "T"),
    //   EmployeeId: props.user.employeeid,
    //   BuildingId: props.user.buildingid,
    //   FloorName: props.user.floorname,
    //   FloorSection: props.user.floorsection,
    //   Address: props.user.address,
    //   CostCenter: props.user.costcenter,

    //   //managerprofilecard:props.user.managerprofilecard
    // };
    returnObject = {
      initials: props.user.initials || "",
      img: props.user.image || "",
      name: props.user.name || "",
      dept: props.user.department || "",
      job: props.user.job || "",
      loc: props.user.location || "",
      wphone: props.user.workphone || "",
      mobile: props.user.mobile || "",
      email: props.user.email || "",
      manager: props.user.manager || "",
      AboutMe: _aboutme || "",
      School: _school || "",
      Projects: _project || "",
      Skills: _skill || "",
      Hobbies: _hobbies || "",
      DOB: (_dob || "") === "" ? "" : formatBDate1(_dob + "T"),
      DOJ: (_doj || "") === "" ? "" : formatDate2(_doj + "T"),
      EmployeeId: props.user.employeeid || "",
      BuildingId: props.user.buildingid || "",
      FloorName: props.user.floorname || "",
      FloorSection: props.user.floorsection || "",
      Address: props.user.address || "",
      CostCenter: props.user.costcenter || "",
      isAdmin:props.user.isAdmin,
    };

    diffStyle = {
      backgroundImage: "url('" + props.user.image + "')",
      backgroundRepeat: "no-repeat",
      width: "101px",
      height: "100px",
      position: "absolute",
      top: "0px",
      borderRadius: "50%",
      zIndex: 1,
      backgroundPosition: "center",
      backgroundSize: "cover",
    };

    setUser(returnObject);
    setUserData(props?.data);
    setSelectedUser(props?.user?.email);
    if (!props.user.IsExternalUser) {
      GetOFields();
    }
    //setshowAD(true);
    /*   dataObj.push({
      positionName: returnObject.name,
      id: '123',
      parentId: '1233',
      tags:returnObject.name,
      name: returnObject.name,
      area: returnObject.FloorSection,
      imageUrl: returnObject.img,
      email:returnObject.email,
      isLoggedUser: true,

    }) */
    console.log(returnObject, "return object");
    return returnObject;
  };

  async function matchPronouns() {
    let settingData = await getSettingJson(SETTING_LIST);
    setSettingData(settingData);

    if (settingData?.Pronouns) {
      let data = settingData?.Pronouns;
      let ans = data?.find((item) => {
        return item?.email == props.user?.email;
      });
      if (ans?.pronouns?.length) {
        setPronouns(ans?.pronouns);
      } else {
        setPronouns("Add Pronouns");
      }
    }
  }
  const printDocument = () => {
    const input = document.getElementById("divToPrint");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();

      // Calculate the image dimensions
      const imgWidth = 190; // Width of the PDF page minus margins
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save("OrgChart.pdf");
    });
  };

  const handlePronouns = (event) => {
    setMessage(event.target.value);
  };
  const theythem = () => {
    let msg = "They/Them";
    setMessage(msg);
  };
  const SheHer = () => {
    let msg = "She/Her";
    setMessage(msg);
  };
  const HeHim = () => {
    let msg = "He/Him";
    setMessage(msg);
  };
  const nextBtnClick = () => {
    setShowMainPanel(!showMainPanel);
  };
  function handleSaveWFH() {
    if (!user?.email || !WFHText) {
      console.error("User email or WFH text is missing.");
      return;
    }

    const existingWFH = settingData?.WFH || [];

    const updatedWFH = [
      ...existingWFH,
      { email: user.email, WFHLocation: WFHText },
    ];

    const tempSetting = { ...settingData, WFH: updatedWFH };
    updateSettingJson(SETTING_LIST, tempSetting);
    setAppSettings({ ...settingData, WFH: updatedWFH });
  }
  function handleShowWorkWeekTable() {
    setShowWWTable((prev) => !prev);
  }
  const [remarkValue, setRemarkValue] = useState("");

  const handleEmailClick = () => {
    const email = props.user.email;
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      email
    )}`;
    window.open(mailtoLink, "_blank");
  };

  const [openUpdatePanel, setOpenUpdatePanel] = useState(false);

  return (
    <>
      <NewDocumentWrapper>
        <>
          {user && (
            <div style={{ padding: "20px", overflow: "hidden" }}>
              <div className="closeIcorofile">
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent:
                      appSettings?.EmpInfoAlignment == "Left"
                        ? "space-between"
                        : appSettings?.EmpInfoAlignment == "Center"
                        ? "center"
                        : appSettings?.EmpInfoAlignment == "Right"
                        ? "space-between"
                        : "",
                  }}
                >
                  {appSettings?.EmpInfoAlignment == "Right" ? (
                    <img
                      src={imagesList.BrandLogo}
                      alt=""
                      style={{
                        objectFit: "contain",
                        width: "200px",
                        height: "120px",
                      }}
                    />
                  ) : (
                    ""
                  )}
                  <div
                    className="empMainDetailStyles"
                    style={{
                      justifyContent:
                        appSettings?.EmpInfoAlignment == "Left"
                          ? "flex-start"
                          : appSettings?.EmpInfoAlignment == "Center"
                          ? "center"
                          : appSettings?.EmpInfoAlignment == "Right"
                          ? "flex-end"
                          : "",
                      marginRight:
                        appSettings?.EmpInfoAlignment == "Right" && "50px",
                    }}
                  >
                    <div className="LeftalignPc">
                      <div className="empLogo">
                        <div style={{ position: "relative" }}>
                          <div style={diffStyle}></div>
                          <Persona
                            //imageUrl={user.img}
                            imageInitials={user.initials}
                            size={PersonaSize.size100}
                          />
                        </div>
                      </div>

                      <div>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            height: "22px",
                            alignItems: "center",
                          }}
                        >
                          <>
                            <div className="empTitle">
                              <span className="clpbrdspan">{user.name}</span>
                              {settingData?.HideShowPronouns &&
                              settingData?.Pronouns &&
                              pronouns != "" ? (
                                <span
                                  onClick={
                                    getCurrentUser().cu==props.user?.email
                                      ? () => openPronsModal(true)
                                      : undefined
                                  }
                                  className={styles.pronouns}
                                  style={{
                                    cursor: `${UserAdmin ? "pointer" : ""}`,
                                  }}
                                >
                                  {pronouns}
                                </span>
                              ) : null}

                              {appSettings?.ShowWFH ? (
                                <span style={{ display: "flex", gap: "5px" }}>
                                  <Icon
                                    iconName={showWFHOrWFOIcon()}
                                    style={{
                                      cursor: "pointer",
                                      marginLeft: "5px",
                                    }}
                                    onClick={() => {
                                      if (
                                        getCurrentUser()?.cu === user?.email
                                      ) {
                                        OpenWFHModal(true);
                                      }
                                    }}
                                  />
                                  {WFHText?.length ? (
                                    <span>{WFHText}</span>
                                  ) : (
                                    ""
                                  )}
                                </span>
                              ) : (
                                ""
                              )}
                              {settingData?.ShowWeekWorkStatus ? (
                                <span
                                  onClick={handleShowWorkWeekTable}
                                  style={{
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 24 24"
                                    className="editicon_f29fc7e1"
                                    height="18"
                                    width="18"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{
                                      fontSize: "18px",
                                      marginTop: "2px",
                                    }}
                                  >
                                    <title>Work week</title>
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path d="M13 6v3h3v2h-3v3h-2v-3H8V9h3V6h2zm5 4.2C18 6.57 15.35 4 12 4s-6 2.57-6 6.2c0 2.34 1.95 5.44 6 9.14 4.05-3.7 6-6.8 6-9.14zM12 2c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2z"></path>
                                  </svg>
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </>
                        </div>

                        <div className="empMainDetail">
                          {console.log("title",checkboxesChecked?.Title,props.user.job)}
                          {props.user.job && checkboxesChecked?.Title ? (
                            <>
                              <span>{props.user.job}</span> |{" "}
                            </>
                          ) : (
                            ""
                          )}
                          {user.dept ? <span>{user.dept}</span> : ""}
                        </div>

                        {user.loc ? (
                          <div className="empMainDetail">{user.loc}</div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  {showWWTable && (
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        alignItems: "start",
                      }}
                    >
                      {" "}
                      <Label>Work Week</Label>{" "}
                      <WeekTable
                        showWWTable={showWWTable}
                        settingData={settingData}
                        user={user}
                        isPanelOpenWorkWeek={isPanelOpenWorkWeek}
                        OpenPanelWorkWeek={() => OpenPanelWorkWeek(true)}
                        closePanelWorkWeek={() => OpenPanelWorkWeek(false)}
                      />
                    </div>
                  )}

                  {AssistantData && (
                    // className="empManagerStyle"
                    <Stack
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        marginRight: "50px",
                      }}
                    >
                      {/* <h4>{"Additional Manager"}</h4> */}
                      {
                        // additionalManagers
                        AssistantData.map((x, i) => (
                          <div key={i}>
                            <h3>{assistant[i]?.displayName}</h3>
                            <Stack horizontal>
                              <div style={{ cursor: "pointer" }}>
                                <Persona
                                  imageUrl={x?.image}
                                  imageInitials={x.name.slice(0, 1)}
                                  imageAlt={x?.name.slice(0, 1)}
                                  presence={PersonaPresence.none}
                                  size={PersonaSize.size56}
                                  className="profilecardmanagerField"
                                  // style={{display:"block"}}
                                />
                              </div>
                              <div style={{ margin: "0 10px" }}>
                                <div className="managerNameDet">{x?.name}</div>
                                <div className="managerNameDet">
                                  {x?.department}
                                </div>
                                <div className="managerNameDet">{x?.job}</div>
                              </div>
                            </Stack>
                          </div>
                        ))
                      }
                    </Stack>
                  )}

                  {AssistantData?.length ||
                  showWWTable ||
                  appSettings?.EmpInfoAlignment == "Center" ||
                  appSettings?.EmpInfoAlignment == "Right" ? null : (
                    <img
                      src={imagesList.BrandLogo}
                      className="brandLogo"
                      alt=""
                      style={{
                        objectFit: "contain",
                        width: "200px",
                        height: "120px",
                        marginRight: "50px",
                        display: !imagesList.BrandLogo && "none",
                      }}
                    />
                  )}
                </div>
                <div
                  ref={contentRef}
                  className={` ${styles.modalContent} ${
                    isExpanded ? styles.modalContentFull : ""
                  }`}
                >
                  <div className="empDetailIconView">
                    {user.email && (
                      <div>
                        <a
                          //style={{ paddingLeft: "0px" }}
                          className="empDetailIcon"
                          // href={"mailto:" + user.email}
                          href={`https://mail.google.com/chat/u/0/#chat/home`}
                          title={user.email}
                          target="_blank"
                        >
                          <Icon iconName="Message"></Icon>
                        </a>
                      </div>
                    )}
                    {user.email && (
                      <div>
                        <a
                          className="empDetailIcon"
                          title={user.email}
                          onClick={handleEmailClick}
                        >
                          <Icon iconName="Mail"></Icon>
                        </a>
                      </div>
                    )}
                    {user.wphone && (
                      <div>
                        <a
                          className="empDetailIcon"
                          href={"https://meet.google.com/new"}
                          // href={`${WorkPhone}:${user.wphone}`}
                          title={user.wphone}
                          target="_blank"
                        >
                          {/* <Icon icon={call16Filled} /> */}
                          <Icon iconName="Phone"></Icon>
                        </a>
                      </div>
                    )}

                    <div>
                      <a
                        className={"empDetailIcon"}
                        title={"Organizational Chart"}
                        //title="Organizational Chart"
                        target="_blank"
                        onClick={() => openChartModal(true)}
                      >
                        <Icon iconName="Org"></Icon>
                      </a>
                    </div>

                    <div>
                      <a
                        className="empDetailIcon"
                        // href={user.videoLink}
                        href={"https://meet.google.com/new"}
                        title={"Video Call"}
                        target="_blank"
                      >
                        <Icon iconName="Video"></Icon>
                      </a>
                    </div>

                    {props.settingData?.profileIconName !== "" ? (
                      <div>
                        <a
                          className="empDetailIcon"
                          //href={user.videoLink}
                          title={ProfleIconUrl}
                          target="_blank"
                        >
                          <Icon
                            style={{ fontSize: "20px" }}
                            iconName={props.settingData?.profileIconName}
                          ></Icon>
                        </a>
                      </div>
                    ) : (
                      ""
                    )}

                    <div
                      className="rightsideiconProfileCard"
                      style={{ position: "absolute", right: "0px" }}
                    >
                      {visibleReportIncorrectIcon && (
                        <IconButton
                          style={{ fontSize: "20px", padding: "15px 15px" }}
                          title="Report incorrect info"
                          iconProps={{ iconName: "Help" }}
                          ariaLabel="Report incorrect info"
                          onClick={() => setOpenResportModal(true)}
                        />
                      )}
                      {!props.user.IsExternalUser ? (
                        <IconButton
                          style={{ fontSize: "20px", padding: "15px 15px" }}
                          title="Edit profile"
                          iconProps={{ iconName: "Edit" }}
                          ariaLabel="Edit profile"
                          onClick={() => setOpenUpdatePanel(true)}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="empMoreDetailsBlock">
                    {checkboxesChecked.Email && (
                      <div className="labelSpanStylesTemp">
                        <label>Email</label>
                        <span className="clpbrdspan">
                          <a
                            title={user.email}
                            onClick={handleEmailClick}
                          >
                            {user.email}
                          </a>
                        </span>
                      </div>
                    )}
                    {checkboxesChecked.WorkPhone && (
                      <div className="labelSpanStylesTemp">
                        <label>{"Work Phone"}</label>

                        <span className="clpbrdspan">
                          <a
                            // href={"tel:" + user.wphone}
                            href={`${WorkPhone}:${user.wphone}`}
                            title={user.wphone}
                            target="_blank"
                          >
                            {!usersWithHiddenPhoneNo.includes(user.email) && (
                              <>{user.wphone}</>
                            )}
                          </a>
                          {/* <Icon className={styles.clpbrdsicon} onClick={() =>  navigator.clipboard.writeText(user.wphone)} iconName="Copy"></Icon> */}
                        </span>
                      </div>
                    )}
                    {checkboxesChecked.Mobile && (
                      <div className="labelSpanStylesTemp">
                        <label>Mobile</label>

                        <span className="clpbrdspan">
                          <a
                            href={"tel:" + user.mobile}
                            title={user.mobile}
                            target="_blank"
                          >
                            {user.mobile}
                          </a>
                          {/* <Icon className={styles.clpbrdsicon} onClick={() =>  navigator.clipboard.writeText(user.mobile)} iconName="Copy"></Icon> */}
                        </span>
                      </div>
                    )}
                    {checkboxesChecked.EmployeeId && (
                      <div className="labelSpanStyles">
                        <label>{"Employee ID"}</label>

                        <span>{user.EmployeeId}</span>
                      </div>
                    )}
                    {checkboxesChecked.CostCenter && (
                      <div className="labelSpanStyles">
                        <label>{"Cost center"}</label>

                        <span>{user.CostCenter}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div>
                      <div className="personallabelSpanStyles">
                        <label>{appSettings?.Labels?.aboutMe}</label>
                        <span>{user.AboutMe}</span>
                      </div>
                    </div>

                    <div>
                      <div className="personallabelSpanStyles">
                        <label>{appSettings?.Labels?.executive}</label>
                        <span>{/* value */}</span>
                      </div>
                    </div>

                    {checkboxesChecked.MemberOf &&
                      appSettings?.ShowMemeberOf && (
                        <div className="personallabelSpanStyles">
                          <label>{"Member of"}</label>
                          {appSettings?.ShowMemeberOf && (
                            <span>{showOFields && userM.MemberOf}</span>
                          )}
                        </div>
                      )}
                    {checkboxesChecked.OwnerOf && (
                      <div
                        className="personallabelSpanStyles"
                        style={{ margin: "0px" }}
                      >
                        <label>{"Owner of"}</label>
                        <span>{showOFields && userM.OwnerOf}</span>
                      </div>
                    )}
                    {checkboxesChecked.ManagerOf && (
                      <div className="personallabelSpanStyles">
                        <label>{"Manager of"}</label>
                        <span>{showOFields && userM.ManagerOf}</span>
                      </div>
                    )}
                    {checkboxesChecked.Address && (
                      <div className="personallabelSpanStyles">
                        <label>{"Address"}</label>
                        <span>{user.Address ? user.Address : ""}</span>
                      </div>
                    )}
                    {checkboxesChecked.FloorSection && (
                      <div className="personallabelSpanStyles">
                        <label>{"Floor section"}</label>
                        <span>
                          {user.FloorSection ? user.FloorSection : ""}
                        </span>
                      </div>
                    )}
                    {checkboxesChecked.FloorName && (
                      <div className="personallabelSpanStyles">
                        <label>{"Floor name"}</label>
                        <span>{user.FloorName ? user.FloorName : ""}</span>
                      </div>
                    )}
                    {checkboxesChecked.BuildingId && (
                      <div className="personallabelSpanStyles">
                        <label>{"Building ID"}</label>
                        <span>{user.BuildingId}</span>
                      </div>
                    )}
                    {console.log("userGridView", userGridView)}
                    {userGridView
                      .filter((item) => item.isCustomField === true)
                      .map((item) => (
                        <div className="personallabelSpanStyles">
                          <label>{item.nameAPI}</label>
                          <span>{user[item.name]}</span>
                        </div>
                      ))}

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {showManager &&
                        !usersWithHiddenManager.includes(user.email) && (
                          <Stack className="empManagerStyle">
                            <h4>{"Manager"}</h4>
                            <Stack horizontal>
                              <div style={{ cursor: "pointer" }}>
                                <Persona
                                  imageUrl={userMgr?.image}
                                  imageInitials={userMgr?.initials}
                                  imageAlt={userMgr?.initials}
                                  presence={PersonaPresence.none}
                                  size={PersonaSize.size56}
                                  className="profilecardmanagerField"
                                  // style={{display:"block"}}
                                />
                              </div>
                              <div style={{ margin: "0 10px" }}>
                                <div className="managerNameDet">
                                  {userMgr?.name}
                                </div>
                                <div className="managerNameDet">
                                  {userMgr?.department}
                                </div>
                                <div className="managerNameDet">
                                  {userMgr?.job}
                                </div>
                              </div>
                            </Stack>
                          </Stack>
                        )}
                        {(!showManager && additionalManager) ?<div style={{borderBottom:"1px solid #ddd",margin:"4px 0"}}></div>:""}
                      {additionalManager && (
                        
                        // className="empManagerStyle"
                        <Stack
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          {/* <h4>{"Additional Manager"}</h4> */}
                          {
                            // additionalManagers
                            additionalManager.map((x, i) => (
                              <div key={i}>
                                <h3>{additionalManagers[i]?.displayName}</h3>
                                <Stack horizontal>
                                  <div style={{ cursor: "pointer" }}>
                                    <Persona
                                      imageUrl={x?.image}
                                      imageInitials={x.name.slice(0, 1)}
                                      imageAlt={x?.name.slice(0, 1)}
                                      presence={PersonaPresence.none}
                                      size={PersonaSize.size56}
                                      className="profilecardmanagerField"
                                      // style={{display:"block"}}
                                    />
                                  </div>
                                  <div style={{ margin: "0 10px" }}>
                                    <div className="managerNameDet">
                                      {x?.name}
                                    </div>
                                    <div className="managerNameDet">
                                      {x?.department}
                                    </div>
                                    <div className="managerNameDet">
                                      {x?.job}
                                    </div>
                                  </div>
                                </Stack>
                              </div>
                            ))
                          }
                        </Stack>
                      )}
                    </div>
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Modal
            isOpen={isPronounsModalOpen}
            onDismiss={() => openPronsModal(false)}
            isBlocking={true}
            styles={{
              main: {
                maxWidth: 500,
                minWidth: 300,
                // padding: "20px",
              },
            }}
            topOffsetFixed={false}
          >
            <IconButton
              className={styles.closeEmpDetails}
              iconProps={{ iconName: "Cancel" }}
              ariaLabel="Close popup modal"
              onClick={() => openPronsModal(false)}
            />

            <div style={{ margin: "20px" }} id="empcard">
              <div>
                <h4 style={{ margin: "0px", fontSize: "15px" }}>
                  {translation.AddPronouns
                    ? translation.AddPronouns
                    : "Add your pronouns"}
                </h4>
              </div>

              <p>
                {translation.PronounsText
                  ? translation.PronounsText
                  : "Include pronouns in your profile info to let others know how to refer to you. Your pronouns are available to people at your work or school when they use Google workspace."}
              </p>
            </div>
            <Stack
              style={{
                backgroundColor: "#f5f5f5",
                minHeight: "9rem",
                maxHeight: "7rem",
                justifyContent: "center",
              }}
            >
              <Stack
                horizontal
                // className={styles.empMainDetailStyles}
                className={styles.Employeedetails}
              >
                <Stack
                  className={styles.empLogo}
                  style={{ marginRight: "-1.5rem" }}
                >
                  {props.user.outlkimg == "on" ? (
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          backgroundImage: props?.user?.image
                            ? props?.user?.image
                            : "url('')",
                          backgroundRepeat: "no-repeat",
                          width: "72px",
                          height: "72px",
                          position: "absolute",
                          top: "0px",
                          borderRadius: "50%",
                          zIndex: 1,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }}
                      ></div>
                      <Persona
                        imageUrl={props?.user?.image}
                        imageInitials={user?.initials}
                        // presence={presence}
                        // presence={['p1', 'p2'].includes(props.user.licensetype?.toLowerCase()) ? undefined : ""}
                        size={PersonaSize.size72}
                        // presenceTitle={props.user.presence}
                        initialsColor={"blue"}
                      />
                    </div>
                  ) : props.user.localimg == "on" ? (
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          backgroundImage: props?.user?.image
                            ? props?.user?.image
                            : "url('')",
                          backgroundRepeat: "no-repeat",
                          width: "72px",
                          height: "72px",
                          position: "absolute",
                          top: "0px",
                          borderRadius: "50%",
                          zIndex: 1,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }}
                      ></div>
                      <Persona
                        imageUrl={props.user.image}
                        imageInitials={user?.initials}
                        // presence={presence}
                        // presence={['p1', 'p2'].includes(props.user.licensetype?.toLowerCase()) ? undefined : presence}
                        // size={PersonaSize.size72}
                        // presenceTitle={props.user.presence}
                        // initialsColor={
                        //   siteTheme.palette.themePrimary
                        // }
                      />
                    </div>
                  ) : (
                    <div>
                      <div
                        style={{
                          backgroundImage: props.user.image
                            ? props.user.image
                            : "url('')",
                          backgroundRepeat: "no-repeat",
                          width: "72px",
                          height: "72px",
                          position: "absolute",
                          top: "0px",
                          borderRadius: "50%",
                          zIndex: 1,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }}
                      ></div>
                      <Persona
                        imageUrl={
                          props.user.image ? props.user.image : "url('')"
                        }
                        imageInitials={user?.initials}
                        // presence={presence}
                        // presence={['p1', 'p2'].includes(props.user.licensetype?.toLowerCase()) ? undefined : presence}
                        size={PersonaSize.size72}
                        // presenceTitle={props.user.presence}
                        // initialsColor={
                        //   siteTheme.palette.themePrimary
                        // }
                      />
                    </div>
                  )}

                  {/* <img src={user.img ? user.img : logo} /> */}
                </Stack>

                <Stack>
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      height: "22px",
                      position: "relative",
                    }}
                  >
                    <>
                      <div className={styles.empTitle}>
                        <span className={styles.clpbrdspan}>{user?.name}</span>
                      </div>

                      <DefaultButton
                        className={styles.pronounsButton1}
                        // onClick={openPronsModal}
                      >
                        {pronouns}
                      </DefaultButton>
                    </>
                  </div>

                  <div className={styles.empMainDetail}>
                    {user?.jtitle ? (
                      <>
                        <span>{user?.jtitle}</span>
                      </>
                    ) : (
                      ""
                    )}

                    {" | "}
                    {user?.dept ? <span>{user?.dept}</span> : ""}
                  </div>

                  {user?.loc ? (
                    <div className={styles.empMainDetail}>{user?.loc}</div>
                  ) : (
                    ""
                  )}
                </Stack>
              </Stack>
            </Stack>

            <div
              style={{
                margin: "15px 0px 15px 0px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  marginLeft: "1.6rem",
                  width: "90%",
                  // gridTemplateColumns:'300px 1fr'
                }}
              >
                <TextField
                  onChange={handlePronouns}
                  value={message}
                  // defaultValue={user.pronouns}
                  maxLength={20}
                  style={{ backgroundColor: "#f5f5f5" }}
                />
              </div>
              <div style={{ margin: "20px" }}>
                {" "}
                Example :{" "}
                <DefaultButton
                  text={"They/Them"}
                  onClick={theythem}
                  className={styles.pronounsButton}
                />{" "}
                <DefaultButton
                  text={"She/Her"}
                  onClick={SheHer}
                  className={styles.pronounsButton}
                />{" "}
                <DefaultButton
                  text={"He/Him"}
                  onClick={HeHim}
                  className={styles.pronounsButton}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                padding: "20px 20px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <a
                onClick={() => {
                  setShowMainPanel(true);
                  openPronsLoadMore(true);
                }}
                // style={{
                //   position: "absolute",
                //   bottom: "23px",
                //   left: "21px"
                // }}
                className={styles.addPrnsModal}
              >
                {" "}
                {translation.LearnMore ? translation?.LearnMore : "Learn more"}
              </a>

              <Modal
                isOpen={isPronounsLoadMoreOpen}
                onDismiss={() => openPronsLoadMore(false)}
                isBlocking={true}
                styles={{
                  main: {
                    maxWidth: 530,
                    minWidth: 300,
                    minHeight: 550,
                    // padding: "20px",
                  },
                }}
                topOffsetFixed={false}
              >
                <IconButton
                  className={styles.closeEmpDetails}
                  iconProps={{ iconName: "Cancel" }}
                  ariaLabel="Close popup modal"
                  onClick={() => openPronsLoadMore(false)}
                />
                {showMainPanel && (
                  <div className="MainPanel">
                    <div
                      style={{
                        backgroundImage: `url(${PronounsImg})`,
                        width: "auto",
                        height: "225px",
                        backgroundPosition: "center center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "100% 100%",
                      }}
                    ></div>
                    <div style={{ padding: "20px 30px" }}>
                      <h3 style={{ margin: "0px" }}>
                        {translation?.PronounsOnProfile
                          ? translation?.PronounsOnProfile
                          : "Pronouns on your profile"}
                      </h3>
                      <div>
                        <p>
                          {translation.PronounsDescription
                            ? translation.PronounsDescription
                            : `Pronouns are the words we use to replace someone's
                          name in a sentence, such as "he," "she," or "they" in
                          English. The pronouns field is an optional place for
                          you to display your pronouns to others via your
                          profile.`}
                        </p>
                      </div>
                      <div>
                        <p>
                          {translation?.PronounsUsage
                            ? translation?.PronounsUsage
                            : `
                          Using someone's pronouns correctly is a simple way to
                          show that we value being inclusive and respectful.
                          Sharing pronouns when you introduce yourself, or on
                          your profile, contributes to creating a more inclusive
                          environment and encourages more people to share theirs
                          too.`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!showMainPanel && (
                  <div className="SecondPanel">
                    <div
                      style={{
                        backgroundImage: `url(${PronounsImg2})`,
                        width: "auto",
                        height: "225px",
                        backgroundPosition: "center center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "100% 100%",
                      }}
                    ></div>
                    <div style={{ padding: "10px 30px" }}>
                      <h3 style={{ margin: "0px" }}>Avoiding assumptions</h3>
                      <div>
                        <p>
                          {translation?.PronounsRespect
                            ? translation?.PronounsRespect
                            : `
                          It's important not to assume someone's gender identity
                          or pronouns based on initial observations of them.
                          When we're referred to with the wrong pronoun, it may
                          make us feel disrespected and invalidated. By
                          investing in getting pronouns right, we show that we
                          value being inclusive and mindful. Take time to learn
                          someone's pronouns or practice with pronouns you're
                          not familiar with.`}
                        </p>
                      </div>
                      <div>
                        <p>
                          {translation?.PronounsIdentity
                            ? translation?.PronounsIdentity
                            : `
                          Remember that pronouns are part of a person's identity
                          and how we express ourselves. Whether or not to share
                          or display pronouns is always up to the individual`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    className="firstdot"
                    style={showMainPanel ? selectedDot : notselectedDot}
                  ></div>
                  <div
                    className="seconddot"
                    style={!showMainPanel ? selectedDot : notselectedDot}
                  ></div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    padding: "15px 30px",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <a
                    onClick={() => openPronsLoadMore(false)}
                    className={styles.addPrnsModal}
                  >
                    {translation.AddPronouns
                      ? translation.AddPronouns
                      : "Add your pronouns"}
                  </a>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <PrimaryButton ariaLabel="Next" onClick={nextBtnClick}>
                      {showMainPanel ? "Next" : "Back"}
                    </PrimaryButton>
                    <DefaultButton
                      text={translation.Cancel ? translation.Cancel : "Cancel"}
                      ariaLabel="Delete"
                      onClick={() => openPronsLoadMore(false)}
                    ></DefaultButton>
                  </div>
                </div>
              </Modal>
              <div style={{ display: "flex", gap: "10px" }}>
                <PrimaryButton ariaLabel="Save" onClick={savePronous}>
                  {ButtonSave}
                  {loading && (
                    <div className={styles.elementToFadeInAndOut}>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  )}
                </PrimaryButton>
                <DefaultButton
                  text={translation.Cancel ? translation.Cancel : "Cancel"}
                  ariaLabel="Delete"
                  onClick={() => openPronsModal(true)}
                ></DefaultButton>
              </div>
            </div>
          </Modal>
          <Modal
            isOpen={isOpenWFHModal}
            onDismiss={() => OpenWFHModal(false)}
            isBlocking={true}
            styles={{
              main: {
                maxWidth: 400,
                minWidth: 400,
                minHeight: 350,
                // padding: "20px",
              },
            }}
            topOffsetFixed={false}
          >
            <IconButton
              // className={styles.closeEmpDetails}
              style={{ position: "absolute", right: "5px" }}
              iconProps={{ iconName: "Cancel" }}
              ariaLabel="Close popup modal"
              onClick={() => OpenWFHModal(false)}
            />
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  padding: "20px",
                }}
              >
                <Label>Set Work Location</Label>
                <textarea
                  value={WFHText}
                  onChange={(e) => setWFHText(e.target.value)}
                ></textarea>
                <div style={{ margin: "auto" }}>
                  <PrimaryButton
                    text={translation.save}
                    onClick={handleSaveWFH}
                  />
                </div>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={isChartOpen}
            onDismiss={() => openChartModal(false)}
            isBlocking={true}
            styles={modalPropsStyles}
            topOffsetFixed={false}
          >
            <div className={styles.modalWrapper}>
              <h4 className={styles.heading}>
                {translation?.OrganizationChart
                  ? translation?.OrganizationChart
                  : "Organization Chart"}
              </h4>
              <div className={styles.iconBtnContainer}>
                <IconButton
                  className={styles.iconBtn}
                  title={"Download OrgChart as PDF..."}
                  iconProps={{ iconName: "Print" }}
                  ariaLabel="Download OrgChart PDF"
                  onClick={printDocument}
                />
                <IconButton
                  className={styles.iconBtn}
                  iconProps={{ iconName: "Cancel" }}
                  ariaLabel="Close popup modal"
                  onClick={() => openChartModal(false)}
                />
              </div>
            </div>

            <div className={styles.orgChartContainer} id="divToPrint">
              {<ModalOrgChart email={selectedUser} />}
            </div>
          </Modal>
          <UpdateUserForm isOpen={openUpdatePanel} onDismiss={()=>setOpenUpdatePanel(false)} user={user}/>

          {openReportModal && (
            <MiniModals
              isPanel={false}
              heading={"Report incorrect info"}
              crossButton={true}
              closeAction={() => setOpenResportModal(false)}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Label>Any remarks you would like to add</Label>
                <textarea
                  value={remarkValue}
                  onChange={(e) => setRemarkValue(e.target.value)}
                  style={{ resize: "none", padding: "5px", outline: "none" }}
                  rows={5}
                  cols={65}
                  name="Remarks"
                  id="Remarks"
                  placeholder="enter your remarks"
                />
                <PrimaryButton style={{ textAlign: "center" }}>
                  <a
                    style={{ textDecoration: "none", color: "#ffff" }}
                    href={`mailto:${appSettings.ReportEmails}?subject=Incorrect%20info%20report&body=${remarkValue}`}
                  >
                    Send Email
                  </a>
                </PrimaryButton>
              </div>
            </MiniModals>
          )}
        </>
      </NewDocumentWrapper>
    </>
  );
};
export default EmployeeDetailModal;
