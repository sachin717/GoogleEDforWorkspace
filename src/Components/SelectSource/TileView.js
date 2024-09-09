import { style } from "./styles";
import styled from "styled-components";
import { useState } from "react";
import "./Edp.scss";
import googleChat from "../assets/images/googleChatIcon.png";
import gmailLogo from "../assets/images/gmail.png";
import { Modal, Persona, PersonaSize, IconButton } from "@fluentui/react";
import EmployeeDetailModal from "./EmployeeDetailModal";
import useStore from "./store";

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
const modalPropsStylesEmpPC = {
  main: {
    maxWidth: 1000,
    minWidth: 1000,
    maxHeight: "100%",
  },
};

const TileView = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userModalCard, setUserModalCard] = useState(null);

  const openPanelForUser = (user) => {
    setUserModalCard(
      <EmployeeDetailModal isModalOpenTrans={true} user={user} />
    );
    setIsModalOpen(true);
  };
  const { variable } = useStore();

  return (
    <>
        <div>
          <div className="tileView">
            {props.employees.map((item) => {
              const examplePersona = {
                //imageUrl: item.img,
                imageInitials: item.initials,
              };
              var diffStyle;

              diffStyle = {
                backgroundImage: "url('" + item.image + "')",
                backgroundRepeat: "no-repeat",
                width: "72px",
                height: "72px",
                position: "absolute",
                top: "5px",
                borderRadius: "50%",
                zIndex: 1,
                backgroundPosition: "center",
                backgroundSize: "cover",
              };

              return (
                <div className="empView">
                  <div className="makeCenterStyles">
                    <div
                      style={diffStyle}
                      onClick={() => openPanelForUser(item)}
                    ></div>
                    <Persona
                      {...examplePersona}
                      coinSize={72}
                      // presenceTitle={item.presence}
                      size={PersonaSize.size72}
                      //  initialsColor={item.personaColor}
                      // presence={presence}
                      //style={{ flexDirection: "column" }}
                    />
                  </div>

                  <div className="nameStyles">
                    {variable === "familyName"
                      ? `${item.lastName} ${item.firstName}`
                      : `${item.firstName} ${item.lastName}`}
                  </div>

                  <div className="logos">
                    <a href={"https://chat.google.com"}>
                      <img
                        className="logo"
                        src={googleChat}
                        alt="Google Chat"
                        style={{ cursor: "pointer" }}
                      />
                    </a>
                    <a
                      href={"https://mail.google.com"}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        className="logo"
                        src={gmailLogo}
                        alt="Gmail"
                        style={{ cursor: "pointer" }}
                      />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <UserModal
              userModalCard={userModalCard}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          </div>
        </div>
    </>
  );
};

const UserModal = ({ userModalCard, isModalOpen, setIsModalOpen }) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onDismiss={() => setIsModalOpen(false)}
      isBlocking={true}
      styles={modalPropsStylesEmpPC}
      topOffsetFixed={false}
    >
      <div>
        <IconButton
          style={{ position: "absolute", right: "10px",top:"5px" }}
          className="closeiconprofile"
          styles={iconButtonStyles}
          iconProps={{ iconName: "Cancel" }}
          ariaLabel="Close popup modal"
          onClick={() => setIsModalOpen(false)}
        />
        {userModalCard}
      </div>
    </Modal>
  );
};

export default TileView;
