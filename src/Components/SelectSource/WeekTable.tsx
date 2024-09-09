import React, { useState, useEffect } from "react";
import "./Edp.scss";
import {
  Checkbox,
  DetailsList,
  IColumn,
  Icon,
  Panel,
  PanelType,
  Pivot,
  PivotItem,
  TextField,
  SelectionMode,
  ChoiceGroup,
  IChoiceGroupOption,
} from "@fluentui/react";
import "sweetalert2/dist/sweetalert2.css";
import { SweetAlerts } from "./Utils/SweetAlert";
import { PrimaryButton } from "@fluentui/react";
import { getCurrentUser, updateSettingData } from "../Helpers/HelperFunctions";
import { useSttings } from "./store";
import { useLanguage } from "../../Language/LanguageContext";

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
    },
  },
};

const WeekTable = ({
  showWWTable,
  user,
  isPanelOpenWorkWeek,
  closePanelWorkWeek,
  OpenPanelWorkWeek,
}) => {
  const [weekIndex, setWeekIndex] = useState(0);
  const [items, setItems] = useState([]);
  const { translation } = useLanguage();
  const [userData, setUserData] = useState<any>([]);
  const [itemsNextWeek, setItemsNextWeek] = useState([]);
  const [selectedOption, setSelectedOption] = useState<string>("WFO");
  const [sortedColumnKey, setSortedColumnKey] = useState<string | undefined>(
    undefined
  );
  const [isSortedDescending, setIsSortedDescending] = useState<boolean>(false);
  const { appSettings, setAppSettings } = useSttings();
  const { SweetAlert: SweetAlertWorkWeek } = SweetAlerts("#weekPanelAlert");
  const options: IChoiceGroupOption[] = [
    { key: "WFH", text: "Always work from home (WFH)" },
    { key: "WFO", text: "Always work from office (WFO)" },
  ];

  const columns: IColumn[] = [
    {
      key: "day",
      name: "Day",
      fieldName: "day",
      minWidth: 100,
      maxWidth: 150,
      isMultiline: true,
      isSorted: sortedColumnKey === "day",
      isSortedDescending: isSortedDescending && sortedColumnKey === "day",
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      onColumnClick: () => handleColumnHeaderClick("day"),
    },
    {
      key: "date",
      name: "Date",
      fieldName: "date",
      minWidth: 100,
      maxWidth: 150,
      isMultiline: true,
      isSorted: sortedColumnKey === "date",
      isSortedDescending: isSortedDescending && sortedColumnKey === "date",
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      onColumnClick: () => handleColumnHeaderClick("date"),
    },
    {
      key: "status",
      name: "Status",
      fieldName: "status",
      minWidth: 100,
      maxWidth: 150,
      isMultiline: true,
      isSorted: sortedColumnKey === "status",
      isSortedDescending: isSortedDescending && sortedColumnKey === "status",
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      onColumnClick: () => handleColumnHeaderClick("status"),
      onRender: (item: any) => (
        <TextField
          value={item.status}
          onChange={(e, newValue) =>
            handleStatusChange(item.id, newValue || "")
          }
        />
      ),
    },
    {
      key: "displayDay",
      name: "Display Day",
      fieldName: "displayDay",
      minWidth: 100,
      maxWidth: 150,
      isMultiline: true,
      onRender: (item: any) => (
        <Checkbox
          checked={item.displayDay}
          onChange={(e, checked) =>
            handleDisplayDayChange(item.id, checked || false)
          }
        />
      ),
    },
    {
      key: "displayDate",
      name: "Display Date",
      fieldName: "displayDate",
      minWidth: 100,
      maxWidth: 150,
      isMultiline: true,
      onRender: (item: any) => (
        <Checkbox
          checked={item.displayDate}
          onChange={(e, checked) =>
            handleDisplayDateChange(item.id, checked || false)
          }
        />
      ),
    },
  ];

  const columnsNextWeek: IColumn[] = [
    {
      key: "day",
      name: "Day",
      fieldName: "day",
      minWidth: 100,
      maxWidth: 150,
      isMultiline: true,
      isSorted: sortedColumnKey === "day",
      isSortedDescending: isSortedDescending && sortedColumnKey === "day",
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      onColumnClick: () => handleColumnHeaderClickNextWeek("day"),
    },
    {
      key: "date",
      name: "Date",
      fieldName: "date",
      minWidth: 100,
      maxWidth: 150,
      isMultiline: true,
      isSorted: sortedColumnKey === "date",
      isSortedDescending: isSortedDescending && sortedColumnKey === "date",
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      onColumnClick: () => handleColumnHeaderClickNextWeek("date"),
    },
    {
      key: "status",
      name: "Status",
      fieldName: "status",
      minWidth: 100,
      maxWidth: 150,
      isMultiline: true,
      isSorted: sortedColumnKey === "status",
      isSortedDescending: isSortedDescending && sortedColumnKey === "status",
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      onColumnClick: () => handleColumnHeaderClickNextWeek("status"),
      onRender: (item: any) => (
        <TextField
          value={item.status}
          onChange={(e, newValue) =>
            handleStatusChangeNextWeek(item.id, newValue || "")
          }
        />
      ),
    },
    {
      key: "displayDay",
      name: "Display Day",
      fieldName: "displayDay",
      minWidth: 100,
      maxWidth: 150,
      isMultiline: true,
      onRender: (item: any) => (
        <Checkbox
          checked={item.displayDay}
          onChange={(e, checked) =>
            handleDisplayDayChangeNextWeek(item.id, checked || false)
          }
        />
      ),
    },
    {
      key: "displayDate",
      name: "Display Date",
      fieldName: "displayDate",
      minWidth: 100,
      maxWidth: 150,
      isMultiline: true,
      onRender: (item: any) => (
        <Checkbox
          checked={item.displayDate}
          onChange={(e, checked) =>
            handleDisplayDateChangeNextWeek(item.id, checked || false)
          }
        />
      ),
    },
  ];

  useEffect(() => {
    const data = appSettings?.WorkWeekData?.find(
      (item) => item.email === user.email
    );
    if (data) {
      if (
        formatDate(new Date()) > data.NextWeek[data?.NextWeek?.length - 1]?.date
      ) {
        setWeekData();
      } else {
        if (hasCurrentWeekPassed()) {
          setItems(data.NextWeek);
          const datesNext = getWeekDates(1);
          const newItemsNext = transformDatesToItems(datesNext, selectedOption);
          setItemsNextWeek(newItemsNext);
        } else {
          if (appSettings?.WorkWeekData?.length) {
            if (showWWTable && user?.email) {
              // const data = appSettings?.WorkWeekData?.find((item) => item.email === user.email);

              setUserData(data);
              setItems(data.CurrentWeek || []);
              setItemsNextWeek(data.NextWeek || []);
              setSelectedOption(data.Default || "WFO");
            }
          }
        }
      }
    } else {
      setWeekData();
    }
    // if(data){
    //   if(hasCurrentWeekPassed()){
    //     window.alert("asdfasd")
    //     setItems(data.NextWeek);
    //     const datesNext = getWeekDates(1);
    //     const newItemsNext = transformDatesToItems(datesNext,selectedOption);
    //     setItemsNextWeek(newItemsNext);
    //         }else{

    //         if(appSettings?.WorkWeekData?.length){
    //         if (showWWTable && user?.email) {
    //           // const data = appSettings?.WorkWeekData?.find((item) => item.email === user.email);

    //             setUserData(data);
    //             setItems(data.CurrentWeek || []);
    //             setItemsNextWeek(data.NextWeek || []);
    //             setSelectedOption(data.Default || 'WFO');

    //         }
    //       }else{
    //         setWeekData();
    //       }
    //         }
    // }else{
    //   setWeekData();
    //   const updatedWorkWeekData = {
    //     email: user.email,
    //     CurrentWeek: transformDatesToItems(getWeekDates(0),selectedOption),
    //     NextWeek: transformDatesToItems(getWeekDates(1),selectedOption),
    //     Default: selectedOption,
    //   };
    //   const currentWorkWeekData = appSettings?.WorkWeekData || [];
    //   const updatedSettings = [...currentWorkWeekData, updatedWorkWeekData];

    //   updateSettingData({ ...appSettings, WorkWeekData: updatedSettings });
    //   setAppSettings({ ...appSettings, WorkWeekData: updatedSettings });

    // }
  }, [showWWTable]);

  function setWeekData() {
    const dates = getWeekDates(0);
    const datesNext = getWeekDates(1);
    const newItems = transformDatesToItems(dates, selectedOption);
    const newItemsNext = transformDatesToItems(datesNext, selectedOption);
    setItems(newItems);
    setItemsNextWeek(newItemsNext);
  }

  function hasCurrentWeekPassed() {
 
    const today = formatDate(new Date());
    const data = appSettings?.WorkWeekData?.find(
      (item) => item.email === user.email
    );
  

    let cur;
    let nxt;
    if (data) {
      console.log(data);
      let len = data.CurrentWeek.length - 1;
      console.log("len", len);
      cur = data.CurrentWeek[len].date;
      nxt = data.NextWeek;
    }
 
    return today > cur;
  }
  function formatDate(date: Date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}-${month}`;
  }
  const getStartOfWeek = (date) => {
    const day = date.getDay();

    const diff = (day === 0 ? 6 : day - 1) * 24 * 60 * 60 * 1000;
    return new Date(date.getTime() - diff);
  };

  const getEndOfWeek = (startOfWeek) => {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return endOfWeek;
  };

  function transformDatesToItems(dates, Option) {
    return dates.map((date, index) => ({
      id: index + 1,
      day: formatDayName(date),
      date: formatDate(date),
      status: Option === "WFH" ? "WFH" : "WFO",
      displayDay: true,
      displayDate: true,
    }));
  }

  function handleColumnHeaderClick(columnKey: string) {
    const newIsSortedDescending =
      sortedColumnKey === columnKey ? !isSortedDescending : false;
    const sortedItems = [...items].sort((a, b) => {
      const aValue = a[columnKey];
      const bValue = b[columnKey];
      if (aValue < bValue) {
        return newIsSortedDescending ? 1 : -1;
      }
      if (aValue > bValue) {
        return newIsSortedDescending ? -1 : 1;
      }
      return 0;
    });
    setItems(sortedItems);
    setSortedColumnKey(columnKey);
    setIsSortedDescending(newIsSortedDescending);
  }

  function handleColumnHeaderClickNextWeek(columnKey: string) {
    const newIsSortedDescending =
      sortedColumnKey === columnKey ? !isSortedDescending : false;
    const sortedItems = [...itemsNextWeek].sort((a, b) => {
      const aValue = a[columnKey];
      const bValue = b[columnKey];
      if (aValue < bValue) {
        return newIsSortedDescending ? 1 : -1;
      }
      if (aValue > bValue) {
        return newIsSortedDescending ? -1 : 1;
      }
      return 0;
    });
    setItemsNextWeek(sortedItems);
    setSortedColumnKey(columnKey);
    setIsSortedDescending(newIsSortedDescending);
  }

  const handleChoiceChange = (
    ev: React.ChangeEvent<HTMLInputElement>,
    option?: IChoiceGroupOption
  ) => {
    if (option) {
      setSelectedOption(option.key);
      const datesCurrent = getWeekDates(0);
      const datesNext = getWeekDates(1);
      setItems(transformDatesToItems(datesCurrent, option.key));
      setItemsNextWeek(transformDatesToItems(datesNext, option.key));
      console.log("c", transformDatesToItems(datesCurrent, option.key));
      console.log("n", transformDatesToItems(datesNext, option.key));
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleStatusChangeNextWeek = (id: number, newStatus: string) => {
    setItemsNextWeek((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleDisplayDayChange = (id: number, checked: boolean) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, displayDay: checked } : item
      )
    );
  };

  const handleDisplayDayChangeNextWeek = (id: number, checked: boolean) => {
    setItemsNextWeek((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, displayDay: checked } : item
      )
    );
  };

  const handleDisplayDateChange = (id: number, checked: boolean) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, displayDate: checked } : item
      )
    );
  };

  const handleDisplayDateChangeNextWeek = (id: number, checked: boolean) => {
    setItemsNextWeek((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, displayDate: checked } : item
      )
    );
  };

  function getWeekDates(index: number) {
    const start = getStartOfWeek(new Date());
    const offset = index === 1 ? 7 : 0;
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i + offset);
      return day;
    });
  }

  function formatDayName(date: Date) {
    const options: any = { weekday: "short" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  const handleNavigation = (direction: "next" | "prev") => {
    if (direction === "next" && weekIndex === 0) {
      setWeekIndex(1);
    } else if (direction === "prev" && weekIndex === 1) {
      setWeekIndex(0);
    }
  };

  const handleEditWorkWeek = () => {
    OpenPanelWorkWeek();
  };

  const handleSaveNextWeek = () => {
    console.log(itemsNextWeek);
    // updateSettingData({...appSettings,WorkWeekData:[]})
    // setItemsNextWeek(itemsNextWeek);
    if (!user?.email) {
      console.error("User email is not available");
      return;
    }

    const updatedWorkWeekData = {
      email: user.email,
      CurrentWeek: items,
      NextWeek: itemsNextWeek,
      Default: selectedOption,
    };

    const currentWorkWeekData = appSettings?.WorkWeekData || [];

    const existingUserSettingsIndex = currentWorkWeekData.findIndex(
      (data) => data.email === user.email
    );

    if (existingUserSettingsIndex !== -1) {
      const updatedSettings = currentWorkWeekData.map((data, index) =>
        index === existingUserSettingsIndex
          ? { ...data, ...updatedWorkWeekData }
          : data
      );

      updateSettingData({ ...appSettings, WorkWeekData: updatedSettings });
      setAppSettings({ ...appSettings, WorkWeekData: updatedSettings });
    } else {
      const updatedSettings = [...currentWorkWeekData, updatedWorkWeekData];

      updateSettingData({ ...appSettings, WorkWeekData: updatedSettings });
      setAppSettings({ ...appSettings, WorkWeekData: updatedSettings });
    }
    SweetAlertWorkWeek("success", translation.SettingSaved);
  };

  return (
    <div className="week-table-container">
      {/* <table className="week-table">
        <thead>
          <tr>
            {weekIndex==0?items?.map((item, index) => {

              return (
                <th key={index}>
                  <span style={{ whiteSpace: "nowrap" }}>


  {item?.displayDate ? item.date : ""}
</span>
                <span style={{ whiteSpace: "nowrap" }}>{item?.displayDay ? item?.day:""} {item?.displayDate?item.date:""}</span> 
              </th>
          
              )
            }):itemsNextWeek?.map((item, index) => { 
              return (
                <th key={index}>
                <span style={{ whiteSpace: "nowrap" }}>{item?.displayDay ?item?.day:""} {item?.displayDate?item.date:""}</span>
              </th>
          
              )
            })}
           
             
          </tr>
        </thead>
        <tbody>
          <tr>
        
           {weekIndex==0?items?.map((item, index) => {
            
          return (
             <td key={index}>
             <span style={{ whiteSpace: "nowrap" }}>{item.status}</span>
           </td>
       
           )
         }):itemsNextWeek?.map((item, index) => {
           return (
             <td key={index}>
             <span style={{ whiteSpace: "nowrap" }}>{item.status}</span>
           </td>
       
           )
         })}
          </tr>
        </tbody>
      </table> */}
      <table className="week-table">
        <thead>
          <tr>
            {weekIndex === 0
              ? items?.map((item, index) => {
                  return item.displayDate ? (
                    <th key={index}>
                      <span style={{ whiteSpace: "nowrap" }}>
                        {item.displayDay ? item.day : ""}{" "}
                        {item.displayDate ? item.date : ""}
                      </span>
                    </th>
                  ) : null;
                })
              : itemsNextWeek?.map((item, index) => {
                  return item.displayDate ? (
                    <th key={index}>
                      <span style={{ whiteSpace: "nowrap" }}>
                        {item.displayDay ? item.day : ""}{" "}
                        {item.displayDate ? item.date : ""}
                      </span>
                    </th>
                  ) : null;
                })}
          </tr>
        </thead>
        <tbody>
          <tr>
            {weekIndex === 0
              ? items?.map((item, index) => {
                  return item.displayDate ? (
                    <td key={index}>
                      <span style={{ whiteSpace: "nowrap" }}>
                        {item.status}
                      </span>
                    </td>
                  ) : null;
                })
              : itemsNextWeek?.map((item, index) => {
                  return item.displayDate ? (
                    <td key={index}>
                      <span style={{ whiteSpace: "nowrap" }}>
                        {item.status}
                      </span>
                    </td>
                  ) : null;
                })}
          </tr>
        </tbody>
      </table>

      <div className="navigation">
        {getCurrentUser()?.cu === user?.email && (
          <Icon
            iconName="Edit"
            className="arrow-button"
            onClick={handleEditWorkWeek}
          />
        )}
        {weekIndex === 1 && (
          <Icon
            iconName="Back"
            onClick={() => handleNavigation("prev")}
            className="arrow-button"
          />
        )}
        {weekIndex === 0 && (
          <Icon
            iconName="Forward"
            onClick={() => handleNavigation("next")}
            className="arrow-button"
          />
        )}
      </div>

      <Panel
        isOpen={isPanelOpenWorkWeek}
        onDismiss={closePanelWorkWeek}
        type={PanelType.custom}
        customWidth="750px"
        headerText="Work Week"
      >
        <div id="weekPanelAlert">
          <Pivot>
            <PivotItem headerText="Default">
              <div style={{ margin: "10px 0" }}>
                <ChoiceGroup
                  selectedKey={selectedOption}
                  options={options}
                  onChange={handleChoiceChange}
                />
              </div>
              {/* <PrimaryButton style={{ marginTop: "10px" }} text={"Save"} onClick={handleSaveDefault} /> */}
            </PivotItem>
            <PivotItem headerText="Current Week">
              <div style={{ margin: "10px 0" }}>
                <DetailsList
                  items={items}
                  columns={columns}
                  styles={ListStyles}
                  ariaLabelForGrid="Details list"
                  selectionMode={SelectionMode.none}
                />
              </div>
              {/* <PrimaryButton style={{ marginTop: "10px" }} text={"Save"} onClick={handleSaveCurrentWeek} /> */}
            </PivotItem>
            <PivotItem headerText="Next Week">
              <div style={{ margin: "10px 0" }}>
                <DetailsList
                  items={itemsNextWeek}
                  columns={columnsNextWeek}
                  styles={ListStyles}
                  ariaLabelForGrid="Details list"
                  selectionMode={SelectionMode.none}
                />
              </div>
            </PivotItem>
          </Pivot>
          <PrimaryButton
            style={{ marginTop: "10px" }}
            text={"Save"}
            onClick={handleSaveNextWeek}
          />
        </div>
      </Panel>
    </div>
  );
};

export default WeekTable;
