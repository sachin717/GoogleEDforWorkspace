import { SpinnerSize } from "@fluentui/react";
import { MessageBar, MessageBarType, Spinner } from "@fluentui/react";
import ViewEmployee from "../SelectSource/ViewEmployee";
import { useLanguage } from "../../Language/LanguageContext";
import { Margin } from "react-to-pdf";
import styles from  "../SCSS/Ed.module.scss"
const messageBarInfoStyles = {
  root: {
    ".ms-MessageBar-icon": {
      color: "#333",
    },
    backgroundColor: "rgb(243, 242, 241)",
    Margin:"10px 0",
  },
};

function Home({
  showProgress,
  UserArray,
  NonM365,
  isTile,
  isGrid,
  isList,
  _gridWidth,
  parsedData,
  allUsers,
  isImportedUser,
  setUserArray
}) {
 const {translation}=useLanguage();
 
  return (
    <div>
      <div className="mainDiv">
        {showProgress ? (
          <Spinner
            size={SpinnerSize.large}
            className="spinnerLoadStyle"
            label={translation.Loading?translation.Loading:"Loading..."}
          />
        ) : UserArray.length == 0  ? (
          <div style={{margin:"15px 0"}}>
          <MessageBar
            messageBarType={MessageBarType.info}
            isMultiline={false}
            styles={messageBarInfoStyles}
            dismissButtonAriaLabel={"Close"}
            style={{ justifyContent: "center" }}
          >
            {"No Records Found"}
          </MessageBar>
          </div>
        ) : (
          <div id="ViewDiv" style={{ overflow: "hidden" }}>
            <ViewEmployee
              employees={UserArray}
              NonM365={NonM365}
              isTile={isTile}
              isGrid={isGrid}
              isList={isList}
              isImportedUser={isImportedUser}
              DynWidth={_gridWidth}
              settingData={parsedData}
              users={allUsers}
              setUsers={setUserArray}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
