import { Label } from "@fluentui/react";
import styled from "styled-components";
import { useLanguage } from "../../Language/LanguageContext";
import defaultimage from "../assets/images/DefaultImg1.png";
import { useEffect, useState } from "react";

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
  const { translation } = useLanguage();
  const [image, setImage] = useState("");

  useEffect(() => {
    setImage(rootChartNode?.imageUrl);
  }, []);

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
                src={image}
                onError={() => setImage(`https://api.dicebear.com/9.x/initials/svg?backgroundColor=0070DC&seed=${rootChartNode?.name[0]}`)}
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
