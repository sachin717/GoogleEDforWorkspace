import React, { useState } from "react";
import { style } from "./styles";
import styled from "styled-components";

import { Icon } from "@fluentui/react/lib/Icon";
import { DocumentCard } from "@fluentui/react/lib/DocumentCard";
import {
  Persona,
  PersonaSize,
  PersonaPresence,
} from "@fluentui/react/lib/Persona";
import EmployeeDetailModal from "./EmployeeDetailModal";
import useStore, { useSttings } from "./store";
import getschemasfields from "./getCustomSchema";
import {
  Modal,
  // IIcoProps,
  // IButtoStyles,
  IconButton,
  IButtonStyles,
  IIconProps,
  Stack,
  Spinner,
  SpinnerSize,
  IExpandingCardProps,
  keyframes,
  ITheme,
  createTheme,
  PrimaryButton,
} from "@fluentui/react";
import { getTheme } from "@fluentui/react/lib/Styling";
import GridCard from "./GridCard";
import "./Edp.scss"
const NewDocumentWrapper = styled.div`
  ${style}
`;

const modalPropsStylesEmpPC = {
  main: {
    maxWidth: 1000,
    minWidth: 1000,
    maxHeight: "100%",
    zIndex: 999,
    // transition: 'opacity 0.3s'
  },
};
let customList = [];
let customListUnique = [];
let dataCount=0;
const ThemeColorsFromWindow = window.__themeState__.theme;
const siteTheme = createTheme({
  //pass this object to your components
  palette: ThemeColorsFromWindow,
});
const iconButtonStyles = {
  root: {
    //color: theme.palette.neutralPrimary,
    marginLeft: "auto",
    marginTop: "4px",
    marginRight: "2px",
  },
  rootHovered: {
    //color: theme.palette.neutralDark,
    backgroundColor: "#ededed",
  },
};
const theme = getTheme();
let _adaptiveCard = null;
let match;

