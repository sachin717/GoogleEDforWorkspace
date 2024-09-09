import React, { useState, useEffect, useCallback } from "react";
import DocumentCardBasicExample from "./DocumentCardBasicExample";
import NonGoogleUsers from "./NonGoogleUsers";
import TileView from "./TileView";
import DetailsListView from "./DetailsListView.tsx";
import { PrimaryButton } from "@fluentui/react";
import { useSttings } from "./store";
import { useLanguage } from "../../Language/LanguageContext";
import { removeDuplicatesFromObject } from "../Helpers/HelperFunctions";
import { useFields } from "../../context/store";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";

function ViewEmployee(props) {
  const { appSettings } = useSttings(); // Assume useSettings is the correct hook
  const autoLoad = appSettings?.AutoLoad || false;
  const [showLoadBtn, setShowLoadBtn] = React.useState(
    appSettings?.AutoLoad ? false : true
  );
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(1);
  const [loading, setLoading] = useState(false);
  const batchSize = Number(appSettings?.records_to_load) ?? 25;
  const { translation } = useLanguage();
  const { setDepDropDown } = useFields();
  const messageBarInfoStyles = {
    root: {
      ".ms-MessageBar-icon": {
        color: "#333",
      },
      backgroundColor: "rgb(243, 242, 241)",
    },
  };
  useEffect(() => {
    setCurrentBatch(1);

    if (props.users.length > 0) {
      const end = batchSize;
      const newUsers = props.users.slice(0, end);
      props.setUsers(newUsers);
      setShowLoadBtn(end < props.users.length);
    }
  }, [
    props.isGrid,
    props.isList,
    props.isTile,
    batchSize,
    props.users,
    props.setUsers,
  ]);

  const loadMoreUsers = useCallback(() => {
    if (loading || props.users.length <= displayedUsers.length) {
      return;
    }
    setLoading(true);

    const start = currentBatch * batchSize;
    const end = start + batchSize;

    if (end >= props.users.length) {
      setShowLoadBtn(false);
    }

    const newUsers = props.users.slice(start, end);
    props.setUsers((prevUsers) => [...prevUsers, ...newUsers]);
    setCurrentBatch((prevBatch) => prevBatch + 1);
    setLoading(false);
  }, [
    loading,
    displayedUsers,
    currentBatch,
    props.users,
    batchSize,
    props.setUsers,
  ]);

  const handleScroll = useCallback(() => {
    if (
      autoLoad &&
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - 100 &&
      !loading
    ) {
      loadMoreUsers();
    }
  }, [autoLoad, loadMoreUsers, loading]);

  useEffect(() => {
    if (autoLoad) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, autoLoad]);

  return (
    <div style={{ margin: "12px 0" }}>
      <div className="empDetailsView">
        {props.isGrid && (
          <DocumentCardBasicExample
            employees={props.employees}
            DynWidth={props.DynWidth}
            settingData={props.settingData}
            blobCall={props.blobCall}
            users={props.users}
            setUsers={props.setUser}
          />
        )}
        {
          props.NonM365?.length == 0 ? (
            <MessageBar
              messageBarType={MessageBarType.info}
              isMultiline={false}
              styles={messageBarInfoStyles}
              dismissButtonAriaLabel={"Close"}
              style={{ justifyContent: "center" }}
            >
              {"No Records Found"}
            </MessageBar>
          ) :
         props.isImportedUser && (
          <NonGoogleUsers
            employees={props.NonM365}
            DynWidth={props.DynWidth}
            settingData={props.settingData}
            blobCall={props.blobCall}
            users={props.users}
            setUsers={props.setUser}
          />
        )}
        {props.isList && <DetailsListView employees={props.employees} />}
        {props.isTile && <TileView employees={props.employees} />}
      </div>
      <div style={{ width: "100%", display: "flex" }}>
        {loading && <p>Loading...</p>}
        {showLoadBtn && props.users.length > displayedUsers.length && (
          <PrimaryButton
            onClick={loadMoreUsers}
            disabled={loading}
            style={{ margin: "10px auto" }}
          >
            {translation.LoadMore ? translation.LoadMore : "Load More"}
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}

export default ViewEmployee;
