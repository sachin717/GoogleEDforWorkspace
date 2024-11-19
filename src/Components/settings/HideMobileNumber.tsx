import {
  Checkbox,
  Panel,
  PanelType,
  Pivot,
  PivotItem,
  PrimaryButton,
} from "@fluentui/react";
import { useLanguage } from "../../Language/LanguageContext";
import { useFields } from "../../context/store";
import { useEffect, useState } from "react";
import { useSttings } from "../SelectSource/store";
import { SweetAlerts } from "../SelectSource/Utils/SweetAlert";
import UserSearchBox from "../SelectSource/UserSearchBox";
import { getSettingJson, SETTING_LIST, updateSettingJson } from "../../api/storage";

const KEY = "UserWithHiddenMobileNumber";

const HideMobileNumber = ({ isOpen, onDismiss }) => {
  const { translation } = useLanguage();

  const { appSettings } = useSttings();
  const [usersWithHiddenMobile, setUsersWithHiddenMobile] = useState([]);

  useEffect(() => {
    const getSettingData = async()=>{
      const data = await getSettingJson(SETTING_LIST)
      setUsersWithHiddenMobile(data[KEY] || []);
    }
    getSettingData();
  }, []);

  return (
    <div>
      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={
          translation.Hidemobile
            ? translation.Hidemobile
            : "Hide mobile numbers of specific users"
        }
        isOpen={isOpen}
        onDismiss={() => onDismiss(false)}
        closeButtonAriaLabel={"Close"}
      >
        <div id="HideMobleNumber" style={{ padding: "5px" }}>
          <Pivot
            className="viewsPanelPivot"
            style={{ paddingTop: "15px" }}
            aria-label="Large Link Size Pivot Example"
            linkSize="large"
          >
            <PivotItem headerText={translation.add ? translation.add : "Add"}>
              <Add
                usersWithHiddenMobile={usersWithHiddenMobile}
                setUsersWithHiddenMobile={setUsersWithHiddenMobile}
              />
              <ShowTable users={usersWithHiddenMobile} />
            </PivotItem>
            <PivotItem
              headerText={translation.delete ? translation.delete : "Delete"}
            >
              <Delete
                usersWithHiddenMobile={usersWithHiddenMobile}
                setUsersWithHiddenMobile={setUsersWithHiddenMobile}
              />
            </PivotItem>
          </Pivot>
        </div>
      </Panel>
    </div>
  );
};

const ShowTable = ({ users }) => {
  const { translation } = useLanguage();
  return (
    <table className={"excludeTable"}>
      <thead>
        <tr>
          <th>Employee Name</th>
          <th>Email</th>
        </tr>
      </thead>
      {users && users.length > 0 ? (
        <tbody>
          {users.map((x: any, i: number) => (
            <tr key={i}>
              <td>{x.name}</td>
              <td>{x.email}</td>
            </tr>
          ))}
        </tbody>
      ) : (
        <tbody>
          <tr>
            <td colSpan={3}>
              {translation.NoRecordsFound ?? "No Records Found"}
            </td>
          </tr>
        </tbody>
      )}
    </table>
  );
};

const Add = ({ usersWithHiddenMobile, setUsersWithHiddenMobile }) => {
  const { allUsers } = useFields();
  const [user, setUser] = useState(null);
  const { appSettings } = useSttings();
  const { translation } = useLanguage();
  const { SweetAlert: addSweetAlert } = SweetAlerts("#HideMobleNumber", true);

  function transformUserDataToFomat(users) {
    return users?.map((user) => ({
      id: user?.id,
      image: user?.image,
      initials: user?.initials,
      name: user?.name,
      job: user?.job,
      email: user?.email,
      department: user?.department,
      dob: user?.DOB,
      doj: user?.DOJ,
      location: user?.location,
    }));
  }

  const hideManager = () => {
    if (usersWithHiddenMobile.some((x: any) => x.email === user.email)) {
      addSweetAlert("error", "User is already admin");
      return;
    }

    setUsersWithHiddenMobile((prev) => [
      ...prev,
      { name: user.name, email: user.email },
    ]);
    const setting = {
      ...appSettings,
      [KEY]: [...usersWithHiddenMobile, { name: user.name, email: user.email }],
    };
    console.log("setting", setting);
    updateSettingJson(SETTING_LIST, setting);
    addSweetAlert("success", translation.SettingSaved);
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        margin: "10px 0px",
      }}
    >
      <UserSearchBox
        options={transformUserDataToFomat(allUsers)}
        onSelect={setUser}
      />
      <PrimaryButton onClick={hideManager}>Add</PrimaryButton>
    </div>
  );
};

const Delete = ({ usersWithHiddenMobile, setUsersWithHiddenMobile }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { appSettings, setAppSettings } = useSttings();
  const { SweetAlert: deleteSweetAlert } = SweetAlerts("#HideMobleNumber", true);
  const { translation } = useLanguage();

  const handelSelectEmail = (checked: boolean, email: string) => {
    if (checked) {
      setSelectedUsers((prev: any) => [...prev, email]);
    } else {
      const x = selectedUsers.filter((x: any) => x.email !== email);
      setSelectedUsers(x);
    }
  };

  const handelDelete = () => {
    const remaningAdmins = usersWithHiddenMobile.filter((x) => {
      if (!selectedUsers.includes(x.email)) {
        return x;
      }
    });

    setUsersWithHiddenMobile(remaningAdmins);
    const setting = { ...appSettings, [KEY]: remaningAdmins };
    updateSettingJson(SETTING_LIST, setting);
    setAppSettings(setting);
    setSelectedUsers([]);
    deleteSweetAlert("success", translation.SettingSaved);
  };

  return (
    <div>
   
      <table className={"excludeTable"}>
        <thead>
          <tr>
            <th>Select</th>
            <th>Employee Name</th>
            <th>Email</th>
          </tr>
        </thead>
        {usersWithHiddenMobile && usersWithHiddenMobile.length > 0 ? (
          <tbody>
            {usersWithHiddenMobile.map((x: any, i: number) => (
              <tr key={i}>
                <td>
                  <Checkbox
                    onChange={(e, checked: boolean) =>
                      handelSelectEmail(checked, x.email)
                    }
                  />
                </td>
                <td>{x.name}</td>
                <td>{x.email}</td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={3}>
                {translation.NoRecordsFound ?? "No Records Found"}
              </td>
            </tr>
          </tbody>
        )}
      </table>

      {selectedUsers?.length > 0 && (
        <div
          style={{ margin: "5px 0px", display: "flex"}}
        >
          <PrimaryButton onClick={handelDelete}>Delete</PrimaryButton>
        </div>
      )}
    </div>
  );
};

export default HideMobileNumber;
