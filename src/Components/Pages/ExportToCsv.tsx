import { Label, PrimaryButton } from "@fluentui/react";
import MiniModals from "../SelectSource/MiniModals";
import { useLanguage } from "../../Language/LanguageContext";

function ExportToCsv({ UserArray, setDownloadCsvModal, handleDownloadCSV }) {
  const { translation } = useLanguage();
  return (
    <>
      <MiniModals
        isPanel={false}
        crossButton={true}
        heading={
          translation.ExportToCSV ? translation.ExportToCSV : "Download to csv"
        }
        closeAction={() => setDownloadCsvModal(false)}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Label style={{ textAlign: "center" }}>
            {UserArray?.length}{" "}
            {translation.Heading9
              ? translation.Heading9
              : "records will be downloaded please confirm"}
          </Label>
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            <PrimaryButton
              text={translation.Download ? translation.Download : "Download"}
              onClick={handleDownloadCSV}
            />
            <PrimaryButton
              text={translation.Cancel ? translation.Cancel : "Cancel"}
              onClick={() => setDownloadCsvModal(false)}
            />
          </div>
        </div>
      </MiniModals>
    </>
  );
}
export default ExportToCsv;
