import { Label, Panel, PanelType, Stack } from "office-ui-fabric-react";
import styles from "./SCSS/Ed.module.scss";
import qr from "../Components/assets/images/hr265QR.png";
import { getCurrentUser } from "./Helpers/HelperFunctions";
const HelpPage = ({ isOpen, onDismiss }) => {
  let currentUser = getCurrentUser().cu;
  return (
    <Panel
      type={PanelType.custom}
      customWidth="650px"
      className={styles.helpPanelStyles}
      styles={{
        root: {
          ".ms-Panel-content": {
            padding: "0px",
          },
          "& .ms-Panel-contentInner":{
            display:"block"
          }
        },
      }}
      headerText="Help"
      isOpen={isOpen}
      onDismiss={onDismiss}
    >
      <Stack horizontal className="panel">
        <div className="left-panel">
          <div
            style={{
              padding: "10px 0",
              width: "100%",
              background: "#fff",
              textAlign: "center",
              borderBottom: "1px solid #ddd",
            }}
          >
            <img
              width={160}
              src="https://ik.imagekit.io/zn4au2jftpm5/hr365/HR365%20for%20site%20official%20PNG_UiZ5jBToP.png?updatedAt=1690782512755"
              alt="HR365"
            />
          </div>
          <div
            style={{
              padding: "10px 0",
              width: "100%",
              background: "#fff",
              textAlign: "center",
              borderBottom: "1px solid #ddd",
            }}
          >
            <a
              style={{ textDecoration: "none", color: "#000" }}
              href={`mailto:${currentUser}`}
            >
              CORS
            </a>
          </div>
          <div
            style={{
              padding: "10px 0",
              width: "100%",
              background: "#fff",
              textAlign: "center",
              borderBottom: "1px solid #ddd",
            }}
          >
            <a
              style={{ textDecoration: "none", color: "#000" }}
              href="https://www.hr365.us/support/"
              target="_blank"
            >
              {" "}
              Support
            </a>
          </div>
          {/* <div style={{ padding: "10px 0", width: "100%", background: "#fff",textAlign:"center",borderBottom:"1px solid #ddd" }}>
           
            <p> Feedback</p>
          </div> */}
          <div
            style={{
              padding: "10px 0",
              width: "100%",
              background: "#fff",
              textAlign: "center",
              borderBottom: "1px solid #ddd",
            }}
          >
            <a
              style={{ textDecoration: "none", color: "#000" }}
              href="https://www.hr365.us/privacy-policy/"
              target="_blank"
            >
              {" "}
              Privacy Policy
            </a>
          </div>
          <div
            style={{
              padding: "10px 0",
              width: "100%",
              background: "#fff",
              textAlign: "center",
              borderBottom: "1px solid #ddd",
            }}
          >
            <a
              style={{ textDecoration: "none", color: "#000" }}
              href="https://kb.hr365.us/sharepoint-employee-directory/modern/faq/"
              target="_blank"
            >
              FAQ
            </a>
          </div>
          <div
            style={{
              padding: "10px 0",
              width: "100%",
              background: "#fff",
              textAlign: "center",
              borderBottom: "1px solid #ddd",
            }}
          >
            <a
              style={{ textDecoration: "none", color: "#000" }}
              href="#"
              target="_blank"
            >
              Release Notes
            </a>
          </div>
        </div>
        <div
          className="right-panel"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "10px",
            }}
          >
            <div
              style={{
                width: "230px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-start",
                }}
              >
                <p style={{ flex: "0 0 150px" }}>Licence Type:</p>
                <p style={{ flex: "0 0 150px" }}>Valid Till:</p>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-start",
                }}
              >
                <p style={{ flex: "0 0 150px" }}>Version:</p>
                <p style={{ flex: "0 0 150px" }}>Total Users:</p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <img src={qr} />
            <a
              style={{ color: "#000", textAlign: "center" }}
              target="_blank"
              href="https://www.hr365.us/"
            >
              www.hr365.us
            </a>
          </div>
        </div>
      </Stack>
    </Panel>
  );
};

export default HelpPage;
