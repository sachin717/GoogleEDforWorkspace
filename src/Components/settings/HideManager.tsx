import {
  Checkbox,
  Panel,
  PanelType,
  Pivot,
  PivotItem,
  PrimaryButton,
} from "@fluentui/react";
import { useLanguage } from "../../Language/LanguageContext";
import UserSearchBox from "../SelectSource/UserSearchBox";
import { useEffect, useState } from "react";
import { useFields } from "../../context/store";
import { SweetAlerts } from "../SelectSource/Utils/SweetAlert";
import { useSttings } from "../SelectSource/store";
import { getSettingJson, SETTING_LIST, updateSettingJson } from "../../api/storage";

const KEY = "UsersWithHiddenManager";

const HideManager = ({ isOpen, onDismiss }) => {
  const { translation } = useLanguage();
  const { appSettings } = useSttings();
  const [usersWithHiddenManager, setUsersWithHiddenManager] = useState([]);

  

  useEffect(() => {
    const getSettingData = async()=>{
      const data = await getSettingJson(SETTING_LIST)
      setUsersWithHiddenManager(data[KEY] || []);
    }
    getSettingData();
  }, []);

  return (
    <Panel
      type={PanelType.custom}
      customWidth="650px"
      isOpen={isOpen}
      onDismiss={() => onDismiss(false)}
      headerText={translation.hidemanager ?? "Hide manager of specific users"}
    >
      <div id="HideManager">
        <Pivot style={{ margin: "10px" }}>
          <PivotItem headerText={translation.add ?? "Add"}>
            <div>
              <Add
                usersWithHiddenManager={usersWithHiddenManager}
                setUsersWithHiddenManager={setUsersWithHiddenManager}
              />
              <ShowTable users={usersWithHiddenManager} />
            </div>
          </PivotItem>
          <PivotItem headerText={translation.delete ?? "Delete"}>
            <Delete usersWithHiddenManager={usersWithHiddenManager} setUsersWithHiddenManager={setUsersWithHiddenManager}/>
          </PivotItem>
        </Pivot>
      </div>
    </Panel>
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

const Add = ({ usersWithHiddenManager, setUsersWithHiddenManager }) => {
  const { allUsers } = useFields();
  const [user, setUser] = useState(null);
  const { appSettings } = useSttings();
  const { translation } = useLanguage();
  const { SweetAlert: addSweetAlert } = SweetAlerts("#HideManager", true);

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
    if(user === null){
      return;
    }
    if (usersWithHiddenManager.some((x: any) => x.email === user.email)) {
      addSweetAlert("error", "User is already admin");
      return;
    }

    setUsersWithHiddenManager((prev) => [
      ...prev,
      { name: user.name, email: user.email },
    ]);
    const setting = {
      ...appSettings,
      [KEY]: [
        ...usersWithHiddenManager,
        { name: user.name, email: user.email },
      ],
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

const Delete = ({ usersWithHiddenManager, setUsersWithHiddenManager }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { appSettings, setAppSettings } = useSttings();
  const { SweetAlert: deleteSweetAlert } = SweetAlerts("#HideManager", true);
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
    const remaningAdmins = usersWithHiddenManager.filter((x) => {
      if (!selectedUsers.includes(x.email)) {
        return x;
      }
    });

    setUsersWithHiddenManager(remaningAdmins);
    const setting = { ...appSettings, [KEY]: remaningAdmins };
    updateSettingJson(SETTING_LIST, setting);
    setAppSettings(setting);
    setSelectedUsers([]);
    deleteSweetAlert("success", translation.SettingSaved);
  };

  return (
    <div>
      {selectedUsers.length > 0 && (
        <div style={{margin:"5px 0px", display:"flex", justifyContent:'end'}}>
          <PrimaryButton onClick={handelDelete}>Delete</PrimaryButton>
        </div>
      )}
      <table className={"excludeTable"}>
        <thead>
          <tr>
            <th>Select</th>
            <th>Employee Name</th>
            <th>Email</th>
          </tr>
        </thead>
        {usersWithHiddenManager && usersWithHiddenManager.length > 0 ? (
          <tbody>
            {usersWithHiddenManager.map((x: any, i: number) => (
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
    </div>
  );
};

export default HideManager;
