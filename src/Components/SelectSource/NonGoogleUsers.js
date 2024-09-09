import React, { useEffect, useState } from "react";
import { style } from "./styles";
import styled from "styled-components";
import EmployeeDetailModal from "./EmployeeDetailModal";
import useStore, { useSttings } from "./store";
import getschemasfields from "./getCustomSchema";
import { Modal, IconButton } from "@fluentui/react";
import GridCard from "./GridCard";
import "./Edp.scss";
import { useFields } from "../../context/store";
import { removeDuplicatesFromObject } from "../Helpers/HelperFunctions";
const NewDocumentWrapper = styled.div`
  ${style}
`;

const modalPropsStylesEmpPC = {
  main: {
    maxWidth: 1000,
    minWidth: 1000,
    maxHeight: "100%",
    zIndex: 999,
  },
};
let customList = [];
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
let customListUnique = null;
const NonGoogleUsers = (props) => {
  const { appSettings } = useSttings();
  const [optioncustomfields, setoptioncustomfields] = React.useState([]);
  const { setDepDropDown } = useFields();
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    const nonM365Departments = props.employees.map((x) => ({
      value: x.department,
      label: x.department,
    }));
    const x = removeDuplicatesFromObject(nonM365Departments, "value");
    setDepDropDown(x);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { changeUserGridView, userGridView, variable, recordtoLoadValue } =
    useStore();
  const result = [];

  function convertToArrayOfObjects(UserArray) {
    UserArray.forEach((item) => {
      const arrayObject = [];
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          const obj = {};
          obj[key] = item[key];
          arrayObject.push(obj);
        }
      }
      result.push(arrayObject);
    });
  }
  convertToArrayOfObjects(props.employees);
  userGridView.forEach((item) => {
    if (!item.checkbox) {
      result.forEach((arr) => {
        arr.forEach((obj) => {
          if (obj[item.name]) {
            delete obj[item.name];
          }
        });
      });
    }
  });

  const hideModal = () => {
    setIsModalOpen(false);
  };
  const openPanelForUser = (user) => {
    let Openmodal = true;
    setSelectedUser(
      <EmployeeDetailModal
        user={user}
        data={props.employees}
        settingData={props.settingData}
        blobCall={props.blobCall}
        isModalOpenTrans={Openmodal}
      />
    )
    setIsModalOpen(true);
  };
  React.useEffect(() => {
    const ListData = async () => {
      try {
        const list = await getschemasfields();
        const fieldNames = list.map((item) => ({
          key: item.fieldName,
          text: item.displayname,
        }));

        setoptioncustomfields(fieldNames);
      } catch (error) {
        console.error("Error fetching list data:", error);
      }
    };
    ListData();
  }, []);

  return (
    <>
      <NewDocumentWrapper>
        <Modal
          isOpen={isModalOpen}
          onDismiss={hideModal}
          isBlocking={true}
          styles={modalPropsStylesEmpPC}
          topOffsetFixed={false}
          layerProps={{
            styles: {
              root: {
                zIndex: 999,
              },
            },
          }}
        >
          <div>
            <IconButton
              className="closeiconprofile"
              styles={iconButtonStyles}
              iconProps={{ iconName: "Cancel" }}
              ariaLabel="Close popup modal"
              onClick={hideModal}
            />
            {selectedUser}
          </div>
        </Modal>
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            gap: "5px",
            flexWrap: "wrap",
          }}
        >
          {props.employees.map((item, index) => {
            var diffStyle = {
              backgroundImage: "url('" + item.image + "')",
              cursor: "pointer",
              backgroundRepeat: "no-repeat",
              width: "103px",
              height: "103px",
              position: "absolute",
              borderRadius: "50%",
              zIndex: 1,
              backgroundPosition: "center",
              backgroundSize: "cover",
            };

            return (
              <div
                key={index}
                className="user-card"
                style={{ width: appSettings.gridWidth + "px" }}
              >
                <GridCard
                  key={index}
                  props={props}
                  users={props.employees}
                  item={item}
                  diffStyle={diffStyle}
                  userGridView={userGridView}
                  ISStartLastname={variable}
                  openPanelForUser={openPanelForUser}
                />
                {userGridView.forEach((item) => {
                  if (item.nameAPI) {
                    const match = optioncustomfields.find(
                      (entry) => entry.key === item.nameAPI
                    );
                    if (match) {
                      customList.push(item.name);
                      customListUnique = new Set(customList);
                    }
                  }
                })}
              </div>
            );
          })}
        </div>
      </NewDocumentWrapper>
    </>
  );
};

export default NonGoogleUsers;
