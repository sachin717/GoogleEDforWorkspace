import { useState, useEffect, useMemo } from "react";
import { PrimaryButton, Checkbox, Panel, PanelType } from "@fluentui/react";
import { useLanguage } from "../../Language/LanguageContext";
import { SweetAlerts } from "../SelectSource/Utils/SweetAlert";
import { useFields } from "../../context/store";
import UserSearchBox from "../SelectSource/UserSearchBox";
import { useSttings } from "../SelectSource/store";
import { getSettingJson, SETTING_LIST, updateSettingJson } from "../../api/storage";

const KEY = "RolesAndPermisstions";

function RolesAndPermisstions(props: any) {
  const { isOpen, onDismiss } = props;
  const { SweetAlert: SweetAlertInPanel } = SweetAlerts("#RAN", true);
  const { SweetAlert: deleteSweetAlert } = SweetAlerts("#RAN", true);
  const { translation } = useLanguage();
  const [admins, setAdmins] = useState([]);
  const [user, setUser] = useState(null);
  const [selectdUsers, setSelectedUser] = useState([]);
  const { allUsers } = useFields();
  const { appSettings, setAppSettings } = useSttings();

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

  const handleAdd = () => {
    if (admins.some((x: any) => x.email === user.email)) {
      SweetAlertInPanel("error", "User is already admin");
      return;
    }

    setAdmins((prev) => [...prev, {name:user.name, email:user.email}]);
    const setting = { ...appSettings, [KEY]: [...admins, {name:user.name, email:user.email}] };
    updateSettingJson(SETTING_LIST, setting);
    SweetAlertInPanel("success", translation.SettingSaved);
  };

  const handelDelete = () => {
    const remaningAdmins = admins.filter((x) => {
      if (!selectdUsers.includes(x.email)) {
        return x;
      }
    });

    setAdmins(remaningAdmins);
    const setting = { ...appSettings, [KEY]: remaningAdmins };
    updateSettingJson(SETTING_LIST, setting);
    setAppSettings(setting);
    setSelectedUser([]);
    deleteSweetAlert("success", translation.SettingSaved);
  };

  useEffect(() => {
    const getSettingData = async()=>{
      const data = await getSettingJson(SETTING_LIST)
      setAdmins(data[KEY] ?? []);
    }
    getSettingData();
  }, []);


  // useEffect(() => {
  //   setAdmins(appSettings[KEY] ?? []);
  // }, []);

  return (
    <div>
      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={
          translation.Updateusersroleandpermissions ?? "Role and permissions"
        }
        isOpen={isOpen}
        onDismiss={onDismiss}
        closeButtonAriaLabel={"Close"}
      >
        <div id="RAN">
          <div
            style={{
              margin: "10px 0px",
              display: "flex",
              justifyContent: "space-between",
              gap: "5px",
            }}
          >
            <UserSearchBox
              options={transformUserDataToFomat(allUsers)}
              onSelect={setUser}
            />
            <PrimaryButton onClick={handleAdd}>Add</PrimaryButton>
            {selectdUsers.length > 0 && (
              <PrimaryButton onClick={handelDelete}>Delete</PrimaryButton>
            )}
          </div>
          <div>
            <ShowTable
              admins={admins}
              selectedUsers={selectdUsers}
              setSelectedUser={setSelectedUser}
              allUsers={allUsers}
            />
          </div>
        </div>
      </Panel>
    </div>
  );
}

const ShowTable = ({ admins, selectedUsers, setSelectedUser, allUsers }) => {
  const { translation } = useLanguage();

  const handelSelectEmail = (checked: boolean, email: string) => {
    if (checked) {
      setSelectedUser((prev: any) => [...prev, email]);
    } else {
      const x = selectedUsers.filter((x: any) => x.email !== email);
      setSelectedUser(x);
    }
  };

  return (
    <table className={"excludeTable"}>
      <thead>
        <tr>
          <th>Select</th>
          <th>Employee Name</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      {admins && admins.length > 0 ? (
        <tbody>
          {admins.map((x: any, i: number) => {
            return (
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
                <td>Admin</td>
              </tr>
            );
          })}
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

export default RolesAndPermisstions;
