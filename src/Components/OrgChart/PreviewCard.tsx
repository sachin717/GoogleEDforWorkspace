import { Label } from "@fluentui/react";
import styles from "../SCSS/PreviewCard.module.scss";
import styled from "styled-components";
import { useLanguage } from "../../Language/LanguageContext";

const Container = styled.div`
  width: 250px;
  height: 140px;
  margin: 10px auto;
  border: 1px solid #aaa;
  transform: scale(0.8);
`;

const PreviewCard = ({
  position,
  rootChartNode,
  jobFontSize,
  italicName,
  headFontSize,
  underlineName,
  boldName,
  italicJob,
  underlineJob,
  boldJob,
  depFontSize,
  underlineDep,
  italicDep,
  boldDep,
  locationFontSize,
}) => {
  const {
    languagePartUpdate,
    setLanguagePartUpdate,
    translation,
    setTranslation,
    languages,
    setLanguage,
    getTranslation,
  } = useLanguage();
  return (
    <div>
      <Label>{translation.Preview}</Label>
      <Container>
        <div style={{ height: "12px", backgroundColor: "rgb(0, 112, 220)" }}>
          <div style={{ height: "100%", width: "100%" }}>
            <div
              style={{
                textAlign: position,
                marginLeft: "-10px",
                marginRight: "-10px",
              }}
            >
              <img
                style={{
                  marginTop: "-30px",
                  borderRadius: "100px",
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                }}
                src={rootChartNode?.imageUrl}
                alt="IMG"
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: `${headFontSize}px`,
                  fontStyle: italicName ? "italic" : "",
                  textDecoration: underlineName ? "underline" : "",
                  fontWeight: boldName ? "bold" : "",
                }}
              >
                {rootChartNode?.name}
              </span>
              <span
                style={{
                  fontSize: `${jobFontSize}px`,
                  fontStyle: italicJob ? "italic" : "",
                  textDecoration: underlineJob ? "underline" : "",
                  fontWeight: boldJob ? "bold" : "",
                }}
              >
                {rootChartNode?.jobTitle}
              </span>
              <span
                style={{
                  fontSize: `${depFontSize}px`,
                  fontStyle: italicDep ? "italic" : "",
                  textDecoration: underlineDep ? "underline" : "",
                  fontWeight: boldDep ? "bold" : "",
                }}
              >
                {rootChartNode?.department}
              </span>
              <span
                style={{
                  fontSize: `${locationFontSize}px`,
                }}
              >
                {rootChartNode?.location}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PreviewCard;
