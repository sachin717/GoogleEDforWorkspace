import React, { useEffect, useState } from "react";
import { Modal, IconButton, Dropdown, IDropdownOption, personaSize } from "@fluentui/react";
import { Persona, Label, PersonaSize } from "@fluentui/react";
import { useSttings } from "./SelectSource/store";
import { useLanguage } from "../Language/LanguageContext";
import gmailLogo from ".././Components/assets/images/gmail.png";
import gchat from ".././Components/assets/images/googleChatIcon.png";
import { decryptData, formatDatesInArray } from "./Helpers/HelperFunctions";

let users:any = [
  {
    DOB: "1986-08-31",
    DOJ: "1986-07-30",
    firstName: "Jamesldfksfs",
    lastName: "Johnson",
    name: "James Johnson dfsd",
    department: "IT",
  },
  {
    DOB: "1988-08-29",
    DOJ: "1988-08-29",
    firstName: "John",
    lastName: "Taylor",
    name: "John Taylor",
    department: "SharePoint",
  },
  {
    DOB: "1989-01-03",
    DOJ: "1989-01-03",
    firstName: "Adele",
    lastName: "Vance",
    name: "Adele Vance",
    department: "Dev",
  },
  {
    DOB: "1986-01-07",
    DOJ: "1986-07-22",
    firstName: "James",
    lastName: "Johnson",
    name: "James Johnson",
    department: "IT",
  },
  {
    DOB: "1988-07-26",
    DOJ: "1988-07-23",
    firstName: "John",
    lastName: "Taylor",
    name: "John Taylor",
    department: "SharePoint",
  },
  {
    DOB: "1989-01-03",
    DOJ: "1989-01-03",
    firstName: "Adele",
    lastName: "Vance",
    name: "Adele Vance",
    department: "Dev",
  },
  {
    DOB: "1986-01-07",
    DOJ: "1986-07-22",
    firstName: "James",
    lastName: "Johnson",
    name: "James Johnson",
    department: "IT",
  },
  {
    DOB: "1988-07-26",
    DOJ: "1988-07-23",
    firstName: "John",
    lastName: "Taylor",
    name: "John Taylor",
    department: "SharePoint",
  },
  {
    DOB: "1989-01-03",
    DOJ: "1989-01-03",
    firstName: "Adele",
    lastName: "Vance",
    name: "Adele Vance",
    department: "Dev",
  },
  {
    DOB: "1986-01-07",
    DOJ: "1986-07-22",
    firstName: "James",
    lastName: "Johnson",
    name: "James Johnson",
    department: "IT",
  },
  {
    DOB: "1988-07-26",
    DOJ: "1988-07-23",
    firstName: "John",
    lastName: "Taylor",
    name: "John Taylor",
    department: "SharePoint",
  },
  {
    DOB: "1989-01-03",
    DOJ: "1989-01-03",
    firstName: "Adele",
    lastName: "Vance",
    name: "Adele Vance",
    department: "Dev",
  },
  {
    DOB: "1986-01-07",
    DOJ: "1986-07-22",
    firstName: "James",
    lastName: "Johnson",
    name: "James Johnson",
    department: "IT",
  },
  {
    DOB: "1988-07-26",
    DOJ: "1988-07-23",
    firstName: "John",
    lastName: "Taylor",
    name: "John Taylor",
    department: "SharePoint",
  },
  {
    DOB: "1989-01-03",
    DOJ: "1989-01-03",
    firstName: "Adele",
    lastName: "Vance",
    name: "Adele Vance",
    department: "Dev",
  },
  {
    DOB: "1986-01-07",
    DOJ: "1986-07-22",
    firstName: "James",
    lastName: "Johnson",
    name: "James Johnson",
    department: "IT",
  },
  {
    DOB: "1988-07-26",
    DOJ: "1988-07-23",
    firstName: "John",
    lastName: "Taylor",
    name: "John Taylor",
    department: "SharePoint",
  },
  {
    DOB: "1989-01-03",
    DOJ: "1989-01-03",
    firstName: "Adele",
    lastName: "Vance",
    name: "Adele Vance",
    department: "Dev",
  },
];

