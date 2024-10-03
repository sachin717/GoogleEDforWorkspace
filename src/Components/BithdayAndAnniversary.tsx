import React, { useEffect, useState } from "react";
import {
  Modal,
  IconButton,
  Dropdown,
  IDropdownOption,
  personaSize,
} from "@fluentui/react";
import { Persona, Label, PersonaSize } from "@fluentui/react";
import { useSttings } from "./SelectSource/store";
import { useLanguage } from "../Language/LanguageContext";
import gmailLogo from ".././Components/assets/images/gmail.png";
import gchat from ".././Components/assets/images/googleChatIcon.png";
import { decryptData, formatDatesInArray } from "./Helpers/HelperFunctions";
import styles from "./SCSS/Ed.module.scss";
import { useLists } from "../context/store";

let users: any = [
  {
    DOB: "1986-09-03",
    DOJ: "1986-09-03",
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
    DOB: "1988-09-10",
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
  showHomePage,
}) {
  const { appSettings } = useSttings();

  const {usersList,imagesList} = useLists();
  users=appSettings?.SelectedUpcomingBirthAndAniv=="importedUser"? usersList?.Users:Users;
  // console.log("users==",users)
  users = formatDatesInArray(users);
  const { translation } = useLanguage();
  const birthAndAnivFilter = appSettings?.BirthAndAnivFilter || {};
  const selectedFilter = Object.keys(birthAndAnivFilter).find(
    (key) => birthAndAnivFilter[key] === true
  );

  // console.log("app->",selectedFilter)
  const [anniversaries, setAnniversaries] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [filter, setFilter] = useState<any>(selectedFilter ?? "currentMonth"); // Default filter
  useEffect(() => {
    // console.log("....");
    setFilter(selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
    if (filter === "currentDay") {
      setAnniversaries(getAnniversariesForCurrentDay(users));
      setBirthdays(getBirthdaysForCurrentDay(users));
    } else if (filter === "currentWeek") {
      setAnniversaries(getAnniversariesForCurrentWeek(users));
      setBirthdays(getBirthdaysForCurrentWeek(users));
      console.log(
        "getBirthdaysForCurrentWeek(users)",
        getBirthdaysForCurrentWeek(users),
        users
      );
    } else if (filter === "currentWeekAndNextWeek") {
      setBirthdays(getBirthdaysForCurrentAndNextWeek(users));
      setAnniversaries(getAnniversariesForCurrentAndNextWeek(users));
    } else if (filter === "currentMonth") {
      setAnniversaries(getCurrentMonthAnniversaries(users));
      setBirthdays(getCurrentMonthBirthdays(users));
      console.log("ann", getCurrentMonthAnniversaries(users));
    } else if (filter === "upcomingMonth") {
      setAnniversaries(getUpcomingAnniversaries(users, false));
      setBirthdays(getUpcomingMonthBirthdays(users));
    } else if (filter == "currentMonthAndNextMonth") {
      setBirthdays(getBirthdaysForCurrentAndNextMonth(users));
      setAnniversaries(getAnniversaryForCurrentAndNextMonth(users));
    }
  }, [filter]);
  function getBirthdaysForNextWeek(users) {
    const today = new Date();

    // Calculate the start of the current week
    const startOfCurrentWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );

    // Calculate the start of the next week
    const startOfNextWeek = new Date(startOfCurrentWeek);
    startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);

    // Calculate the end of the next week
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

    return users
      .map((user) => {
        const dob = new Date(user.DOB);

        // Ensure the dob has the same year as the current year
        dob.setFullYear(today.getFullYear());

        // Check if the birthday falls within the next week
        if (dob >= startOfNextWeek && dob <= endOfNextWeek) {
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
  function getBirthdaysForCurrentWeek(users) {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));

    return users
      .map((user) => {
        const dob = new Date(user.DOB);
        if (
          dob.toLocaleDateString() >= startOfWeek.toLocaleDateString() &&
          dob.toLocaleDateString() <= endOfWeek.toLocaleDateString()
        ) {
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

  function getAnniversariesForNextWeek(users) {
    const today = new Date();

    // Calculate the start of the current week
    const startOfCurrentWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );

    // Calculate the start of the next week
    const startOfNextWeek = new Date(startOfCurrentWeek);
    startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);

    // Calculate the end of the next week
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

    return users
      .map((user) => {
        const anniversaryDate = new Date(user.anniversaryDate);

        // Ensure the anniversaryDate has the same year as the current year
        anniversaryDate.setFullYear(today.getFullYear());

        // Check if the anniversary falls within the next week
        if (
          anniversaryDate >= startOfNextWeek &&
          anniversaryDate <= endOfNextWeek
        ) {
          const daysUntilAnniversary = Math.ceil(
            (anniversaryDate.getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          return {
            ...user,
            upcomingAnniversary: anniversaryDate,
            daysUntilAnniversary,
          };
        }
        return null;
      })
      .filter((user) => user !== null);
  }

  function getBirthdaysForCurrentAndNextWeek(users) {
    const today = new Date();

    // Calculate the start of the current week
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - today.getDay());

    // Calculate the end of the current week
    const endOfCurrentWeek = new Date(startOfCurrentWeek);
    endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 6);

    // Calculate the start of the next week
    const startOfNextWeek = new Date(endOfCurrentWeek);
    startOfNextWeek.setDate(endOfCurrentWeek.getDate() + 1);

    // Calculate the end of the next week
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

    // Combine results for both weeks
    const birthdays = users
      .map((user) => {
        const dob = new Date(user.DOB);

        // Ensure dob has the same year as the current year
        dob.setFullYear(today.getFullYear());

        let isBirthdayInRange = false;

        // Check if birthday is in the current week
        if (dob >= startOfCurrentWeek && dob <= endOfCurrentWeek) {
          isBirthdayInRange = true;
        }

        // Check if birthday is in the next week
        if (dob >= startOfNextWeek && dob <= endOfNextWeek) {
          isBirthdayInRange = true;
        }

        // If the birthday is within either of the weeks
        if (isBirthdayInRange) {
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

    return birthdays;
  }

  function getAnniversariesForCurrentAndNextWeek(users) {
    const today = new Date();

    // Calculate the start of the current week
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - today.getDay());

    // Calculate the end of the current week
    const endOfCurrentWeek = new Date(startOfCurrentWeek);
    endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 6);

    // Calculate the start of the next week
    const startOfNextWeek = new Date(endOfCurrentWeek);
    startOfNextWeek.setDate(endOfCurrentWeek.getDate() + 1);

    // Calculate the end of the next week
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

    // Combine results for both weeks
    const birthdays = users
      .map((user) => {
        const dob = new Date(user.DOJ);

        // Ensure dob has the same year as the current year
        dob.setFullYear(today.getFullYear());

        let isBirthdayInRange = false;

        // Check if birthday is in the current week
        if (dob >= startOfCurrentWeek && dob <= endOfCurrentWeek) {
          isBirthdayInRange = true;
        }

        // Check if birthday is in the next week
        if (dob >= startOfNextWeek && dob <= endOfNextWeek) {
          isBirthdayInRange = true;
        }

        // If the birthday is within either of the weeks
        if (isBirthdayInRange) {
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

    return birthdays;
  }

  function getAnniversariesForCurrentDay(users) {
    const today = new Date();
    const todayMonthDay = `${today.getMonth() + 1}-${today.getDate()}`; // MM-DD format

    return users
      .map((user) => {
        const doj = new Date(user.DOJ);
        const dojMonthDay = `${doj.getMonth() + 1}-${doj.getDate()}`; // MM-DD format

        if (todayMonthDay === dojMonthDay) {
          const anniversaryThisYear = new Date(
            today.getFullYear(),
            doj.getMonth(),
            doj.getDate()
          );
          const daysUntilAnniversary = 0; // It's today, so days until anniversary is 0

          return {
            ...user,
            upcomingAnniversary: anniversaryThisYear,
            daysUntilAnniversary,
          };
        }
        return null;
      })
      .filter((user) => user !== null);
  }

  function getBirthdaysForCurrentDay(users) {
    const today = new Date();
    const todayMonthDay = `${today.getMonth() + 1}-${today.getDate()}`;

    return users
      .map((user) => {
        const dob = new Date(user.DOB);
        const dobMonthDay = `${dob.getMonth() + 1}-${dob.getDate()}`; // MM-DD format

        if (todayMonthDay === dobMonthDay) {
          return {
            ...user,
            upcomingBirthday: new Date(
              today.getFullYear(),
              dob.getMonth(),
              dob.getDate()
            ),
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
        if (
          doj.toLocaleDateString() >= startOfWeek.toLocaleDateString() &&
          doj.toLocaleDateString() <= endOfWeek.toLocaleDateString()
        ) {
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
  function getBirthdaysForCurrentAndNextMonth(users) {
    const today: any = new Date();

    function getMonthRange(monthOffset) {
      const startOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + monthOffset,
        1
      );
      const endOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + monthOffset + 1,
        0
      );
      return { startOfMonth, endOfMonth };
    }

    const { startOfMonth: startOfCurrentMonth, endOfMonth: endOfCurrentMonth } =
      getMonthRange(0);
    const { startOfMonth: startOfNextMonth, endOfMonth: endOfNextMonth } =
      getMonthRange(1);

    return users
      .map((user) => {
        const dob = new Date(user.DOB);
        const nextBirthday: any = new Date(dob);
        nextBirthday.setFullYear(today.getFullYear());

        if (nextBirthday < today) {
          nextBirthday.setFullYear(today.getFullYear() + 1);
        }

        return {
          ...user,
          upcomingBirthday: nextBirthday,
          daysUntilBirthday: Math.ceil(
            (nextBirthday - today) / (1000 * 60 * 60 * 24)
          ),
        };
      })
      .filter((user) => {
        const { upcomingBirthday } = user;
        return (
          (upcomingBirthday >= startOfCurrentMonth &&
            upcomingBirthday <= endOfCurrentMonth) ||
          (upcomingBirthday >= startOfNextMonth &&
            upcomingBirthday <= endOfNextMonth)
        );
      });
  }
  function getAnniversaryForCurrentAndNextMonth(users) {
    const today: any = new Date();

    function getMonthRange(monthOffset) {
      const startOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + monthOffset,
        1
      );
      const endOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + monthOffset + 1,
        0
      );
      return { startOfMonth, endOfMonth };
    }

    const { startOfMonth: startOfCurrentMonth, endOfMonth: endOfCurrentMonth } =
      getMonthRange(0);
    const { startOfMonth: startOfNextMonth, endOfMonth: endOfNextMonth } =
      getMonthRange(1);

    return users
      .map((user) => {
        const doj = new Date(user.DOJ);
        const nextBirthday: any = new Date(doj);
        nextBirthday.setFullYear(today.getFullYear());

        if (nextBirthday < today) {
          nextBirthday.setFullYear(today.getFullYear() + 1);
        }

        return {
          ...user,
          upcomingBirthday: nextBirthday,
          daysUntilBirthday: Math.ceil(
            (nextBirthday - today) / (1000 * 60 * 60 * 24)
          ),
        };
      })
      .filter((user) => {
        const { upcomingBirthday } = user;
        return (
          (upcomingBirthday >= startOfCurrentMonth &&
            upcomingBirthday <= endOfCurrentMonth) ||
          (upcomingBirthday >= startOfNextMonth &&
            upcomingBirthday <= endOfNextMonth)
        );
      });
  }

  const filterOptions = [
    { key: "currentDay", text: "Current Day" },
    { key: "currentWeek", text: "Current Week" },
    { key: "currentWeekAndNextWeek", text: "Current week and Next week " },
    { key: "currentMonth", text: "Current Month" },
    { key: "currentMonthAndNextMonth", text: "Current Month And Next Month" },
    // { key: "upcomingMonth", text: "Upcoming Month" },
  ];

  return (
    <Modal
      isOpen={isBirthAndAnivModalOpen}
      onDismiss={() => {setBirthAndAnivModalOpen(false);showHomePage(true)}}
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
          <h1 className="modal-header">
            {translation.UpcomingBirthdays
              ? translation.UpcomingBirthdays
              : "Upcoming Birthdays and Anniversaries"}
          </h1>
          {imagesList.BirthdayAndAnniversaryImage && (
            <img
              width={"auto"}
              height={120}
              src={imagesList.BirthdayAndAnniversaryImage}
              alt=""
            />
          )}
        </div>

        <div
          className="filter-container"
          style={{
            display: "flex",
            gap: "5px",
            float: "right",
            margin: "10px 20px",
          }}
        >
          <Label>
            {translation.BirthdayAndAnniversaryFilterFor
              ? translation.BirthdayAndAnniversaryFilterFor
              : "Birthday and anniversary filter for: "}
          </Label>
          <Dropdown
            className={styles.filterbirthAndAnniv}
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
            <h3 className="section-header">
              {translation.Birthdays ? translation.Birthdays : "Birthdays"}
            </h3>
            {birthdays?.length > 0 && (
              <div className="user-item">
                <Label>{translation.Name ? translation.Name : "Name"}</Label>
                <Label>
                  {translation.Department
                    ? translation.Department
                    : "Department"}
                </Label>
                <Label>{translation.DOB ? translation.DOB : "DOB"}</Label>
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
                    <Persona
                      imageUrl={user.image}
                      text={user.name}
                      size={PersonaSize.size40}
                    />
                    <p>{user.department}</p>
                    <p>{user.DOB}</p>
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        cursor: "pointer",
                      }}
                    >
                      <a
                        style={{ cursor: "pointer" }}
                        href={"https://gmail.google.com"}
                        target="_blank"
                      >
                        <img src={gmailLogo} alt="gooogle chat" width={20} />
                      </a>
                      <a
                        style={{ cursor: "pointer" }}
                        href={"https://chat.google.com"}
                        target="_blank"
                      >
                        <img src={gchat} alt="gmail" width={20} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>
                {translation.NoUpcomingBirthdays
                  ? translation.NoUpcomingBirthdays
                  : "No upcoming birthdays"}
              </p>
            )}
          </div>

          <div className="anniversaries-section">
            <h3 className="section-header">
              {" "}
              {translation.DayOfAnniversary
                ? translation.DayOfAnniversary
                : "Anniversaries"}
            </h3>
            {anniversaries.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div className="user-item">
                  <Label>{translation.Name ? translation.Name : "Name"}</Label>
                  <Label>
                    {translation.Department
                      ? translation.Department
                      : "Department"}
                  </Label>
                  <Label>{translation.DOJ ? translation.DOJ : "DOJ"}</Label>
                  <Label>{"Links"}</Label>
                </div>
                {anniversaries.map((user, index) => (
                  <div key={index} className="user-item">
                    <Persona
                      text={user.name}
                      imageUrl={user?.image}
                      size={PersonaSize.size40}
                    />
                    <p>{user.department}</p>
                    <p>{user.DOJ}</p>
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        cursor: "pointer",
                      }}
                    >
                      <a
                        style={{ cursor: "pointer" }}
                        href={"https://gmail.google.com"}
                        target="_blank"
                      >
                        <img src={gmailLogo} alt="gooogle chat" width={20} />
                      </a>
                      <a
                        style={{ cursor: "pointer" }}
                        href={"https://chat.google.com"}
                        target="_blank"
                      >
                        <img src={gchat} alt="gmail" width={20} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>
                {translation.NoUpcomingAnniversaries
                  ? translation.NoUpcomingAnniversaries
                  : "No upcoming anniversaries"}
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default BirthdayAndAnniversary;