const DocumentCardBasicExample = (props) => {
 
  const { appSettings } = useSttings();
  const [optioncustomfields, setoptioncustomfields] = React.useState([]);
 

  // console.log(props.employees, 'grid');
  // console.log(props.settingData.BrandLogo, 'gooo');

  //const [isModalOpen, { toggle: toggleModal }] = useBoolean(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { changeUserGridView, userGridView, variable, recordtoLoadValue } =
    useStore();
  //const [numToShow, setNumToShow] = useState(recordtoLoadValue);
  //const [totalToShow, setTotalToShow] = useState(dummyData.length);
  const result = [];

  /*  const handleLoadMore = () => {
     setNumToShow(numToShow + recordtoLoadValue);
   }; */

  //
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
      /* console.log(result, 'documentcard');
      console.log(userGridView, 'useGridView'); */
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

  // console.log(variable, 'item');
  /*  const finalObjectArray = result.map(subArr => {
     const obj = {};
     const keys = []; // Array to store keys in the desired order
     subArr.forEach(innerObj => {
         for (let key in innerObj) {
             keys.push(key); // Store the key in the order it appears
             obj[key] = innerObj[key]; // Assign the key-value pair to the object
         }
     });
     // Rearrange the object properties based on the order of keys
     const orderedObj = {};
     keys.forEach(key => {
         orderedObj[key] = obj[key];
     });
     return orderedObj;
 }); */

  //console.log(finalObjectArray,'modified');

  //console.log(filteredData,'filterddata');
  //

  const hideModal = () => {
    setIsModalOpen(false);
  };
  const openPanelForUser = (user) => {
    let Openmodal=true;
    _adaptiveCard = (
      <EmployeeDetailModal
        user={user}
        data={props.employees}
        settingData={props.settingData}
        blobCall={props.blobCall}
        isModalOpenTrans = {Openmodal}
      />
    );
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
    // console.log(variable, "va");
  }, []);

  // Loop through customFields to find objects with isCustomField:true

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
            {_adaptiveCard}
          </div>
        </Modal>
        {/* className="gridDiv" */}
        <div style={{display:"flex",justifyContent:"start",gap:"5px",flexWrap:"wrap"}}>
          {props.employees /* slice(0, numToShow) */
            .map((item, index) => {
              var diffStyle = {
                // backgroundImage: item.img +',linear-gradient(to Bottom Left,rgba(255, 255, 255, 0), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0), rgb(128, 0, 128))',
                backgroundImage: "url('" + item.image + "')",
                // backgroundImage: {{item.img, linearGradient(to top right, #fffeff00,#55435500,#55435500,#9f479f87,#863596)}},
                // backgroundImage:colorgrad,
                // backgroundImage: "linear-gradient(to Bottom Left,#ffffff00, #ffffff00,#ffffff00, #bf6fe8)!important",
                cursor: "pointer",
                backgroundRepeat: "no-repeat",
                width: "103px",
                height: "103px",
                position: "absolute",
                // top: "9px",
                borderRadius: "50%",
                zIndex: 1,
                backgroundPosition: "center",
                backgroundSize: "cover",
              };

              return (
                <div key={index} className="user-card"  style={{ width: appSettings.gridWidth + "px" }}>
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

                  <div>
                  
                    {/* <DocumentCard className="docCardStyle"
                styles={{
                  root: {
                    //minWidth: "550px !important",
                    minWidth: props.DynWidth + "px !important"
                  },
                }}>
                {" "}
                <div className="makeCenterStyles">
                  <div
                    style={diffStyle}
                    onClick={() => openPanelForUser(item)}
                    // onMouseOver={() => openhoverDiv(item)}
                    // onMouseLeave={() => setIsShown(false)}
                    className="Onhover"
                  ></div>
                  <Persona
                    // imageUrl={colorgrad}
                    imageInitials={item.initials}
                    // presence={presence}
                    // presenceTitle={item.presence}
                    // initialsColor={item.personaColor}
                    size={PersonaSize.size100} />
                </div>
                {/*  <div className="nameStyles">
                   {variable === 'familyName' ? `${item.lastName} ${item.firstName}` : `${item.firstName} ${item.lastName}`}
                  </div>
                  <div className="titleStyles">
                    <a
                      style={{
                        color: "#363636",
                        textDecoration: "none",
                      }}
                      href={"mailto:" + item.email}
                      target="_blank"
                    >
                      <Icon iconName="Mail"></Icon>
                      {item.email}
                    </a>
                  </div>
                  {!item.job || item.job == "" || item.job == "-" ? (
                    ""
                  ) : (
                    <div className="titleStylesJT">{item?.job}</div>
                  )}
                  {!item.department ||
                    item.department == "" ||
                    item.department == "-" ? (
                    ""
                  ) : (
                    <div className="titleStylesDept">{item.department}</div>
                  )}
                  {!item.location ||
                    item.location == "" ||
                    item.location == "-" ? (
                    ""
                  ) : (
                    <div className="titleStylesLoc">
                      <Icon iconName="Location"></Icon>
                      {item.location}
                    </div>
                  )}
                  {!item.workphone ||
                    item.workphone == "" ||
                    item.workphone == "-" ? (
                    ""
                  ) : (
                    <div className="titleStyles">
                      <a
                        style={{
                          color: "#363636",
                          textDecoration: "none",
                        }}
                         href={"tel:" +item.workphone}
                        target="_blank"
                      >
                        <Icon iconName="Phone"></Icon>
                        {item.workphone}
                      </a>
                    </div>
                  )}
                  {!item.mobile || item.mobile == "" || item.mobile == "-" ? (
                    ""
                  ) : (
                    <div className="titleStyles">
                      <a
                        style={{
                          color: "#363636",
                          textDecoration: "none",
                        }}
                        href={"tel:" + item.mobile}
                        target="_blank"
                      >
                        <Icon iconName="CellPhone"></Icon>
                        {item.mobile}
                      </a>
                    </div>
                  )}
                  {!item.manager || item.manager == "" || item.manager == "-" ? (
                    ""
                  ) : (
                    <div className="titleStyles">
                      <a
                        style={{
                          color: "#363636",
                          textDecoration: "none",
                        }}
                        href={"mailto:" + item.manager}
                        target="_blank"
                      >
                        <Icon iconName="Mail"></Icon>
                        {item.manager}
                      </a>
                    </div>
                  )}
                  <div className="titleStylesCF"></div> */}
                  </div>

                  {userGridView.forEach((item) => {
                    if (item.nameAPI) {
                      const match = optioncustomfields.find(
                        (entry) => entry.key === item.nameAPI
                      );
                      if (match) {
                        customList.push(item.name);
                        customListUnique = new Set(customList);
                        // Perform rendering for matched item
                        // console.log(`userGridView ${userGridView}`);
                      }
                    }
                  })}

                  <div>
                    {/*  {userGridView ? userGridView.map((item1) => {
             
                 return (<>
                    {item1.name == "name" && item1.checkbox?
                      <>
                        <div className="nameStyles">
                          {item.name}
                        </div>
                      </> : ""}

                    {item1.name == "email" && item1.checkbox ? <><div className="titleStyles">
                      <a
                        style={{
                          color: "#363636",
                          textDecoration: "none",
                        }}
                        href={"mailto:" + item.email}
                        target="_blank"
                      >
                        <Icon iconName="Mail"></Icon>
                        {item.email}
                      </a>
                    </div></> : ""
                    }
                    

                    {item1.name == "job" && item1.checkbox ? <>
                      {!item.job || item.job == "" || item.job == "-" ? (
                        ""
                      ) : (
                        <div className="titleStylesJT">{item?.job}</div>
                      )}
                    </> : ""
                    }
                    {item1.name == "department" && item1.checkbox ? <>
                      {!item.department ||
                        item.department == "" ||
                        item.department == "-" ? (
                        ""
                      ) : (
                        <div className="titleStylesDept">{item.department}</div>
                      )}
                    </> : ""}
                    {item1.name == "location" && item1.checkbox ? <>
                      {!item.location ||
                        item.location == "" ||
                        item.location == "-" ? (
                        ""
                      ) : (
                        <div className="titleStylesLoc">
                          <Icon iconName="Location"></Icon>
                          {item.location}
                        </div>
                      )}</> : ""}
                    {item1.name == "phone" && item1.checkbox ? <>
                      {!item.workphone ||
                        item.workphone == "" ||
                        item.workphone == "-" ? (
                        ""
                      ) : (
                        <div className="titleStyles">
                          <a
                            style={{
                              color: "#363636",
                              textDecoration: "none",
                            }}
                            href={"tel:" + item.workphone}
                            target="_blank"
                          >
                            <Icon iconName="Phone"></Icon>
                            {item.workphone}
                          </a>
                        </div>
                      )}</> : ""}

                    {item1.name == "mobile" && item1.checkbox ? <>
                      {!item.mobile || item.mobile == "" || item.mobile == "-" ? (
                        ""
                      ) : (
                        <div className="titleStyles">
                          <a
                            style={{
                              color: "#363636",
                              textDecoration: "none",
                            }}
                            href={"tel:" + item.mobile}
                            target="_blank"
                          >
                            <Icon iconName="CellPhone"></Icon>
                            {item.mobile}
                          </a>
                        </div>
                      )}</> : ""}
                      {item1.name == "workphone" && item1.checkbox ? <>
                      {!item.workphone || item.workphone == "" || item.workphone == "-" ? (
                        ""
                      ) : (
                        <div className="titleStyles">
                          <a
                            style={{
                              color: "#363636",
                              textDecoration: "none",
                            }}
                            href={"tel:" + item.workphone}
                            target="_blank"
                          >
                            <Icon iconName="Phone"></Icon>
                            {item.workphone}
                          </a>
                        </div>
                      )}</> : ""}
                    {item1.name == "manager" && item1.checkbox ? <>
                      {!item.manager || item.manager == "" || item.manager == "-" ? (
                        ""
                      ) : (
                        <div className="titleStyles">
                          <a
                            style={{
                              color: "#363636",
                              textDecoration: "none",
                            }}
                            href={"mailto:" + item.manager}
                            target="_blank"
                          >
                            <Icon iconName="Mail"></Icon>
                            {item.manager}
                          </a>
                        </div>
                      )}</> : ""}

                      {item1['isCustomField']==true?   <>
                        <div className="titleStyles">
                          {item1['name']}-{item[item1.nameAPI]}
                        </div>
                      </> :null
                      
                      }
                    
                  </>
                  )}
                  

                ) 

                  : <>
                    <div className="nameStyles">
                      {variable === 'familyName' ? `${item.lastName} ${item.firstName}` : `${item.firstName} ${item.lastName}`}
                    </div>
                    <div className="titleStyles">
                      <a
                        style={{
                          color: "#363636",
                          textDecoration: "none",
                        }}
                        href={"mailto:" + item.email}
                        target="_blank"
                      >
                        <Icon iconName="Mail"></Icon>
                        {item.email}
                      </a>
                    </div>
                    {!item.job || item.job == "" || item.job == "-" ? (
                      ""
                    ) : (
                      <div className="titleStylesJT">{item?.job}</div>
                    )}
                    {!item.department ||
                      item.department == "" ||
                      item.department == "-" ? (
                      ""
                    ) : (
                      <div className="titleStylesDept">{item.department}</div>
                    )}
                    {!item.location ||
                      item.location == "" ||
                      item.location == "-" ? (
                      ""
                    ) : (
                      <div className="titleStylesLoc">
                        <Icon iconName="Location"></Icon>
                        {item.location}
                      </div>
                    )}
                    {!item.workphone ||
                      item.workphone == "" ||
                      item.workphone == "-" ? (
                      ""
                    ) : (
                      <div className="titleStyles">
                        <a
                          style={{
                            color: "#363636",
                            textDecoration: "none",
                          }}
                          href={"tel:" + item.workphone}
                          target="_blank"
                        >
                          <Icon iconName="Phone"></Icon>
                          {item.workphone}
                        </a>
                      </div>
                    )}
                    {!item.mobile || item.mobile == "" || item.mobile == "-" ? (
                      ""
                    ) : (
                      <div className="titleStyles">
                        <a
                          style={{
                            color: "#363636",
                            textDecoration: "none",
                          }}
                          href={"tel:" + item.mobile}
                          target="_blank"
                        >
                          <Icon iconName="CellPhone"></Icon>
                          {item.mobile}
                        </a>
                      </div>
                    )}
                    {!item.manager || item.manager == "" || item.manager == "-" ? (
                      ""
                    ) : (
                      <div className="titleStyles">
                        <a
                          style={{
                            color: "#363636",
                            textDecoration: "none",
                          }}
                          href={"mailto:" + item.manager}
                          target="_blank"
                        >
                          <Icon iconName="Mail"></Icon>
                          {item.manager}
                        </a>
                      </div>
                    )}
                    <div className="titleStylesCF"></div>
                  </>}  */}
                  </div>

                  <div>
                    {/* {userGridView ? userGridView.map((item1,index) => {
    return (
        <>
        <GridCard item={item}  diffStyle={diffStyle} userGridView={userGridView} />
            {item1.checkbox && item1.name !== 'id' && item1.name !== 'image' && (
                <div key={`${index}-${Math.random()}`} className={`titleStyles ${item1.name === 'name' ? 'nameStyles' : ''}`}>
                   {item1.name == "name" && item1.checkbox?
                      <>
                        <div className="nameStyles">
                        {variable === 'familyName' ? `${item.lastName} ${item.firstName}` : `${item.firstName} ${item.lastName}`}
                        
                        </div>
                      </> : ""}
                    {item1.name === 'email' && item1.checkbox == true  && (
                        <a
                            style={{
                                color: "#363636",
                                textDecoration: "none",
                            }}
                            href={`mailto:${item[item1.name]}`}
                            target="_blank"
                        >
                            <Icon iconName="Mail"></Icon>
                            {item[item1.name]}
                        </a>
                    ) }
                       {item1.name === 'email' && item1.checkbox == true  && (
                        <a
                            style={{

                                color: "#363636",
                                textDecoration: "none",
                            }}
                            href={`mailto:${item[item1.name]}`}
                            target="_blank"
                        >
                            <Icon iconName="Mail"></Icon>
                            {item[item1.name]}
                        </a>
                    ) }
                    { ( item1.name === 'location'&& item1.checkbox == true  &&(
                        <>
                            {item1.name === 'location' && (
                                <Icon iconName="Location"></Icon>
                            )}
                            {item[item1.name]}
                        </>
                ))}
            {item1.name === 'mobile' && item.mobile !== '' && item1.checkbox == true ? (
              <>
                {item1.name === 'mobile' && <Icon iconName="CellPhone" />}
                {item[item1.name]}
              </>
            ) : (
              <></>
            )}
             {item1.name === 'workphone' && item.workphone !== '' && item1.checkbox == true  ? (
              <>
                {item1.name === 'workphone' && <Icon iconName="Phone" />}
                {item[item1.name]}
              </>
            ) : (

              <></>
            )}
             {item1.name === 'job' && item.job !== ''&& item1.checkbox == true  ? (
              <>
                {item1.name === 'job'}
                {item[item1.name]}
              </>
            ) : (

              <></>
            )}
            
             {item1.name === 'department' && item.department !== '' && item1.checkbox == true ? (
              <>
                {item1.name === 'department'}
                {item[item1.name]}
              </>
            ) : (

              <></>
            )}
              {item1.isCustomField === true && (
              <>
                {item[item1.nameAPI]?item1.name+"-" : ''}{item[item1.nameAPI]}
              </>
            )}

                </div>
            )}
        </>
    );
}) : <></>} */}
                  </div>
                </div>
              );
            })}
            
        </div>
      </NewDocumentWrapper>
    </>
  );
};

export default DocumentCardBasicExample;