function BirthdayAndAnniversary({
  Users,
  isBirthAndAnivModalOpen,
  setBirthAndAnivModalOpen,
}) {
    
    const { appSettings } = useSttings();
    users=appSettings?.SelectedUpcomingBirthAndAniv=="importedUser"? JSON?.parse(decryptData(appSettings?.Users)):users;
    // console.log("users==",users)
    users=formatDatesInArray(Users);
    const {translation}=useLanguage();
    const birthAndAnivFilter = appSettings?.BirthAndAnivFilter || {}; 
    const selectedFilter = Object.keys(birthAndAnivFilter).find(key => birthAndAnivFilter[key] === true);
    
    // console.log("app->",selectedFilter)
  const [anniversaries, setAnniversaries] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [filter, setFilter] = useState<any>(selectedFilter??"currentMonth"); // Default filter
 useEffect(()=>{
  // console.log("....");
  setFilter(selectedFilter);
 },[selectedFilter])

  useEffect(() => {
    if (filter === "currentDay") {
      setAnniversaries(getAnniversariesForCurrentDay(users));
      setBirthdays(getBirthdaysForCurrentDay(users));
    } else if (filter === "currentWeek") {
      setAnniversaries(getAnniversariesForCurrentWeek(users));
      setBirthdays(getBirthdaysForCurrentWeek(users));
    } else if (filter === "currentMonth") {
      setAnniversaries(getCurrentMonthAnniversaries(users));
      setBirthdays(getCurrentMonthBirthdays(users));
      console.log("ann",getCurrentMonthAnniversaries(users))
    } else if (filter === "upcomingMonth") {
      setAnniversaries(getUpcomingAnniversaries(users, false));
      setBirthdays(getUpcomingMonthBirthdays(users));
    }
  }, [filter]);

  function getAnniversariesForCurrentDay(users) {
    const today = new Date();
    return users
      .map((user) => {
        const doj = new Date(user.DOJ);
        if (today.toDateString() === doj.toDateString()) {
          return {
            ...user,
            upcomingAnniversary: doj,
            daysUntilAnniversary: 0,
          };
        }
        return null;
      })
      .filter((user) => user !== null);
  }

  function getBirthdaysForCurrentDay(users) {
    const today = new Date();
    return users
      .map((user) => {
        const dob = new Date(user.DOB);
        if (today.toDateString() === dob.toDateString()) {
          return {
            ...user,
            upcomingBirthday: dob,
            daysUntilBirthday: 0,
          };
        }
        return null;
      })
      .filter((user) => user !== null);
  }

  function getAnniversariesForCurrentWeek(users) {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));

    return users
      .map((user) => {
        const doj = new Date(user.DOJ);
        if (doj >= startOfWeek && doj <= endOfWeek) {
          const daysUntilAnniversary = Math.ceil(
            (doj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
          return {
            ...user,
            upcomingAnniversary: doj,
            daysUntilAnniversary,
          };
        }
        return null;
      })
      .filter((user) => user !== null);
  }

  function getBirthdaysForCurrentWeek(users) {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));

    return users
      .map((user) => {
        const dob = new Date(user.DOB);
        if (dob >= startOfWeek && dob <= endOfWeek) {
          const daysUntilBirthday = Math.ceil(
            (dob.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
          return {
            ...user,
            upcomingBirthday: dob,
            daysUntilBirthday,
          };
        }
        return null;
      })
      .filter((user) => user !== null);
  }

  function getUpcomingMonthBirthdays(users) {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const nextMonth = (currentMonth + 1) % 12;
    const nextYear = nextMonth === 0 ? currentYear + 1 : currentYear;

    return users
      .map((user) => {
        const dob = new Date(user.DOB);
        const birthMonth = dob.getMonth();
        const birthDay = dob.getDate();

        if (birthMonth === nextMonth) {
          const birthdayNextMonth = new Date(nextYear, birthMonth, birthDay);
          return {
            ...user,
            upcomingBirthday: birthdayNextMonth,
            daysUntilBirthday: Math.ceil(
              (birthdayNextMonth.getTime() - today.getTime()) /
                (1000 * 60 * 60 * 24)
            ),
          };
        }
        return null;
      })
      .filter((user) => user !== null);
  }

  function getUpcomingAnniversaries(users, currentMonth) {
    const today = new Date();
    const currentMonthIndex = today.getMonth();
    const currentYear = today.getFullYear();
    const targetMonthIndex = currentMonth
      ? currentMonthIndex
      : (currentMonthIndex + 1) % 12;
    const targetYear = targetMonthIndex === 0 ? currentYear + 1 : currentYear;

    return users
      .map((user) => {
        const doj = new Date(user.DOJ);
        const joinMonth = doj.getMonth();
        const joinDay = doj.getDate();

        if (joinMonth === targetMonthIndex) {
          const anniversaryThisYear = new Date(targetYear, joinMonth, joinDay);
          return {
            ...user,
            upcomingAnniversary: anniversaryThisYear,
            daysUntilAnniversary: Math.ceil(
              (anniversaryThisYear.getTime() - today.getTime()) /
                (1000 * 60 * 60 * 24)
            ),
          };
        }
        return null;
      })
      .filter((user) => user !== null);
  }
  function getCurrentMonthBirthdays(users) {
    const today = new Date();
    const currentMonth = today.getMonth();

    return users
      .map((user) => {
        const dob = new Date(user.DOB);
        const birthMonth = dob.getMonth();
        const birthDay = dob.getDate();

        if (birthMonth === currentMonth) {
          const birthdayThisYear = new Date(
            today.getFullYear(),
            birthMonth,
            birthDay
          );
          const timeDifference = birthdayThisYear.getTime() - today.getTime();
          const daysUntilBirthday = Math.ceil(
            timeDifference / (1000 * 60 * 60 * 24)
          );

          return {
            ...user,
            upcomingBirthday: birthdayThisYear,
            daysUntilBirthday,
          };
        }
        return null;
      })
      .filter((user) => user !== null);
  }
  function getCurrentMonthAnniversaries(users) {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return users
      .map((user) => {
        const doj = new Date(user.DOJ);
        const joinMonth = doj.getMonth();
        const joinDay = doj.getDate();

        if (joinMonth === currentMonth) {
          const anniversaryThisYear = new Date(currentYear, joinMonth, joinDay);
          const timeDifference =
            anniversaryThisYear.getTime() - today.getTime();
          const daysUntilAnniversary = Math.ceil(
            timeDifference / (1000 * 60 * 60 * 24)
          );

          return {
            ...user,
            upcomingAnniversary: anniversaryThisYear,
            daysUntilAnniversary,
          };
        }
        return null;
      })
      .filter((user) => user !== null)
      .sort((a, b) => a.daysUntilAnniversary - b.daysUntilAnniversary);
  }

  const filterOptions = [
    { key: "currentDay", text: "Current Day" },
    { key: "currentWeek", text: "Current Week" },
    { key: "currentMonth", text: "Current Month" },
    { key: "upcomingMonth", text: "Upcoming Month" },
  ];

  return (
    <Modal
      isOpen={isBirthAndAnivModalOpen}
      onDismiss={() => setBirthAndAnivModalOpen(false)}
      isBlocking={true}
      styles={{
        main: {
          maxWidth: 1200,
          minWidth: 480,
          minHeight: "660px",
          height: "660px",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          padding: "10px",
        },
      }}
      topOffsetFixed={false}
    >
      <div className="bithdayModal">
        <IconButton
          className="icon-button"
          iconProps={{ iconName: "Cancel" }}
          onClick={() => setBirthAndAnivModalOpen(false)}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginRight: "50px",
            overflow: "hidden",
          }}
        >
          <h1 className="modal-header">{translation.UpcomingBirthdays?translation.UpcomingBirthdays:"Upcoming Birthdays and Anniversaries"}</h1>
          {appSettings?.BirthdayAndAnniversaryImage && (
            <img
              width={"auto"}
              height={120}
              src={appSettings?.BirthdayAndAnniversaryImage}
              alt=""
            />
          )}
        </div>

        <div
          className="filter-container"
          style={{ display: "flex", gap: "5px" ,float:"right",margin:"10px 20px"}}
        >
          <Label>{translation.BirthdayAndAnniversaryFilterFor?translation.BirthdayAndAnniversaryFilterFor:"Birthday and anniversary filter for: "}</Label>
          <Dropdown
            placeholder={translation.SelectFilter}
            options={filterOptions}
            selectedKey={filter}
           
            onChange={(e, option) => setFilter(option?.key)}
          />
        </div>

        <div
          className="modal-container"
          style={{ overflowY: "scroll", height: "60vh" }}
        >
          <div className="birthdays-section">
            <h3 className="section-header">{translation.Birthdays?translation.Birthdays:"Birthdays"}</h3>
            {birthdays?.length > 0 && (
              <div className="user-item">
                <Label>{translation.Name?translation.Name:"Name"}</Label>
                <Label>{translation.Department?translation.Department:"Department"}</Label>
                <Label>{translation.DOB?translation.DOB:"DOB"}</Label>
                <Label>{"Links"}</Label>
              </div>
            )}
            {birthdays.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {birthdays.map((user, index) => (
                  <div key={index} className="user-item">
                    <Persona imageUrl={user.image} text={user.name} size={PersonaSize.size40} />
                    <p>{user.department}</p>
                    <p>{user.DOB}</p>
                    <div style={{display:"flex",gap:"20px",cursor:"pointer"}}>
                    <a style={{cursor:"pointer"}} href={"https://gmail.google.com"} target="_blank"><img src={gmailLogo} alt="gooogle chat" width={20} /></a>
                    <a style={{cursor:"pointer"}} href={"https://chat.google.com"} target="_blank"><img src={gchat} alt="gmail" width={20} /></a>
                    </div> 
                  </div>
                ))}
              </div>
            ) : (
              <p>{translation.NoUpcomingBirthdays?translation.NoUpcomingBirthdays:"No upcoming birthdays"}</p>
            )}
          </div>
            
          <div className="anniversaries-section">
            <h3 className="section-header"> {translation.DayOfAnniversary?translation.DayOfAnniversary:"Anniversaries"}</h3>
            {anniversaries.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div className="user-item">
                <Label>{translation.Name?translation.Name:"Name"}</Label>
                <Label>{translation.Department?translation.Department:"Department"}</Label>
                <Label>{translation.DOJ?translation.DOJ:"DOJ"}</Label>
                <Label>{"Links"}</Label>
                </div>
                {anniversaries.map((user, index) => (
                  <div key={index} className="user-item">
                    <Persona text={user.name} imageUrl={user?.image} size={PersonaSize.size40} />
                    <p>{user.department}</p>
                    <p>{user.DOJ}</p>
                    <div style={{display:"flex",gap:"20px",cursor:"pointer"}}>
                    <a style={{cursor:"pointer"}} href={"https://gmail.google.com"} target="_blank"><img src={gmailLogo} alt="gooogle chat" width={20} /></a>
                    <a style={{cursor:"pointer"}} href={"https://chat.google.com"} target="_blank"><img src={gchat} alt="gmail" width={20} /></a>
                    </div>   

                  </div>
                ))}
              </div>
            ) : (
              <p>{translation.NoUpcomingAnniversaries?translation.NoUpcomingAnniversaries:"No upcoming anniversaries"}</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default BirthdayAndAnniversary;
