import {
  Checkbox,
  Label,
  Panel,
  PanelType,
  PrimaryButton,
} from "@fluentui/react";
import { ChangeEvent, useEffect, useState } from "react";
import styles from "../SCSS/Ed.module.scss";
import { useLanguage } from "../../Language/LanguageContext";
import { updateSettingData } from "../Helpers/HelperFunctions";
import { useSttings } from "../SelectSource/store";
import { SweetAlerts } from "../SelectSource/Utils/SweetAlert";

const Collaboration = ({ isOpen, onDismiss }) => {
  const { SweetAlert: SweetAlertCollaboration } = SweetAlerts(
    "#collaboration",
    true
  );
  const { translation } = useLanguage();
  const { appSettings, setAppSettings } = useSttings();
  const [selectedWorkPhone, setSelectedWorkPhone] = useState("");
  const [selectedMobile, setSelectedMobile] = useState("");
  const [selectedChat, setSelectedChat] = useState("");
  const [selectedActionIcon, setSelectedActionIcon] = useState("");

  const [classicFormData, setClassicFormData] = useState({
    phone: false,
    mail: false,
    chat: false,
  });

  const [modernFormData, setModernFromData] = useState({
    outlook: false,
    teams: false,
  });

  const [MSTeamsFormData, setMSTeamsFromDate] = useState({
    call: false,
    message: false,
    video: false,
  });

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement>,
    setHandler: any
  ) => {
    setHandler((prev: any) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, setHandler: any) => {
    setHandler(e.target.name);
  };

  const handleSaveCollabSttings = () => {
    const fields = {
      Classic: classicFormData,
      Modern: modernFormData,
      MSTeams: MSTeamsFormData,
    };

    const CollaborationSettings = {
      WorkPhone: selectedWorkPhone,
      Mobile: selectedMobile,
      Chat: selectedChat,
      ActionIcon: {
        value: selectedActionIcon,
        fields: fields,
      },
    };

    updateSettingData({ ...appSettings, CollaborationSettings });
    setAppSettings({ ...appSettings, CollaborationSettings });
    SweetAlertCollaboration("success", translation.SettingSaved);
  };

  useEffect(() => {
    setSelectedWorkPhone(appSettings.CollaborationSettings.WorkPhone);
    setSelectedMobile(appSettings.CollaborationSettings.Mobile);
    setSelectedChat(appSettings.CollaborationSettings.Chat);
    setSelectedActionIcon(appSettings.CollaborationSettings.ActionIcon.value);
    setClassicFormData(
      appSettings.CollaborationSettings.ActionIcon.fields.Classic
    );
    setModernFromData(
      appSettings.CollaborationSettings.ActionIcon.fields.Modern
    );
    setMSTeamsFromDate(
      appSettings.CollaborationSettings.ActionIcon.fields.MSTeams
    );
  }, []);

  return (
    <div>
      <Panel
        type={PanelType.custom}
        customWidth="650px"
        headerText={"Collaboration"}
        isOpen={isOpen}
        onDismiss={() => onDismiss(false)}
        closeButtonAriaLabel={"Close"}
      >
        <div id="collaboration" style={{ marginTop: "10px" }}>
          <div className={styles.colabItem}>
            <div>
              <Label>
                {translation.WorkPhone ? translation.WorkPhone : "Work phone"}
              </Label>
            </div>
            <div className={styles.checkboxes}>
              <Checkbox
                name="SIP"
                checked={selectedWorkPhone === "SIP"}
                onChange={(e: any) => {
                  handleChange(e, setSelectedWorkPhone);
                }}
                label={translation.SIP ? translation.SIP : "SIP"}
              />
              <Checkbox
                name="Tel"
                checked={selectedWorkPhone === "Tel"}
                onChange={(e: any) => {
                  handleChange(e, setSelectedWorkPhone);
                }}
                label={translation.Tel ? translation.Tel : "Tel"}
              />
              <Checkbox
                name="MSTeams"
                checked={selectedWorkPhone === "MSTeams"}
                onChange={(e: any) => {
                  handleChange(e, setSelectedWorkPhone);
                }}
                label={translation.GoogleChat || "Google chat"}
              />
              <Checkbox
                name="None"
                checked={selectedWorkPhone === "None"}
                onChange={(e: any) => {
                  handleChange(e, setSelectedWorkPhone);
                }}
                label={translation.None ? translation.None : "None"}
              />
            </div>
          </div>

          <div className={styles.seprator}></div>

          <div className={styles.colabItem}>
            <div>
              <Label>{translation.Mobile}</Label>
            </div>
            <div className={styles.checkboxes}>
              <Checkbox
                name="SIP"
                checked={selectedMobile === "SIP"}
                onChange={(e: any) => {
                  handleChange(e, setSelectedMobile);
                }}
                label={translation.SIP ? translation.SIP : "SIP"}
              />
              <Checkbox
                name="Tel"
                checked={selectedMobile === "Tel"}
                onChange={(e: any) => {
                  handleChange(e, setSelectedMobile);
                }}
                label={translation.Tel ? translation.Tel : "Tel"}
              />
              <Checkbox
                name="MSTeams"
                checked={selectedMobile === "MSTeams"}
                onChange={(e: any) => {
                  handleChange(e, setSelectedMobile);
                }}
                label={translation.GoogleChat || "Google chat"}
              />
              <Checkbox
                name="None"
                checked={selectedMobile === "None"}
                onChange={(e: any) => {
                  handleChange(e, setSelectedMobile);
                }}
                label={translation.None ? translation.None : "None"}
              />
            </div>
          </div>

          <div className={styles.seprator}></div>

          <div className={styles.colabItem}>
            <div>
              <Label>{translation.Chat ? translation.Chat : "Chat"}</Label>
            </div>
            <div className={styles.checkboxes}>
              <Checkbox
                name="SIP"
                checked={selectedChat === "SIP"}
                onChange={(e: any) => {
                  handleChange(e, setSelectedChat);
                }}
                label={translation.SIP ? translation.SIP : "SIP"}
              />
              <Checkbox
                name="Tel"
                checked={selectedChat === "Tel"}
                onChange={(e: any) => {
                  handleChange(e, setSelectedChat);
                }}
                label={translation.Tel ? translation.Tel : "Tel"}
              />
              <Checkbox
                name="MSTeams"
                checked={selectedChat === "MSTeams"}
                onChange={(e: any) => {
                  handleChange(e, setSelectedChat);
                }}
                label={translation.GoogleChat || "Google chat"}
              />
              <Checkbox
                name="None"
                checked={selectedChat === "None"}
                onChange={(e: any) => {
                  handleChange(e, setSelectedChat);
                }}
                label={translation.None ? translation.None : "None"}
              />
            </div>
          </div>

          <div className={styles.seprator}></div>

          <div className={styles.colabItem}>
            <div>
              <Label>
                {translation.Actionicons
                  ? translation.Actionicons
                  : "Action icons"}
              </Label>
            </div>
            <div className={styles.lastCheckBox}>
              <Checkbox
                checked={selectedActionIcon === "Classic"}
                name="Classic"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleChange(e, setSelectedActionIcon);
                }}
                label={translation.Classic ? translation.Classic : "Classic"}
              />

              <Checkbox
                checked={selectedActionIcon === "Modern"}
                name="Modern"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleChange(e, setSelectedActionIcon);
                }}
                label={translation.Modern ? translation.Modern : "Modern"}
                styles={{root:{marginLeft:"-8px"}}}
              />

              <Checkbox
                checked={selectedActionIcon === "MSTeams"}
                name="MSTeams"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleChange(e, setSelectedActionIcon);
                }}
                label={translation.GoogleChat || "Google chat"}
                styles={{root:{marginLeft:"-15px"}}}
              />

              <Checkbox
                checked={selectedActionIcon === "None"}
                name="None"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleChange(e, setSelectedActionIcon);
                }}
                label={translation.None ? translation.None : "None"}
                styles={{root:{marginLeft:"15px"}}}
              />
            </div>
          </div>

          <div>
            {selectedActionIcon === "Classic" && (
              <div className={styles.colabItem}>
                <div></div>
                <div className={styles.outlookAndTeams}>
                  <Checkbox
                    name="phone"
                    checked={classicFormData.phone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFormChange(e, setClassicFormData)
                    }
                    label={translation.Phone ? translation.Phone : "Phone"}
                  />
                  <Checkbox
                    name="mail"
                    checked={classicFormData.mail}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFormChange(e, setClassicFormData)
                    }
                    label={translation.Mail ? translation.Mail : "Mail"}
                  />
                  <Checkbox
                    name="chat"
                    checked={classicFormData.chat}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFormChange(e, setClassicFormData)
                    }
                    label={translation.Chat ? translation.Chat : "Chat"}
                  />
                </div>
              </div>
            )}

            {selectedActionIcon === "Modern" && (
              <div className={styles.colabItem}>
                <div></div>
                <div className={styles.outlookAndTeams}>
                  <Checkbox
                    name="outlook"
                    checked={modernFormData.outlook}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFormChange(e, setModernFromData)
                    }
                    label={translation.Gmail || "Gmail"}
                  />
                  <Checkbox
                    name="teams"
                    checked={modernFormData.teams}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFormChange(e, setModernFromData)
                    }
                    label={translation.Chat || "Chat"}
                  />
                </div>
              </div>
            )}
            {selectedActionIcon === "MSTeams" && (
              <div className={styles.colabItem}>
                <div></div>
                <div className={styles.outlookAndTeams}>
                  <Checkbox
                    name="call"
                    checked={MSTeamsFormData.call}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFormChange(e, setMSTeamsFromDate)
                    }
                    label={translation.Call ? translation.Call : "Call"}
                  />
                  <Checkbox
                    name="message"
                    checked={MSTeamsFormData.message}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFormChange(e, setMSTeamsFromDate)
                    }
                    label={
                      translation.Message ? translation.Message : "Message"
                    }
                  />
                  <Checkbox
                    name="video"
                    checked={MSTeamsFormData.video}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFormChange(e, setMSTeamsFromDate)
                    }
                    label={translation.Video ? translation.Video : "Video"}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <PrimaryButton onClick={handleSaveCollabSttings}>
          {translation.save ? translation.save : "Save"}
        </PrimaryButton>
      </Panel>
    </div>
  );
};

export default Collaboration;
