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
          {props.employees.map((item, i) => {
            return (
              <div key={i} className="empView">
                <div className="makeCenterStyles">
                  <Persona
                    coinSize={72}
                    size={PersonaSize.size72}
                    imageUrl={item.imageUrl}
                    imageInitials={item.initials}
                    onClick={()=>openPanelForUser(item)}
                  />
                </div>

                <div className="nameStyles">
                  {variable === "familyName"
                    ? `${item.lastName} ${item.firstName}`
                    : `${item.firstName} ${item.lastName}`}
                </div>

                <div className="logos">
                  <a
                    href={"https://chat.google.com"}
                    target="_blank"
                  >
                    <img
                      className="logo"
                      src={googleChat}
                      alt="Google Chat"
                      style={{ cursor: "pointer" }}
                    />
                  </a>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      const email = item.email;
                      const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                        email
                      )}`;
                      window.open(mailtoLink, "_blank");
                    }}
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
