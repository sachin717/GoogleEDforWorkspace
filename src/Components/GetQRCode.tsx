import { IconButton, Modal } from "@fluentui/react";
import QRCode from "react-qr-code";

const GetQRCode = ({ isOpen, onDismiss, user }) => {
  if(!user){
    return;
  }
  const data = {
    NAME: user.name ?? "",
    department: user.department ?? "",
    email: user.email ?? "",
    job: user.job ?? "",
    mobile: user.mobile ?? "",
    workphone: user.workphone ?? "",
  };

  const qrData = JSON.stringify(data);
  return (
    <Modal isOpen={isOpen} onDismiss={() => onDismiss(false)} isBlocking>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <IconButton
            style={{
              cursor: "pointer",
              color: "#000",
            }}
            iconProps={{ iconName: "Cancel" }}
            ariaLabel="Close popup modal"
            onClick={() => onDismiss(false)}
          />
        </div>
        <div
          style={{
            padding: "30px 50px",
            textAlign: "center",
          }}
        >
          <QRCode size={220} value={qrData} />
          <div
            style={{
              marginTop: "10px",
            }}
          >
            <div style={{ fontSize: "16px", fontWeight: "500" }}>
              {user.name}
            </div>
            <div style={{ fontSize: "12px" }}>
              {user.job} | {user.department}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              marginTop: "10px",
            }}
          >
            <IconButton iconProps={{ iconName: "Download" }} />
            <IconButton iconProps={{ iconName: "Share" }} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GetQRCode;
