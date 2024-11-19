import { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import {
  TextField,
  PrimaryButton,
  Panel,
  PanelType,
  Label,
} from "@fluentui/react";
import { useFields } from "../context/store";
import ReactSelect from "react-select";
import { SweetAlerts } from "./SelectSource/Utils/SweetAlert";
import { useLanguage } from "../Language/LanguageContext";

const UpdateUserForm = ({ isOpen, onDismiss, user }) => {
  const { SweetAlert } = SweetAlerts("#updateUser", true);
  const { translation } = useLanguage();
  const [manager, setManager] = useState<any>("");
  const [managerOptions, setManagerOptions] = useState<any>([]);
  const { allUsers } = useFields();
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    title: "",
    department: "",
    costCenter: "",
    workPhone: "",
    mobilePhone: "",
    buildingId: "",
    floorName: "",
    floorSection: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || "",
        address: user.Address || "",
        title: user.job || "",
        department: user.dept || "",
        costCenter: user.CostCenter || "",
        workPhone: user.wphone || "",
        mobilePhone: user.mobile || "",
        buildingId: user.BuildingId || "",
        floorName: user.FloorName || "",
        floorSection: user.FloorSection || "",
      });

      const sManager = allUsers.find((x) => x.email === user.manager);
      if (sManager !== undefined) {
        const managerValue = { value: sManager.email, label: sManager.name };
        setManager(managerValue);
      } else {
        setManager({ value: "", label: "" });
      }

      const options = allUsers.map((x: any) => ({
        value: x.email,
        label: x.name,
      }));

      setManagerOptions(options);
    }
  }, [user]);

  const handleInputChange =
    (field: string) => (_: any, newValue: string) => {
      setFormData({ ...formData, [field]: newValue });
    };

  const handleUpdate = async () => {
    const updateData = {
      primaryEmail: user.email,
      name: {
        givenName: formData.fullName.split(" ")[0] || "",
        familyName: formData.fullName.split(" ")[1] || "",
      },
      relations: [
        {
          value: manager.value,
          type: "manager",
        },
      ],
      addresses: [
        {
          type: "work",
          formatted: formData.address,
        },
      ],
      organizations: [
        {
          title: formData.title,
          primary: true,
          customType: "",
          department: formData.department,
          costCenter: formData.costCenter,
        },
      ],
      phones: [
        {
          type: "work",
          value: formData.workPhone,
        },
        {
          type: "mobile",
          value: formData.mobilePhone,
        },
      ],
      locations: [
        {
          type: "desk",
          area: "desk",
          buildingId: formData.buildingId,
          floorName: formData.floorName,
          floorSection: formData.floorSection,
        },
      ],
      suspended: false,
      includeInGlobalAddressList: true,
    };

    try {
      await gapi.client.directory.users.patch({
        userKey: user.email,
        resource: updateData,
      });
      SweetAlert("success", translation.SettingSaved);
    } catch (error) {
      console.log("Error updating user details:", error);
      SweetAlert("error", "Something went wrong");
    }
  };

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      headerText="Update User Details"
      type={PanelType.medium}
    >
      <div id="updateUser">
        <TextField
          label="Full Name"
          value={formData.fullName}
          onChange={handleInputChange("fullName")}
        />
        <TextField
          label="Address"
          value={formData.address}
          onChange={handleInputChange("address")}
        />
        <TextField
          label="Title"
          value={formData.title}
          onChange={handleInputChange("title")}
        />
        <TextField
          label="Department"
          value={formData.department}
          onChange={handleInputChange("department")}
        />
        <TextField
          label="Cost Center"
          value={formData.costCenter}
          onChange={handleInputChange("costCenter")}
        />
        <TextField
          label="Work Phone"
          value={formData.workPhone}
          onChange={handleInputChange("workPhone")}
        />
        <TextField
          label="Mobile Phone"
          value={formData.mobilePhone}
          onChange={handleInputChange("mobilePhone")}
        />
        <TextField
          label="Building ID"
          value={formData.buildingId}
          onChange={handleInputChange("buildingId")}
        />
        <TextField
          label="Floor Name"
          value={formData.floorName}
          onChange={handleInputChange("floorName")}
        />
        <TextField
          label="Floor Section"
          value={formData.floorSection}
          onChange={handleInputChange("floorSection")}
        />
        <div>
          <Label>Manager</Label>
          <ReactSelect
            options={managerOptions}
            value={manager}
            onChange={(option) => setManager(option)}
            isClearable
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <PrimaryButton text="Update" onClick={handleUpdate} />
        </div>
      </div>
    </Panel>
  );
};

export default UpdateUserForm;
